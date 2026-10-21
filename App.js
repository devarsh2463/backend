import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDb from "./config/db.js";
import userRoute from "./route/userRoute.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

const PORT = process.env.PORT || 5000;


// Test route
app.get("/", (req, res) => {

    res.json({
        status: 1,
        message: "Backend run successfully"
    });

});


// API routes
app.use("/api", userRoute);


// Database + Server
connectDb()
    .then(() => {

        app.listen(PORT, () => {

            console.log(
                `App is running on http://localhost:${PORT}`
            );

        });

    })
    .catch((error) => {

        console.log(
            "Server not started:",
            error.message
        );

    });