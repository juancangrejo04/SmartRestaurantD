# SMARTRESTAURANT — PROMPT 2 DE 3: ACCESO PRIVADO, ROLES Y FLUJO DE DOMICILIO
# (Proyecto de asignatura "Diseño de un Sistema Distribuido" · Universidad Central)

Ya existe un proyecto SmartRestaurant en este workspace (React 19 + TypeScript + Vite 8 + Tailwind 4 + React Router 7 con `HashRouter`, estado en `src/context/AppContext.tsx`, diccionario en `src/i18n/translations.ts`, servicios en `src/services/`, páginas públicas en `src/pages/public/`, paneles en `src/views/`). Compila y está desplegado en Vercel. **No lo rehagas desde cero:** conserva el diseño cálido (crema, azafrán, espresso) y los módulos que funcionan (reservas, pedido por QR, mesero, cocina, reseñas, monitor) y modifica, reemplaza o elimina lo necesario.

**Contexto de esta serie:** la corrección se entrega en 3 prompts. Este es el **2**. **Da por hecho lo que entregó el prompt 1** (si algo no existe, créalo de forma mínima y avisa): cinco países (Colombia–Bogotá, Brasil–São Paulo, EE. UU.–Nueva York, Francia–París, Japón–Tokio; **México y Medellín eliminados**), perfiles regionales en `src/data/regions/*` (`RegionProfile`), helpers `Money`/`Intl`/UTC, componentes `AddressForm/PhoneInput/NameFields`, i18n tipado en **cinco idiomas** (es, pt, en, fr, ja) con `t()`/`loc()`, 20 sedes (2 marcas × 2 sedes × 5 ciudades) con coordenadas, cartas por marca y país con el "Almuerzo del día", y scripts `check-i18n` y `check-no-country-rules`. **Reglas permanentes:** ningún `if (country === …)` fuera de `src/data/regions/`; importes como enteros en unidad menor; instantes en UTC; **todo texto nuevo pasa por `t()` y se agrega a los cinco idiomas**; los scripts de control deben seguir pasando. **La numeración de secciones es la del documento maestro**; las que no aparecen pertenecen a otros prompts. Haz solo lo que está en este prompt. Las reglas de localización (secciones 3 y 4) y el criterio de idiomas (sección 9) ya quedaron del prompt 1; el caso de prueba obligatorio (10), el monitor y la consola de plataforma (8) y la documentación (12) llegan en el prompt 3.

## 0. REGLAS DE TRABAJO

1. Sin preguntas; decide con criterio profesional.
2. Empieza con **Archivos nuevos / modificados / eliminados** y entrega el contenido **íntegro** de cada archivo (sin fragmentos ni TODO).
3. **Si te quedas sin espacio, termina limpiamente la fase en curso y escribe `FASE N COMPLETA — escribe "continúa"`.** Nunca dejes un archivo a medias.
4. Todo compila al final de cada fase (`tsc --noEmit`, `vite build`).
5. No afirmes pruebas o build que no ejecutaste: "revisión estática" y qué revisaste.
6. La app corre 100 % en el navegador (sin backend). Nunca afirmes que hay servidores reales; di "simulado".

---

## 2. CASO DE NEGOCIO

**SmartRestaurant** es una plataforma multinacional de **restaurantes de proximidad**: el cliente descubre restaurantes cercanos, pide a **domicilio** (o en mesa con QR, o reserva mesa), el restaurante prepara, un **repartidor** cercano y disponible entrega y todo queda con pago, comprobante legal del país, notificaciones y calificaciones. Eslogan sugerido (traducible): "Tu restaurante favorito, a la puerta de tu casa".

Tipo de comercio: restaurantes. Perfil de usuario objetivo: personas de zonas urbanas con poco tiempo para almuerzo. Mantén las dos marcas multinacionales existentes (**Aura Mestiza** y **Sora**), cada una con **2 sedes por ciudad** en barrios distintos, para poder demostrar búsqueda por cercanía (4 comercios por ciudad, 20 sedes en total).

