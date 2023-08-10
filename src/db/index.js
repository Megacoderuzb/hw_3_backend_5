const mongoose = require("mongoose");

module.exports = {
  connect() {
    return mongoose
      .connect("mongodb://127.0.0.1:27017/db_name", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("DB ga ulandi.");
      })
      .catch((err) => {
        console.log("DB da xatolik: ", err);
      });
  },
  disconnect() {
    return mongoose.disconnect();
  },
  clean() {
    return mongoose.connection.db.dropDatabase();
  },
};
