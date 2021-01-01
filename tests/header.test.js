const puppeteer = require("puppeteer");

test("we can launch a browser", async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  //open the main page of the app
  await page.goto("localhost:3000");
});
