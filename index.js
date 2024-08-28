import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import 'dotenv/config';
import bcrypt from "bcrypt";

import { validationResult } from "express-validator";
import { registerValidator } from "./validators/auth.js";
import UserModel from "./models/user.js"

mongoose
    .connect(process.env.db)
    .then(console.log("DB connected"))
    .catch((err) => { console.log(err)})


const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send('Hello')
})
app.post("/registration", registerValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }

    //Password encryption 
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    //Create new user
    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        passwordHash: passwordHash
    })
    const user = await doc.save();
    res.json(user)
})

app.listen(4444, (err) => {
    if (err) {
        console.log(err)
    }
    console.log("Server started")
})