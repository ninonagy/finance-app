## Finance app ([production](https://finance-app-sigma.vercel.app/))

![screely-1662184332421](https://user-images.githubusercontent.com/41818057/188257849-0f278aa2-9504-42f6-8452-60d2830e5c13.png)

This app was created for the needs of the final thesis at the Zagreb University of Applied Sciences.

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
  - [ ] logout
  - [ ] inbox
  - [ ] expenses
  - [ ] settings
- [ ] convert `amount` field to `decimal` column type
