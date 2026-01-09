require("dotenv").config();
const app = require("./app");
const dbConnection = require("./db/db");

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
dbConnection();
