import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";
import { checkAndExecuteScrape } from "./util/checkAndExecuteScrape";
const port = process.env.PORT;

mongoose
    .connect(env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Mongoose connected");
        app.listen(port, () => {
            checkAndExecuteScrape();
            console.log("server running on port: " + port);
        });
    })
    .catch(console.error);
