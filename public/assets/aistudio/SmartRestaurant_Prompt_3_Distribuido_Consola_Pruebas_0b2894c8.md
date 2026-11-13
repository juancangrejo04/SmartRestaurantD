# SMARTRESTAURANT — PROMPT 3 DE 3: SISTEMA DISTRIBUIDO, CONSOLA DE PLATAFORMA, PRUEBAS Y DOCUMENTACIÓN
# (Proyecto de asignatura "Diseño de un Sistema Distribuido" · Universidad Central)

Ya existe un proyecto SmartRestaurant en este workspace (React 19 + TypeScript + Vite 8 + Tailwind 4 + React Router 7 con `HashRouter`, estado en `src/context/AppContext.tsx`, diccionario en `src/i18n/translations.ts`, servicios en `src/services/`, páginas públicas en `src/pages/public/`, paneles en `src/views/`). Compila y está desplegado en Vercel. **No lo rehagas desde cero:** conserva el diseño cálido (crema, azafrán, espresso) y los módulos que funcionan (reservas, pedido por QR, mesero, cocina, reseñas, monitor) y modifica, reemplaza o elimina lo necesario.

**Contexto de esta serie:** la corrección se entrega en 3 prompts. Este es el **3** y último. **Da por hecho lo entregado en los prompts 1 y 2** (si algo no existe, créalo de forma mínima y avisa): cinco países (Bogotá, São Paulo, Nueva York, París, Tokio), perfiles regionales en `src/data/regions/*`, helpers `Money`/`Intl`/UTC, i18n en cinco idiomas (es, pt, en, fr, ja) con `t()`/`loc()`, 20 sedes con cartas por marca y país, el "Almuerzo del día" (CO `25900`, BR `2590`, US `2590`, FR `2590`, JP `2590`), sesión segura y panel de personal oculto en `/#/staff`, roles y permisos (`can()`), equipo y roles personalizados, flujo de domicilio con saga, Dispatch, repartidores, comprobantes por país, calificaciones y privacidad. **Reglas permanentes:** ningún `if (country === …)` fuera de `src/data/regions/`; importes enteros en unidad menor; instantes en UTC; todo texto nuevo por `t()` y en los cinco idiomas; los scripts de control deben seguir pasando. **La numeración de secciones es la del documento maestro.** Haz solo lo que está en este prompt. Referencias que verás a otras secciones ya resueltas: **4** (reglas de localización) en el prompt 1; **5.4** (credenciales), **7** (paneles por actor) y **11** (privacidad y residencia de datos, con el campo `homeRegion`) en el prompt 2.

## 0. REGLAS DE TRABAJO

1. Sin preguntas; decide con criterio profesional.
2. Empieza con **Archivos nuevos / modificados / eliminados** y entrega el contenido **íntegro** de cada archivo (sin fragmentos ni TODO).
3. **Si te quedas sin espacio, termina limpiamente la fase en curso y escribe `FASE N COMPLETA — escribe "continúa"`.** Nunca dejes un archivo a medias.
4. Todo compila al final de cada fase (`tsc --noEmit`, `vite build`).
5. No afirmes pruebas o build que no ejecutaste: "revisión estática" y qué revisaste.
6. **Alcance honesto:** la app corre 100 % en el navegador. Los nodos regionales, el broker y las réplicas son **simulación fiel** de un sistema distribuido (mensajes serializados, sin memoria compartida, con latencia, fallos y reintentos). Nunca afirmes que existen servidores, contenedores o comunicación real entre máquinas; di "nodo lógico simulado" y documenta la interfaz real que se usaría (sección 12).

---

## 1. LO QUE EXIGE EL ENUNCIADO PARA ESTE PROMPT

