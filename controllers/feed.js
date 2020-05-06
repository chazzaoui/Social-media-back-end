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
    const title = req.body.title;
    const content = req.body.content
    res.status(201).json({ message: "post uploaded successfully!", post:{ _id: new Date().toISOString() , title, content, creator:{
        name: 'Chaffie'
    },
    createdAt: new Date()
} })
}