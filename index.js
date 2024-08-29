import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';

import { loginValidator, registerValidator } from "./validators/auth.js";
import { postCreateValidation } from "./validators/posts.js";
import checkAuth from "./utils/checkAuth.js";
import * as authController from "./controllers/authControllers.js";
import * as postController from "./controllers/postsControllers.js";

mongoose
    .connect(process.env.db)
    .then(console.log("DB connected"))
    .catch((err) => { console.log(err)})


const app = express();
app.use(express.json());

//Authentication
app.post("/login", loginValidator, authController.login)
app.post("/registration", registerValidator, authController.registration)
app.get("/me", checkAuth, authController.getMe)

//Posts
app.post("/create-post", checkAuth, postCreateValidation, postController.create);
app.get('/posts', postController.getAll);
app.get('/posts/:id', postController.getOne);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch('/posts/:id', checkAuth, postController.update)

app.get("/", (req, res) => {
    res.send('Hello')
})
app.listen(4444, (err) => {
    if (err) {
        console.log(err)
    }
    console.log("Server started")
})