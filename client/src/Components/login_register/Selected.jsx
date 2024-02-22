import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import styles from "./loginreg.module.css";

const Selected = ({ selected, usersname, setUsersname }) => {
  const [alert1, setAlert1] = useState(1);
  const [alert2, setAlert2] = useState(false);
  const [alert3, setAlert3] = useState(false);

  return (
    <div className={styles.login}>
      <div className={styles.title}>{selected}</div>
      <div>
        {alert1 === 1 && (
          <div>
            <Login
              usersname={usersname}
              setUsersname={setUsersname}
              setAlert1={setAlert1}
            />
          </div>
        )}

        {alert1 === 2 && (
          <div>
            <Register
              usersname={usersname}
              setUsersname={setUsersname}
              setAlert1={setAlert1}
            />
          </div>
        )}
        {alert1 === 3 && <div className={styles.title}>{usersname}</div>}
      </div>
    </div>
  );
};

export default Selected;
