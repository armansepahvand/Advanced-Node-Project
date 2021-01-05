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

  describe("And using valid inputs", async () => {
    beforeEach(async () => {
      await page.type(".title input", "My title");
      await page.type(".content input", "My content");
      await page.click("form button");
    });
    test("submitting takes user to review screen", async () => {
      const text = await page.getContentsOf("h5");

      expect(text).toEqual("Please confirm your entries");
    });

    test("submitting then saving adds blog to index page", async () => {
      await page.click("button.green");
      await page.waitFor(".card");

      const title = await page.getContentsOf(".card-title");
      const content = await page.getContentsOf("p");

      expect(title).toEqual("My title");
      expect(content).toEqual("My content");
    });
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

describe("User is not logged in", async () => {
  test("User can not create a posts", async () => {
    const result = await page.evaluate(() => {
      return fetch("/api/blogs", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "My Title", content: "My Content" }),
      }).then((res) => res.json());
    });
    expect(result).toEqual({ error: "You must log in!" });
  });

  test("User can not get a list of posts ", async () => {
    const result = await page.evaluate(() => {
      return fetch("/api/blogs", {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    });
    expect(result).toEqual({ error: "You must log in!" });
  });
});
