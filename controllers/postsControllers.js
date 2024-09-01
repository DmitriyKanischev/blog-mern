import PostModel from "../models/post.js";

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageURL: req.body.imageURL,
            tags: req.body.tags,
            user: req.userId
        });

        const post = await doc.save()
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать пост'
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate({path: "user", select: ["fullName", "avatarUrl"]}).exec();
        res.json(posts)
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: "Статьи не найдены"
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndUpdate({
            _id: postId,
        }, {
            $inc: {
                viewsCount: 1
            }
        }, {
            returnDocument: 'after'
        })
        .then(doc => res.json(doc))
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Не удалось вернуть статью"
            })
        })

    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: "Статьи не найдены"
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postId
        })
        .then(() =>  res.json({
            success: true
        }))
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Не удалось удалить статью"
            })
        })
    } catch (error) {
        console.log(error);
            res.status(500).json({
                message: "Не удалось удалить статью"
            })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne({
            _id: postId
        }, {
            title: req.body.title,
            text: req.body.text,
            imageURL: req.body.imageURL,
            tags: req.body.tags,
            user: req.userId
        })
        res.json({
            success: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось обновить статью"
        })
    }
}