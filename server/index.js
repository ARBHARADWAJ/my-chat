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
      // users[data] = socket.id;
      // if (!users[socket.id]) {
      //   users[socket.id] = {
      //     username: data,
      //     friends: [],
      //     nread: [],
      //   };
      //   messages[socket.id] = {};
      //   console.log(users[socket.id], " ", socket.id);
      // } else {
      //   console.log(
      //     "cjeck thsi out the user is lareafy found",
      //     users[socket.id]
      //   );
      // }
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

  // users.push(socket.id);//after the user connection the user data is pushed in to the users plist but is now not used

  // socket.emit("generate",{username:socket.id});//sends the id to the user in ftd
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

  /*function getid(username) {
    for (const id in users) {
      if (users[id].username === username) {
        return id;
      }
    }
    return null;
  }*/

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

    /* const selected = getid(data.selected); //return id of the user
    const currentuser = getid(data.username);
    console.log(data);
    if (!messages[currentuser]) {
      messages[currentuser] = {};
    }
    if (!messages[selected]) {
      messages[selected] = {};
    }
    if (!Array.isArray(messages[currentuser][selected])) {
      messages[currentuser][selected] = [];
    }
    let m = {
      from: data.username,
      to: data.selected,
      message: data.message,
      time: data.time,
      date: data.formattedDate,
    };
    console.log(m);
    messages[currentuser][selected].push(m);

    // messages[selected][currentuser] = messages[selected][currentuser] || [];
    if (!Array.isArray(messages[selected][currentuser])) {
      messages[selected][currentuser] = [];
    }
    m = {
      from: data.username,
      selected: data.selected,
      message: data.message,
      time: data.time,
      date: data.formattedDate,
    };
    console.log(m);
    messages[selected][currentuser].push(m);

    if (users[currentuser] && users[selected]) {
      console.log("both users are present");
      if (!users[currentuser].nread.includes(data.selected)) {
        users[currentuser].nread.push(data.selected);
      }

      if (!users[selected].nread.includes(data.username)) {
        users[selected].nread.push(data.username);
      }

      if (!users[selected].friends.includes(data.username)) {
        users[selected].friends.push(data.username);
      }

      if (!users[currentuser].friends.includes(data.selected)) {
        users[currentuser].friends.push(data.selected);
      }
      //TODO:check this out and clear it and use it in the following operation in mongoose
      */

    // io.to(currentuser).emit("receive_message", {
    //   message: data.message,
    //   to: data.selected,
    //   from: data.username,
    // });

    // io.to(selected).emit("receive_message", {
    //   message: data.message,
    //   to: data.selected,
    //   from: data.username,
    // });
    // io.emit("receive_message", {
    //   from_user: username,
    //   to_user: selected,
    //   message: message,
    //   time: time,
    //   date: formattedDate,
    // });

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

    // } else {
    //   console.log("both users are not present");
    // }//check this one also
    // Emit messages to both sender and receiver
  });

  socket.on("load", async (selected, usersname, callback) => {
    // if (selected) {
    //   const id = getid(selected);
    //   const usid = getid(usersname);
    //   if (messages[usid][id]) {
    //     console.log(messages[usid][id]);
    //     callback({
    //       status: "done",
    //       messages: messages[usid][id],
    //     });
    //     // io.to(selected).emit("receive_message", {
    //     //   message: messages[id][usid],
    //     //   to: selected,
    //     //   from: usersname,
    //     // });
    //   } else {
    //     messages[usid][id] = [];
    //     callback({
    //       status: "error",
    //       messages: [],
    //     });
    //   }
    // } TODO: is to make sure that this
    // functionaloty is just he getmessage from the messaegmodel
    //and htat need to be return use the call back function
    const data = await getMessages(usersname, selected);

    callback({
      status: "done",
      messages: data,
    });
  });

  socket.on("get_friends", async (username, callback) => {
    // let id = getid(username);
    // if (userid[id]) {
    //   let friends = userid[id].friends ? userid[id].friends : [];
    //   let unreadlist = users[id].unread ? users[id].unread : [];
    //   callback({
    //     friends: friends,
    //     unread: unreadlist,
    //   });
    // } else {
    //   // Handle the case where userid[id] is undefined
    //   callback({
    //     friends: [],
    //     unread: [],
    //   });
    // }
    //todo: make this functionality of getfriedns() in the messagemodel
    //and also use it for fetching friends
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
    // const c = getid(item);//item is the receiver name
    // const d = getid(username);
    // if (messages[c] && messages[d] && (messages[c][d] || messages[d][c])) {
    //   callback({ messages: messages[d][c] || [] });
    //   // io.to(d).emit("receive_message", messages[d][c]);//this isjust for the theory
    //   // io.to(c).emit("receive_message", messages[c][d]);
    // }
    // // socket.to(d).emit("receive_message", messages[d][c]);
    // // socket.to(c).emit("receive_message", messages[c][d]);
    //todo:this is also the getmessages but its depedn on
    // the same function so make it, or call it
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
