const puppeteer = require("puppeteer");
const sessionFactory = require("./factories/sessionFactory");
let browser, page;

//Initiate the browser befiore each test
beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
  //open the main page of the app
  await page.goto("localhost:3000");
});

//close browser afgter each test
afterEach(async () => {
  await browser.close();
});

test("the Header has the correct test", async () => {
  //get the text from an a tag inside of the header
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);

  //make assertion for the text
  expect(text).toEqual("Blogster");
});

test("clicking login starts oauth flow", async () => {
  //Click on the login link
  await page.click(".right a");

  //save the oauth login url in a variable
  const url = await page.url();

  //check if the url has the "accounts.google.com" sting in it
  expect(url).toMatch(/accounts\.google\.com/);
});

test("When signed in, shows logout button", async () => {
  const { session, sig } = sessionFactory();

  //set the session cookie
  await page.setCookie({
    name: "session",
    value: session,
    Domain: "localhost",
  });

  //set the session.sig cookie
  await page.setCookie({
    name: "session.sig",
    value: sig,
    Domain: "localhost",
  });

  //refresh the page
  await page.goto("localhost:3000");

  //wait for the page to fully load before looking for the target tag
  await page.waitFor('a[href="/auth/logout"]');

  //get the text from an a tag inside of the header
  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);

  //make assertion for the text
  expect(text).toEqual("Logout");
});
