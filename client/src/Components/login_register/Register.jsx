import React, { useState } from "react";
import styles from "./loginreg.module.css";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");
const Register = ({ setUsersname, setAlert1 }) => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [alert, setAlert] = useState(false);
  const [se, setSe] = useState(false);
  return (
    <div className={styles.login}>
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          placeholder="username"
          className={styles.input}
        />
      </div>
      <div>
        <input
          type="text"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="password"
        />
      </div>
      <div>
        <button
          className={styles.btn_log}
          onClick={() => {
            socket.emit(
              "connection",
              {
                username: username,
                password: password,
              },
              (res) => {
                if (res) {
                  if (res.status === "done") {
                    setUsername(username);
                    setSe(true);
                    setTimeout(() => {
                      setAlert(1);
                    }, 3000);
                  } else {
                    setAlert(true);
                  }
                }
              }
            );
            // }
          }}
        >
          Register
        </button>
      </div>

      <div>
        {alert && <div>the user alerady exits</div>}{" "}
        {se && <div>Created user change to login</div>}
        <button
          className={styles.btn_log}
          onClick={() => {
            setAlert1(1);
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Register;
