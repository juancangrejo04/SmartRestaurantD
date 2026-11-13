# Arquitectura del Sistema Distribuido Simulado — SmartRestaurant

> **Nota de alcance:** Todos los componentes descritos aquí operan como módulos TypeScript independientes dentro del navegador. Ningún servicio importa a otro servicio dentro de `src/services/*`: toda comunicación entre subsistemas cruza fronteras serializadas en JSON UTF-8 mediante `src/core/broker.ts`.

---

## 1. Topología General y API Gateway

```
  [ SPA Cliente / Staff ]
             │
             ▼
  [ SimulatedApiGateway (src/core/apiGateway.ts) ]
    • Rate limiting (40 req / 5s -> HTTP 429)
    • Verificación de firma/claims de sesión (HTTP 401)
    • Resolución de endpoints vía NameService (TTL 60s)
             │
             ▼
  [ Broker Unificado (src/core/broker.ts) ]  ◄───► [ BroadcastChannel + StorageEvents ]
    • Colas por suscriptor · Entrega at-least-once · Backoff exponencial
    • Idempotencia por consumidor · Dead-Letter Queue (DLQ) · Reloj de Lamport
             │
   ┌─────────┴────────────────────────────────────────────────┐
   ▼                                                          ▼
  [ 11 Subsistemas Lógicos ]                      [ 5 Nodos Regionales + Réplicas ]
                                                  node-co · node-br · node-us · node-fr · node-jp
```

---

## 2. Los 11 Subsistemas Lógicos y Grafo de Aristas

Ningún archivo en `src/services/*` importa otro servicio de dominio. El arranque coordinado se realiza exclusivamente en `src/services/subsystemRegistry.ts`.

| # | Subsistema (`ServiceName`) | Archivo | Responsabilidad |
|---|---|---|---|
| 1 | `auth-service` | `src/services/authService.ts` | Identidad, hash PBKDF2/SHA-256, roles, permisos y `homeRegion`. |
| 2 | `restaurant-service` | `src/services/restaurantService.ts` | Marcas, 20 sedes, planos de mesas, catálogo y caché TTL de menús. |
| 3 | `reservation-service` | `src/services/reservationService.ts` | Reservas en zonas IANA/UTC y detección de solapamientos (±90 min). |
| 4 | `order-service` | `src/services/orderService.ts` + `orderSagaService.ts` | Creación de pedidos, máquina de estados y orquestación Saga. |
| 5 | `kitchen-service` | `src/services/kitchenService.ts` | Cola KDS en cocina por sede, preparación y listo para despacho/mesa. |
| 6 | `dispatch-service` | `src/services/dispatchService.ts` | Pool de repartidores por región y exclusión mutua con lease TTL. |
| 7 | `payments-service` | `src/services/paymentGatewayService.ts` | Autorización, captura, anulación (`void`) y reembolso por pasarela local. |
| 8 | `billing-service` | `src/services/billingService.ts` | Motor de impuestos (`profile.taxRules`) y emisión fiscal (CUFE/NFC-e/Factur-X/T+13). |
| 9 | `notification-service` | `src/services/notificationService.ts` | Alertas localizadas por rol, región y receptor sin mezcla de idiomas. |
| 10 | `fx-service` | `src/services/fxService.ts` | Tasas de cambio referenciales y conversión a centavos USD para consolidado. |
| 11 | `analytics-service` | `src/services/analyticsService.ts` + `auditService.ts` | KPIs por sede/país, agregados USD anonimizados (cero PII) y auditoría. |

### Lista de Aristas en el Grafo de Comunicación (Publicador → Evento → Suscriptor)

