const app = require("./app");
const db = require("./db");
const config = require("./shared/config");

db.connect().then(() => {
  app.listen(config.port, () => {
    console.log(`Server ${config.port}-portda ishlayapti.`);
  });
});
