const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const fetch = require("fetch");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const cors = require("cors");
app.use(cors());

const port = process.env.PORT || 4600;
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const peer = ExpressPeerServer(server, {
  debug: true,
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/peerjs", peer);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("form");
  // res.send(uuidv4());
});
app.get("/2/callendcallend", (req, res) => {
  console.log("ennnnnnnnnnnnnn");
  res.render("end");
});
app.get("/:room", (req, res) => {
  console.log("wwwww", req.params);
  res.render("index", { RoomId: req.params.room });
});
app.post("/", (req, res) => {
  console.log("trigetpost", req.body);
  const r = req.body.roomNo;
  res.redirect(`/${r}`);
});
io.on("connection", (socket) => {
  console.log("socket get connnecteddggg");
  socket.on("newUser", (id, room) => {
    console.log("socket.on", room);
    socket.join(room);
    socket.broadcast.to(room).emit("userJoined", id);
    socket.on("disconnect", () => {
      socket.broadcast.to(room).emit("userDisconnect", id);
    });
  });
});
server.listen(port, () => {
  console.log("Server running on port : " + port);
});
