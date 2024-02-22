import React, { useState } from "react";
import io from "socket.io-client";
import styles from "./loginreg.module.css";
const socket = io.connect("http://localhost:3001");

const Login = ({ usersname, setUsersname, setAlert1 }) => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [alert, setAlert] = useState(false);
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
          className={styles.input}

          placeholder="password"
        />
      </div>
      <div>
        <button
          onClick={() => {
            socket.emit(
              "login",
              {
                username: username,
                password: password,
              },
              (res) => {
                console.log(res);
                if (res) {
                  if (res.status === "created") {
                    setUsersname(username);
                    setAlert1(3);
                  } else {
                    setAlert(true);
                  }
                }
              }
            );
            // }
          }}
          className={styles.btn_log}
        >
          Submit
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            setAlert1(2);
          }}
          className={styles.btn_log}
          >
          Register
        </button>
            {alert && <div>user need to register</div>}
      </div>
    </div>
  );
};

export default Login;
