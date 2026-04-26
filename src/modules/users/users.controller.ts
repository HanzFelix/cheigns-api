import type { NextFunction, Request, Response } from 'express';
import * as userService from './users.service';
import { successResponse } from '../../utils/response';

export async function loginUser(req: Request, res: Response, next: NextFunction) {
	try {
		const { username, password } = req.body;

		const token_and_user = await userService.loginUser({ username, password });
		return successResponse(res, token_and_user);
	} catch (error) {
		next(error);
	}
}

export async function registerUser(req: Request, res: Response, next: NextFunction) {
	try {
		const { email, username, password } = req.body;
		const id_and_username = await userService.registerUser({ email, username, password });

		return successResponse(res, id_and_username, 201);
	} catch (error) {
		next(error);
	}
}
