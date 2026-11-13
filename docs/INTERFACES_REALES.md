# Interfaces Reales Equivalentes para Producción — SmartRestaurant

Este documento describe las interfaces, protocolos y proveedores externos reales que reemplazarían a los módulos simulados del prototipo al desplegar SmartRestaurant en infraestructura productiva distribuida.

---

## 1. Pasarelas de Pago Regionales (reemplaza `src/services/paymentGatewayService.ts`)

| Región | Proveedores / Rieles Reales | Endpoint Típico (Backend Regional → PSP) | Contrato JSON Típico |
|---|---|---|---|
| **CO 🇨🇴** | Wompi / PayU Latam / MercadoPago CO (**PSE**, **Nequi Push**, Tarjetas) | `POST https://production.wompi.co/v1/transactions` | `{"amount_in_cents": 6162400, "currency": "COP", "payment_method": {"type": "NEQUI", "phone_number": "3001234567"}, "reference": "ord-bog-401"}` |
| **BR 🇧🇷** | Banco Central BACEN (**Pix** QR Dinámico DICT) · PagSeguro / Stone (**Boleto**, Cartão) | `POST https://pix.api.efipay.com.br/v2/cob/{txid}` | `{"calendario": {"expiracao": 900}, "valor": {"original": "65.17"}, "chave": "pix-cnpj-sede"}` |
| **US 🇺🇸** | Stripe / Adyen (**Credit/Debit**, **Apple Pay**, **Google Pay** con *manual capture*) | `POST https://api.stripe.com/v1/payment_intents` | `{"amount": 6562, "currency": "usd", "capture_method": "manual", "idempotency_key": "saga-ord-us-auth"}` |
| **FR 🇫🇷** | Stripe EU / Lyra / Adyen (**Carte Bancaire CB**, **SEPA Direct Debit**, Apple Pay, SCA 3DS2) | `POST https://api.stripe.com/v1/payment_intents` | `{"amount": 6087, "currency": "eur", "payment_method_types": ["card", "sepa_debit"], "capture_method": "manual"}` |
| **JP 🇯🇵** | **PayPay** Merchant API · GMO Payment Gateway (**Konbini**, Tarjetas) | `POST https://api.paypay.ne.jp/v2/codes` | `{"merchantPaymentId": "ord-jp-101", "amount": {"amount": 5894, "currency": "JPY"}, "codeType": "ORDER_QR"}` |

---

## 2. Facturación Electrónica e Impuestos (reemplaza `src/services/billingService.ts`)

| Región | Autoridad / Norma Real | Proveedor / API Típica | Payload / Formato Intercambio |
|---|---|---|---|
| **CO 🇨🇴** | DIAN — Facturación Electrónica con Validación Previa | Proveedor Tecnológico autorizado DIAN (XML UBL 2.1 + firma XAdES + cálculo **CUFE**) | `POST /api/v1/dian/invoices` → recibe `{ cufe, qrUrl, xmlBase64, applicationResponse }` |
| **BR 🇧🇷** | SEFAZ Estadual / Receita Federal | Focus NFe / Tecnospeed **NFC-e** (Modelo 65) | `POST /v2/nfce?ref=ord-br-201` → XML firmado con Certificado A1, retorna `chave_nfe` y `url_danfe` |
| **US 🇺🇸** | IRS / State Dept. of Taxation | Avalara AvaTax / TaxJar (cálculo por dirección *ZIP+4* en tiempo real) | `POST https://api.taxjar.com/v2/taxes` → `{"to_zip": "07030", "to_state": "NJ", "shipping": 4.99, "amount": 51.80}` |
| **FR 🇫🇷** | DGFiP — Certificación NF525 & Factur-X | Sistema certificado NF525 / Chorus Pro (PDF/A-3 + XML EN16931) | Registro encadenado inmutable (`hash_chain` SHA-256) + desglose TVA (`10 %`, `5.5 %`, `20 %`) |
| **JP 🇯🇵** | NTA — *Qualified Invoice System* | API POS conforme **インボイス制度** con registro `T` + 13 dígitos | Comprobante con total imponible discriminado por tasa `8 %` (軽減税率) y `10 %` |

---

## 3. Tasas de Cambio FX (reemplaza `src/services/fxService.ts`)

- **Fuentes oficiales sugeridas:** European Central Bank (`eurofxref-daily.xml`), Federal Reserve H.10, Banco de la República Colombia (TRM WebService SOAP/REST), Banco Central do Brasil (`Olinda PTAX` API).
- **Endpoint interno proyectado:** `GET https://fx.internal.smartrestaurant.app/v1/snapshots/latest?base=USD`
- **Contrato JSON:**
```json
{
  "baseCurrency": "USD",
  "sourceName": "ECB + Fed H.10 + BanRep + BCB PTAX",
  "publishedAtUtc": "2026-11-12T16:00:00Z",
  "ratesPerUsd": { "USD": 1.0, "COP": 4100.0, "BRL": 5.6, "EUR": 0.92, "JPY": 155.0 }
}
```

---

## 4. Mapas, Geocodificación y Despacho (reemplaza `src/services/dispatchService.ts` + `src/core/geo.ts`)

- **Proveedores:** Google Maps Platform (*Places Autocomplete*, *Geocoding*, *Routes API*) o Mapbox.
- **Exclusión mutua en producción:** Bloqueo distribuido vía **Redis Redlock** o columna con versión optimista / `SELECT FOR UPDATE` en clúster PostgreSQL regional, reemplazando los *leases* locales con TTL.

---

## 5. Broker Distribuido y Notificaciones (reemplaza `src/core/broker.ts` y `notificationService.ts`)

| Capacidad | En el Prototipo | En Producción Real |
|---|---|---|
| **Message Broker & Colas** | `SimulatedDistributedBroker` + JSON UTF-8 + `BroadcastChannel` | **Apache Kafka** (particiones por región `orders.co`, `orders.br`, etc.) o **RabbitMQ / NATS JetStream** con *Dead-Letter Exchanges*, `x-idempotency-key` y reintentos con *backoff*. |
| **Servicio de Nombres** | `NameService` con caché TTL 60 s | **Consul / Kubernetes CoreDNS + Envoy** resolviendo `svc.region.smartrestaurant.internal` hacia pods activos y réplicas regionales. |
| **Mensajería Cliente / Staff** | `notificationService` en interfaz web + Toast | **Firebase Cloud Messaging (FCM)** para móviles/KDS, **Twilio / WhatsApp Business API** para SMS por país y **Amazon SES / SendGrid** para comprobantes fiscales por correo. |
