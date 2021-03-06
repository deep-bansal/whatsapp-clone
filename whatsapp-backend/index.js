const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const Messages = require("./models/dbMessages");
const PORT = 9000;
const app = express();

app.use(express.json());

const connect_url = config.mongoURI;

mongoose.connect(connect_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.get("/", (req, res) => {
  return res.status(200).send("Hello World!");
});

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(data);
    }
  });
});

app.post("/messages/new", (req, res) => {
  const message = req.body;
  Messages.create(message, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(data);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Listening to Port no ${PORT}`);
});
