import { Router } from 'express';
import {
  createFolderHandler,
  getFoldersHandler,
  getFolderByIdHandler,
  updateFolderHandler,
  deleteFolderHandler,
  reorderFolderCardsHandler,
} from '../controllers/folderController';
import { validate } from '../middleware/validate';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  createFolderSchema,
  updateFolderSchema,
  folderIdParamSchema,
  queryFoldersSchema,
} from '../validators/folder.validator';

const router = Router();

router
  .route('/')
  .get(validate(queryFoldersSchema), getFoldersHandler)
  .post(
    protect,
    authorize('admin', 'superadmin'),
    validate(createFolderSchema),
    createFolderHandler
  );

router
  .route('/:id')
  .get(validate(folderIdParamSchema), getFolderByIdHandler)
  .put(
    protect,
    authorize('admin', 'superadmin'),
    validate(updateFolderSchema),
    updateFolderHandler
  )
  .delete(
    protect,
    authorize('admin', 'superadmin'),
    validate(folderIdParamSchema),
    deleteFolderHandler
  );

router
  .route('/:id/reorder')
  .put(
    protect,
    authorize('admin', 'superadmin'),
    reorderFolderCardsHandler
  );

export default router;
