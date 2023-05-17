import React from "react";
import styles from "./Chats.module.scss";
import Input from "../Input/Input";

export default function Chats({
  setConnected,
  uniqueChats,
  setUniqueChats,
  currentChatId,
  setCurrentChatId,
  handleChatId,
}) {
  const [telValue, setTelValue] = React.useState("");
  const [filteredChats, setFilteredChats] = React.useState([]);
  React.useEffect(() => {
    setFilteredChats(
      uniqueChats.filter((chat) => chat.chatId.includes(telValue))
    );
  }, [uniqueChats, telValue]);

  const goBack = () => {
    setConnected(false);
  };

  return (
    <div className={styles.chats}>
      <div className={styles.back} onClick={() => goBack()}>
        {"<< Вернуться на главную"}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleChatId(telValue);
        }}
      >
        <Input
          value={telValue}
          setValue={setTelValue}
          placeholder={"Введите номер"}
        />
        {/* <input type="submit" value="Отправить" /> */}
      </form>
      {!(filteredChats.length > 0) && (
        <div className={styles.empty}>Нет начатых диалогов</div>
      )}
      {filteredChats.length > 0 &&
        filteredChats.map((chat) => (
          <div
            className={
              chat.chatId === currentChatId ? styles.chatActive : styles.chat
            }
            onClick={() => setCurrentChatId(chat.chatId)}
            key={chat.chatId}
          >
            <div>{chat.chatId.replace("@c.us", "").replace("@g.us", "")}</div>
            <div>
              <span>{chat.senderName}, </span>
              <span>{new Date(chat.timestamp * 1000).toLocaleString()}</span>
            </div>
            <div>{chat.message}</div>
          </div>
        ))}
    </div>
  );
}
