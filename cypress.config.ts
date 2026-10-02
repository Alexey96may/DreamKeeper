import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:5173/DreamKeeper/', // Укажите порт, на котором запущен ваш npm run dev
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
