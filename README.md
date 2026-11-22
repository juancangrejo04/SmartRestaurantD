# SmartRestaurant: módulo de procesos independientes

Módulo aparte de la app web (no la modifica). Sin dependencias; requiere Node 18 o superior.

- `services/broker.js`: intermediario de mensajes (publicación-suscripción, confirmación, reentrega y cola de fallidos).
- `services/payments.js`, `logistics.js`, `notifications.js`: subsistemas independientes que solo se comunican por mensajes.
- `services/order-node.js`: nodo regional. Misma imagen para los cinco países; la variable `REGION` (co, br, us, fr, jp) elige el perfil en `lib/profiles.json`.
- Las tasas de impuesto y propina son simplificadas; el cálculo completo está en la app web.

## Ejecutar
- Pruebas de falla automáticas, como procesos locales: `npm test`
- Con contenedores: `docker compose up --build` (puertos: broker 4000, pagos 4010, logística 4011, notificaciones 4012, nodos 4101 a 4105).
- Crear un pedido: `curl -X POST localhost:4102/orders -H 'content-type: application/json' -d '{"items":[{"price":2590,"qty":2}]}'`
- Fallas manuales: `docker compose stop payments`, crear un pedido y `docker compose start payments`.

## Sexto país por configuración
`lib/profiles.json` incluye un perfil de ejemplo `de` (Alemania, valores ilustrativos). `REGION=de node services/order-node.js` levanta el nodo sin cambiar código; la prueba T6 lo verifica.
