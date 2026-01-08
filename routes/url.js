const express = require('express');
const router = express.Router();
const{handleGenerateNewShorturl,handlegetAnalytics} = require('../controllers/url')

router.post('/',handleGenerateNewShorturl);

router.get('/analytics/:shortId',handlegetAnalytics)

module.exports = router;