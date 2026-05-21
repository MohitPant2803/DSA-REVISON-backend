import { Router } from 'express';
import {
  createRevisionCardHandler,
  getRevisionCardsHandler,
  getRevisionCardByIdHandler,
  getCardsByFolderHandler,
  updateRevisionCardHandler,
  deleteRevisionCardHandler,
} from '../controllers/revisionController';
import { validate } from '../middleware/validate';
import { protect, authorize } from '../middleware/authMiddleware';
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
  .get(validate(queryRevisionCardsSchema), getRevisionCardsHandler);

router.get('/folder/:folderId', validate(folderCardsQuerySchema), getCardsByFolderHandler);

router
  .route('/:id')
  .get(validate(revisionCardIdParamSchema), getRevisionCardByIdHandler)
  .put(protect, authorize('admin', 'superadmin'), validate(updateRevisionCardSchema), updateRevisionCardHandler)
  .delete(
    protect,
    authorize('admin', 'superadmin'),
    validate(revisionCardIdParamSchema),
    deleteRevisionCardHandler
  );

export default router;
