// messageModel.js
const mongoose = require("./mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  friends: {
    type: Array,
    default: [],
  },
  nread: {
    type: Array,
    default: [],
  },
  password: String,
});

// const User = mongoose.model("User", userSchema);

const User = mongoose.model("User", userSchema);

async function addFriends(username, friend) {
  try {
    const foundUser = await User.findOne({ username: username });

    // if (!foundUser.nread.includes(friend)) {
    //   foundUser.nread.push(friend);
    // }

    if (!foundUser.friends.includes(friend)) {
      foundUser.friends.push(friend);
    }

    await foundUser.save();
  } catch (error) {
    console.error(error);
  }
}

async function addFriendUnread(username, receiver) {
  const found = await User.findOne({ username: username });
  const unread = found.nread;
  if (unread.includes(receiver)) {
    const index = unread.indexOf(receiver);
    if (index !== -1) {
      const newarr = unread.splice(index, 1)[0];
      console.log(newarr);
      found.nread = newarr;
      await found.save();
    }
    else{
      console.log("list is empty");
    }
  }
  else{
    found.nread.unshift(receiver);
    await found.save();
  }
  console.log(found);
}

module.exports = { User, addFriends,addFriendUnread };
