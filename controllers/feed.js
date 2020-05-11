const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");
const io = require("../socket");

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage) //returns page minus the items i already have
      .limit(perPage);

    res.status(200).json({ posts, totalItems });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //means we have errors
    const error = new Error(
      "Entered data does not meet min length requirement"
    );
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error("No file provided!");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  let creator;
  try {
    const post = new Post({
      title,
      content,
      imageUrl,
      creator: req.userId,
    });
    await post.save();

    const user = await User.findById(req.userId);
    creator = user;
    user.posts.push(post);
    await user.save();

    res.status(201).json({
      message: "post uploaded successfully!",
      post: post,
      creator: {
        _id: creator._id,
        name: creator.name,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById({ _id: postId });

    if (!post) {
      const error = new Error("Could not find post with this id!");
      error.statusCode = 404;
      throw error; // throw is acceptable here cause i end up in the catch block and there i next the error to middlewhere
    }
    res.status(200).json({ message: "post found!", post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log(err);
    next(err);
  }
};

exports.editPost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //means we have errors
    const error = new Error(
      "Entered data does not meet min length requirement"
    );
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No image picked!");
    error.statusCode = 422;
    throw error;
  }
  try {
    const post = await Post.findById(postId).populate("creator");

    if (!post) {
      const error = new Error("Could not find post with this id!");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 401;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    const result = await post.save();

    res.status(200).json({ message: "Post updated!", post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log(err);
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("Could not find post with this id!");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.userId);

    user.posts.pull(postId); //provided by mongoose, removes an item from array
    await user.save();

    res.status(200).json({ message: "Deleted Succesfully!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log(err);
    next(err);
  }
};

exports.getStatus = async (req, res, next) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("Could not find user with this id!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Found status", user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log(err);
    next(err);
  }
};

exports.editStatus = async (req, res, next) => {
  const userId = req.userId;
  const status = req.body.status;

  if (!status) {
    const error = new Error("Empty status input!");
    error.statusCode(401);
    throw error;
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Could not find user with this id!");
      error.statusCode = 404;
      throw error;
    }
    user.status = status;
    await user.save();

    res.status(200).json({ message: "succesfully updated status!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log(err);
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
