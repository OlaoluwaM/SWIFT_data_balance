#!/usr/bin/env node

require('dotenv').config({ path: `${__dirname}/.env` });

const colors = require('colors');
const puppeteer = require('puppeteer');
const ProgressBar = require('progress');
const sendSMS = require('./twilio').sendSMS;

const myArgs = process.argv.slice(2);
const shouldSendSMS = myArgs.includes('--SMS');

const TIMEOUT = 60000000;

(async () => {
  const bar = new ProgressBar(` Fetching [:bar] :percent `, {
    total: 10,
    width: 40,
    complete: '#'.green,
    incomplete: '.',
  });

  const browser = await puppeteer.launch({ timeout: TIMEOUT });

  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    bar.tick();

    await page.goto('https://www.swiftng.com/', {
      waitUntil: 'networkidle2',
    });
    bar.tick();

    await (await page.$('button.navbar-toggler')).click();
    bar.tick();

    await (await page.$('li.nav-item:nth-of-type(4) > .dropdown')).hover();
    bar.tick();

    await await (
      await page.$('li.nav-item:nth-of-type(4) > .dropdown .dropdown-item:first-of-type')
    ).click();
    bar.tick();

    await page.waitForNavigation();
    bar.tick();

    await page.type('#username', process.env.USERNAME);
    await page.type('#password', process.env.PASSWORD);
    await page.keyboard.press('Enter');
    bar.tick();

    await page.waitForNavigation();
    bar.tick();

    const remainingDataBalanceElement = await page.$(
      '#var_154758 > div > div > div.card.bonus-card.mb-0.px-2.py-0 > div.balance-layout > div > div.d-flex.flex-wrap.balanceDetail > div:nth-child(1) > span:nth-child(2)'
    );
    bar.tick();

    const remainingDataBalance = await remainingDataBalanceElement.evaluate(node => node.innerText);
    bar.tick();

    if (bar.complete) {
      console.log(` Your remaining data balance is ${colors.green.bold(remainingDataBalance)}`);

      if (shouldSendSMS) {
        console.log(' Letting recipients know...');
        await sendSMS(` Our remaining SWIFT data balance is ${remainingDataBalance}`);
        console.log(' All Done!');
      }
    }
  } catch (error) {
    console.error(` \n${colors.red.bold(error)}`);
  } finally {
    bar.terminate();
    await browser.close();
  }
})();
