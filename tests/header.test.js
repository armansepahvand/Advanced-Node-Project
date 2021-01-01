const puppeteer = require("puppeteer");

test("we can launch a browser", async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  //open the main page of the app
  await page.goto("localhost:3000");
  //get the text from an a tag insite of the header
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
});
