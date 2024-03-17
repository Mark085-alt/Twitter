import mongoose from "mongoose";

export const dbConnection = async () => {

    mongoose.connect(process.env.DATABASE_URL)
        .then(() => {
            console.log("Db connection established");

        })
        .catch((err) => {
            console.log("Db connection failed: ");
            console.log(err);
            process.exit(1);
        })

}