### 2.1 Los cuatro actores del enunciado y sus roles

| Actor del enunciado | Rol(es) en la aplicación |
|---|---|
| **Cliente** | `customer` |
| **Comercio** | `owner` (dueño), `branch_admin` (administrador de sede), `waiter` (mesero), `kitchen` (cocina) y roles personalizados creados por ellos (por ejemplo `cashier`) |
| **Repartidor** | `courier` |
| **Administrador de plataforma** | `platform_admin` |

Cada actor tiene registro y autenticación, perfil regional propio (país, idioma, moneda, zona horaria) y su propio panel.

---

## 5. ACCESO, ROLES, PERMISOS Y CREDENCIALES

### 5.1 El panel administrativo es PRIVADO y no aparece en la vista del cliente

- La parte pública (cliente) **no contiene ningún enlace, botón, texto, menú ni ruta visible hacia el panel del personal**: sin "Panel Staff", sin tarjetas de roles, sin pestaña "Soy del equipo", sin mención en el pie de página. La pantalla `/login` pública es solo para clientes.
- El personal accede únicamente por una **URL específica, no enlazada desde ninguna pantalla de cliente**: `/#/staff` (pantalla "Acceso del personal"), con `<meta name="robots" content="noindex">` y título genérico. Todas las rutas internas viven bajo `/#/staff/app/...` y exigen sesión de personal; un cliente autenticado que las abre es redirigido al sitio público.
- La pantalla `/#/staff` tiene correo y contraseña, un bloque plegable **"Cuentas de demostración"** con la tabla de la sección 5.4 (solo ahí y en el README), el selector de idioma, y dos formularios de registro: **"Registrar mi comercio"** (queda `pending` hasta que el administrador de plataforma lo apruebe) y **"Quiero ser repartidor"** (queda `pending` hasta que lo apruebe un administrador de sede o el administrador de plataforma). Así se cubre el registro de los cuatro actores sin exponerlo al cliente.
- **Seguridad de la sesión (simulada pero coherente):** contraseñas con **hash + sal** (`crypto.subtle.digest('SHA-256')`), nunca en texto plano en el almacenamiento (las contraseñas de demostración se hashean al sembrar los datos); política de contraseña (mínimo 8, mayúscula, número y símbolo); sesión con **token y expiración de 8 horas**; bloqueo de 60 s tras 5 intentos fallidos; cierre de sesión que limpia todo; mensajes de error genéricos ("credenciales inválidas"); registro de auditoría. Indica en el README que es una simulación y qué se usaría realmente (TLS, OAuth 2.0/OIDC, bcrypt/argon2, JWT firmado).
- Los clientes se registran solos desde el sitio público (con casilla de **consentimiento** de tratamiento de datos, ver sección 11) o inician sesión con las cuentas de demostración de cliente.

### 5.2 Gestión de roles y usuarios (crear cualquier rol con credenciales)

Crea `/#/staff/app/equipo` con las pestañas **Usuarios**, **Roles y permisos** y **Auditoría**:

