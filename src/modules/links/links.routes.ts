import { Router } from 'express';
import * as LinksController from './links.controller';
import { authMiddleware, optionalAuthMiddleware } from '../../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

router.post('/', authMiddleware, LinksController.createLink);
router.get('/', optionalAuthMiddleware, LinksController.getLinks);
router.get('/:linkHash', optionalAuthMiddleware, LinksController.getLink);
router.put('/:linkHash', authMiddleware, LinksController.updateLink);
router.delete('/:linkHash', authMiddleware, LinksController.deleteLink);

export default router;
