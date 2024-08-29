import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';

import { registerValidator } from "./validators/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as authController from "./controllers/authControllers.js"

mongoose
    .connect(process.env.db)
    .then(console.log("DB connected"))
    .catch((err) => { console.log(err)})


const app = express();
app.use(express.json());

//Authentication
app.post("/login", authController.login)
app.post("/registration", registerValidator, authController.registration)
app.get("/me", checkAuth, authController.getMe)


app.get("/", (req, res) => {
    res.send('Hello')
})

app.listen(4444, (err) => {
    if (err) {
        console.log(err)
    }
    console.log("Server started")
})