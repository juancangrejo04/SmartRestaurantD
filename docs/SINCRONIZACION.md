# Sincronización en Tiempo Real entre Dispositivos — SmartRestaurant

Este documento describe el funcionamiento técnico de `src/services/remoteSyncService.ts` y su integración con `src/context/AppContext.tsx` para sincronizar pedidos y mesas entre dispositivos distintos en tiempo real usando Firebase Auth (anónimo) y Cloud Firestore.

---

## 1. Entidades sincronizadas vs. excluidas

| Colección / Dominio | ¿Se sincroniza en Firestore? | Detalle |
|---|---|---|
| **Pedidos (`orders/{id}`)** | **Sí** | Objeto `Order` serializado en `data` (string JSON) + campos planos indexados (`branchId`, `userId`, `courierId`, `orderType`, `orderNumber`, `status`, `updatedAt`). |
| **Mesas (`tables/{id}`)** | **Sí** | Objeto `Table` serializado en `data` (string JSON) + campos planos indexados (`branchId`, `status`, `updatedAt`). |
| Usuarios / cuentas / contraseñas | **No** | Permanecen locales (`authService` + `localStorage`). |
| Menús, sucursales y reservas | **No** | Permanecen en datos locales de cada instancia. |
| Reseñas y eventos del broker (`recordAndDispatchEvent`) | **No** | Se conservan locales junto al `BroadcastChannel` entre pestañas. |
| Datos sensibles de tarjeta o nuevas credenciales | **No** | No se envían datos de tarjetas ni hashes de contraseña; `deliveryPin` permanece tal como existe en el pedido de demostración. |

---

## 2. Resolución de conflictos: Último Escritor Gana (*Last-Writer-Wins*)

Cada operación que crea o altera un pedido (`Order`) o mesa (`Table`) estampa `updatedAt = new Date().toISOString()` en formato ISO-8601 UTC.

1. **Subida incremental (local → nube):**
   - `AppContext` mantiene referencias de sesión (`sessionModifiedOrderIdsRef`, `sessionModifiedTableIdsRef`) y del último timestamp confirmado (`lastPushedOrderUpdatedAtRef`, `lastPushedTableUpdatedAtRef`).
   - **Nunca se suben los datos semilla (`INITIAL_ORDERS`, `INITIAL_TABLES`) al arrancar.** Solo se envían documentos creados o modificados durante la sesión cuyo `updatedAt` sea mayor al último confirmado.
   - Si una escritura ocurre sin red (`offline`), el envío queda pendiente y se ejecuta automáticamente en cuanto el servicio regresa a `online`.
2. **Bajada y mezcla (nube → local):**
   - Al recibir cambios por `onSnapshot`:
     - Si el registro no existe localmente, se inserta en el estado React.
     - Si ya existe y `remote.updatedAt > local.updatedAt`, reemplaza la versión local.
     - Si `remote.updatedAt <= local.updatedAt`, se descarta el cambio obsoleto.
   - Antes de actualizar el estado React, se actualiza `lastPushed*UpdatedAtRef` con el `updatedAt` recibido para evitar bucles de reenvío (*echo loops*).
   - `setOrders` y `setTables` siguen persistiendo en `localStorage` y propagando por `BroadcastChannel` dentro del mismo navegador.

---

## 3. Alcance de consultas por rol (*Query Scoping*)

| Rol en la sesión | Pedidos suscritos (`orders`) | Mesas suscritas (`tables`) |
|---|---|---|
| `customer` | `userId == currentUser.id` | Suscripción por sede solo al abrir Menú QR de mesa (`/mesa/:branchId/:tableId`), además de seguimiento directo por enlace (`/pedido/:orderId` vía `id` u `orderNumber`). |
| `kitchen`, `waiter`, `branch_admin`, `admin`, `cashier` | `branchId == sucursalAsignada` | `branchId == sucursalAsignada` |
| `courier` | Dos consultas sin índice compuesto: `courierId == currentUser.id` y entregas en estado `ready` dentro de sus sucursales/región | `branchId` de su región |
| `owner`, `platform_admin` | Pedidos de todas sus sucursales asignadas | Mesas de todas sus sucursales asignadas |

---

## 4. Resiliencia sin conexión y degradación elegante

- **Sin configuración de Firebase:** si no existen `/firebase-applet-config.json` ni variables `VITE_FIREBASE_*`, `remoteSyncService` entra en modo `'disabled'` (`Sin conexión · solo local`) y la aplicación opera exactamente igual en modo local.
- **Sin conexión o errores de red:** cualquier fallo pasa el estado a `'offline'` sin lanzar excepciones a la interfaz y programa reintentos con *backoff* exponencial (`500 ms`, `1 s`, `2 s`, `4 s`, `8 s`, `16 s`, máx. `30 s`), además de reaccionar a los eventos `online`/`offline` del navegador.

---

## 5. Limitación de seguridad (Entorno de Demostración)

- El inicio de sesión por rol/correo de SmartRestaurant se simula en el cliente (`authService.ts`). Para habilitar lecturas y escrituras entre navegadores distintos sin exigir un inicio de sesión Firebase por empleado, `remoteSyncService` autentica el dispositivo mediante **sesión anónima (`signInAnonymously`)**.
- Por ello, las reglas de `firestore.rules` tienen alcance de **demostración**: permiten lectura a cualquier sesión `request.auth != null` y validan esquema/tamaño (`data` string `< 50 KB` en `orders` y `< 5 KB` en `tables`, con `delete` bloqueado).
- **En producción:** se debe reemplazar el login simulado por Firebase Authentication con *Custom Claims* (`role`, `branchId`) o validación estricta en backend/Cloud Functions para impedir que un cliente lea o modifique pedidos fuera de su sucursal o cuenta.
