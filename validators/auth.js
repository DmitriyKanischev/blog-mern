import {body} from "express-validator";

export const registerValidator = [
    body('email', "Ivalid email").isEmail(),
    body('password', "Password min 5, max 32 character").isLength({min: 5, max: 32}),
    body('fullName', "Name 3 characters min").isLength({min: 3, }),
    body('avatarUrl', "Not valid link").optional().isURL(),
]