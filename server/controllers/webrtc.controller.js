import User from "../models/user.model.js";
import Message from "../models/message.model.js";


export const onConnected = (socket) => {

    // Handle user connection
    socket.on('userConnected', async (userId) => {
        await handleUserConnected(userId, socket.id);
    });


    // Handle one-to-to chat message
    socket.on('send-message-one-to-one', async (messageData, senderId, receiverId) => {
        await handleSendMessage(messageData, senderId, receiverId);
        socket.broadcast.emit("receive-message", messageData);
    });
}


const handleUserConnected = async (userId, socketId) => {
    try {
        await User.findByIdAndUpdate(userId, { socketId: socketId }, { new: true });
        console.log(`User ${userId} connected with socket ID ${socketId}`);

    } catch (error) {
        console.error('Error updating user socket ID:', error);
    }
};


const handleSendMessage = async (message, senderId, recieverId) => {


    try {

        const senderUser = await User.findById(senderId).select("socketId");

        if (!senderUser) {
            throw new Error("Sender not found!");
        }

        const newMessage = await Message.create(
            {
                content: message,
                sender: senderId,
                reciever: recieverId,
            }
        );

    } catch (error) {
        console.error('Error updating user socket ID:', error);
    }
};







// // Handle offer message
// socket.on('offer', (offer, recipientSocketId) => {
//     io.to(recipientSocketId).emit('offer', offer, socket.id);
// });

// // Handle answer message
// socket.on('answer', (answer, recipientSocketId) => {
//     io.to(recipientSocketId).emit('answer', answer);
// });

// // Handle ICE candidate message
// socket.on('icecandidate', (candidate, recipientSocketId) => {
//     io.to(recipientSocketId).emit('icecandidate', candidate);
// });

// socket.on('error', (error) => {
//     console.error('Socket error:', error);
//     // Handle specific errors (e.g., disconnection) or emit an error event to the client
// });