Requisitos del prototipo (sección 7 del PDF): cinco instancias/regiones lógicas comunicadas por red (aquí simuladas); **una única base de código parametrizada por perfiles regionales**; **al menos cuatro subsistemas como procesos independientes comunicados por mensajes con un middleware**; flujo completo de pedido por país; **pruebas de falla** (detener un nodo durante un pedido y demostrar reintento, reversión o conmutación a una réplica); **pruebas de localización** con el caso de prueba obligatorio; repositorio con instrucciones de despliegue y datos de prueba (todo dato personal es ficticio). Criterios relacionados: diseño funcional con subsistemas, transacciones atómicas, middleware, sincronización y datos (20 pts), objetivos de un SD (10 pts), diseño físico (15 pts, en el informe), prototipo y pruebas (10 pts).

---

## 8. SISTEMA DISTRIBUIDO SIMULADO (OBJETIVOS DE UN SD)

### 8.1 Nodos regionales y réplicas
Cinco **nodos regionales lógicos** (`node-co`, `node-br`, `node-us`, `node-fr`, `node-jp`), cada uno con su **partición de datos propia** (espacio de almacenamiento aislado, con clave por región) y su **instancia de cada servicio de la región**. Cada región tiene un **primario y una réplica** que se sincroniza por eventos de replicación (consistencia eventual, con retardo visible). Capa global mínima: directorio de identidad de la plataforma, FX, y analítica consolidada (que solo recibe agregados anonimizados, sección 11).

### 8.2 Subsistemas (mínimo cuatro, aquí once) como procesos lógicos independientes
Identidad y Perfiles Regionales · Catálogo · Reservas · Pedidos · Cocina · Logística y Asignación (Dispatch) · Pagos · Facturación e Impuestos · Notificaciones · Tasas de cambio (FX) · Analítica y Monitoreo. **Ninguno importa a otro**: solo se comunican por mensajes a través del **broker** (`src/core/broker.ts`, un único Event Bus; elimina el segundo que hoy no se usa). Cada servicio tiene su propio estado y API mínima; la UI habla con un `ApiGateway` simulado.

### 8.3 Broker / middleware (justificación en `docs/ARQUITECTURA.md`)
Publicación-suscripción con colas por suscriptor y **mensajes serializados a JSON UTF-8 en cada frontera** (sin referencias compartidas). Envelope: `id, type, version, region, traceId, correlationId, lamport, idempotencyKey, sourceService, targetService, status (pending|processing|completed|failed), attempts, maxAttempts, createdAtUtc, payload, headers { locale, timeZone }`. Entrega *at-least-once* con **idempotencia por consumidor**, reintentos con *backoff* exponencial, *dead-letter queue* y reproducción manual; latencias simuladas distintas intra-región e inter-región; sincronización entre pestañas con `BroadcastChannel`.

### 8.4 Sincronización y coordinación
Reloj de Lamport en los eventos; NTP simulado por nodo; exclusión mutua para "un solo repartidor por pedido" (lease con TTL); **elección de líder** entre primario y réplica de cada región (cuando cae el primario, la réplica se promueve y el monitor lo muestra); manejo de interbloqueos con tiempo de espera y liberación del lease.

### 8.5 Nombres
`NameService` (directorio de servicios con TTL y caché) que resuelve `servicio.región` → nodo → "dirección" lógica (por ejemplo `pagos.co.smartrestaurant.app:8443`), reflejando los dominios regionales del perfil. El monitor muestra la tabla de resolución y su caché.

### 8.6 Pruebas de falla (interactivas, para sustentación)
En el monitor, botones y un asistente guiado paso a paso, con narración traducida, que ejecutan de verdad:
1. **Detener un nodo o un servicio durante un pedido real** (por ejemplo Pagos de Bogotá) y mostrar: detección (heartbeat perdido), reintentos con *backoff*, y **recuperación** al reiniciarlo, con el pedido terminando bien.
2. **Falla permanente de Pagos** → la **saga revierte** (libera repartidor, anula la autorización, cancela el pedido, reembolsa y notifica en el idioma de cada parte).
3. **Caída del primario de una región** → **conmutación a la réplica** y el pedido sigue; mostrar el retardo de replicación y la consistencia eventual al volver el primario.
4. **Evento duplicado** → idempotencia (se ignora el segundo y no se cobra dos veces).
5. **Reintentar eventos fallidos** y **restablecer servicios**.
Cada prueba termina con un **registro de resultados** exportable (CSV) con marcas de tiempo UTC.

