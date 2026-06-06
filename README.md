# Lokaverkefni - Vor 26

Prjónabúðin er netverslun byggð með React, TypeScript og Supabase. Verkefnið er lokaverkefni þar sem markmiðið er að sýna uppbyggingu á stærra frontend verkefni með góðri möppuskipan, endurnýtanlegum components, authentication, state management, Supabase tengingu, testing og fake checkout flæði.

## Virkni

Verkefnið inniheldur:

- Forsíðu fyrir verslunina
- Vörulista
- Síðu fyrir staka vöru
- Leit að vörum
- Flokka og síun eftir flokkum
- Innskráningu og nýskráningu
- Körfu þar sem hægt er að bæta við vörum, fjarlægja vörur og breyta magni
- Greiðslusíðu
- Staðfestingarsíðu eftir greiðslu
- Responsive hönnun
- Supabase tengingu fyrir gögn
- State management fyrir körfu og authentication

## Tækni

Verkefnið notar:

- React
- TypeScript
- Vite
- Supabase
- React Query
- Zustand
- React Router
- React Hook Form
- Zod
- Tailwind CSS
- Vitest
- Testing Library
- Cypress testing

## Uppsetning

Til að keyra verkefnið local:

```bash
npm install
npm run dev
```

Verkefnið keyrir þá í development mode. Vite sýnir slóðina í terminal:

```bash
http://localhost:5173
```

## Environment variables

Búa þarf til tvær skrár í rót verkefnisins.

```.env
VITE_SUPABASE_URL=***
VITE_SUPABASE_PUBLISHABLE_KEY=***
```

```cypress.env.json
{
  "TEST_EMAIL": "***",
  "TEST_PASSWORD": "***"
}
```

Gildin verða send með verkefnaskilum í link sem eyðist við opnun.

## Scripts

### Keyra verkefnið

```bash
npm run dev
```

### Keyra test

```bash
npm run test:run
```

### Keyra lint

```bash
npm run lint
```

### Build

```bash
npm run build
```

## Greiðsluferli

Checkout flæðið er aðeins gervigreiðsluferli. Engar raunverulegar greiðslur fara fram og verkefnið safnar ekki raunverulegum kortaupplýsingum.

Markmiðið með checkout flæðinu er að sýna að notandi geti:

1. Sett vörur í körfu
2. Farið í checkout
3. Fyllt út greiðsluform
4. Staðfest pöntun
5. Séð staðfestingarsíðu eftir pöntun

## Möppuskipan

Verkefnið notar feature-based uppbyggingu.

Helstu möppur:

```txt
src/
  app/
  assets/
  components/
  features/
    auth/
      api/
      hooks/
    cart/
      api/
      hooks/
      store/
    checkout/
      components
      model/
    customers/
      api/
    orders/
      api/
      hooks/
    products/
      api/
      components/
      hooks/
      model/
    shops/
      api/
  lib/
  pages/
  test/
```

### `features`

Inniheldur virkni sem tilheyrir ákveðnum hluta kerfisins, til dæmis vörur, körfu, checkout og authentication.

### `pages`

Inniheldur síður appsins, til dæmis forsíðu, vörulista, vörusíðu, körfu, checkout og staðfestingarsíðu.

## Helstu síður

Verkefnið inniheldur meðal annars:

- `/` — forsíða
- `/products` — allar vörur
- `/products?category=...` — vörur síaðar eftir flokki
- `/products/:id` — stök vara
- `/cart` — karfa
- `/checkout` — greiðslusíða
- `/order-confirmation` — staðfestingarsíða
- `/login` — innskráning
- `/register` — nýskráning
- `/profile` — prófílsíða með eldri pöntunum notanda

## Testing

Verkefnið notar Vitest, Testing Library og Cypress.

Unit test eru keyrð með:

```bash
npm run test:run
```

Cypress E2E test eru keyrð með:

```bash
npm run cy:run
```

Einnig er hægt að opna Cypress viðmótið með:

```bash
npm run cy:open
```

Testin ná meðal annars yfir:

- Cart logic
- Checkout validation / fake payment logic
- Product detail virkni
- ProductsPage category filter með URL query param
- Navigation flæði
- Leit að vörum
- Körfu flæði
- Checkout flæði með innskráningu og greiðslu

## Supabase

Supabase er notað sem backend/database fyrir verkefnið.

Töflur í gagnagrunninum:

- `cart_items`
- `carts`
- `categories`
- `order_items`
- `orders`
- `product_assets`
- `product_attributes`
- `product_variants`
- `products`
- `profiles`
- `shop_customers`
- `shop_members`
- `shops`

Authentication notar Supabase Auth.

## Deployment

Linkur á síðuna á Railway:

```txt
Live demo: https://lokaverkefni-vor26-production.up.railway.app/
```

## Höfundur

Hafrún Harðardóttir
