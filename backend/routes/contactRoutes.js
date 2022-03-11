const express = require('express');
const router = express.Router();

const { contactForm } = require('../controllers/contactController');
const validation = require('../middleware/validatorMiddleware');
const { contactSchema } = require('../middleware/validators/contactValidation');

router.route('/').post(contactSchema, validation, contactForm);

module.exports = router;
