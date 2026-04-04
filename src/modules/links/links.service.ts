import { HttpException } from '../../exceptions/exception';
import { TInsertLink, TUpdateLink } from './links.schema';
import { deleteLinkByHash, findLinkByLinkHash, findLinksByChainHash, insertLink, updateLinkByHash } from './links.model';
import { numToBase62Hash } from '../../utils/hash';

export async function createLink(chainHash: string, userId: number, l: Omit<TInsertLink, 'hash' | 'chainId'>) {
	if (!l.url) {
		throw new HttpException('URL is required', 400);
	}

	l.title ||= l.url;
	l.description ||= '';
	l.imgUrl ||= '';

	const hash = await numToBase62Hash(Date.now());

	const linkHash = await insertLink(chainHash, userId, { hash, ...l });

	if (!linkHash) {
		throw new HttpException('Failed to create link', 500);
	}

	return linkHash[0];
}

export async function getLinks(chainHash: string, ownerId: number | undefined) {
	const results = await findLinksByChainHash(chainHash, ownerId);

	return results;
}

export async function getLink(linkHash: string, ownerId: number | undefined) {
	const results = await findLinkByLinkHash(linkHash, ownerId);

	if (results.length === 0) {
		throw new HttpException('Link not found.', 404);
	}

	return results[0];
}

export async function updateLink(ownerId: number, l: Omit<TUpdateLink, 'chainId'>) {
	if (!l.hash || !ownerId) {
		throw new HttpException('Missing required field', 400);
	}

	if (!(l.title || l.description || l.url || l.imgUrl)) {
		throw new HttpException('No field to update', 400);
	}

	const results = await updateLinkByHash(ownerId, l);

	if (!results || results.length < 1) throw new HttpException('Failed to update link', 400);

	return results;
}

export async function deleteLink(linkHash: string, ownerId: number) {
	if (!linkHash || !ownerId) {
		throw new HttpException('Missing required field', 400);
	}

	const results = await deleteLinkByHash(linkHash, ownerId);

	if (!results || results.length < 1) throw new HttpException('Failed to delete link', 400);

	return results;
}
