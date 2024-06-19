const mongoose = require("mongoose");
const Message = mongoose.model("Message");
const { Chatroom } = require("./chatroomController");

exports.sendMessage = async (req, res) => {
  const { chatroomId, text } = req.body;

  // Kiểm tra xem tin nhắn có dữ liệu hợp lệ hay không
  if (!chatroomId || !text) {
    return res.status(400).json({ error: "Invalid message data." });
  }

  try {
    // Tìm kiếm phòng chat theo ID
    const chatroom = await Chatroom.findById(chatroomId);

    if (!chatroom) {
      return res.status(404).json({ error: "Chatroom not found." });
    }

    // Tạo một tin nhắn mới
    const message = new Message({ text });
    
    // Lưu tin nhắn vào phòng chat
    chatroom.messages.push(message);
    
    // Lưu thay đổi vào cả phòng chat và tin nhắn
    await Promise.all([chatroom.save(), message.save()]);

    res.json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMessages = async (req, res) => {
  const { chatroomId } = req.params;

  try {
    // Tìm kiếm tin nhắn trong phòng chat theo ID
    const messages = await Message.find({ chatroom: chatroomId });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