| Origen | Evento (`EventType`) | Destino(s) | Tipo |
|---|---|---|---|
| `order-service` | `ORDER_CREATED` | `kitchen-service`, `notification-service`, `analytics-service` | Pub/Sub |
| `order-service` | `PAYMENT_AUTHORIZE_REQUEST` | `payments-service` | Request/Reply |
| `order-service` | `DISPATCH_ASSIGN_COURIER` / `DISPATCH_RELEASE_LEASE` | `dispatch-service` | Request/Reply |
| `order-service` | `ORDER_STATUS_CHANGED` | `notification-service`, `analytics-service` | Pub/Sub |
| `order-service` | `PAYMENT_CAPTURE_REQUEST` | `payments-service` | Request/Reply |
| `order-service` | `ORDER_PAID` | `billing-service` | Pub/Sub |
| `order-service` | `PAYMENT_VOID_REQUEST` / `PAYMENT_REFUND_REQUEST` | `payments-service` | Request/Reply (Compensación) |
| `order-service` | `SAGA_COMPENSATED` | `notification-service`, `analytics-service` | Pub/Sub (Compensación) |
| `payments-service` | `PAYMENT_PROCESSED` | `order-service`, `analytics-service` | Pub/Sub |
| `billing-service` | `RECEIPT_ISSUED` | `notification-service`, `analytics-service` | Pub/Sub |
| `dispatch-service` | `COURIER_ASSIGNED` | `order-service`, `notification-service` | Pub/Sub |
| `restaurant-service` | `CATALOG_CACHE_INVALIDATED` / `PRODUCT_AVAILABILITY_CHANGED` | `restaurant-service` (réplicas), `order-service` | Pub/Sub |
| `fx-service` | `FX_RATES_UPDATED` | `analytics-service` | Pub/Sub |
| `auth-service` / `api-gateway` | `AUDIT_RECORD` | `analytics-service` | Pub/Sub |

---

## 3. Transacciones Distribuidas y Orquestación Saga

El ciclo completo de un pedido a domicilio se ejecuta mediante una **Saga orquestada** (`src/services/orderSagaService.ts`) sobre mensajes JSON UTF-8 canónicos (`DistributedEvent`):

```json
{
  "id": "evt-9f2a18c4",
  "type": "PAYMENT_AUTHORIZE_REQUEST",
  "version": "1.0",
  "region": "CO",
  "traceId": "trc-8812ab",
  "correlationId": "ord-bog-401",
  "lamport": 142,
  "idempotencyKey": "saga-ord-bog-401-auth",
  "sourceService": "order-service",
  "targetService": "payments-service",
  "status": "pending",
  "attempts": 0,
  "maxAttempts": 3,
  "createdAtUtc": "2026-11-16T01:30:00Z",
  "headers": { "locale": "es", "timeZone": "America/Bogota" },
  "payload": { "orderId": "ord-bog-401", "amountMinorUnits": 56700, "currency": "COP" }
}
```

| Paso Saga | Emisor → Receptor | Evento / Protocolo | Confirmación (*Commit*) | Compensación (*Rollback*) | Manejo de Falla |
|---|---|---|---|---|---|
| 1. Crear pedido | UI / Gateway → `order-service` | `ORDER_CREATED` (JSON UTF-8 vía Broker) | Pedido persistido en partición regional `pending`. | Marcar pedido `cancelled`. | Validación síncrona en Gateway; rate-limit 429 o error 400. |
| 2. Autorizar pago | `order-service` → `payments-service` | `PAYMENT_AUTHORIZE_REQUEST` (Request/Reply + `idempotencyKey`) | Retención (`authorized`) generada en pasarela regional. | `PAYMENT_VOID_REQUEST` (liberar fondos retenidos). | Reintentos automáticos con *backoff* exponencial (250 ms, 600 ms, 1200 ms); tras 3 fallos pasa a **DLQ** y dispara Saga inversa. |
| 3. Confirmar comercio & Cocina | `order-service` → `kitchen-service` | `ORDER_STATUS_CHANGED` (`confirmed` → `preparing`) | Ticket KDS creado y aceptado en sede. | Notificar cancelación a KDS y cliente (`SAGA_COMPENSATED`). | Si comercio rechaza o vence timeout, revierte autorización en `payments-service`. |
| 4. Asignar repartidor | `order-service` → `dispatch-service` | `DISPATCH_ASSIGN_COURIER` | Lease con TTL adquirido (exclusión mutua: 1 repartidor por pedido). | `DISPATCH_RELEASE_LEASE` (libera repartidor y marca disponible). | Si el lease expira sin respuesta o falla asignación, libera bloqueo y reasigna o compensa. |
| 5. Capturar pago & Facturar | `order-service` → `payments-service` → `billing-service` | `PAYMENT_CAPTURE_REQUEST` → `ORDER_PAID` → `RECEIPT_ISSUED` | Captura firme + comprobante fiscal emitido según `profile.receipt`. | `PAYMENT_REFUND_REQUEST` (reembolso total) + anulación operativa. | Si el consumidor recibe un evento duplicado, `consumedKeys` descarta la segunda ejecución sin doble cobro. |

