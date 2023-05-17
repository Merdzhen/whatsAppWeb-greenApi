import React from "react";
import styles from "./Message.module.scss";

export default function Message({ message, messages }) {
  const [quotedMessage, setQuotedMessage] = React.useState({});
  React.useEffect(() => {
    // if there is any quoted message in the response & if there is the quoted message in the local storage
    if (
      message.quotedMessage.length > 0 &&
      messages.filter((msg) => msg.idMessage === message.quotedMessage)[0]
        ?.message
    ) {
      setQuotedMessage(
        messages.filter((msg) => msg.idMessage === message.quotedMessage)[0]
      );
    } else {
      setQuotedMessage("");
    }
  }, [message, messages]);

  return (
    <div className={message.isMe ? styles.myMessage : styles.message}>
      {quotedMessage.message && (
        <div className={styles.quote}>{quotedMessage.message}</div>
      )}
      <div className={styles.main}>
        {!message.isMe && <span>{message.senderName}, </span>}
        {new Date(message.timestamp * 1000).toLocaleString()}: {message.message}
      </div>
    </div>
  );
}