### 8.7 Objetivos del SD (visibles como "Matriz de objetivos" en el monitor)
Transparencia (acceso, ubicación, concurrencia, fallas; y un ejemplo de dónde **no** conviene: mostrar al cliente la moneda local), fiabilidad (sin componentes críticos únicos, réplicas), rendimiento (caché de catálogos con TTL y su tasa de aciertos), escalabilidad (ningún nodo con el estado global; agregar un sexto país solo con configuración: botón "Simular alta de país" que registra un perfil de ejemplo desactivado), flexibilidad y apertura (interfaces públicas documentadas), seguridad (autenticación, control de acceso por rol, protección frente a denegación de servicio con *rate limiting* simulado y suplantación con tokens firmados simulados) y manejo de fallas (ACID: confirmación y reversión en pago y pedido). Cada objetivo enlaza con la demostración que lo prueba.

### 8.8 El monitor es solo del personal
`/#/staff/app/monitor` (administrador de plataforma y dueño; por defecto también administradores de sede en modo lectura de su región). El aviso académico va **solo** en el monitor y en el README: "Simulación académica: los nodos y servicios son módulos lógicos dentro del navegador que se comunican por un broker simulado; no hay servidores ni comunicación real entre máquinas". Nada de esto aparece en la parte pública. Incluye diagrama animado: Cliente → API Gateway → Servicios de dominio → Broker → Servicios destinatarios, con las cinco regiones; selección de evento con detalle y línea de tiempo de intentos; historial con filtros.

---

## 10. CASO DE PRUEBA OBLIGATORIO (PANTALLA EN LA CONSOLA)

Crea `/#/staff/app/prueba-localizacion` (administrador de plataforma). El botón **"Ejecutar caso de prueba en los 5 países"** procesa, de verdad y por el flujo completo (catálogo → carrito → pago simulado → asignación → seguimiento → comprobante), el **mismo pedido lógico**: **dos almuerzos, un domicilio y una propina, realizado el 15 de noviembre de 2026 a las 20:30 hora local** de cada país. Luego muestra, para los cinco países, una **tabla comparativa** y los **cinco comprobantes** (abrir/imprimir/exportar CSV):

| Elemento a verificar | Qué se debe mostrar |
|---|---|
| Idioma y textos | Etiquetas, mensajes y estados del pedido en el idioma del país |
| Precio y moneda | Subtotal, domicilio, impuestos, propina y total con símbolo, separadores y decimales correctos |
| Fecha y hora | Formato local con la zona correcta **y almacenamiento en UTC** |
| Dirección y teléfono | Captura y validación según el país |
| Impuesto y comprobante | Tasa aplicable y tipo de documento |
| Pago | Medios de pago disponibles según el país |
| Propina | Sugerida, opcional o ausente según el país |

Cada catálogo incluye un **"Almuerzo del día"** con estos precios exactos (los del enunciado), que se guardan como enteros en unidad menor: CO `25900` ($ 25.900), BR `2590` (R$ 25,90), US `2590` ($25.90), FR `2590` (25,90 €), JP `2590` (¥2,590). Tarifas de domicilio de ejemplo (referenciales): CO 4.900 COP, BR R$ 6,90, US $4.99, FR 3,90 €, JP ¥300.

**Resultados esperados de fecha y hora (verificados con IANA/`Intl`)**, para que el código los pase como pruebas:

| País | Hora local mostrada | Instante UTC almacenado |
|---|---|---|
| Colombia | 15/11/2026, 8:30 p. m. (COT, UTC−5) | `2026-11-16T01:30:00Z` |
| Brasil | 15/11/2026, 20:30 (BRT, UTC−3) | `2026-11-15T23:30:00Z` |
| Estados Unidos | 11/15/2026, 8:30 PM (EST, UTC−5; el horario de verano terminó el 1-nov) | `2026-11-16T01:30:00Z` |
| Francia | 15/11/2026 20:30 (CET, UTC+1; el horario de verano terminó el 25-oct) | `2026-11-15T19:30:00Z` |
| Japón | 2026/11/15 20:30 (JST, UTC+9) | `2026-11-15T11:30:00Z` |

