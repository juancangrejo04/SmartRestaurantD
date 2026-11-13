# SmartRestaurant — Plataforma Multinacional & Sistema Distribuido Simulado

> **Aviso de simulación académica:** Los cinco nodos regionales (`node-co`, `node-br`, `node-us`, `node-fr`, `node-jp`), sus réplicas, el API Gateway, los once subsistemas, las pasarelas de pago y el broker de mensajes (`src/core/broker.ts`) son **módulos lógicos simulados que se ejecutan 100 % dentro del navegador**. No existen servidores externos, contenedores ni comunicación real por red entre máquinas; cada frontera de subsistema serializa mensajes en JSON UTF-8 sin memoria compartida y sincroniza pestañas mediante `BroadcastChannel`.

---

## 1. Instalación, Ejecución y Despliegue (GitHub & Vercel)

### Requisitos
- Node.js 20+ y `npm` 10+

### Comandos locales
```bash
npm install
npm run dev       # Servidor Vite en http://localhost:3000
npm run prebuild  # Verificación obligatoria: check-i18n + check-no-country-rules
npm run build     # Verificación TypeScript (tsc --noEmit) + bundle Vite en dist/
```

### Despliegue en Vercel
El repositorio incluye `vercel.json` configurado para SPA (`HashRouter`):
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build` (ejecuta automáticamente `prebuild`)
- **Output Directory:** `dist`
- **Variables de entorno:** **ninguna requerida** (cero claves privadas; persistencia aislada por región en `localStorage` bajo el prefijo `smartrestaurant_v4_*`).

---

## 2. Rutas Principales y Portal Oculto de Personal

| Ámbito | Ruta (`HashRouter`) | Acceso |
|---|---|---|
| Sitio público cliente | `/#/`, `/#/restaurantes`, `/#/carta/:branchId`, `/#/pedir/:branchId`, `/#/mesa/:branchId/:tableId`, `/#/pedido/:orderId` | Abierto (cero enlaces al portal `/staff` ni lenguaje técnico) |
| Acceso de clientes | `/#/login`, `/#/registro`, `/#/cuenta` | Clientes registrados |
| **Portal oculto de personal** | `/#/staff` | Personal, comercios, repartidores y plataforma (`robots: noindex`) |
| Consola de Plataforma (USD/FX, Perfiles, Ingresos, Auditoría) | `/#/staff/app/platform_admin`, `/#/staff/app/sistema` | `platform_admin` |
| Caso de Prueba Obligatorio (5 países + Autopruebas) | `/#/staff/app/prueba-localizacion` | `platform_admin` |
| Monitor Distribuido y Pruebas de Falla | `/#/staff/app/monitor` | `platform_admin`, `owner` (global) · `branch_admin`/`admin` (lectura de su región) |

---

## 3. Credenciales de Demostración (Sección 5.4)

### Personal y Plataforma (`/#/staff`)
| Rol | Correo | Contraseña | Alcance |
|---|---|---|---|
| Administrador de Plataforma | `plataforma@smartrestaurant.app` | `Plataforma#2026` | Global (consola, perfiles, FX, monitor, pruebas) |
| Dueño de Marca | `dueno@smartrestaurant.app` | `Dueno#2026` | Todas las sedes de su marca + monitor |
| Admin de Sede (Bogotá) | `admin.bogota@smartrestaurant.app` | `Sede#2026` | Sede Colombia (COP / `es`) |
| Admin de Sede (São Paulo) | `admin.saopaulo@smartrestaurant.app` | `Sede#2026` | Sede Brasil (BRL / `pt`) |
| Admin de Sede (Nueva York) | `admin.nuevayork@smartrestaurant.app` | `Sede#2026` | Sede EE. UU. (USD / `en`) |
| Admin de Sede (París) | `admin.paris@smartrestaurant.app` | `Sede#2026` | Sede Francia (EUR / `fr`) |
| Admin de Sede (Tokio) | `admin.tokio@smartrestaurant.app` | `Sede#2026` | Sede Japón (JPY / `ja`) |
| Mesero (Bogotá / São Paulo) | `mesero.bogota@smartrestaurant.app` / `mesero.saopaulo@smartrestaurant.app` | `Mesero#2026` | Salón y pedidos |
| Cocina KDS (Bogotá / París) | `cocina.bogota@smartrestaurant.app` / `cocina.paris@smartrestaurant.app` | `Cocina#2026` | Comandas KDS |
| Cajero (Bogotá) | `cajero.bogota@smartrestaurant.app` | `Caja#2026` | Cobros en caja |
| Repartidor (Bogotá / NY) | `repartidor1.bogota@smartrestaurant.app` / `repartidor1.nuevayork@smartrestaurant.app` | `Reparto#2026` | Entregas y tracking |
| Comercio pendiente (moderación) | `nuevo.comercio@smartrestaurant.app` | `Comercio#2026` | Pendiente de aprobación |

### Clientes de Demostración (`/#/login`)
| País | Correo | Contraseña | `homeRegion` |
|---|---|---|---|
| Colombia 🇨🇴 | `cliente.bogota@demo.app` | `Cliente#2026` | `CO` |
| Brasil 🇧🇷 | `cliente.saopaulo@demo.app` | `Cliente#2026` | `BR` |
| EE. UU. 🇺🇸 | `cliente.nuevayork@demo.app` | `Cliente#2026` | `US` |
| Francia 🇫🇷 | `cliente.paris@demo.app` | `Cliente#2026` | `FR` |
| Japón 🇯🇵 | `cliente.tokio@demo.app` | `Cliente#2026` | `JP` |

---

## 4. Guion de Sustentación en 5 Minutos (Para el Jurado)

