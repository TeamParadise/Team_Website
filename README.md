# Team Paradise website

Website for Team Paradise, FRC Team 1165.

This is a static HTML, CSS and JavaScript site. There is no framework or build
step, which makes it a good place to learn how the basics fit together.

## New here?

Start with these files:

1. `index.html` for the home-page content.
2. `Pages/style.css` for the site's appearance.
3. `Pages/site.js` for the shared navigation and footer.

Make one small change, reload the page, and see what happened. That is usually
more useful than trying to understand the whole repository at once.

## Running the site

Install the development tools once:

```sh
pnpm install
```

Start a local server:

```sh
pnpm run serve
```

Open `http://localhost:4173/`. Opening the HTML files directly will not always
work because the site uses paths that begin at the repository root.

Before committing, run:

```sh
pnpm run check
```

That checks the HTML and JavaScript, local file links, duplicate IDs, image
dimensions and the shared page structure.

## Where things live

```text
index.html                 Home page
Pages/site.js              Shared JavaScript
Pages/style.css            Styles for the whole site
Pages/navbar.html          Navigation shared by every page
Pages/socials.html         Footer links shared by every page
Pages/calendar.html        Team calendar
Pages/newsletter_form.html Mailchimp form
Pages/sponsors.html        Sponsorship packet
Pages/shop.html            Shop placeholder
Pages/donate.html          Donation placeholder
Resources/                 Images, icons, font and sponsorship PDF
```

`navbar.html` and `socials.html` are fragments loaded by `site.js`. They are not
complete pages, so they should not have their own `<html>`, `<head>` or `<body>`
tags.

## Common changes

### Adding a page

Copy a small existing page and change its title, heading and content. Keep the
skip link, `header#navbar`, `main#main-content`, `footer#socials`, stylesheet and
`site.js` script. Add the page to `navbar.html` when it is ready for visitors.

Each page should have one `<h1>`. Use `<h2>` and `<h3>` for sections under it.

### Changing the navigation or footer

Edit `navbar.html` or `socials.html` once. `site.js` inserts those fragments into
every full page and marks the current navigation link with `aria-current`.

Some future links are commented out in `navbar.html`. Leave them commented until
their pages are ready.

### Adding an image

Use useful alt text when an image adds information. Use `alt=""` when it is only
decorative. Add `width` and `height` so the page does not jump while loading.

Large camera photos also need a web-sized WebP copy. The home page has working
`<picture>` examples. Keep the original as a fallback, and add `loading="lazy"`
to images that start below the first screen.

## Accessibility checks

- Use headings in order.
- Make links and controls usable with a keyboard.
- Keep the visible focus outline.
- Give iframes a useful `title`.
- Do not rely on colour alone.
- Check narrow and wide screens.

The custom checker catches a few common mistakes, but it cannot tell whether a
page is pleasant to use. Test it yourself too.

## Mailchimp

The newsletter page uses Mailchimp's embedded form. Its action URL, field names,
honeypot, response containers and validation script are connected. Do not rename
or remove them without testing a real sign-up.

## Shop

`Pages/shop.html` is the public shop interface. Its product grid and cart are
ready for the small shop API that will run separately from GitHub Pages.

The API URL belongs in the `data-shop-api` attribute on the `.shop` element. It
must provide `GET /products`, returning an array of products in this form:

```json
[
  {
    "id": "shirt",
    "name": "Team Paradise T-shirt",
    "description": "Soft black team shirt.",
    "imageUrl": "https://...",
    "variants": [
      { "id": "price_small", "label": "Small", "price": 2000, "currency": "usd", "availableQuantity": 12 }
    ]
  }
]
```

Prices are integer cents. `POST /checkout` will receive the cart's selected
variant IDs and quantities. It must validate the stock again on the server,
reserve stock while payment is pending, and create Stripe's embedded Checkout
Session. A Stripe webhook, not the success page, confirms paid orders and
releases stock for expired or failed sessions.

Never put Stripe secret keys, webhook secrets, Google credentials or inventory
write access in this repository's browser code.

## JavaScript, TypeScript and frameworks

The custom JavaScript is currently one small file, so plain JavaScript is the
simplest choice. TypeScript or Astro may make sense if the site grows into an
application, but they would also add a build and deployment process. That choice
is not permanent and should be revisited when there is enough code to benefit.

## Comments

Good comments explain something another student would not know from reading the
next line. Keep notes about integrations, accessibility decisions and dormant
features. Avoid narrating obvious HTML, CSS or JavaScript.

## Commits

Use short conventional commit messages:

```text
feat(calendar): add event details
fix(nav): keep links visible on phones
docs(site): explain newsletter setup
```
