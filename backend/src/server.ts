import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";
import { setNextScrapeTimeout } from "./util/checkAndExecuteScrape";
const port = process.env.PORT;

mongoose
    .connect(env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Mongoose connected");
        app.listen(port, () => {
            setNextScrapeTimeout(0);
            console.log("server running on port: " + port);
        });
    })
    .catch(console.error);
