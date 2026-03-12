# Guia pas a pas: GTM + GA4 (InstantBackend Web)

Aquest document explica exactament com configurar els **tags mínims** a Google Tag Manager (GTM) perquè rebis mètriques útils a Google Analytics 4 (GA4), fins i tot si és la primera vegada que ho fas.

## 0) Què ja tens preparat al codi

La web ja està instrumentada per enviar aquests esdeveniments al `dataLayer`:

- `page_view`
- `signup_success`
- `login_success`
- `begin_checkout`
- `checkout_redirect`
- `checkout_success`
- `checkout_cancel`
- `checkout_error`

També tens **Consent Mode v2** configurat:

- Per defecte: consentiment denegat.
- Quan l'usuari accepta cookies: s'actualitza a concedit segons analytics/marketing.

Important: si l'usuari no accepta analytics, és normal que no vegis els mateixos esdeveniments que amb consentiment acceptat.

---

## 1) Preparar Google Analytics 4 (si no el tens fet)

1. Entra a [https://analytics.google.com](https://analytics.google.com)
2. Crea una **propietat GA4** (si encara no existeix).
3. Crea un **Data Stream Web** per `https://instantbackend.dev`.
4. Copia el teu **Measurement ID** (format `G-XXXXXXXXXX`).

Aquest ID el farem servir dins de GTM.

---

## 2) Entrar al contenidor GTM correcte

1. Entra a [https://tagmanager.google.com](https://tagmanager.google.com)
2. Obre el contenidor que té ID `GTM-P6RXBZTV`.
3. Assegura't que estàs al **Workspace** de producció (o el que facis servir).

---

## 3) Crear la tag base de GA4 (obligatori)

### 3.1 Crear etiqueta “Google tag”

1. Menú esquerra: **Etiquetas** → **Nueva**
2. Nom: `GA4 - Google tag (base)`
3. Clica a **Configuración de la etiqueta**
4. Tria tipus: **Google tag**
5. Al camp **ID de etiqueta** enganxa el Measurement ID: `G-XXXXXXXXXX`
6. (Molt recomanat) Desactiva enviament automàtic de page view:
   - Si veus l'opció **Send a page view event when this configuration loads**, posa-la en **OFF**.
   - Ho fem perquè ja enviem `page_view` manualment des del `dataLayer`.
7. A **Activación (Triggering)** tria: **All Pages / Todas las páginas**
8. Desa.

---

## 4) Crear triggers de Custom Event

Has de crear un trigger per cada event que envia el frontend.

1. Menú esquerra: **Activadores** → **Nuevo**
2. Tipus: **Evento personalizado**
3. Event name: posa exactament el nom (sense espais)
4. This trigger fires on: **All Custom Events / Todos los eventos personalizados**
5. Desa.

Repeteix per aquests noms:

- `page_view`
- `signup_success`
- `login_success`
- `begin_checkout`
- `checkout_success`
- `checkout_cancel`
- `checkout_error`

Opcional:

- `checkout_redirect`

---

## 5) Crear tags d'event de GA4

Ara crearem una etiqueta GA4 Event per cada trigger.

### 5.1 Tag de `page_view`

1. **Etiquetas** → **Nueva**
2. Nom: `GA4 - Event - page_view`
3. Tipus: **Google Analytics: GA4 Event**
4. A **Configuration Tag** tria `GA4 - Google tag (base)`
5. Event Name: `page_view`
6. Trigger: `CE - page_view` (o com l'hagis anomenat)
7. Desa.

### 5.2 Tag de `signup_success`

1. Nova etiqueta
2. Nom: `GA4 - Event - sign_up`
3. Tipus: GA4 Event
4. Configuration Tag: `GA4 - Google tag (base)`
5. Event Name: `sign_up` (recomanat per estàndard GA4)
6. Trigger: el de `signup_success`
7. Desa.

### 5.3 Tag de `login_success`

1. Nom: `GA4 - Event - login`
2. Event Name: `login`
3. Trigger: `login_success`
4. Desa.

### 5.4 Tag de `begin_checkout`

1. Nom: `GA4 - Event - begin_checkout`
2. Event Name: `begin_checkout`
3. Trigger: `begin_checkout`
4. Desa.

### 5.5 Tag de `checkout_success`

Tens 2 opcions:

- Opció simple (recomanada al principi):
  - Nom: `GA4 - Event - purchase`
  - Event Name: `purchase`
  - Trigger: `checkout_success`

- Opció custom:
  - Event Name: `checkout_success`

Si no tens encara `transaction_id` i `value`, comença per l'opció simple i ja l'enriquirem després.

### 5.6 Tags opcionals

- `GA4 - Event - checkout_cancel` (Event Name `checkout_cancel`, trigger `checkout_cancel`)
- `GA4 - Event - checkout_error` (Event Name `checkout_error`, trigger `checkout_error`)

---

## 6) Passar paràmetres dels events (recomanat)

Alguns events inclouen paràmetres útils al `dataLayer`:

- `signup_success`: `method`, `has_plan`, `plan`
- `login_success`: `method`, `has_plan`, `plan`
- `begin_checkout`: `plan`, `source`
- `checkout_error`: `plan`, `message`

Per enviar-los a GA4 des de GTM:

1. A una GA4 Event Tag, ves a **Event Parameters**
2. Afegeix fila:
   - Parameter Name: per exemple `plan`
   - Value: `{{DLV - plan}}`
3. Crea la variable si no existeix:
   - **Variables** → **Nueva**
   - Tipus: **Data Layer Variable**
   - Data Layer Variable Name: `plan`
   - Nom variable: `DLV - plan`
4. Repeteix per `source`, `method`, `has_plan`, `message`.

Llista recomanada de variables DLV:

- `DLV - plan` (key `plan`)
- `DLV - source` (key `source`)
- `DLV - method` (key `method`)
- `DLV - has_plan` (key `has_plan`)
- `DLV - message` (key `message`)

---

## 7) Validació amb Preview (abans de publicar)

1. A GTM, botó **Preview**
2. Introdueix URL: `https://instantbackend.dev`
3. Connecta Tag Assistant.
4. Navega i prova aquest flux:
   - Home
   - Register o Login
   - Checkout start
   - Checkout success o cancel
5. Comprova al panell esquerre de Tag Assistant que apareixen els events:
   - `page_view`, `signup_success`, `login_success`, `begin_checkout`, etc.
6. En cada event, comprova que es dispara la seva etiqueta GA4 corresponent.

Si algun event no apareix:

- Revisa spelling exacte del nom d'event al trigger.
- Revisa que la tag tingui el trigger correcte.
- Revisa consentiment de cookies (accepta analytics per provar).

---

## 8) Publicar el contenidor

1. Botó **Submit / Enviar**
2. Nom de versió recomanat: `ga4-baseline-events-v1`
3. Publica.

---

## 9) Verificar a GA4

1. Entra a GA4 → **Realtime**
2. Amb una pestanya de la web oberta, navega i fes accions.
3. Comprova que entren events:
   - `page_view`
   - `sign_up`
   - `login`
   - `begin_checkout`
   - `purchase` (si has mapat `checkout_success` a `purchase`)

Nota: alguns informes estàndard triguen hores a consolidar-se; Realtime és quasi immediat.

---

## 10) Problemes típics i solució ràpida

- **"La etiqueta ha dejado de enviar datos" a GTM**
  - Passa si no hi ha trànsit recent o no està publicat.
  - Verifica Preview + Publicació + espera 24-48h al diagnòstic.

- **Veig duplicats de page_view**
  - Desactiva auto page_view a la tag base de Google tag.

- **No veig events a Realtime**
  - Comprova Measurement ID correcte.
  - Comprova que la tag base dispara a All Pages.
  - Comprova consentiment analytics acceptat durant la prova.

- **No veig paràmetres (`plan`, `source`)**
  - Crea bé les DLV amb la key exacta (`plan`, `source`, etc.)
  - Afegeix-les a Event Parameters de la tag.

---

## 11) Checklist final (copiar/enganxar)

- [ ] Tinc GA4 Measurement ID (`G-...`)
- [ ] Tag base `GA4 - Google tag (base)` creada i activa a All Pages
- [ ] Auto `page_view` desactivat a la tag base
- [ ] Triggers de custom event creats
- [ ] Tags GA4 Event creades per `page_view`, `sign_up`, `login`, `begin_checkout`, `purchase`
- [ ] (Opcional) tags `checkout_cancel`, `checkout_error`
- [ ] Preview validat amb events reals
- [ ] Contenidor publicat
- [ ] Events visibles a GA4 Realtime