- **El dueño (`owner`) y el administrador de sede (`branch_admin`) pueden crear cualquier tipo de rol y asignarle credenciales.** Formulario "Crear usuario": nombre (campos según `profile.nameFields`), correo, teléfono (con validación del país), rol, sede(s), idioma, y credenciales: contraseña manual o **generada** (con botón copiar) y opción "obligar a cambiar contraseña al primer ingreso". También pueden **editar, desactivar, reactivar, restablecer contraseña y eliminar** usuarios.
- **Constructor de roles personalizados:** nombre del rol (traducible en los 5 idiomas), descripción y selección de permisos por casillas agrupadas (secciones 5.3). Ejemplo ya creado: `cashier` (cajero).
- **Reglas de alcance (anti-escalamiento de privilegios, aplicadas en la UI y en el servicio):**
  - `platform_admin`: puede todo, incluido crear dueños y aprobar comercios/repartidores.
  - `owner`: crea usuarios y roles en **cualquiera de las sedes de sus marcas**, con permisos que sean un subconjunto de los suyos; no puede crear `platform_admin` ni otro `owner`.
  - `branch_admin`: crea usuarios y roles **solo para su sede**, con permisos que sean un subconjunto de los suyos; no puede crear `owner` ni `platform_admin`; puede crear otros `branch_admin` de **su** sede.
  - Un usuario nunca puede concederse a sí mismo ni a otro más permisos de los que tiene. Si se fuerza la acción, el servicio la rechaza con el código `ERR_FORBIDDEN` y la UI muestra el mensaje traducido.
- Cada usuario guarda `preferredLanguage` y `timeZone` (por defecto los de su región) y los usa para **mostrar interfaz, notificaciones y fechas en su propio idioma y zona horaria**.
- Auditoría: quién creó/modificó/eliminó a quién, con fecha en la zona horaria del que mira (se almacena en UTC).

### 5.3 Permisos (claves) y valores por defecto de cada rol

Módulo `src/core/permissions.ts` con `can(user, permission, ctx?)`, usado en menú, botones, rutas (`RequirePermission`) **y en los servicios**. Las acciones sin permiso no se muestran (no quedan deshabilitadas sin explicación). Todo el personal queda limitado a sus sedes asignadas (`platform_admin` = todas).

| Permiso | platform_admin | owner | branch_admin | waiter | kitchen | courier |
|---|---|---|---|---|---|---|
| Consola global (todas las regiones, nodos, monitor, FX, perfiles regionales, comisiones) | ✓ | | | | | |
| Editar perfiles regionales, impuestos, medios de pago, propinas, festivos | ✓ | | | | | |
| Aprobar comercios y repartidores pendientes | ✓ | | ✓ (repartidores de su sede) | | | |
| Dashboard consolidado de todas las sedes de sus marcas | | ✓ | | | | |
| Dashboard de su sede | | ✓ | ✓ | | | |
| Ver ingresos y analítica / exportar CSV | ✓ | ✓ | ✓ (su sede) | | | |
| Crear/editar restaurantes, sedes y mesas | | ✓ | ✓ (mesas de su sede) | | | |
| Crear usuarios y roles (según 5.2) | ✓ | ✓ | ✓ | | | |
| Editar carta, precios y descripciones | | ✓ | ✓ | | | |
| Marcar plato agotado/disponible | | ✓ | ✓ | | ✓ | |
| Aceptar o rechazar pedidos a domicilio entrantes | | ✓ | ✓ | ✓ | | |
| Operar el tablero de cocina | | ✓ | ✓ | | ✓ | |
| Ver y gestionar reservas | | ✓ | ✓ | ✓ | | |
| Sentar clientes, tomar pedidos en mesa, servir | | ✓ | ✓ | ✓ | | |
| Cobrar, propina, cerrar mesa | | ✓ | ✓ | ✓ (sin descuentos) | | |
| Descuentos y reembolsos | ✓ | ✓ | ✓ | | | |
| Anular un plato ya enviado a cocina | | ✓ | ✓ | solo antes de que cocina lo empiece | | |
| Panel de reparto: disponibilidad, aceptar/rechazar ofertas, avanzar entrega | | | | | | ✓ |
| Moderar reseñas y responder | ✓ | ✓ | ✓ | | | |
| Notificaciones propias | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### 5.4 Credenciales de demostración (todas ficticias)

Contraseña = la indicada. Correos con dominio ficticio `@smartrestaurant.app`. Se muestran en `/#/staff` (bloque plegable) y en el README, **no** en la parte pública.

