const Page = require("./helpers/page");
let page;

//Initiate the browser befiore each test
beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

//close browser afgter each test
afterEach(async () => {
  await page.close();
});