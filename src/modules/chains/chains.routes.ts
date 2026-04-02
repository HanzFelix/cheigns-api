import { Router } from 'express';
import * as ChainsController from './chains.controller';
import { authMiddleware, optionalAuthMiddleware } from '../../middlewares/auth.middleware';

const chainsRouter = Router();

chainsRouter.post('/', authMiddleware, ChainsController.createChain);
chainsRouter.get('/', authMiddleware, ChainsController.getChains);
chainsRouter.get('/:chainHash', optionalAuthMiddleware, ChainsController.getChain);
chainsRouter.put('/:chainHash', ChainsController.updateChain);
chainsRouter.delete('/:chainHash', ChainsController.deleteChain);

export default chainsRouter;
