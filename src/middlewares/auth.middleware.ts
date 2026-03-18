import type { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { HttpException } from '../exceptions/exception';
import { errorResponse } from '../utils/response';
import { env } from 'cloudflare:workers';
import { TSelectUser } from '../modules/users/users.schema';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
	// Get token from Authorization header
	const [scheme, token] = req.header('Authorization')?.split(' ', 2) ?? [,];

	if (!token || scheme != 'Bearer') {
		return errorResponse(res, 'Invalid token provided. Authorization denied.', 401);
	}

	try {
		req.user = jwt.verify(token, env.JWT_SECRET) as TSelectUser;
		next();
	} catch (err: unknown) {
		return errorResponse(res, 'Not allowed to perform this action. Log in to continue', 403);
	}
}

export async function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
	// Get token from Authorization header
	const [scheme, token] = req.header('Authorization')?.split(' ', 2) ?? [,];

	if (token && scheme == 'Bearer') {
		try {
			req.user = jwt.verify(token, env.JWT_SECRET) as TSelectUser;
		} catch (err: unknown) {}
	}

	next();
}
