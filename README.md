# SidBites

SidBites is a food ordering and delivery web application. Browse the menu, manage a cart and wishlist, place orders, and manage the catalog through an admin area.

## Live website

Visit **[https://sid-bites.vercel.app/](https://sid-bites.vercel.app/)**.

## Features

- Browse menu items and categories, including prices, discounts, units, and stock.
- Create an account, verify an email address, sign in, and reset a password.
- Sign in with Google or GitHub when OAuth credentials are configured.
- Add items to a cart and wishlist.
- Manage delivery addresses and view orders.
- Place orders with cash on delivery or Razorpay.
- Admin pages for managing menu types, items, customers, and orders.
- Responsive navigation and light/dark theme support.
- Store item and profile images using Cloudinary.

## Technology

- [Next.js](https://nextjs.org/) 16 with the App Router and React 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/) with PostgreSQL
- [Better Auth](https://www.better-auth.com/) for authentication
- Razorpay for online payments, Nodemailer with Brevo SMTP for email, and Cloudinary for images

## Application routes

| Route | Description |
| --- | --- |
| `/` | Home page |
| `/menu` | Browse menu items |
| `/categories/[id]` | Browse items in a category |
| `/about` | About SidBites |
| `/contact` | Contact page |
| `/auth/signup` | Create an account |
| `/auth/login` | Sign in |
| `/auth/forget-password` | Request a password reset |
| `/auth/reset-password` | Reset a password |
| `/auth/verify-email` | Verify an email address |
| `/user/cart` | View and check out the cart |
| `/user/wishlist` | View saved items |
| `/user/addresses` | Manage delivery addresses |
| `/user/orders` | View orders |
| `/user/account` | Manage account settings |
| `/admin/dashboard` | Admin dashboard |
| `/admin/type` | Manage menu categories/types |
| `/admin/items` | Manage menu items |
| `/admin/customer` | View customers |
| `/admin/orders` | Manage orders |

User pages require a signed-in non-admin account. Admin pages require an admin account.

## Getting started

### Prerequisites

- Node.js 20.9 or newer
- npm
- A PostgreSQL database

External service credentials are needed for the corresponding features; see [Environment variables](#environment-variables).

### Install

```bash
git clone <repository-url>
cd SidBites
npm install
```

Create a `.env` file in the project root and set the variables described below. Keep this file and all secret values out of source control.

### Configure the database

Apply the existing migrations to your PostgreSQL database:

```bash
npx prisma migrate dev
```

The `postinstall` script generates the Prisma client during `npm install`. To regenerate it manually:

```bash
npx prisma generate
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Add the variables required for the services you intend to use to the root `.env` file. Do not commit credentials.

| Variable | Used for |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma |
| `BETTER_AUTH_URL` | Base URL for Better Auth; use `http://localhost:3000` for local development |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |
| `BREVO_SMTP_HOST` | Brevo SMTP server hostname |
| `BREVO_SMTP_PORT` | Brevo SMTP server port |
| `BREVO_SMTP_USERNAME` | Brevo SMTP username |
| `BREVO_SMTP_PASSWORD` | Brevo SMTP password/key |
| `BREVO_MAIL_FROM` | Verified sender address for outgoing email |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |

Email configuration is used for email verification and password resets. Cloudinary is used for image uploads. Razorpay credentials are needed for online checkout; cash-on-delivery orders do not require Razorpay.

For OAuth providers, configure the provider's allowed callback URL to match the Better Auth deployment URL and its callback route. Use the provider's current Better Auth setup instructions when configuring OAuth applications.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check the project |
| `npx prisma generate` | Generate the Prisma client |
| `npx prisma migrate dev` | Apply migrations during development |
| `npx prisma migrate deploy` | Apply migrations in a deployment environment |

## Deployment

SidBites is deployed on Vercel. To deploy your own instance:

1. Import the repository into Vercel and select the Next.js framework preset.
2. Add the required environment variables in the Vercel project settings. Set `BETTER_AUTH_URL` to the deployed app's URL.
3. Configure Google/GitHub OAuth callback URLs and the Brevo sender for the deployed domain, if using those services.
4. Ensure the configured PostgreSQL database is reachable from the deployment and apply migrations with `npx prisma migrate deploy`.
5. Deploy the application. Vercel uses the Next.js build; the available production build command is `npm run build`.

## Project structure

```text
prisma/                 Prisma schema and database migrations
src/app/                App Router pages and server actions
src/app/actions/        Authentication, user, admin, and public actions
src/components/         Shared UI, cart, wishlist, and theme components
src/lib/auth/           Better Auth configuration and email handling
src/lib/db/             Prisma database client
src/lib/hooks/          Cart and wishlist hooks
src/lib/store/          Client-side stores and Cloudinary configuration
```
