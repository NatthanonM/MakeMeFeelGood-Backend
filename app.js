require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const routes = require("./routes");
const configs = require("./configs");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("App is working"));

app.use("/api", routes);

app.listen(configs.port, () =>
  console.log(`Example app listening on port ${configs.port}!`)
);

module.exports = {
  app,
};
