// // messageModel.js
// const mongoose = require("./mongoose");

// const messageFormatSchema = new mongoose.Schema({
//   from_user: { type: String, required: true },
//   to_user: { type: String, required: true },
//   message: { type: String, required: true },
//   time: { type: String, required: true },
//   date: { type: String, required: true },
// });

// const messageSchema=new mongoose.Schema({
//   username:{type:String,required:true},
//   message:messageFormatSchema
// })

// const Message = mongoose.model("Message", messageSchema);

// module.exports = Message;

const mongoose = require("mongoose");
// const messageId = mongoose.Types.ObjectId();
const { User, addFriends, addFriendUnread } = require("../mongoose/UserSchema");
const { Schema } = mongoose;

const messageFormatSchema = new Schema({
  from_user: { type: String, required: true },
  to_user: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
});

const messageSchema = new Schema({
  username: String,
  messagelist: [
    {
      receiver: { type: String, required: true },
      messages: [messageFormatSchema],
    },
  ],
});
// const MessageFormat = mongoose.model("MessageFormat", messageFormatSchema);
const MessageSchema = mongoose.model("Message", messageSchema);

async function getreceivermessages(messages, receivername) {
  var found = false;
  messages.forEach((e) => {
    if (e.receiver === receivername) {
      found = true;
      return e.messageid;
    }
  });
  if (found == false) {
    return null;
  }
}

async function createMessage(username) {
  const existingUser = await User.findOne({ username: username });
  if (existingUser) {
    const message = new MessageSchema({
      username: username,
      message: [],
    });
    await message.save();
    console.log("the user is assigned with some message data");
  }
}
async function getMessages(username, receivername) {
  try {
    let founduser = await MessageSchema.findOne({ username: username });
    console.log("searched the user and found the user", founduser);
    
    if (founduser && founduser.messagelist) {
      for (const ele of founduser.messagelist) {
        if (ele.receiver === receivername) {
          console.log("found the receiver");
          // console.log("searched messages", ele);
          return ele.messages;
        }
      }
    }

    return [];
  } catch (e) {
    console.log(e);
    return [];
  }
}


async function setMessages(username, receivername, message) {
  let founduser = await MessageSchema.findOne({ username });
  try {
    if (founduser) {
      const newmessage = {
        from_user: "",
        to_user: "",
        message: "",
        time: "",
        date: "",
      };

      newmessage.from_user = message.from_user;
      newmessage.to_user = message.to_user;
      newmessage.message = message.message;
      newmessage.time = message.time;
      newmessage.date = message.date; // Corrected property name

      ///if user present
      let found = false;
      if (founduser.messagelist.length > 0) {
        founduser.messagelist.forEach((element) => {
          if (element.receiver === receivername) {
            element.messages.push(newmessage);
            found = true;
          }
        });
      } else {
        founduser.messagelist.push({
          receiver: receivername,
          messages: [newmessage],
        });
      }

      await addFriends(username, receivername);
      await addFriends(receivername, username);
      await addFriendUnread(receivername,username)
      await founduser.save();
    } else {
      console.log("user not found");
    }
  } catch (e) {
    console.log(e);
  }
}

function getFriends(username) {
  console.log(
    "the user is requesting the users friedns so we willl retun teh userns friedns of ",
    username
  );
}

module.exports = {
  MessageSchema,
  setMessages,
  getMessages,
  getFriends,
  createMessage,
};

//TODO:make a function that ssign a user a friend and an unread name
//  intotheir array and make a function in userschema and also use
// it in this file
