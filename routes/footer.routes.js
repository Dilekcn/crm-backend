const express = require('express')
const router = express.Router()
const footersControllers = require('../controllers/footer.controllers')

router.get('/footers', footersControllers.getAll)
router.get('/footers/:id', footersControllers.getSingleFooterById)
router.post('/footers', footersControllers.createFooter)
router.put('/footers/:id', footersControllers.updateFooterById)
router.delete('/footers/:id', footersControllers.removeFooterById)

module.exports = router