| Rol | Correo | Contraseña | Alcance |
|---|---|---|---|
| Administrador de plataforma | `plataforma@smartrestaurant.app` | `Plataforma#2026` | Global |
| Dueño (owner) | `dueno@smartrestaurant.app` | `Dueno#2026` | Todas las sedes de Aura Mestiza y Sora |
| Admin de sede Bogotá | `admin.bogota@smartrestaurant.app` | `Sede#2026` | Sedes de Bogotá |
| Admin de sede São Paulo | `admin.saopaulo@smartrestaurant.app` | `Sede#2026` | Sedes de São Paulo |
| Admin de sede Nueva York | `admin.nuevayork@smartrestaurant.app` | `Sede#2026` | Sedes de Nueva York |
| Admin de sede París | `admin.paris@smartrestaurant.app` | `Sede#2026` | Sedes de París |
| Admin de sede Tokio | `admin.tokio@smartrestaurant.app` | `Sede#2026` | Sedes de Tokio |
| Mesero (uno por ciudad) | `mesero.bogota@…`, `mesero.saopaulo@…`, `mesero.nuevayork@…`, `mesero.paris@…`, `mesero.tokio@…` | `Mesero#2026` | Su sede |
| Cocina (uno por ciudad) | `cocina.bogota@…` (y las otras cuatro ciudades) | `Cocina#2026` | Su sede |
| Repartidor (tres por ciudad) | `repartidor1.bogota@…` (y 2, 3, y las otras ciudades) | `Reparto#2026` | Su ciudad |
| Cajero (**rol personalizado** de ejemplo) | `cajero.bogota@smartrestaurant.app` | `Caja#2026` | Sede Bogotá |
| Cliente (uno por país) | `cliente.bogota@demo.app`, `cliente.saopaulo@demo.app`, `cliente.nuevayork@demo.app`, `cliente.paris@demo.app`, `cliente.tokio@demo.app` | `Cliente#2026` | Parte pública |
| Comercio pendiente de aprobación (ejemplo) | `nuevo.comercio@smartrestaurant.app` | `Comercio#2026` | Estado `pending` |

Debe haber **al menos un usuario de cada tipo** para probar todas las funciones (platform_admin, owner, branch_admin, waiter, kitchen, courier, customer y un rol personalizado), con nombres ficticios acordes al país (nombres japoneses en kanji, francés con œ, etc.).

### 5.5 Rutas

Públicas: `/`, `/restaurantes`, `/restaurantes/:id`, `/sucursal/:branchId`, `/carrito`, `/checkout`, `/pedido/:orderId` (seguimiento), `/comprobante/:orderId`, `/reservar`, `/mesa/:branchId/:tableId`, `/resenas`, `/ayuda`, `/privacidad`, `/login`, `/registro`, y protegidas de cliente: `/mis-pedidos`, `/mis-reservas`, `/mis-datos` (privacidad y perfil). Personal (ocultas): `/staff`, `/staff/app/...` con una pantalla de inicio distinta por rol (sección 7). 404 traducido.

---

## 6. FLUJO DE DOMICILIO COMPLETO (REQUISITOS FUNCIONALES 4.1–4.10 DEL ENUNCIADO)

