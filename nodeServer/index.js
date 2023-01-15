const express = require("express");
const { ClientRequest } = require("http");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port=8000;


const users = {};

const staticPath=path.join(__dirname,'../static');
app.use(express.static(staticPath))

// -------------------------------------------------------EXPRESS APP----------------------------------------
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../index.html"));
});

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    console.log(name,"Joined");
    users[socket.id] = name;    
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", message => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", () => {
    console.log(users[socket.id] + " Disconnected")
    socket.broadcast.emit("leave", users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(port, () => {
  console.log(`Server Started at port ${port}`);
});


