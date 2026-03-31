import { deleteChainByHash, findChainByHash, findChainsByUserId, insertChain, updateChainByHash } from './chains.model';
import { numToBase62Hash } from '../../utils/hash';
import { HttpException } from '../../exceptions/exception';
import { TInsertChain, TUpdateChain } from './chains.schema';

export async function createChain(c: Omit<TInsertChain, 'hash'>) {
	const { title, description = '', ownerId } = c;

	if (!title) {
		throw new HttpException('Title is required', 400);
	}

	const hash = await insertChain({ title, description, hash: await numToBase62Hash(Date.now()), ownerId });

	if (!hash) {
		throw new HttpException('Failed to create chain', 500);
	}

	return hash;
}
export async function getChains(userId: number) {
	return await findChainsByUserId(userId);
}

export async function getChain(hash: string, ownerId: number | undefined) {
	const results = await findChainByHash(hash, ownerId);

	if (results.length === 0) {
		throw new HttpException('Chain not found.', 404);
	}

	return results[0];
}

export async function updateChain(c: TUpdateChain) {
	if (!c.hash || !c.ownerId) {
		throw new HttpException('Missing required field', 400);
	}

	if (!(c.title || c.description) && c.shared == null) {
		throw new HttpException('No field to update', 400);
	}

	const result = await updateChainByHash(c);

	if (!result) throw new HttpException('Failed to update chain', 400);

	return result;
}

export async function deleteChain(hash: string, ownerId: number) {
	if (!hash || !ownerId) {
		throw new HttpException('Missing required field', 400);
	}

	const result = await deleteChainByHash(hash, ownerId);

	if (!result) throw new HttpException('Failed to delete chain', 400);

	return result;
}
