require('dotenv').config();
const puppeteer = require('puppeteer');

const TIMEOUT = 60000000;

(async () => {
  const browser = await puppeteer.launch({ timeout: TIMEOUT });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  await page.goto('https://www.swiftng.com/', {
    waitUntil: 'networkidle2',
  });

  await (await page.$('button.navbar-toggler')).click();

  await (await page.$('li.nav-item:nth-of-type(4) > .dropdown')).hover();

  await await (
    await page.$('li.nav-item:nth-of-type(4) > .dropdown .dropdown-item:first-of-type')
  ).click();

  await page.waitForNavigation();

  await page.type('#username', process.env.USERNAME);
  await page.type('#password', process.env.PASSWORD);
  await page.keyboard.press('Enter');

  await page.waitForNavigation();

  const remainingDataBalanceElement = await page.$(
    '#var_154758 > div > div > div.card.bonus-card.mb-0.px-2.py-0 > div.balance-layout > div > div.d-flex.flex-wrap.balanceDetail > div:nth-child(1) > span:nth-child(2)'
  );

  const remainingDataBalance = await remainingDataBalanceElement.evaluate(node => node.innerText);

  console.log(`Your remaining data balance is ${remainingDataBalance}`);
  await browser.close();
})();
