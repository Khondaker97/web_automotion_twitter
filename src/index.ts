import puppeteer, { ElementHandle } from "puppeteer";
import { password, userName } from "./secret";

const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const sleep_for = async (page: puppeteer.Page, min: number, max: number) => {
  let sleep_duration = randomIntFromInterval(min, max);
  console.log("waiting for", sleep_duration / 1000, "seconds");
  // await page.waitForNavigation({ timeout: sleep_duration });
  await page.waitForNetworkIdle({ timeout: sleep_duration });
};

let authenticate = async (page: puppeteer.Page) => {
  //$x(`//input[@autocomplete="username"]`)
  try {
    const userName_input = await page.$x(
      '//label //div[@dir="auto"] //input[@name="text"]'
    );
    const password_input = await page.$x(
      `//label //div[@dir="auto"] //input[@autocomplete="current-password"]`
    );
    if (userName_input.length > 0) {
      await userName_input[0].focus();
      await page.keyboard.type(userName);
      const buttons = await page.$x(
        `//div[@role="button"]//span[text()="Next"]`
      );
      if (buttons.length > 0) {
        await (buttons[0] as ElementHandle<HTMLElement>).click();
        await page.waitForNavigation({ timeout: 1000 });
      }
    }
    // if (password_input.length > 0) {
    //   await password_input[0].focus();
    //   await page.keyboard.type(password);
    //   await Promise.all([
    //     page.click(
    //       selector
    //     ),
    //     page.waitForNavigation({ timeout: 1000 }),
    //   ]);
    // }
  } catch (error) {
    console.log("error in auth", error);
  }
};
let begins = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const URL = "https://twitter.com/i/flow/login";
    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    });

    let status = await page.goto(URL, {
      waitUntil: "networkidle2",
    });

    await sleep_for(page, 1000, 4000);
    await authenticate(page);
  } catch (error) {
    console.log(error);
  }
};

let main = async () => {
  await begins();
};
main();
