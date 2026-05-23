import { Router } from 'express';
import { createPlaylist, getPlaylists, getPlaylistById, deletePlaylist, addPlacard, removePlacard, updatePlaylist, duplicatePlaylist } from '../controllers/playlist.controller';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect); // Ensure user is authenticated

router.post('/create', createPlaylist);
router.get('/', getPlaylists);
router.get('/:id', getPlaylistById);
router.delete('/:id', deletePlaylist);
router.put('/:id', updatePlaylist);
router.post('/:id/duplicate', duplicatePlaylist);
router.post('/add', addPlacard);
router.post('/remove', removePlacard);
router.post('/:id/reorder', require('../controllers/playlist.controller').reorderPlaylist);

export default router;