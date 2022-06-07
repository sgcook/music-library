const express = require('express');
const artistController = require ('../controllers/artist');
const albumController = require('../controllers/album');

const router = express.Router();

router.post('/', artistController.create);
router.get('/', artistController.read);
router.get('/:artistId', artistController.readById);
router.patch('/:artistId', artistController.update);
router.delete('/:artistId', artistController.destroy);

router.post('/:artistId/album', albumController.create);
router.get('/:artistId/album', albumController.read);
router.get('/:artistId/album/:albumId', albumController.readById);
router.patch('/:artistId/album/:albumId', albumController.update);
router.delete('/:artistId/album/:albumId', albumController.destroy);

module.exports = router;