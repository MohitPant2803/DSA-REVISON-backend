import { Router } from 'express';
import { createPlaylist, getPlaylists, getPlaylistById, deletePlaylist, addPlacard, removePlacard } from '../controllers/playlist.controller';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect); // Ensure user is authenticated

router.post('/create', createPlaylist);
router.get('/', getPlaylists);
router.get('/:id', getPlaylistById);
router.delete('/:id', deletePlaylist);
router.post('/add', addPlacard);
router.post('/remove', removePlacard);

export default router;