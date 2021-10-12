var express = require('express');
var router = express.Router();

const blogsControllers = require('../controllers/blogs.controllers');

router.get('/blogs', blogsControllers.getAll);
router.get('/blogs/:id', blogsControllers.getSingleBlog);
router.get('/blogs/user/:userid', blogsControllers.getBlogsByUserId);
router.post('/blogs/filter', blogsControllers.getWithQuery);
router.post('/blogs/search', blogsControllers.searchBlogs);
router.post('/blogs', blogsControllers.create);
router.put('/blogs/:id', blogsControllers.updateBlog);
router.delete('/blogs/:id', blogsControllers.removeSingleBlog);

module.exports = router;
  