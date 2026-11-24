# SMARTRESTAURANT — PROMPT 8: SINCRONIZACIÓN DE PEDIDOS ENTRE DISPOSITIVOS EN TIEMPO REAL

El proyecto compila y funciona. Hoy todo el estado vive en `localStorage` y el `BroadcastChannel` de `AppContext.tsx` solo sincroniza pestañas del mismo navegador. Objetivo: que **un pedido hecho en un dispositivo aparezca en el panel de otro dispositivo (administrador, cocina, mesero, repartidor) y que cada cambio de estado llegue en tiempo real al cliente**, sin romper nada de lo que ya funciona. Entrega los archivos modificados **completos**. No cambies diseño, datos semilla, credenciales, idiomas existentes ni el flujo de pedidos. Al final confirma `npm run build` y `check-i18n` sin errores.

## Reglas de seguridad del cambio
- **Si Firebase no está configurado o no hay conexión, la app debe funcionar exactamente como hoy** (solo local). Nunca bloquear la interfaz esperando a la red.
- No migres usuarios, menú, sucursales ni reseñas. **Solo pedidos y mesas** pasan por la nube.
- No guardes contraseñas, PIN de entrega en claro ni datos de tarjeta en la nube. El `deliveryPin` se guarda tal cual está hoy (es un dato de demostración); no agregues datos nuevos sensibles.

## 1. Servicio de sincronización (`src/services/remoteSyncService.ts`, nuevo)
Usa Firebase (SDK modular `firebase/app`, `firebase/auth`, `firebase/firestore`). Toma la configuración de la integración de Firebase del proyecto o de variables `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`. Si faltan, el servicio queda en modo `disabled` y no hace nada.
- `init()`: inicia sesión anónima (`signInAnonymously`) y expone el estado `'disabled' | 'connecting' | 'online' | 'offline'`.
- Colecciones: `orders` (un documento por pedido, id = `order.id`) y `tables` (un documento por mesa, id = `table.id`).
- Cada documento guarda el objeto completo serializado en un campo `data` (string JSON) más campos planos para consultas: `branchId`, `userId`, `courierId`, `status`, `updatedAt` (ISO).
- `pushOrder(order)` y `pushTable(table)`: upsert del documento. Elimina `undefined` antes de escribir.
- `subscribeOrders(scope, onChange)`: `onSnapshot` con alcance por rol:
  - cliente: solo pedidos con `userId == currentUser.id`;
  - cocina, mesero, administrador de sede, cajero: `branchId == currentUser.branchId`;
  - repartidor: `courierId == currentUser.id` o pedidos de domicilio de su sucursal en estado `ready`;
  - dueño y administrador de plataforma: todos los pedidos de sus sucursales.
  Entrega los documentos modificados (`docChanges`) ya convertidos a `Order`.
- `subscribeTables(branchId, onChange)` igual para `tables`.
- Manejo de errores: cualquier excepción pasa el estado a `'offline'`, se registra en consola y se reintenta con espera creciente (500, 1000, 2000, 4000 ms, máximo 30 s). No lances errores a la interfaz.

## 2. Integración en `AppContext.tsx` (cambios mínimos)
- **Subida (local → nube):** guarda una referencia `lastPushedUpdatedAt` por pedido. Cuando cambie `orders` (ya existe el efecto que escribe en `localStorage`), compara con esa referencia y sube **solo** los pedidos cuyo `updatedAt` sea mayor al último subido **y** que se hayan creado o modificado durante esta sesión. **No subas todos los pedidos semilla al arrancar.** Igual con `tables`.
- **Bajada (nube → local):** al recibir cambios, aplica *último escritor gana* por `updatedAt`: si el pedido no existe localmente, agrégalo; si existe y `remote.updatedAt > local.updatedAt`, reemplázalo; en otro caso, ignóralo. Actualiza `lastPushedUpdatedAt` con el valor recibido para **no reenviarlo** (evita bucles). Usa los mismos `setOrders` y `setTables` ya existentes, de modo que `localStorage` y el `BroadcastChannel` siguen funcionando.
- Todas las funciones que cambian un pedido (`advanceKitchenOrder`, `updateDeliveryOrderStatus`, `completeDeliveryWithPin`, `assignCourierToOrder`, entrega a mesa, cancelación, etc.) **deben poner `updatedAt = new Date().toISOString()`** si no lo hacen. Revisa `orderService.ts` para que lo hagan todas.
- Suscríbete cuando haya `currentUser` y cancela la suscripción al cerrar sesión o cambiar de usuario.
- Los eventos del broker simulado (`recordAndDispatchEvent`) siguen igual; no los envíes a la nube.

## 3. Cliente: seguimiento en tiempo real
- `LiveOrderTrackerPage.tsx` y "Mis pedidos" deben leer los pedidos de `orders` (estado de React) y reflejar el cambio sin recargar. Si el cliente abre el enlace de seguimiento de un pedido que no está en su dispositivo, consulta el documento por `id` o `orderNumber` en Firestore.
- Cuando llegue desde la nube un cambio de estado de un pedido del cliente, muestra el toast traducido `toast_order_status_updated` ("Tu pedido #{order} ahora está: {status}") y la notificación existente.

## 4. Indicador de conexión
En el encabezado del personal y en el seguimiento del cliente, agrega un indicador pequeño con punto de color: verde "En línea · sincronizado", ámbar "Conectando…", gris "Sin conexión · solo local". Claves nuevas en es, pt, en, fr, ja (`sync_online`, `sync_connecting`, `sync_offline`, `toast_order_status_updated`). Ejecuta `check-i18n`.

## 5. Reglas de Firestore (entrega el archivo `firestore.rules`)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{id} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null
        && request.resource.data.keys().hasAll(['data','branchId','status','updatedAt'])
        && request.resource.data.data is string
        && request.resource.data.data.size() < 50000;
      allow delete: if false;
    }
    match /tables/{id} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null
        && request.resource.data.data is string
        && request.resource.data.data.size() < 5000;
      allow delete: if false;
    }
  }
}
```
Explica en un comentario que la seguridad es de **nivel demostración** (sesión anónima), porque el inicio de sesión de la app es simulado en el cliente.

## 6. Documentación
Crea `docs/SINCRONIZACION.md` con: qué se sincroniza (pedidos y mesas), qué no (usuarios, menú), cómo funciona el último escritor gana, el alcance por rol y la limitación de seguridad.

## Verificación final (con dos dispositivos o dos navegadores distintos, por ejemplo Chrome y Edge, no dos pestañas)
1. Dispositivo A: entra como cliente y haz un pedido a domicilio en Bogotá.
2. Dispositivo B: entra como `admin.bogota@smartrestaurant.app` o `cocina.bogota@smartrestaurant.app`. El pedido aparece **sin recargar** en menos de 3 segundos.
3. En B, pasa el pedido a "preparando" y "listo". En A, el estado cambia en vivo y aparece el toast.
4. Repite con un pedido en mesa y un mesero en el dispositivo B; la mesa cambia en A y B.
5. Corta la red en A (modo avión). La app sigue funcionando y marca "Sin conexión"; al volver, se sincroniza.
6. Sin configuración de Firebase, la app funciona igual que antes y el indicador dice "Sin conexión · solo local".
7. Los 5 idiomas y las 5 sucursales siguen intactos; `npm run build` y `check-i18n` sin errores.
