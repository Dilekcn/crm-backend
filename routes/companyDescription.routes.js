var express = require('express');
var router = express.Router();

const companyDescriptionControllers = require('../controllers/companyDescription.controllers');

router.get("/companydescription",companyDescriptionControllers.getAll)
router.get("/companydescription/:id",companyDescriptionControllers.getSingleCompanyDescription)
router.get("/companydescription/title/:title",companyDescriptionControllers.getCompanyDescriptionByTitle)
router.get("/companydescription/author/:author",companyDescriptionControllers.getCompanyDescriptionByAuthor)
router.post("/companydescription",companyDescriptionControllers.create)
// router.put("/companydescription/:id", companyDescriptionControllers.updateCompanyDescription)
router.delete("/companydescription/:id", companyDescriptionControllers.removeSingleCompanyDescription)

module.exports = router 
