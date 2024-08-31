import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import 'dotenv/config';

import { loginValidator, registerValidator } from "./validators/auth.js";
import { postCreateValidation } from "./validators/posts.js";
import checkAuth from "./utils/checkAuth.js";
import * as authController from "./controllers/authControllers.js";
import * as postController from "./controllers/postsControllers.js";
import handleValidationError from "./utils/handleValidationError.js";

mongoose
    .connect(process.env.db)
    .then(console.log("DB connected"))
    .catch((err) => { console.log(err)})


const app = express();

//Storage for upload images
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({storage});
/////////////////////////////////


app.use(express.json());
app.use('/upload', express.static('uploads'));
//Authentication
app.post("/login", loginValidator, handleValidationError, authController.login);
app.post("/registration", registerValidator, handleValidationError, authController.registration);
app.get("/me", checkAuth, authController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/upload/${req.file.originalname}`
    })
})
//Posts
app.post("/create-post", checkAuth, postCreateValidation, handleValidationError, postController.create);
app.get('/posts', postController.getAll);
app.get('/posts/:id', postController.getOne);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationError, postController.update);

app.get("/", (req, res) => {
    res.send('Hello')
})
app.listen(4444, (err) => {
    if (err) {
        console.log(err)
    }
    console.log("Server started")
})