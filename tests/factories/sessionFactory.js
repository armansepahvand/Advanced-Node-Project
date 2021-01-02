const Buffer = require("safe-buffer").Buffer;

//Use Keygrip to generate our cookie singnature
const Keygrip = require("keygrip");
const keys = require("../../config/keys");
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = () => {
  //create a session Object
  const sessionObject = {
    passport: {
      user: id,
    },
  };

  //translate the session Object to a session string
  const session = Buffer.from(JSON.stringify(sessionObject)).toString("base64");

  const sig = keygrip.sign("session=" + session);

  return { session, sig };
};