| Minuto | Paso | Ruta / Acción | Qué señalar al jurado |
|---|---|---|---|
| **0:00 – 1:00** | **Pedido a domicilio en Bogotá (CO)** | En `/#/restaurantes`, elegir una sede de Bogotá → `/#/pedir/:branchId`. Agregar 2× *Almuerzo del día* (`$ 25.900`), ingresar dirección/teléfono colombiano, elegir propina voluntaria (10 %) y pagar por PSE/Nequi simulado. | Moneda en enteros (`COP`), Impoconsumo 8 % + IVA domicilio 19 %, cero referencias técnicas en el sitio público. |
| **1:00 – 1:45** | **Comercio acepta → Cocina → Repartidor** | Abrir `/#/staff` en otra pestaña: entrar como `admin.bogota@smartrestaurant.app` para aceptar, `cocina.bogota@smartrestaurant.app` para preparar y `repartidor1.bogota@smartrestaurant.app` para aceptar entrega (`BroadcastChannel` actualiza ambas pestañas). | Desacoplamiento por mensajes en `broker.ts`, exclusión mutua con lease TTL sobre el repartidor y avance de la Saga. |
| **1:45 – 2:30** | **Seguimiento, comprobante y calificación** | Volver a `/#/pedido/:orderId` del cliente. Ver la línea de tiempo en vivo, abrir la Factura Electrónica DIAN (CUFE simulado) y enviar la calificación de restaurante y repartidor. | Comprobante legal parametrizado desde `profile.receipt` y marca horaria local + almacenamiento interno en UTC. |
| **2:30 – 3:20** | **Consola de Plataforma, FX y Perfiles sin código** | En `/#/staff` entrar como `plataforma@smartrestaurant.app` → `/#/staff/app/platform_admin` y `/#/staff/app/sistema`. Mostrar consolidado global en USD (con fuente BCE/Fed y cero datos personales PII) y modificar una tasa en `taxRules` en vivo. | Residencia de datos (`homeRegion`), conversión FX solo en consolidado, cambios de impuestos efectivos sin tocar código. |
| **3:20 – 4:15** | **Pruebas de Falla y Matriz SD** | Ir a `/#/staff/app/monitor`. Ejecutar Prueba 1 (detener `payments-service` durante un pedido → backoff + recuperación) o Prueba 2 (falla permanente → rollback completo de Saga) y Prueba 3 (caída del primario `node-co` → elección de réplica + resincronización eventual). Exportar CSV. | Reloj de Lamport, offsets NTP, resolución de `NameService`, DLQ, idempotencia y diagrama animado de los 11 subsistemas. |
| **4:15 – 5:00** | **Caso de Prueba Obligatorio (5 Países)** | Ir a `/#/staff/app/prueba-localizacion`. Pulsar **Ejecutar caso de prueba en los 5 países** (`2026-11-15 20:30` local) y **Ejecutar autopruebas** (15 aserciones). | Comparativa completa (CO, BR, US, FR, JP), instantes UTC exactos (`2026-11-16T01:30:00Z` CO/US, etc.), los 5 comprobantes legales y 15/15 autopruebas aprobadas. |

---

## 5. Cómo Agregar un Sexto País (Ej. Alemania `DE`) Solo con Configuración

La lógica de precios, impuestos, fechas, horarios, direcciones y facturas es **agnóstica al país** (verificada por `node scripts/check-no-country-rules.mjs`). Para incorporar Alemania (`DE`):

1. **Tipos base (`src/types/index.ts`):** Agregar `'DE'` a `CountryCode`, `'de'` a `Language` (si se desea idioma alemán nativo; puede reutilizar `'en'` mientras se traduce).
2. **Perfil regional (`src/data/regions/DE.ts`):** Copiar `FR.ts`, definir `code: 'DE'`, `currency: 'EUR'`, `timeZone: 'Europe/Berlin'`, `hasDaylightSaving: true`, `phonePrefix: '+49'`, `taxRules` (MwSt 19 % / 7 %), `tipPolicy`, `receipt` (`Kassenbon / TSE`), `paymentMethods` (SEPA, Girocard, PayPal, Efectivo) y `dataResidency` (`europe-west3` / GDPR).
3. **Registro regional (`src/data/regions/index.ts` y `src/i18n/countries.ts`):** Importar y registrar `DE_PROFILE`. El nodo lógico `node-de`, sus particiones (`smartrestaurant_v4_partition_DE`), sus entradas en `NameService` y las rutas de factura se generan automáticamente.
4. **Traducciones y catálogo (`src/i18n/locales/*.ts` y `src/data/seedData.ts`):** Añadir las claves `country_de`, `city_berlin`, etiquetas fiscales/pago en los archivos de idioma y las sedes/platos iniciales de Berlín en `seedData.ts`.
5. **Validación:** Ejecutar `npm run prebuild && npm run build`. El botón **Simular alta de país** en `/#/staff/app/monitor` demuestra este registro dinámico en vivo.

---

## 6. Documentación Complementaria
- [`docs/ARQUITECTURA.md`](./docs/ARQUITECTURA.md) — Subsistemas, broker, Sagas, sincronización, partición y nombres.
- [`docs/LOCALIZACION.md`](./docs/LOCALIZACION.md) — Perfiles regionales, fuentes oficiales de tasas y cumplimiento de reglas i18n/L10n.
- [`docs/INTERFACES_REALES.md`](./docs/INTERFACES_REALES.md) — Interfaces y APIs reales equivalentes para despliegue productivo.
- [`docs/DECLARACION_IA.md`](./docs/DECLARACION_IA.md) — Declaración de uso de herramientas de IA.
