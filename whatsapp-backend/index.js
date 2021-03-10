const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const Messages = require("./models/dbMessages");
const Rooms = require("./models/rooms");
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
  appId: config.appId,
  key: config.key,
  secret: config.secret,
  cluster: config.cluster,
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
        roomId: messageDetails.roomId,
      });
    } else {
      console.log("Error tiggering Pusher");
    }
  });
});

app.get("/messages/sync/:roomId", (req, res) => {
  Messages.find({ roomId: req.params.roomId }, (err, data) => {
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

app.post("/rooms/new", (req, res) => {
  const room = req.body;
  Rooms.create(room, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(data);
    }
  });
});

app.get("/rooms", (req, res) => {
  Rooms.find((err, data) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(data);
    }
  });
});

app.get("/room/:roomId", (req, res) => {
  Rooms.find({ _id: req.params.roomId }, (err, data) => {
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
