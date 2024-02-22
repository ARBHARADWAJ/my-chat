import React from 'react'
import styles from "./Mymessage.module.css";

const Mymessage = ({message,index,time,date}) => {
  return (
    <div className={styles.container} index={index} >
      <div className={styles.mymessage} index={index}>
        {message}  
      <div className={styles.time} index={index}>
        <div index={index}>{time}</div>
      </div>
      </div>
    </div>
  )
}

export default Mymessage

{/* <p>{item.selected}</p> */}
    