const express = require('express');
const artistsController = require ('../controllers/artists');
const albumsController = require('../controllers/albums');

const router = express.Router();

router.post('/', artistsController.create);
router.get('/', artistsController.read);
router.get('/:artistId', artistsController.readById);
router.patch('/:artistId', artistsController.update);
router.delete('/:artistId', artistsController.destroy);

router.post('/:artistId/albums', albumsController.create);
router.get('/:artistId/albums', albumsController.read);
router.get('/:artistId/albums/:albumId', albumsController.readById);
router.patch('/:artistId/albums/:albumId', albumsController.update);
router.delete('/:artistId/albums/:albumId', albumsController.destroy);

module.exports = router;