Resultados esperados de impuesto/propina: CO impoconsumo sobre comida y IVA sobre tarifa, propina voluntaria (sugerida 10 %); BR tasa referencial, propina opcional; US sales tax por **dirección de entrega** y propina **solicitada** (por defecto 18 %); FR TVA 10 % con servicio incluido y **sin** propina por defecto; JP 8 % por ser domicilio de alimentos y **sin** propina ni sugerencia. Estos números deben **salir de `profile.taxRules` y `profile.tipPolicy`**, no del código.

Incluye pruebas unitarias ligeras ejecutables en el navegador (botón "Ejecutar autopruebas" en la misma pantalla) para: formatos de moneda y fecha de los cinco países, conversión local→UTC de la tabla anterior, enteros en unidad menor (sin `float`), reglas de impuestos por jurisdicción, política de propina y plurales de francés/japonés. Muestra aprobado/fallido por prueba.

---

## 12. DOCUMENTACIÓN EN EL REPOSITORIO (EXIGIDA POR EL ENUNCIADO)

Genera, breves y con tablas:
- `README.md`: instalación (`npm install`), ejecución, build, GitHub y Vercel (Framework Vite, build `npm run build`, salida `dist`, sin variables de entorno); **credenciales de demostración** (sección 5.4) y la URL oculta del personal `/#/staff`; **guion de sustentación de 5 minutos** (cliente pide a domicilio en Bogotá → comercio acepta → cocina → asignación de repartidor → seguimiento → comprobante → calificación → consola con FX → prueba de falla → caso de prueba en los 5 países); aviso de simulación académica; **cómo agregar un sexto país solo con configuración** (perfil, locale, datos, sin tocar la lógica).
- `docs/ARQUITECTURA.md`: grafo de subsistemas (lista de aristas), tabla de transacciones (emisor, receptor, mensaje y formato, protocolo, confirmación y reversión, qué hacer si falla), tecnologías de comunicación elegidas y por qué, middleware elegido y qué heterogeneidad resuelve, sincronización y coordinación, datos (partición, replicación, consistencia fuerte vs eventual y dónde), servicio de nombres.
- `docs/LOCALIZACION.md`: el perfil regional de cada país con la **fuente oficial y fecha de verificación** de cada tasa e impuesto (marcando lo que está pendiente de verificar), las reglas 4.1 y cómo se cumplen.
- `docs/INTERFACES_REALES.md`: la interfaz real que se usaría para lo simulado (pasarelas de pago por país como PSE/Nequi, Pix/boleto, tarjetas y wallets, SEPA, PayPay/konbini; mapas y geocodificación; servicio de tasas de cambio; facturación electrónica DIAN/NF-e/SIRET/invoice system; mensajería push/SMS/correo; broker como RabbitMQ/Kafka/NATS), con endpoints y formatos típicos.
- `docs/DECLARACION_IA.md`: declaración del uso de herramientas de IA en el proyecto (el enunciado exige declararlo), con campos para el grupo.

---


---

## 14. ERRORES BLOQUEANTES DE ESTE PROMPT (CORRÍGELOS)

1. **Dos Event Bus:** `src/services/eventBus.ts` (el que usa `AppContext`) y `src/core/eventBus.ts` (más completo, con `BroadcastChannel`, sin uso). Unifica en `src/core/broker.ts` y borra el otro; migra `AppContext` y los servicios.
2. El monitor y la consola de plataforma **no aparecen en lo público**; solo bajo `/#/staff/app/...` con `RequirePermission`.
3. Todo texto del monitor, de las demostraciones guiadas y de las pruebas (incluido el JSON legible, las etiquetas y los mensajes narrados) pasa por `t()` en los cinco idiomas; el payload JSON técnico puede quedar en crudo.
4. Los mensajes de la demostración de `AppContext` hoy están fijos en español: pasan a claves.

