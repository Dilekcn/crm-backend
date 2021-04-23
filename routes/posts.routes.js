var express = require('express');
var router = express.Router();

const postsControllers = require("../controllers/posts.controllers")

router.get("/posts",postsControllers.getAll)
router.get("/posts/:postid",postsControllers.getSinglePost)
router.get("/posts/title/:titlename",postsControllers.getSinglePostByTitle)
router.post("/posts",postsControllers.create)
router.put("/posts/:postid", postsControllers.updatePost)
router.delete("/posts/:postid", postsControllers.removeSinglePost)

module.exports = router