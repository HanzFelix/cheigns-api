import type { NextFunction, Request, Response } from 'express';
import * as linkService from './links.service';
import { successResponse } from '../../utils/response';

export async function createLink(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = req.user!.id;
		const chainHash = req.params['chainHash'] as string;
		const { title, description, url, imgUrl } = req.body;

		const linkHash = await linkService.createLink(chainHash, userId, { title, description, url, imgUrl });
		return successResponse(res, linkHash, 201);
	} catch (error) {
		next(error);
	}
}

export async function getLinks(req: Request, res: Response, next: NextFunction) {
	try {
		const hash = req.params['chainHash'] as string;
		const userId = req.user?.id;

		const links = await linkService.getLinks(hash, userId);

		return successResponse(res, links);
	} catch (error) {
		next(error);
	}
}

export async function getLink(req: Request, res: Response, next: NextFunction) {
	try {
		const hash = req.params['linkHash'] as string;
		const userId = req.user?.id;

		const link = await linkService.getLink(hash, userId);

		return successResponse(res, link);
	} catch (error) {
		next(error);
	}
}

export async function updateLink(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = req.user!.id;
		const hash = req.params['linkHash'] as string;
		const { title, description, url, imgUrl } = req.body;

		const result = await linkService.updateLink(userId, { hash, title, description, url, imgUrl });

		return successResponse(res, result);
	} catch (error) {
		next(error);
	}
}

export async function deleteLink(req: Request, res: Response, next: NextFunction) {
	try {
		const ownerId = req.user!.id;
		const hash = req.params['linkHash'] as string;
		console.log(hash, ownerId);

		const result = await linkService.deleteLink(hash, ownerId);

		return successResponse(res, result);
	} catch (error) {
		next(error);
	}
}
