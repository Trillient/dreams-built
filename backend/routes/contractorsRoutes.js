const express = require('express');
const router = express.Router();

const validation = require('../middleware/validatorMiddleware');

router.route('/').get().post();
router.route('/:id').put().delete();

module.exports = router;
