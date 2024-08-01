import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

// Charger les variables d'environnement à partir du fichier .env
dotenv.config();

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env.CYPRESS_EMAIL = process.env.CYPRESS_EMAIL;
      config.env.CYPRESS_PASSWORD = process.env.CYPRESS_PASSWORD;
      return config;
    },
    retries: {
      // Retry once on failure in 'cypress run' mode
      runMode: 1,
      // Retry twice on failure in 'cypress open' mode
      openMode: 2,
    },
  },
});
