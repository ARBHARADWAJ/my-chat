// import "./App.css";
import { useEffect, useState, useRef } from "react";
import Mymessage from "./Components/Mymessage/Mymessage";
import Othermessage from "./Components/Othermessage/Othermessage";
import Groups from "./Components/Groups/Groups";
import styles from "./App.module.css";
import io from "socket.io-client";
import Message from "./Components/Messages/Message";
import Selected from "./Components/login_register/Selected";
const socket = io.connect("http://localhost:3001");

function App() {
  var currentDate = new Date();

  let minutes = currentDate.getMinutes();
  let hours = currentDate.getHours();
  let date = currentDate.getDate();
  let month = currentDate.getMonth(); // Note: Months are zero-indexed, so January is 0, February is 1, etc.
  let year = currentDate.getFullYear();

  var monthAbbreviations = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState([]);
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState([]);
  const [usersname, setUsersname] = useState("");
  const [unread, setUnread] = useState([]);
  // const [, setUnread] = useState([]);
  const chatContainerRef = useRef(null);
  const [password, setPassword] = useState(null);

  useEffect(() => {
    socket.on("generate", (user) => {});

    const receiveMessageHandler = (data) => {
      console.log("see it",data);
      if(data.content==="unread"){
        setUnread(data.unread)
      }

      if (data.message) {
        const msg = {
          message: data.message,
          to_user: data.to_user,
          from_user: data.from_user,
          time: data.time,
          date: data.date,
        };
        console.log("New data is received from backend:", msg," \nnow the actual message",data);
        setMessageReceived((prevMessages) => [...prevMessages, msg]);
        // Update state with the new message
      } else {
        setMessageReceived([]); // Clear previous messages
      }
    };

    socket.on("receive_unread", (data) => {
     
      if (data.name===usersname) {
        setUsers(data.friends);
        setUnread(data.unread);
      }
    });
    socket.on("receive_message", receiveMessageHandler);

    return () => {
      // Unsubscribe when the component unmounts
      socket.off("receive_message", receiveMessageHandler);
    };
  }, [usersname, selected,socket,users,unread]);
  // }, [selected,socket]);

  // Function to scroll the chat container to the bottom

  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  const handleSendMessage = () => {
    let formattedDate = `${date} ${monthAbbreviations[month]} ${year}`;
    let time = hours + ":" + minutes;
    socket.emit("friend_message", {
      message: message,
      selected: selected,
      username: usersname,
      time: time,
      formattedDate: formattedDate,
    });
    setMessage(""); // Clear the input field
    // scrollToBottom(); (optional - if you want to scroll to the bottom after sending a message)
  };

  useEffect(() => {
    console.log("Updated messageReceived:", messageReceived);
  }, [messageReceived]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className={styles.App}>
      <div className={styles.Groups}>
        <Groups
          users={users}
          unread={unread}
          setSelected={setSelected}
          username={usersname}
          setMessageReceived={setMessageReceived}
          setUnread={setUnread}
        />
      </div>

      <div className={styles.message}>
        <Selected
          selected={selected}
          usersname={usersname}
          setUsersname={setUsersname}
        />
        <div className={styles.content}>
          {/* <div className={styles.selectedname}>{selected}</div> */}
          <Message
            usersname={usersname}
            messageReceived={messageReceived}
            selected={selected}
          />
        </div>

        <div className={styles.inputfiled}>
          <input
            placeholder="Message......"
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            value={message}
            className={styles.input}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

