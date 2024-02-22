import React from "react";
import styles from "./Othermessage.module.css";

const Othermessage = ({ message, index, from, selected,time,date }) => {
  return (
    <>
      {from === selected && (
        <div className={styles.container} index={index}>
          <div className={styles.othermessage} index={index}>
            {message}
            <div className={styles.time} index={index}>
              <div index={index}>{time}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Othermessage;
