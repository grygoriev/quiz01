const express = require('express');

const router = express.Router({ mergeParams: true });

router.use('/questions', require('./question'));

module.exports = router;
