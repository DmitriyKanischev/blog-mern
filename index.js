import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import 'dotenv/config'

import { validationResult } from "express-validator";
import { registerValidator } from "./validators/auth.js";
import UserModel from "./validators/auth.js"

mongoose
    .connect(process.env.db)
    .then(console.log("DB connected"))
    .catch((err) => { console.log(err)})


const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send('Hello')
})
app.post("/registration", registerValidator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }
    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        passwordHash: req.body.password
    })
    res.json({
        success: true
    })
})

app.listen(4444, (err) => {
    if (err) {
        console.log(err)
    }
    console.log("Server started")
})