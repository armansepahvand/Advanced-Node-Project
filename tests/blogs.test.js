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

describe("when logged in", async () => {
  beforeEach(async () => {
    await page.login();
    await page.goto("localhost:3000/blogs");
    await page.click("a.btn-floating");
  });

  test("Can see blog craete form", async () => {
    const lable = await page.getContentsOf("form label");

    expect(lable).toEqual("Blog Title");
  });

  describe("And using invalid inputs", async () => {
    beforeEach(async () => {
      await page.click("form button");
    });
    test("The form shows an error message", async () => {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(".content .red-text");

      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });
});
