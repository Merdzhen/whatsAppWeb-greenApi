import React, { useEffect, useState } from "react";
import axios from "axios";
import Conversation from "./Conversation/Conversation";
import { handleUniqueChats } from "../hooks/handleUniqueChats";
import styles from "./Main.module.scss";
import Chats from "./Chats/Chats";
import Input from "./Input/Input";

const Main = () => {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");

  // console.log(idInstance, apiTokenInstance, messages);
  useEffect(() => {
    // localStorage.clear();

    // gets idInstance from local storage
    const idInstanceStorage = JSON.parse(
      localStorage.getItem("idInstanceStorage")
    );
    if (idInstanceStorage) {
      setIdInstance(idInstanceStorage);
    }

    // gets apiTokenInstance from local storage
    const apiTokenInstanceStorage = JSON.parse(
      localStorage.getItem("apiTokenInstanceStorage")
    );
    if (apiTokenInstanceStorage) {
      setApiTokenInstance(apiTokenInstanceStorage);
    }

    // gets messages from local storage
    const messagesStorage = JSON.parse(localStorage.getItem("messagesStorage"));
    if (messagesStorage) {
      setMessages(messagesStorage);
    }
  }, []);

  // saves idInstance to local storage
  useEffect(() => {
    localStorage.setItem("idInstanceStorage", JSON.stringify(idInstance));
  }, [idInstance]);

  // saves messages to local storage
  useEffect(() => {
    localStorage.setItem("messagesStorage", JSON.stringify(messages));
  }, [messages]);

  // saves apiTokenInstance to local storage
  useEffect(() => {
    localStorage.setItem(
      "apiTokenInstanceStorage",
      JSON.stringify(apiTokenInstance)
    );
  }, [apiTokenInstance]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getMessage();
    }, 1000 * 5); // in milliseconds
    return () => clearInterval(intervalId);
  });

  // gets meassage from Api
  const getMessage = async () => {
    if (idInstance.length > 0 && apiTokenInstance.length > 0) {
      // console.log("getMessage");
      const apiUrl = `https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`;
      axios
        .get(apiUrl)
        .then((respGet) => {
          // console.log("respGet", respGet);
          // deletes notification by receiptId (creates ability to receive the new one)
          if (respGet.data?.receiptId) {
            const apiUrlDelete = `https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${respGet.data.receiptId}`;
            axios
              .delete(apiUrlDelete)
              .then((respDelete) => {
                // console.log("respDelete", respDelete);
                // checks if the notification is a message type
                if (
                  respGet.data.body.typeWebhook === "incomingMessageReceived" ||
                  respGet.data.body.typeWebhook === "outgoingMessageReceived"
                ) {
                  const mess = {
                    chatId: String(respGet.data.body.senderData.chatId),
                    // chatName: respGet.data.body.senderData.chatName,
                    senderName: respGet.data.body.senderData.senderName,
                    message: "",
                    quotedMessage:
                      respGet.data.body.messageData?.quotedMessage?.stanzaId ||
                      "",
                    timestamp: respGet.data.body.timestamp,
                    idMessage: respGet.data.body.idMessage,
                    idInstance: respGet.data.body.instanceData.idInstance,
                    isMe:
                      respGet.data.body.senderData.sender ===
                      respGet.data.body.instanceData.wid,
                  };
                  if (
                    respGet.data.body.messageData.typeMessage ===
                      "textMessage" ||
                    respGet.data.body.messageData.typeMessage ===
                      "quotedMessage"
                  ) {
                    mess.message =
                      respGet.data.body.messageData?.textMessageData
                        ?.textMessage ||
                      respGet.data.body.messageData?.extendedTextMessageData
                        ?.text ||
                      "";
                  } else {
                    mess.message = "*** Формат сообщения не поддерживается ***";
                  }
                  setMessages((prev) => [mess, ...prev]);
                  console.log("mess", mess);
                }
              })
              .catch((errorDelete) => {
                console.log("errorDelete", errorDelete.message);
              });
          }
        })
        .catch((error) => {
          console.log("errorReceive", error.message);
        });
    }
    // const apiUrl = `https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`;
  };

  const [uniqueChats, setUniqueChats] = useState([]);
  useEffect(() => {
    setUniqueChats(handleUniqueChats(messages, idInstance));
  }, [messages, idInstance]);

  const [currentChatId, setCurrentChatId] = useState("");
  //sets first chat as active chat
  useEffect(() => {
    if (currentChatId === "" && uniqueChats[0]?.chatId) {
      setCurrentChatId(uniqueChats[0].chatId);
    } else {
      setCurrentChatId('');
    }
  }, [uniqueChats]);

  const handleChatId = (telValue) => {
    if (telValue.length === 12 || telValue.length === 11) {
      // console.log("telValue.length");
      const chatIdCurr = `${telValue}@c.us`;
      setCurrentChatId(chatIdCurr);
      const mess = {
        chatId: chatIdCurr,
        senderName: "Вы",
        message: "",
        quotedMessage: "",
        timestamp: Date.now() / 1000,
        idMessage: "",
        idInstance: idInstance,
        isMe: true,
      };
      if (!uniqueChats.find((chat) => chat.chatId === chatIdCurr)?.chatId) {
        setUniqueChats((prev) => [mess, ...prev]);
        // console.log("setUniqueChats");
      }
    }
  };

  const connect = () => {
    setConnected(true);
  };

  // console.log(uniqueChats, currentChatId, idInstance, messages);

  if (!connected) {
    return (
      <div className={styles.main}>
        <div>Добро пожаловать в мессенджер</div>
        <form onSubmit={connect} className={styles.form}>
          <Input
            value={idInstance}
            setValue={setIdInstance}
            placeholder={"Введите idInstance"}
          />
          <Input
            value={apiTokenInstance}
            setValue={setApiTokenInstance}
            placeholder={"Введите apiTokenInstance"}
          />
          <input type="submit" value="Войти" className={styles.btn} />
          <a
            className={styles.btn}
            href="https://green-api.com"
            target="_blank"
            rel="noreferrer"
          >
            Получить idInstance и apiTokenInstance
          </a>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Chats
        setConnected={setConnected}
        messages={messages}
        uniqueChats={uniqueChats}
        setUniqueChats={setUniqueChats}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        handleChatId={handleChatId}
      />
      {currentChatId?.length > 0 && (
        <Conversation
          idInstance={idInstance}
          currentChatId={currentChatId}
          apiTokenInstance={apiTokenInstance}
          messages={messages}
          setMessages={setMessages}
        />
      )}
    </div>
  );
};

export default Main;
