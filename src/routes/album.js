const express = require('express');
const albumController = require('../controllers/artist');

const router = express.Router();

router.post('/:artistId/album', albumController.create);

module.exports = router;