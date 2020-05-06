const {validationResult} = require('express-validator')
const Post = require('../models/post')

exports.getPost = (req, res, next) => {
    Post.find().then( result => {
        res.status(200).json({posts: result })
    }).catch(err => console.log(err))
}

exports.addPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){ //means we have errors
        return res.status(422).json({message: 'Entered data does not meet min length requirement', errors: errors.array()})
    }
    const title = req.body.title;
    const content = req.body.content
    const post = new Post({
        title,
        content,
        imageUrl: 'images/0.jpeg',
        creator:{
            name: 'Chaffie'
        },
    })
    post.save().then(res =>{
         console.log(res)
         res.status(201).json({ message: "post uploaded successfully!", post: res })
    }).catch(err => console.log(err))
}