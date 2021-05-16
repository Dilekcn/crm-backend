var express = require('express');
var router = express.Router();

const companyDescriptionControllers = require("../controllers/companyDescription.controllers")

router.get("/company",companyDescriptionControllers.getAll)
router.get("/company/:id",companyDescriptionControllers.getSingleCompanyDescription)
router.get("/company/title/:title",companyDescriptionControllers.getCompanyDescriptionByTitle)
router.post("/company",companyDescriptionControllers.create)
router.put("/company/:id", companyDescriptionControllers.updateCompanyDescription)
router.delete("/company/:id", companyDescriptionControllers.removeSingleCompanyDescription)

module.exports = router