import { Router } from 'express';
import {
  createRevisionCardHandler,
  getRevisionCardsHandler,
  getRevisionCardByIdHandler,
  getCardsByFolderHandler,
  updateRevisionCardHandler,
  deleteRevisionCardHandler,
  getRevisionCardsByIdsHandler,
} from '../controllers/revisionController';
import { validate } from '../middleware/validate';
import { protect, authorize, optionalProtect } from '../middleware/authMiddleware';
import {
  createRevisionCardSchema,
  updateRevisionCardSchema,
  queryRevisionCardsSchema,
  revisionCardIdParamSchema,
  folderCardsQuerySchema,
} from '../validators/revisionCard.validator';

const router = Router();

router
  .route('/')
  .post(protect, authorize('admin', 'superadmin'), validate(createRevisionCardSchema), createRevisionCardHandler)
  .get(optionalProtect, validate(queryRevisionCardsSchema), getRevisionCardsHandler);

router.post('/batch', optionalProtect, getRevisionCardsByIdsHandler);

router.get('/folder/:folderId', optionalProtect, validate(folderCardsQuerySchema), getCardsByFolderHandler);

router
  .route('/:id')
  .get(optionalProtect, validate(revisionCardIdParamSchema), getRevisionCardByIdHandler)
  .put(protect, authorize('admin', 'superadmin'), validate(updateRevisionCardSchema), updateRevisionCardHandler)
  .delete(
    protect,
    authorize('admin', 'superadmin'),
    validate(revisionCardIdParamSchema),
    deleteRevisionCardHandler
  );

export default router;
