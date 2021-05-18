const express = require('express')
const router = express.Router()
const footersControllers = require('../controllers/footer.controllers')

router.get('/footers', footersControllers.getAll)
router.post('/footers', footersControllers.createFooter)
router.put('/footers', footersControllers.updateFooterById)
router.delete('/footers', footersControllers.removeFooterById)

module.exports = router