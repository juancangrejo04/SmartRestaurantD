# 🍽️ SmartRestaurant — Plataforma Multinacional de Gestión Inteligente & Arquitectura Distribuida

SmartRestaurant es una plataforma web completa de gestión inteligente de restaurantes concebida bajo los principios de **sistemas distribuidos** y preparada para operar en **cinco países** con diferentes monedas, idiomas, formatos de fecha, tasas impositivas y zonas horarias.

Diseñada con una estética SaaS moderna (inspirada en Stripe, Toast POS y Linear) y lista para desplegarse directamente en **Vercel** sin necesidad de bases de datos externas ni configuraciones de variables de entorno.

---

## 🌟 Características Principales

### 1. Arquitectura de Sistema Distribuido Simulado (Academic Architecture)
- **7 Servicios de Dominio Independientes:**
  - `Auth Service`: Identidad, sesiones en LocalStorage y control de acceso basado en roles (RBAC).
  - `Restaurant Service`: Catálogo de restaurantes, sucursales y gestión del plano de mesas.
  - `Reservation Service`: Reservaciones centralizadas con motor de prevención de colisiones (rango ±90 min).
  - `Order Service`: Orquestación de comandas, comensales, cálculo dinámico de impuestos locales y propinas.
  - `Kitchen Service (KDS)`: Pantalla de despacho para línea de cocina con 4 columnas y cronómetros de preparación.
  - `Notification Service`: Distribuidor asíncrono de alertas push en la aplicación con historial y estado leído.
  - `Analytics Service`: Motor analítico en tiempo real con cálculo de KPIs y exportación directa a formato CSV.
- **Internal Event Bus:**
  - Registro de eventos con identificador único (`evt-xxxx`), timestamp, servicio origen, servicio destino, estado (`Pending`, `Processing`, `Completed`, `Failed`) e `idempotencyKey` para evitar ejecuciones duplicadas.
  - Simulación de latencia de red asíncrona.
  - Inyección de fallos controlada (Modo Caos) para demostrar tolerancia a fallos y reintentos (Dead Letter Queue).
  - Demostración guiada paso a paso para presentaciones académicas.

### 2. Internacionalización en Cinco Países (i18n)
| País | Idioma | Moneda | Zona Horaria | Impuesto Local |
| :--- | :--- | :--- | :--- | :--- |
| **Colombia** 🇨🇴 | Español | COP (`$ COP`) | America/Bogota | Impoconsumo (8%) |
| **México** 🇲🇽 | Español | MXN (`$ MXN`) | America/Mexico_City | IVA (16%) |
| **Estados Unidos** 🇺🇸 | English | USD (`$ USD`) | America/New_York | Sales Tax (8.875%) |
| **Brasil** 🇧🇷 | Português | BRL (`R$ BRL`) | America/Sao_Paulo | Taxa de Serviço (10%) |
| **Japón** 🇯🇵 | 日本語 | JPY (`¥ JPY`) | Asia/Tokyo | 消費税 (10%) |

- Reloj regional en vivo para la zona horaria del país activo.
- Traducciones completas en toda la interfaz (botones, formularios, estados, reportes y métricas).

### 3. Autenticación y Roles de Demostración
- **Owner**: Visión ejecutiva y analítica multinacional.
- **Admin**: Administración de locales, catálogo de menú y mesas.
- **Waiter**: Mapa de salón interactivo, asignación de mesas y toma de comandas.
- **Kitchen**: Pantalla KDS en tiempo real para cocineros y avance de tickets.
- **Customer**: Agendamiento de reservas y simulación de pedidos directos escaneando QR.
- Selector de rol en un clic con credenciales preconfiguradas.

### 4. Pedidos QR y Carta Digital
- Generador de código QR para cada mesa del restaurante.
- Simulador interactivo de pedido móvil para comensales (selección de platos, carrito, cálculo de impuestos, propinas y confirmación de pago).
- Seguimiento del pedido en vivo desde el smartphone del comensal.

### 5. Reportes y Analítica
- Gráficos interactivos con **Recharts** (tendencia semanal de ventas, facturación por sucursal, distribución de categorías).
- Botón de **Exportar a CSV** para auditorías e informes de gestión.

---

## 🚀 Puesta en Marcha Local

### Requisitos
- Node.js 18+ (recomendado Node.js 20 o 22)
- npm 9+

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/smartrestaurant.git
cd smartrestaurant
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en entorno de desarrollo
```bash
npm run dev
```
La aplicación iniciará en `http://localhost:3000`.

### 4. Generar build de producción
```bash
npm run build
```
Los archivos optimizados para producción se generarán en la carpeta `dist/`.

---

## 📦 Despliegue en Vercel

SmartRestaurant está preconfigurado con `vercel.json` para gestionar el enrutamiento SPA y no requiere variables de entorno.

### Opción 1: Despliegue desde la interfaz web de Vercel (Recomendado)
1. Sube tu código a un repositorio de **GitHub**.
2. Ingresa a [Vercel](https://vercel.com/) e inicia sesión.
3. Haz clic en **Add New Project** e importa el repositorio de GitHub.
4. Vercel detectará automáticamente la configuración:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Haz clic en **Deploy**. ¡Tu aplicación estará en línea en segundos!

### Opción 2: Despliegue mediante Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```
Para producción:
```bash
vercel --prod
```

---

## 🛠️ Tecnologías Utilizadas
- **React 19**
- **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide React** (Iconografía consistente)
- **Recharts** (Visualización de datos y gráficos)
- **LocalStorage API** (Persistencia local robusta sin dependencias de bases de datos remotas)

---

## 📄 Licencia
Este proyecto fue desarrollado con fines educativos y de demostración de arquitectura de software para sistemas distribuidos y modernos.
