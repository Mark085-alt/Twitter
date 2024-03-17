
import { dbConnection } from "./config/dbConnection.js"
import dotenv from "dotenv";
import { app } from "./app.js";
import { cloudinaryConnection } from "./config/cloudinary.config.js"
import { createServer } from "http";
import { Server } from "socket.io";


// import routes
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

// environment
dotenv.config();

// connection
dbConnection();

// cloudinary
cloudinaryConnection();

// port
const PORT = process.env.PORT || 5000;


app.use("/api/v1/auth", authRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/message", messageRoute);


const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "https://twitter-himanshu.vercel.app",
            "http://localhost:3000"
        ],
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization"],
        credentials: true
    },
    pingTimeout: 60000
});





let activeUsers = [];

io.on('connection', (socket) => {

    // Add user
    socket.on("add-user", (userId) => {
        // if not added
        if (!activeUsers.some((user) => user.userId === userId)) {
            activeUsers.push(
                {
                    userId,
                    socketId: socket.id
                }
            );
        }
        io.emit("get-active-users", activeUsers);
    });

    // Send Message
    socket.on("send-message", (data) => {
        const { userId } = data;
        const user = activeUsers.find((user) => user.userId === userId);

        if (user) {
            io.to(user.socketId).emit("recieve-message", data)
        }
    });

    // Disconnect User
    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        io.emit("get-active-users", activeUsers);
    });
});


server.listen(PORT, () => {
    console.log("Server listening on port : ", PORT)
});


app.get("/api/v1/", (req, res) => {
    res.send("Twitter Default Route")
});


