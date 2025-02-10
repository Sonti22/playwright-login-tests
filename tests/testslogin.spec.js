// tests/login.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Login Form Tests', () => {
  // Сценарии для корректных учетных данных
  const validCredentials = [
    { username: 'aqa', password: 'AQA123' },
    { username: 'test', password: 'test123' },
    { username: 'admin', password: 'admin' }
  ];

  validCredentials.forEach(cred => {
    test(`Успешный логин для пользователя: ${cred.username}`, async ({ page }) => {
      // Переходим на страницу логина
      await page.goto('/');
      // Заполняем поля логина и пароля
      await page.fill('input[name="username"]', cred.username);
      await page.fill('input[name="password"]', cred.password);
      // Нажимаем на кнопку "Войти"
      await page.click('button[type="submit"]');
      
      // Проверяем, что после успешного логина произошел переход на /welcome
      await expect(page).toHaveURL('/welcome');
      // Дополнительно можно проверить наличие текста на странице welcome
      await expect(page.locator('body')).toContainText('Logged in successfully');
    });
  });

  // Сценарий для неверного пароля
  test('Логин с неверным паролем', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="username"]', 'aqa');
    await page.fill('input[name="password"]', 'wrongPassword');
    await page.click('button[type="submit"]');
    
    // Проверяем, что появилось сообщение об ошибке
    await expect(page.locator('.error')).toContainText('Incorrect password');
  });

  // Сценарий для несуществующего пользователя
  test('Логин с несуществующим пользователем', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="username"]', 'nonexistent');
    await page.fill('input[name="password"]', 'anyPassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error')).toContainText('User not found');
  });

  // Тест, фиксирующий баг с пустыми данными
  test('Логин с пустыми значениями (фикс бага)', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="username"]', '');
    await page.fill('input[name="password"]', '');
    await page.click('button[type="submit"]');
    
    // По текущей логике сервера, если поля не заполнены, возвращается успех,
    // что является багом. Этот тест зафиксирует данное поведение.
    await expect(page).toHaveURL('/welcome');
    await expect(page.locator('body')).toContainText('Logged in successfully');
  });
});
