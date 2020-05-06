exports.getPost = (req, res, next) => {
    res.status(200).json({posts: [{title: 'This is a post', content: "I hope you enjoy this"}]})
}

exports.addPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content
    res.status(201).json({message: "post uploaded successfully!", post:{ id: new Date().toISOString() , title, content} })
}