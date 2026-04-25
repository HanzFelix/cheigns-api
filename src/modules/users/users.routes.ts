import { Request, Response, Router } from 'express';
import * as UsersController from './users.controller';

const router = Router();

router.post('/login', UsersController.loginUser);
router.post('/register', UsersController.registerUser);

export default router;
