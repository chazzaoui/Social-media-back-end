const {validationResult} = require('express-validator')

exports.getPost = (req, res, next) => {
    res.status(200).json({posts: [{
        _id: Math.random(),
     title: 'This is a post',
     content: "I hope you enjoy this", 
     imageUrl: 'images/0.jpeg', 
     creator:{
        name: "Chaffie"
    },
    createdAt: new Date()
}]})
}

exports.addPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){ //means we have errors
        return res.status(422).json({message: 'Entered data does not meet min length requirement', errors: errors.array()})
    }
    const title = req.body.title;
    const content = req.body.content
    res.status(201).json({ message: "post uploaded successfully!", post:{ _id: new Date().toISOString() , title, content, creator:{
        name: 'Chaffie'
    },
    createdAt: new Date()
} })
}