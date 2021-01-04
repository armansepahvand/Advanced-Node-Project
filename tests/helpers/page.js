const puppeteer = require("puppeteer");

class CustomPage {
  static async build() {
    //create a browser instance
    const browser = await puppeteer.launch({
      headless: false,
    });

    //create a page instance from
    const page = await browser.newPage();

    //create a ne custumePage object
    const custumPage = new CustomPage(page);

    // a proxy to return the proper function from one of the browser, page or
    //custompage functions using proxy method
    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || page[property] || browser[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }
}

module.exports = CustomPage;
