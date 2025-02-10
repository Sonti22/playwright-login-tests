// playwright.config.js
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    use: {
      baseURL: 'http://localhost:3000',
      headless: true, // Если хотите видеть запуск браузера, установите false
      viewport: { width: 1280, height: 720 }
    },
    timeout: 30000,
    retries: 0
  };
  
  module.exports = config;
  