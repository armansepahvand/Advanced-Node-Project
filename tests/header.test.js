const { use } = require("passport");

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

test("the Header has the correct test", async () => {
  //get the text from an a tag inside of the header
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);

  //make assertion for the text
  expect(text).toEqual("Blogster");
});

test.skip("clicking login starts oauth flow", async () => {
  //Click on the login link
  await page.click(".right a");

  //save the oauth login url in a variable
  const url = await page.url();

  //check if the url has the "accounts.google.com" sting in it
  expect(url).toMatch(/accounts\.google\.com/);
});

test("When signed in, shows logout button", async () => {
  await page.login();
  //get the text from an a tag inside of the header
  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);

  //make assertion for the text
  expect(text).toEqual("Logout");
});
