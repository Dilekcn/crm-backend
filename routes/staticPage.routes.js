const express = require('express');
const router = express.Router();

const staticPageControllers = require('../controllers/staticPage.controllers');

router.get("/staticPage",staticPageControllers.getAll)
router.get("/staticPage/:id",staticPageControllers.getSinglePage)
router.get("/staticPage/name/:name",staticPageControllers.getSinglePageByName)
router.post("/staticPage",staticPageControllers.createPage)
router.put("/staticPage/:id", staticPageControllers.updatePages)
router.delete("/staticPage/:id", staticPageControllers.removePage)

module.exports = router;