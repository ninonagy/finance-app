# Finance app ([production](https://finance-app-sigma.vercel.app/))

https://user-images.githubusercontent.com/41818057/188262559-7e44f586-e0d0-49b9-89ea-e9b055b92de1.mp4

This app was created for the needs of the undergraduate thesis at the Zagreb University of Applied Sciences.

Technology used: 
- [Remix](https://remix.run/) - Full-stack web server
- [DaisyUI](https://daisyui.com/) - UI component library
- [Prisma](https://www.prisma.io/) - Database ORM
- [Cypress](https://www.cypress.io/) - UI testing
- [Vitest](https://vitest.dev/) - Unit testing

This is a pretty simple expense tracker app, and mainly demonstrates how to use Cypress to test UI in a full stack app with Prisma and Remix. The main functionality is creating expenses, registering, and logging in and out.

- managig user sessions, and verifying them [./app/utils/session.server.ts](/app/utils/session.server.ts)
- creating and filtering expenses [./app/db/expense.ts](/app/db/expense.ts)

## Demo account

You can use demo credentials to explore and play with the app: 

```
    email: demo@example.com
    pass:  demo
```

## TODO

- [x] user session management
- [x] cypress tests
  - [x] login/register
  - [x] logout
  - [ ] inbox
  - [ ] expenses
  - [ ] settings
- [ ] convert `amount` field to `decimal` column type

## Development setup

First, copy `.env.template` file and rename it to `.env` and `.env.test`. Fill `DATABASE_URL` variable with your local or remote [postgres connection string](https://stackoverflow.com/questions/3582552/what-is-the-format-for-the-postgresql-connection-string-url) to be able to connect to the database. 

### 1. Install dependencies

```bash
npm install
```

This will install all the required dependencies specified in the `package.json`. 

### 2. Create and seed the database

To initialize database migrations run: 
```bash
npx prisma migrate dev
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered. The seed file in `db/seed.ts` will be executed and your database will be populated with the sample data.

Prisma comes with a built-in GUI to view and edit the data in your database. You can open it using the following command:
```bash
npx prisma studio
```

### 3. Start the app

```bash
npm run dev
```

The app is now running, navigate to http://localhost:3000/ in your browser to explore its UI.
