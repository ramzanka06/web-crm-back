const Message = require("../models/Message.model");

module.exports.messageController = {
  createMessage: async (req, res) => {
    try {
      const { text, sender } = req.body;
      const chat = req.params.chatId;
      const message = await Message.create({ text, chat, sender });
      
      res.status(201).json(message);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Не удалось добавить сообщение" });
    }
  },
  deleteMessage: async (req, res) => {
    try {
      const messageId = req.params.messageId;

      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({ error: "Сообщение не найдено" });
      }

      if (message.sender.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ error: "У тебя нет права для удаления этого сообщения" });
      }

      await Message.deleteOne({ _id: messageId });


      return res.json("Сообщение удалено");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Не удалось удалить сообщение" });
    }
  },
  getMessage: async (req, res) => {
    try {
      const chatId = req.params.chatId;

      // Ищем все сообщения в указанном чате
      const messages = await Message.find({ chat: chatId });

      res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Не удалось получить сообщения" });
    }
  },
};
