import React from "react";
import Message from "../Message/Message";
import styles from "./Conversation.module.scss";
import Input from "../Input/Input";
import axios from "axios";

export default function Conversation({
  idInstance,
  currentChatId,
  apiTokenInstance,
  messages,
  setMessages,
}) {
  let listRef = React.useRef();

  React.useEffect(() => {
    listRef.current?.firstElementChild?.scrollIntoView();
  });

  const [messageValue, setMessageValue] = React.useState("");

  // sends meassage to Api
  const sendMessage = async () => {
    setMessageValue("");

    const apiUrl = `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    const requestOptions = {
      chatId: currentChatId,
      message: messageValue,
    };
    axios
      .post(apiUrl, requestOptions, {
        headers: { "Content-Type": "application/json" },
      })
      .then((resp) => {
        // console.log("resp", resp);
        const mess = {
          chatId: currentChatId,
          senderName: "Вы",
          message: messageValue,
          quotedMessage: "",
          timestamp: Date.now() / 1000,
          idMessage: resp.data.idMessage,
          idInstance: idInstance,
          isMe: true,
        };
        setMessages((prev) => [mess, ...prev]);
      })
      .catch((error) => {
        console.log("error", error.message);
      });
  };

  const [currentMessages, setCurrentMessages] = React.useState([]);
  // console.log(currentMessages);
  
  React.useEffect(() => {
    setCurrentMessages(
      messages.filter(
        (msg) => String(msg.idInstance) === idInstance && msg.chatId === currentChatId
      )
    );
  }, [messages, currentChatId, idInstance]);

  return (
    <div className={styles.conversation}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <Input value={messageValue} setValue={setMessageValue} placeholder={'Введите сообщение'}/>
        {/* <input type="submit" value="Отправить" /> */}
      </form>
      <div className={styles.messages} ref={listRef}>
        {currentMessages.length > 0 &&
          currentMessages.map((mess, index) => (
            <React.Fragment key={index}>
              <Message messages={messages} message={mess} />
            </React.Fragment>
          ))}
      </div>
    </div>
  );
}
