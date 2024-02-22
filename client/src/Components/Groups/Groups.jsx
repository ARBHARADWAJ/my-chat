import React, { useState, useEffect } from "react";
import styles from "./Groups.module.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

const Groups = ({
  users,
  unread,
  setSelected,
  username,
  setMessageReceived,
  setUnread,
}) => {
  // Filter out the current user from the list of usernames
  // const unreadlist=unread.filter(names=>!usapers.includes(names))
  // const usernames = users.filter((name) => !unread.includes(name));
  const usernames = unread;

  const [search, setSearch] = useState(null);
  const [list, setList] = useState([]);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (search.trim() !== "") {
        generateFriends();
      }
    }, 1000);
    return () => clearTimeout(delaySearch);
  }, [search]);

  useEffect(() => {
    socket.emit("get_friends", username, (res) => {
      console.log("here is just for fun log the returns", res);
      if (res.status === "done") {
        setList(res.friends || []);
        setUnread(res.unread || []);
      }
    });
  }, [socket]);

  function getload(item, username) {
    socket.emit("load_messages", item, username, (res) => {
      setMessageReceived(res.messages || []);
    });
  }

  // Function to fetch friends based on search term
  function generateFriends() {
    // Emit a socket event to the server to get friends based on the search term
    socket.emit("generate_friends", search, (res) => {
      if (res.status === "done") {
        let data = res.data;
        setList(data);
      } else {
        setList(["no data found"]);
      }
    });
  }
  // function generateFriends() {
  //   setUnread(["ramesh", "suresh", "rajesh", "vikram"]);
  //   setList(["raja", "venket", "roja", "akasam", "ahuti", "prasad"]);
  //   // return ;
  // }

  return (
    <div className={styles.maincont}>
      <div className={styles.ours}>MyChat</div>
      <div className={styles.title}>friends</div>

      <input
        className={styles.input}
        type="text"
        value={search}
        placeholder="Search Friends"
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          // e.preventDefault();
          if (e.key === "Escape") {
            // Handle the Escape key press if needed
            setAlert(false);
          }
          if (e.key === "Enter") {
            socket.emit("generate_friends", search, (res) => {
              if (res.status === "done") {
                setList(res.data);
              }
            });
          }
        }}
        onClick={() => setAlert(true)}
      />
      {/* thisis for the show fo members whenthe search name is displayed */}

      {/* Display friends list or search results */}
      {alert === false ? (
        // Display the regular friends list
        <div className={styles.cont}>
          <div className={styles.usernames}>
            <div className={styles.title}>Unread</div>
            {/* {["ramu", "ramu", "ramu", "ramu"]?.map((item, index) => ( */}
            {unread?.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelected(item);
                  console.log(item);
                  getload(item, username);
                }}
                className={styles.name}
              >
                {item}
              </div>
            ))}
          </div>
          {/* //user unread instead of username */}
          {/* Map over usernames and display them */}
          {/* {item.substring(0, 10) + "..."} */}
          <div className={styles.usernames}>
            <div className={styles.title}>Friends</div>
            {/* {["ramu", "ramu", "ramu", "ramu"]?.map((item, index) => ( */}
             {usernames?.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelected(item);
                  console.log(item);
                  getload(item, username);
                }}
                className={styles.name}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Display the search results
        <div className={styles}>
          <div className={styles.title}>search</div>
          {list?.map((item, index) => (
          // {["ramu", "ramu", "ramu", "ramu"]?.map((item, index) => (
            <div
              key={index}
              className={styles.name}
              onClick={() => {
                setSelected(item);
                console.log(item);
                setAlert(false); // Close the dropdown when an item is selected
                getload(item, username);
                generateFriends();
              }}
            >
              {item}
            </div>
          ))}
        </div>
        // <></>
      )}
    </div>
  );
};

export default Groups;
