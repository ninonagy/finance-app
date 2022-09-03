import { defineConfig } from "cypress";
import { initPlugin } from "@frsource/cypress-plugin-visual-regression-diff/dist/plugins";

// import { user } from "./cypress/fixtures/user.json";
// import { users, expenses } from "./cypress/data/database-seed.json";

import { seed, teardown } from "cypress/seed";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8080",
    specPattern: "cypress/tests/**/*.spec.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    viewportHeight: 1000,
    viewportWidth: 1280,
    setupNodeEvents(on, config) {
      // initPlugin(on, config);

      // implement node event listeners here
      on("task", {
        // seed database with test data
        async "db:seed"() {
          await teardown();
          return await seed();
        },
      });
    },
  },
});
