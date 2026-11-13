# Declaración de Uso de Herramientas de Inteligencia Artificial

En cumplimiento de los lineamientos académicos de la asignatura **"Diseño de un Sistema Distribuido" (Universidad Central)**, se declara de forma transparente el uso de asistentes de Inteligencia Artificial durante la construcción de **SmartRestaurant**.

---

## 1. Datos del Grupo (Diligenciar antes de la entrega)

| Campo | Valor |
|---|---|
| **Asignatura** | Diseño de un Sistema Distribuido |
| **Institución** | Universidad Central |
| **Docente** | _[Completar nombre del docente]_ |
| **Integrantes del grupo** | _[Completar nombres completos y códigos estudiantiles]_ |
| **Fecha de entrega** | _[YYYY-MM-DD]_ |
| **Repositorio / URL Vercel** | _[Completar URLs finales]_ |

---

## 2. Alcance y Trazabilidad del Uso de IA

| Área del Proyecto | Herramienta / Uso Aplicado | Validación y Criterio del Equipo Humano |
|---|---|---|
| **Arquitectura y código React / TypeScript** | Generación asistida y refactorización modular de los 11 subsistemas, `broker.ts`, Saga de pedidos, nodos regionales y vistas por rol. | Revisión de aislamiento entre servicios, validación de ausencia de lógica condicional por país (`check-no-country-rules.mjs`) y verificación de compilación (`tsc --noEmit` y `vite build`). |
| **Internacionalización (5 idiomas)** | Redacción y sincronización de 1 260 claves de traducción en `es`, `en`, `pt`, `fr` y `ja`. | Auditoría estructural automatizada (`check-i18n.mjs`) y revisión contextual en cada vista pública y operativa. |
| **Reglas fiscales y casos de localización** | Estructuración de `RegionProfile` para CO, BR, US, FR y JP y matriz comparativa / autopruebas de navegador. | Verificación de fechas IANA/UTC (`2026-11-15 20:30` local → UTC con DST terminado en NY y París), contraste con portales tributarios oficiales (DIAN, NY/NJ, DGFiP, NTA) y marcado explícito de tasas referenciales (BR ISS/ICMS y tarifas base de envío). |
| **Documentación técnica** | Estructuración de `README.md`, `docs/ARQUITECTURA.md`, `docs/LOCALIZACION.md` y `docs/INTERFACES_REALES.md`. | Contraste directo contra archivos fuente (`src/core/*`, `src/services/*`, `src/data/regions/*`) y verificación de alcance honesto de la simulación en navegador. |

---

## 3. Declaración de Responsabilidad

El equipo autor comprende, asume la responsabilidad técnica total y está en capacidad de explicar, modificar y sustentar en vivo ante el jurado cada módulo, decisión arquitectónica, algoritmo de sincronización, regla de localización y prueba de falla incluida en el repositorio.