---

## 4. Elección de Tecnologías de Comunicación y Middleware

- **En la simulación (navegador):** Broker en memoria + serialización obligatoria `JSON.parse(JSON.stringify(obj))` en cada frontera (garantiza ausencia de referencias compartidas) + `BroadcastChannel` y eventos `storage` para coherencia multipestaña.
- **Justificación del middleware (`broker.ts`):** En producción equivale a un broker AMQP/Pub-Sub (RabbitMQ/NATS/Kafka). Resuelve cuatro ejes de **heterogeneidad** entre países:
  1. **Idioma y formato:** cada evento transporta `headers.locale` y `headers.timeZone`, permitiendo que emisor y consumidor procesen o notifiquen en su idioma sin acoplamiento.
  2. **Moneda e impuestos:** los payloads viajan con enteros en unidad menor y código de divisa explícito (`COP`, `BRL`, `USD`, `EUR`, `JPY`).
  3. **Sistemas fiscales y pasarelas:** `order-service` publica `ORDER_PAID` sin conocer si la región emite DIAN CUFE, NFC-e, Factur-X o factura NTA.
  4. **Desacoplamiento temporal y resiliencia:** si un nodo cae transitoriamente (`payments-service` = `down`), las colas conservan el mensaje, reintentan con backoff y envían a DLQ para reproducción manual.

---

## 5. Sincronización, Coordinación y Servicio de Nombres

| Mecanismo | Implementación | Propósito |
|---|---|---|
| **Reloj Lógico de Lamport** | `distributedClock.tick()` / `receive()` (`src/core/clock.ts`) | Orden causal parcial (`L = max(L_local, L_msg) + 1`) en todos los eventos del broker. |
| **NTP Simulado por Nodo** | `ntpOffsets` por región (`±5..18 ms`, configurable desde Monitor) | Simula deriva de relojes físicos entre regiones y resincronización manual. |
| **Exclusión Mutua (Lease TTL)** | `dispatchService` (`acquireLease` / `releaseLease`) | Garantiza que dos repartidores no tomen simultáneamente el mismo pedido; expiración automática evita interbloqueos (*deadlocks*). |
| **Elección de Líder (Primario ↔ Réplica)** | `regionNodes.failoverPrimary` / `restorePrimary` | Ante caída del nodo primario regional (`term + 1`), la réplica asume como líder activo hasta que el primario vuelve y converge. |
| **Servicio de Nombres (`NameService`)** | `src/core/nameService.ts` | Resuelve `servicio.región` → endpoint lógico (ej. `payments.co.smartrestaurant.co:8443` o `payments.replica.co...`) con caché TTL de 60 s e invalidación automática al cambiar de líder. |

---

## 6. Partición, Replicación y Consistencia de Datos

- **Partición horizontal por región:** Cada región mantiene partición aislada (`smartrestaurant_v4_partition_<REGION>`) y réplica propia (`smartrestaurant_v4_replica_<REGION>`). Ningún nodo regional almacena los clientes privados de otra jurisdicción (`homeRegion`, sección 11).
- **Consistencia fuerte (en partición líder regional):** Reservas de mesa (previene doble reserva en ±90 min), autorización/captura de pagos, emisión de comprobantes fiscales y asignación de lease de repartidor.
- **Consistencia eventual:** Replicación hacia partición réplica regional (`pendingReplicationCount` + `replicationLagMs` visibles en Monitor), caché de catálogo con TTL de 60 s e ingesta hacia analítica consolidada global en USD (agregados sin datos personales PII).