1. **Catálogo por cercanía:** el cliente indica su ubicación (dirección con `AddressForm` o "usar mi ubicación" simulada con coordenadas de su ciudad); la lista de comercios se ordena por distancia (Haversine, en km o millas según el perfil), muestra tiempo estimado, tarifa de entrega en moneda local, calificación y estado abierto/cerrado (horario y festivos del perfil). Búsqueda por nombre, tipo de cocina y filtro por cercanía. Descripciones y precios por país.
2. **Carrito y pedido:** crear, modificar y **cancelar**. Desglose en moneda local: subtotal, tarifa de domicilio, **impuestos calculados por las reglas del perfil** (por tipo de pedido y por **jurisdicción de la dirección de entrega**), propina **según `tipPolicy`** y total. El carrito pertenece a una sede; cambiar de sede pide confirmación.
3. **Checkout:** dirección y teléfono con validación del país, nombre en el orden del país, medio de pago de `profile.paymentMethods`, propina según política, programar o "lo antes posible", aceptar términos. Resumen con formatos del país.
4. **Pago simulado con pasarela *mock*** (servicio independiente) con los medios del país, estados `authorized → captured → failed → refunded`, **reembolso en caso de cancelación o falla**.
5. **Transacción atómica del pedido (patrón saga con compensaciones):** `crear pedido → autorizar pago → confirmar comercio → asignar repartidor → capturar pago`; si un paso falla o se agota el tiempo, se ejecutan las **compensaciones en orden inverso** (liberar repartidor, anular autorización o reembolsar, cancelar pedido, avisar a todos). Cada paso es idempotente (clave de idempotencia) y queda en el monitor con "confirmación/reversión".
6. **Comercio:** recibe el pedido, lo **acepta o rechaza** (con motivo), indica tiempo de preparación, pasa por cocina (`queued → preparing → ready`) y lo marca "listo para recoger".
7. **Asignación de repartidor por cercanía y disponibilidad, con balanceo de carga:** `DispatchService` calcula un puntaje por repartidor (distancia al comercio + carga actual de entregas activas, ponderada por el perfil) y hace una **oferta** al mejor; si rechaza o vence (20 s simulados), pasa al siguiente. **Exclusión mutua:** un solo repartidor por pedido, con un bloqueo con arriendo (*lease*) distribuido. El monitor muestra el contador de carga por repartidor.
8. **Seguimiento en tiempo real** del pedido (línea de tiempo con estados y horas en la zona horaria del cliente) y de la **ubicación del repartidor** en un mapa estilizado en SVG sin servicios externos: puntos de GPS simulados que se mueven del comercio al cliente, ETA y distancia en km o millas.
9. **Repartidor:** panel móvil con disponibilidad (en línea/fuera de línea), ofertas con cuenta regresiva, "recogido", "en camino", "entregado" (con código de entrega de 4 dígitos), ganancias en su moneda y calificaciones.
10. **Notificaciones** al cliente, al comercio y al repartidor **en el idioma y la zona horaria de cada uno** (se guardan como `{ titleKey, messageKey, params, instantUtc }` y se traducen **al mostrarse**, así que cambian al cambiar de idioma).
11. **Comprobante** con el formato del país (factura electrónica, NF-e/NFC-e, receipt, ticket/facture, 領収書) generado desde `profile.receipt`: campos fiscales del comercio, desglose de impuestos por tasa, propina, moneda y formato locales, fecha en la zona del cliente **y** instante UTC en el pie. Se puede **imprimir** y **descargar como PDF/HTML** (impresión del navegador).
12. **Calificaciones:** tras la entrega el cliente califica **al comercio y al repartidor por separado** (1–5 + comentario), solo si tuvo una visita/pedido verificado y una vez por pedido. Los promedios aparecen en el catálogo, en la ficha del comercio, en el perfil del repartidor y en las consolas. Las reseñas de ejemplo (≥ 30) existen en los cinco idiomas y las respuestas del comercio también; las nuevas se guardan en su idioma original con la etiqueta traducida "Escrita en {idioma}".
13. Conserva y adapta lo existente: reservas, pedido en mesa por QR, mesero, cocina, reseñas y notificaciones, con flujo mesa → cocina → servir → cuenta (estados por plato `queued → preparing → ready → served`, estados de mesa, llamar al mesero, pedir la cuenta).

---

## 7. PANEL POR ACTOR (ALCANCE DE ESTE PROMPT)

Cada actor tiene un panel con menús, pantalla de inicio y acciones **distintos** (no un mismo panel con otro rótulo). Cambiar de rol sin cerrar sesión **no existe**: para cambiar de usuario hay que cerrar sesión y entrar de nuevo.

