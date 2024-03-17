import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import fileUploader from "express-fileupload";
import cors from "cors"




const app = express();


// middleware
app.use(cookieParser())
app.use(express.json())
app.use(cors(
    {
        origin: [
            "https://twitter-himanshu.vercel.app",
            "http://localhost:3000"
        ],
        credentials: true,
    }
));
app.use(express.urlencoded({ extended: true }));
app.use(fileUploader(
    {
        useTempFiles: true,
        tempFileDir: '/tmp/'
    }
));




export { app };

