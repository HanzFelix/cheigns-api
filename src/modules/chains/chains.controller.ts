import type { NextFunction, Request, Response } from 'express';
import * as chainService from './chains.service';
import { successResponse } from '../../utils/response';

export async function createChain(req: Request, res: Response, next: NextFunction) {
	try {
		const { title, description } = req.body;

		const hash = await chainService.createChain({ title, description, ownerId: req.user!.id });
		return successResponse(res, { id: hash }, 201);
	} catch (error) {
		next(error);
	}
}

export async function getChains(req: Request, res: Response, next: NextFunction) {
	try {
		const ownerId = req.user!.id;

		const chains = await chainService.getChains(ownerId);
		return successResponse(res, chains);
	} catch (error) {
		next(error);
	}
}

export async function getChain(req: Request, res: Response, next: NextFunction) {
	try {
		const hash = req.params['chainHash'] as string;
		const ownerId = req.user?.id;

		const chain = await chainService.getChain(hash, ownerId);

		return successResponse(res, chain);
	} catch (error) {
		next(error);
	}
}

export async function updateChain(req: Request, res: Response, next: NextFunction) {
	try {
		const ownerId = req.user!.id;
		const hash = req.params['chainHash'] as string;
		const { title, description, shared } = req.body;

		const result = await chainService.updateChain({ hash, title, description, ownerId, shared });

		return successResponse(res, result);
	} catch (error) {
		next(error);
	}
}

export async function deleteChain(req: Request, res: Response, next: NextFunction) {
	try {
		const ownerId = req.user!.id;
		const hash = req.params['chainHash'] as string;

		const result = await chainService.deleteChain(hash, ownerId);

		return successResponse(res, result);
	} catch (error) {
		next(error);
	}
}
