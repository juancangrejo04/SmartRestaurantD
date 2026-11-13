# Especificación de Localización e Internacionalización — SmartRestaurant

Toda la lógica de formato monetario, fechas, impuestos, propinas, validaciones y comprobantes se parametriza exclusivamente desde `src/data/regions/{CO,BR,US,FR,JP}.ts`, sin condicionales por país en los servicios ni en las vistas.

---

## 1. Perfiles Regionales Configurados (5 Mercados)

| Atributo | Colombia (`CO`) | Brasil (`BR`) | Estados Unidos (`US`) | Francia (`FR`) | Japón (`JP`) |
|---|---|---|---|---|---|
| **Ciudad piloto** | Bogotá | São Paulo | New York | Paris | 東京 (Tokyo) |
| **Idioma por defecto** | Español (`es`) | Português (`pt`) | English (`en`) | Français (`fr`) | 日本語 (`ja`) |
| **Moneda y unidad menor** | `COP` (`0` dec.) | `BRL` (`2` dec., centavos) | `USD` (`2` dec., cents) | `EUR` (`2` dec., cents) | `JPY` (`0` dec.) |
| **Formato ejemplo (`25900`/`2590`)** | `$ 25.900` | `R$ 25,90` | `$25.90` | `25,90 €` | `¥2,590` |
| **Separadores (miles / dec.)** | `.` / `,` | `.` / `,` | `,` / `.` | `\u202F` (espacio fino) / `,` | `,` / `.` |
| **Fecha / Reloj** | `dd/mm/aaaa` · `12h` | `dd/mm/aaaa` · `24h` | `mm/dd/aaaa` · `12h` | `dd/mm/aaaa` · `24h` | `aaaa/mm/dd` · `24h` |
| **Zona horaria IANA / DST** | `America/Bogota` (No) | `America/Sao_Paulo` (No) | `America/New_York` (Sí) | `Europe/Paris` (Sí) | `Asia/Tokyo` (No) |
| **Orden de nombre** | Nombre + Apellido | Nombre + Apellido | Given + Family | Prénom + Nom | Apellido + Nombre (`family_given`) |
| **Prefijo / Regex teléfono** | `+57` (`^3\d{9}$`) | `+55` (`(XX) 9XXXX-XXXX`) | `+1` (`(XXX) XXX-XXXX`) | `+33` (`0X XX XX XX XX`) | `+81` (`0[789]0-XXXX-XXXX`) |
| **Código postal** | 6 dígitos (opcional) | CEP `NNNNN-NNN` | ZIP `NNNNN(-NNNN)` | Code postal `NNNNN` | 〒`NNN-NNNN` (primero en dirección) |
| **Política de propina (`tipPolicy`)** | Voluntaria (`0/5/10/15%`, def. `0%`) | Opcional (`0/5/10%`, def. `0%`) | Solicitada (`15/18/20/25%`, def. `18%`) | Servicio incluido (sin widget) | Ninguna (`none`, sin widget ni sugerencia) |
| **Medios de pago** | PSE, Nequi, Tarjeta, Efectivo | Pix, Tarjeta, Boleto, Efectivo | Card, Apple Pay, Google Pay, Cash | Carte Bancaire, Apple Pay, SEPA, Espèces | Card, PayPay, Konbini, 現金 |
| **Residencia de datos** | `southamerica-east1` · Ley 1581/2012 (60 m) | `southamerica-east1` · LGPD 13.709/2018 (60 m) | `us-east1` · NY SHIELD / CCPA (84 m) | `europe-west9` · RGPD UE 2016/679 (120 m) | `asia-northeast1` · APPI (84 m) |

---

## 2. Reglas Fiscales, Comprobantes, Fuentes Oficiales y Estado de Verificación