---

## 15. FASES DE ESTE PROMPT

**FASE 3A — Núcleo distribuido**
1. `broker.ts` (envelope, colas por suscriptor, at-least-once, idempotencia, backoff, DLQ), `Clock` + NTP simulado + Lamport, `NameService`, `FxService`, bloqueo con arriendo, elección de líder.
2. Nodos regionales con partición de datos propia (clave por región) y réplica con consistencia eventual; los once subsistemas como servicios independientes que solo se comunican por el broker; `ApiGateway` simulado; sincronización entre pestañas.
**FASE 3B — Consola, monitor y pruebas**
3. Consola de **administrador de plataforma**: tablero global con total consolidado en USD (con fuente y fecha del FX), **editor de perfiles regionales y tasas** (cambia impuestos, propinas, medios de pago, festivos y formatos sin tocar código), **modelo de ingresos** (comisión, tarifa de entrega y publicidad en las cinco monedas), aprobaciones, usuarios y auditoría.
4. Monitor con diagrama animado, cola de eventos, detalle, nodos y réplicas, directorio de servicios, **pruebas de falla guiadas**, matriz de objetivos del SD y registro de resultados en CSV.
5. Pantalla **Caso de prueba obligatorio** con tabla comparativa, cinco comprobantes y **autopruebas** en el navegador.
**FASE 3C — Documentación y cierre**
6. `README.md`, `docs/ARQUITECTURA.md`, `docs/LOCALIZACION.md`, `docs/INTERFACES_REALES.md`, `docs/DECLARACION_IA.md` (sección 12).
7. Pasada final con el protocolo de verificación siguiente sobre **todo el proyecto**.

---

## 16. VERIFICACIÓN FINAL DEL PROYECTO (REVISA TU CÓDIGO)

Si no puedes ejecutar el build o las autopruebas, dilo ("revisión estática") y lista lo revisado.
1. `npm install` sin banderas, `npm run build` y `prebuild` con 0 errores; existe **un solo** broker.
2. **Pruebas de falla:** detener Pagos en un pedido real (reintento con backoff y recuperación), falla permanente (saga: reversión y reembolso), caída del primario de una región (conmutación a réplica y consistencia eventual al volver) y evento duplicado (idempotencia); cada una deja un registro exportable con marcas de tiempo UTC.
3. **Caso de prueba obligatorio:** los cinco países producen la tabla de la sección 10 con los instantes UTC esperados, los impuestos y propinas **salidos de `profile.taxRules` y `profile.tipPolicy`**, y las autopruebas pasan.
4. **Consola de plataforma:** editar una tasa de impuesto en el perfil de un país cambia el resultado del siguiente pedido y del comprobante **sin tocar código**; el consolidado en USD muestra fuente y fecha de la tasa; los cobros al cliente siguen en moneda local.
5. **Residencia de datos:** el consolidado global no contiene datos personales; cada región solo ve sus clientes.
6. **Sexto país:** el botón "Simular alta de país" registra un perfil de ejemplo desactivado, y el README explica los pasos para agregar Alemania solo con configuración.
7. **Aislamiento:** ningún servicio importa a otro; todo pasa por el broker con mensajes serializados.
8. **Idiomas:** monitor, consola y pruebas en los cinco idiomas, sin palabras de otro idioma; `check-i18n` y `check-no-country-rules` pasan.
9. **Pública limpia:** ningún texto técnico (Event Bus, simulación, arquitectura) fuera del monitor y del README.
10. Recarga conserva datos; "Restaurar datos iniciales" (solo plataforma) los regenera. 360 / 768 / 1440 px sin desbordes.

Termina con un resumen de máximo 15 líneas: qué cumple de cada sección del enunciado, qué queda pendiente y qué verificaste realmente.
