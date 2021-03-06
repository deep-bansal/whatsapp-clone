const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/secrets");
// console.log(config.mongoURI);
const app = express();
const port = 9000;

const connection_url = config.mongoURI;
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.get("/", (req, res) => res.status(200).send("hello world"));

app.listen(port, () => console.log(`Listening on port no.${port}`));