- **Cliente (público):** inicio con búsqueda por cercanía, carrito, mis pedidos con seguimiento, mis reservas (solo con sesión y solo las suyas), mis datos y privacidad.
- **Comercio — dueño:** resumen multi-sede con KPIs por ciudad en su moneda local y total referencial en USD (la fuente y fecha de la tasa llegan en el prompt 3; por ahora usa una tabla fija etiquetada "referencial"), comparación entre sedes, calificaciones, equipo y roles, carta, sedes y mesas, analítica con CSV.
- **Comercio — administrador de sede:** centro de operación de **su** sede en vivo: pedidos a domicilio por etapa, tiempos, reservas pendientes, mesas, repartidores asignados, equipo y roles de su sede, carta y reseñas.
- **Comercio — mesero:** mapa de mesas con estado en color **y texto**, tomar pedido por mesa, aceptar pedidos a domicilio, cobrar, alertas (plato listo, llamado, cuenta).
- **Comercio — cocina:** tablero de pantalla completa oscuro con Recibidos / Preparando / Listos / Entregados (domicilio y mesa), por plato, con cronómetros y filtro por estación.
- **Repartidor:** panel móvil (sección 6, punto 9).
- **Administrador de plataforma:** en este prompt crea solo su panel base: tablero global de pedidos por región (en moneda local de cada región), **usuarios de toda la plataforma, aprobación de comercios y repartidores pendientes y auditoría**. El editor de perfiles regionales, el modelo de ingresos, el monitor y el caso de prueba obligatorio los construye el prompt 3 (deja el ítem de menú "Sistema" sin enlaces rotos: muestra "próximamente" traducido solo si el prompt 3 aún no se aplicó).

---

## 11. CUMPLIMIENTO LEGAL DE DATOS (4.1.10)

- **Residencia de datos:** los datos personales de un cliente viven **solo en el nodo de su región** (partición propia). La capa global y las consolas consolidadas reciben **agregados anonimizados** (sin nombre, correo, teléfono ni dirección). El perfil indica región, ley aplicable (Ley 1581/2012, LGPD, CCPA/CPRA, RGPD, APPI) y plazos de retención.
- **Consentimiento:** el registro exige aceptar el tratamiento de datos, con texto traducido de la ley del país; se guarda fecha UTC, versión del texto y finalidad.
- **Derechos:** `/mis-datos` permite **ver y exportar mis datos (JSON/CSV)** y **solicitar la supresión** (derecho de supresión): anonimiza al usuario, conserva solo lo que la ley exige (comprobantes) y publica el evento. Muestra la restricción de **transferencia internacional**: un cliente no puede "mover" sus datos a otra región.
- Página `/privacidad` traducida y específica por país, generada desde `profile.dataResidency`.
- Todo dato de prueba es ficticio (nombres, correos, teléfonos, direcciones y documentos).

---


(La partición física de datos por nodo la implementa el prompt 3; aquí usa el campo `homeRegion` en cada registro personal y una función de acceso que solo devuelve datos de la región del usuario.)

---

## 14. ERRORES BLOQUEANTES DE ESTE PROMPT (CORRÍGELOS)

1. **"Cambiar Rol"** sigue en el menú del personal: elimínalo. Tampoco debe haber botón "Event Bus" en la barra de ningún rol (el monitor se abre solo desde el menú "Sistema" para quien tenga permiso).
2. **Permisos:** hoy solo hay 3 usos de comprobación y la ruta genérica `/app/:view` solo verifica que exista una sesión de personal. Reemplázala por rutas explícitas bajo `/staff/app/...` con `RequireAuth`, `RequireRole` y `RequirePermission` y por `can()` (sección 5.3). Elimina `canAccessView`.
3. Lo público no contiene ningún enlace al personal; "Mis reservas", "Mis pedidos" y "Mis datos" solo existen con sesión de cliente y filtran por `userId`.
4. Los usuarios de demostración definitivos (sección 5.4) reemplazan a los anteriores, con contraseñas **hasheadas con sal** al sembrar; la semilla no guarda contraseñas en texto plano.

