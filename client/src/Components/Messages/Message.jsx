import React, { useRef } from "react";
import Othermessage from "../Othermessage/Othermessage";
import Mymessage from "../Mymessage/Mymessage";
import styles from "./Message.module.css";


const Message = ({ usersname, messageReceived, selected }) => {
  const chatContainerRef = useRef(null);

  // Function to scroll the chat container to the bottom
  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };
  if (!messageReceived || !Array.isArray(messageReceived)) {
    console.error("Invalid or missing messageReceived prop:", messageReceived);
    return null;
  }
  return (
    <>
      {messageReceived.map((item, index) => (
        <div key={index}>

          {item.message && selected && (
            <>
              {item.from_user === usersname && item.to_user === selected ? (
                <Mymessage
                  message={item.message}
                  index={index}
                  time={item.time}
                  date={item.date}
                />
              ) : (
                <Othermessage
                  message={item.message}
                  index={index}
                  from={item.from_user}
                  selected={selected}
                  time={item.time}
                  date={item.date}
                />
              )}
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default Message;
