const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");


const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

const Room = require('./models/room.js');

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

//middleware
app.use(express.json());

const DB=process.env.DB;
io.on("connection", (socket) => {
  console.log("Sockect Connection Successfull ");

  // creating room
  socket.on("createRoom", async ({ name }) => {
    try {
      let room = new Room();
      let player = {
        socketID: socket.id,
        name,
        playerType: 'X',
      }
      room.players.push(player);
      room.turn = player;
      room = await room.save();

      const roomId = room._id.toString();
      socket.join(roomId);
      io.to(roomId).emit("createRoomSuccess", room);
    } catch (e) {
      console.log(e);
    }
  });

  // joining room
  socket.on("joinRoom", async ({ name, roomId }) => {
    try {
      if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
        socket.emit("errorOccurred", "Please enter a valid room id");
        return;
      }
      let room = await Room.findById(roomId);
      if (room.isJoin) {
        let player = {
          name,
          socketID: socket.id,
          playerType: "O"
        }
        socket.join(roomId);
        room.players.push(player);
        room.isJoin = false;
        room = await room.save();
        io.to(roomId).emit("joinRoomSuccess", room);
        io.to(roomId).emit("updatePlayers", room.players);
        io.to(roomId).emit("updateRoom", room);
      } else {
        socket.emit("errorOccurred", "The game is in progress, try again");
      }
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("tap", async ({ index, roomId }) => {
    try {
      let room = await Room.findById(roomId);

      let choice = room.turn.playerType;
      if (room.turnIndex == 0) {
        room.turn = room.players[1];
        room.turnIndex = 1;
      } else {
        room.turn = room.players[0];
        room.turnIndex = 0;
      }
      room = await room.save();
      io.to(roomId).emit("tapped", {
        index,
        choice,
        room,
      });
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("winner", async ({ winnerSocketID, roomId }) => {
    try {
      let room = await Room.findById(roomId);
      let player = room.players.find((player) => player.socketID == winnerSocketID);
      player.points += 2;
      room = await room.save();
      if (player.points >= room.maxRounds) {
        io.to(roomId).emit("endGame", player);
      } else {
        io.to(roomId).emit("pointIncrease", player);
      }
    } catch (e) {
      console.log(e);
    }
  });

  // diconnecting the client to socket
  socket.on("disconnect", () => {
    console.log("Client Disconnected");
  });
});


mongoose.connect(DB).then(() => {
  console.log("Database Connection Succesfull");
}).catch((e) => {
  console.log(e);
});



server.listen(port, '0.0.0.0', () => {
  console.log(`Server has been started on port ${port}`);
});