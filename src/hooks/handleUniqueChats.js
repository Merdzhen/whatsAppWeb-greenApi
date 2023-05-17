export const handleUniqueChats = (messages, idInstance) => {
  let uniqueConversations = [];
  let uniqueChats = [];
  messages.forEach((msg) => {
    if (!uniqueChats.includes(msg.chatId) && Number(idInstance) === Number(msg.idInstance)) {
      uniqueChats.push(msg.chatId);
      uniqueConversations.push(msg);
    }
  });
  return uniqueConversations;
};
