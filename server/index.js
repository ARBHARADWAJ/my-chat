const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { callbackify } = require("util");
const { send } = require("process");
const { User, addFriends } = require("./mongoose/UserSchema");
const {
  MessageSchema,
  getMessages,
  setMessages,
  createMessage,
} = require("./mongoose/Messagemodel");
const Mongoose = require("./mongoose/mongoose");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const users = {}; //to store the users id and socket id
const messages = {}; //to store messages
const tusers = [];

io.on("connection", (socket) => {
  socket.on("connection", async (data, callback) => {
    console.log("exteed", data);
    try {
      
      const existuser = await User.findOne({ username: data.username });
      // if the user is not there
      if (!existuser) {
        const newuser = new User({
          username: data.username,
          friends: [],
          nread: [],
          password: data.password,
        });
        await newuser.save();

        createMessage(data.username);
        console.log("user created", User.findOne({ username: data.username }));
        callback({ status: "done" });
      } else {
        console.log("the users is already esist", existuser);
        callback({ status: "undone " });
      }

      tusers.push(data.username);
    } catch (e) {
      console.log(e);
    }
  }); //connecting to the server with a name of the user,

  socket.on("login", async (data, callback) => {
    console.log("exteed", data);
    try {
      const existuser = await User.findOne({ username: data.username });
      // if the user is not there
      if (!existuser) {
        callback({ status: "not created" });
      } else {
        callback({
          status: "created",
        });
        const u = await User.findOne({ username: data.username });
       
        const f = u.friends;
        const n = u.nread;
        io.emit("receive_unread", {
          friends: f,
          unread: n,
          name: data.username,
        });
        console.log(f, "", n);
        console.log('"user is present');
      }

      tusers.push(data.username);
    } catch (e) {
      console.log(e);
    }
  }); //connecting to the server with a name of the user,

  

  socket.on("generate_friends", async (data, callback) => {
    const returndata = tusers.filter((names) => names.includes(data));
    callback({
      status: returndata ? "done" : "error",
      data: returndata ?? [],
    });
  });

  socket.on("join_room", (data) => {
    socket.join(data);
  });



  socket.on("friend_message", async (data) => {
    const { username, selected, message, time, formattedDate } = data;
    let m = {
      from_user: username,
      to_user: selected,
      message: message,
      time: time,
      date: formattedDate,
    };
    setMessages(username, selected, m);
    setMessages(selected, username, m);

   
    const u = await User.findOne({ username: selected });
    const n = u.nread;

    // io.to(selected).emit("receive_unread", {

    // });
    io.to(selected).emit("receive_message", {
      from_user: username,
      to_user: selected,
      message: message,
      time: time,
      date: formattedDate,
      content: "unread",
      unread: n,
    });

    io.emit("receive_message", {
      from_user: username,
      to_user: selected,
      message: message,
      time: time,
      date: formattedDate,
    }); //this is extra

    // Emit messages to both sender and receiver
  });

  socket.on("load", async (selected, usersname, callback) => {
   
    const data = await getMessages(usersname, selected);

    callback({
      status: "done",
      messages: data,
    });
  });

  socket.on("get_friends", async (username, callback) => {
    
    const fri = (await User.findOne({ username: username }).friends) || [];
    const unr = (await User.findOne({ username: username }).nread) || [];
    // io.to(selected).emit("receive_unread", {
    //   friends: fri,
    //   unread: unr,
    // });
    console.log(fri, " ", unr);
    callback({
      friends: fri,
      unread: unr,
    });
    console.log("friends");
  });

  socket.on("load_messages", async (item, username, callback) => {
   
    const data = await getMessages(username, item);
    // console.log(data, "load messages function");
    callback({
      status: "done",
      messages: data,
    });
  });

  //end of teh function
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING 3001");
});