| País | Reglas configuradas en `taxRules` | Tipo de comprobante (`profile.receipt`) | Fuente oficial registrada | Fecha verificación | Estado / Observación |
|---|---|---|---|---|---|
| **Colombia (`CO`)** | • Impoconsumo comida preparada: **8 %** (`800 bps`)<br>• IVA sobre tarifa de domicilio: **19 %** (`1900 bps`) | Factura Electrónica DIAN con Validación Previa (CUFE · NIT) | [DIAN — Impoconsumo](https://www.dian.gov.co/impuestos/personas/Paginas/impuesto-nacional-al-consumo.aspx) · [DIAN — IVA](https://www.dian.gov.co/impuestos/personas/Paginas/iva.aspx) | `2026-01-15` | Verificado régimen general; excepciones de régimen simple o alimentos crudos excluidos no modeladas. |
| **Brasil (`BR`)** | • Tasa referencial ISS / ICMS restaurantes: **5 %** (`500 bps`) | NFC-e (Nota Fiscal de Consumidor Eletrônica · CNPJ) | [Prefeitura SP — ISS](https://www.prefeitura.sp.gov.br/cidade/secretarias/fazenda/tributos/iss/) | `2026-01-20` | **Referencial / Pendiente de validación contable local:** varía según municipio, régimen Simples Nacional vs Lucro Presumido y desglose ICMS-ST. |
| **Estados Unidos (`US`)** | • Sales Tax NY (NYC comida/entrega): **8.875 %** (`888 bps`)<br>• Sales Tax NJ (entrega interestatal): **6.625 %** (`663 bps`) | Itemized Digital Sales Receipt & POS Audit Trail (EIN) | [NY Tax Rates](https://www.tax.ny.gov/bus/st/rates.htm) · [NJ Treasury Rates](https://www.state.nj.us/treasury/taxation/ratehist.shtml) | `2026-01-10` | Verificado para jurisdicciones piloto NY/NJ; requiere integración real con motor postal por *ZIP+4* para otros estados. |
| **Francia (`FR`)** | • TVA restauración consumo inmediato/domicilio: **10 %** (`1000 bps`)<br>• TVA productos envasados para llevar: **5.5 %** (`550 bps`)<br>• TVA domicilio/alcohol: **20 %** (`2000 bps`) | Ticket de Caisse NF525 & Ventilation TVA Factur-X (SIRET · DGFiP) | [impots.gouv.fr — TVA Restauration](https://www.impots.gouv.fr/professionnel/taux-de-tva-en-restauration) | `2026-01-18` | Verificado conforme normativa DGFiP de tasas diferenciadas (10 % vs 5.5 % vs 20 %). |
| **Japón (`JP`)** | • Consumo en salón (*dine-in*): **10 %** (`1000 bps`)<br>• Domicilio / para llevar (*Keigen Zeiritsu* alimentos): **8 %** (`800 bps`)<br>• Tarifa de envío: **10 %** (`1000 bps`) | 領収書 (*Ryōshūsho*) / 適格請求書 Sistema Invoice (`T`+13 dígitos · NTA) | [NTA — Tasa estándar 10 %](https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6102.htm) · [NTA — Tasa reducida 8 %](https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/index.htm) | `2026-01-12` | Verificado régimen *Keigen Zeiritsu* (8 % alimentos domicilio vs 10 % en mesa y tarifa de reparto). |

> **Nota sobre tarifas base de domicilio y festivos:** Las tarifas base de envío por país (`CO 5.500`, `BR R$ 7,90`, `US $2.99`, `FR 2,50 €`, `JP ¥380` — y en el caso de prueba `CO 4.900`, `BR 6,90`, `US 4.99`, `FR 3,90`, `JP 300`) son **valores comerciales referenciales** editables desde `/#/staff/app/sistema`. Los festivos nacionales de 2026 pueden requerir ajuste anual por decreto local.

---

## 3. Cumplimiento de las Reglas de la Sección 4.1

1. **Enteros estrictos en unidad menor (`src/core/money.ts`):** Todos los precios, impuestos, propinas, comisiones y totales se representan como `{ amount: number, currency: CurrencyCode }` en enteros de unidad menor (`Math.round`), sin operaciones `float` en sumas, restas o cálculos en puntos básicos (`mulBps`).
2. **Almacenamiento en UTC e `Intl` regional (`src/core/clock.ts` y `money.ts`):** Todo instante se persiste en ISO-8601 UTC (`...Z`). La conversión bidireccional local ↔ UTC se resuelve mediante `Intl.DateTimeFormat` con la zona IANA del `RegionProfile`, respetando transiciones DST (`EST` en NY el 1 de noviembre y `CET` en París el 25 de octubre).
3. **Cero condicionales de país en lógica de negocio:** El script `node scripts/check-no-country-rules.mjs` audita todo `src/` (fuera de `src/data/regions/`, `src/i18n/`, `src/types/`, `seedData.ts` y `dishCatalog.ts`) y falla el `prebuild` si detecta comparaciones literales de país/moneda en servicios, componentes o vistas.
4. **Cobertura i18n al 100 % en 5 idiomas:** Todo texto de interfaz pública, portal `/#/staff`, monitor y pruebas se consulta con `t('clave')` / `loc(...)`. El script `node scripts/check-i18n.mjs` verifica que `es`, `en`, `pt`, `fr` y `ja` contengan exactamente el mismo conjunto de claves (1 260 claves no vacías) antes de cada compilación.
