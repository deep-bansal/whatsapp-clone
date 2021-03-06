const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const Messages = require("./models/dbMessages");
const Pusher = require("pusher");
const PORT = 9000;
const app = express();
const cors = require("cors");
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origins", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use(cors());

const connect_url = config.mongoURI;

mongoose.connect(connect_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const pusher = new Pusher({
  appId: "1167395",
  key: "1c8efe6427d0e8bf5a05",
  secret: "244bbf8e6a8eeeb7e50e",
  cluster: "eu",
  useTLS: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("DB connected");
  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    if (change.operationType == "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error tiggering Pusher");
    }
  });
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