---

## 15. FASES DE ESTE PROMPT

**FASE 2A — Acceso, roles y equipo**
1. Sesión segura (hash+sal, token con expiración, bloqueo por intentos), `/#/staff` oculto, `RequireAuth/Role/Permission`, `permissions.ts` con `can()`.
2. Usuarios de demostración (sección 5.4), registro de clientes con consentimiento, registro de comercio y de repartidor en `/#/staff` (estado `pending`).
3. `/#/staff/app/equipo`: usuarios, constructor de roles personalizados, anti-escalamiento de privilegios, auditoría. Panel base de cada rol y de plataforma (sección 7).
**FASE 2B — Domicilio completo**
4. Catálogo por cercanía, carrito, checkout por país (con `AddressForm`, medios de pago, propina por política), pasarela mock con reembolso, **saga del pedido con compensaciones**.
5. Panel de comercio para aceptar/rechazar domicilios, cocina por plato, **Dispatch** (puntaje por cercanía y carga, ofertas con vencimiento, exclusión mutua), panel del repartidor, 15 repartidores (3 por ciudad).
6. Seguimiento con mapa SVG y ubicación simulada del repartidor, notificaciones guardadas como claves y traducidas al mostrarse, comprobante por país (`profile.receipt`), calificaciones de comercio y repartidor, `/mis-datos` y `/privacidad`.
7. Conserva y adapta reservas, QR de mesa, mesero y cocina con el flujo mesa → cocina → servir → cuenta (estados por plato y de mesa).

---

## 16. VERIFICACIÓN DE ESTE PROMPT (REVISA TU CÓDIGO)

Si no puedes ejecutar el build, dilo ("revisión estática") y lista lo revisado.
1. `npm run build` y `prebuild` con 0 errores.
2. **Acceso:** un visitante no ve nada del personal; `/#/staff` pide credenciales; un cliente autenticado no puede abrir `/#/staff/app/...`; "Mis pedidos" y "Mis reservas" solo con sesión y solo del usuario; tras 5 intentos fallidos se bloquea 60 s; la sesión expira.
3. **Roles:** con cada cuenta de la sección 5.4, el menú, el inicio y las acciones son distintos. El dueño y el administrador de sede **crean usuarios y roles personalizados con credenciales** y esos usuarios inician sesión; un administrador de sede **no** puede crear un owner ni dar permisos que no tiene; si se fuerza la acción, el servicio devuelve `ERR_FORBIDDEN` y la UI lo muestra traducido.
4. **Domicilio en cada país (los cinco):** catálogo por cercanía → carrito → checkout con dirección/teléfono/nombre del país → pago con los medios del país → comercio acepta → cocina → asignación de repartidor → seguimiento con mapa → comprobante con el formato del país → calificación de comercio y repartidor.
5. **Saga:** forzando el fallo del pago, el pedido se revierte (libera repartidor, anula autorización, reembolsa y notifica en el idioma de cada parte).
6. **Idiomas:** las pantallas nuevas están en los cinco idiomas, sin palabras de otro idioma; las notificaciones cambian de idioma al cambiar el selector; `check-i18n` pasa.
7. **Dinero y tiempo:** importes enteros; el comprobante muestra la hora en la zona del cliente y el instante UTC en el pie.
8. **Privacidad:** consentimiento en el registro, exportar y suprimir datos desde `/mis-datos`, y `/privacidad` específica por país.
9. 360 / 768 / 1440 px sin desbordes.

Termina con un resumen de máximo 15 líneas: archivos creados/modificados/eliminados, qué cumple del enunciado, qué queda pendiente y qué verificaste realmente.
