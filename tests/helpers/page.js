const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class CustomPage {
  static async build() {
    //create a browser instance
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    //create a page instance from
    const page = await browser.newPage();

    //create a new custumePage object
    const customPage = new CustomPage(page, browser);

    // a proxy to return the proper function from one of the browser, page or
    //custompage functions using proxy method
    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || page[property] || browser[property];
      },
    });
  }

  constructor(page, browser) {
    this.page = page;
    this.browser = browser;
  }

  //close function to close the browser on call
  close() {
    this.browser.close();
  }

  async login() {
    const user = await userFactory();

    const { session, sig } = sessionFactory(user);

    //set the session cookie
    await this.page.setCookie({
      name: "session",
      value: session,
    });

    //set the session.sig cookie
    await this.page.setCookie({
      name: "session.sig",
      value: sig,
    });

    //refresh the page
    await this.page.goto("http://localhost:3000");

    //wait for the page to fully load before looking for the target tag
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML);
  }
}

module.exports = CustomPage;
