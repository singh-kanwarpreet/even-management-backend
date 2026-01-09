const mongoose = require("mongoose");

function dbConnection() {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("MongoDb connected successfully");
    })
    .catch((err) => {
      console.log("MongoDb connection failed" + err);
    });
}

module.exports = dbConnection;
