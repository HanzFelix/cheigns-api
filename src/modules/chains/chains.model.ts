import { and, desc, eq, or } from 'drizzle-orm';
import { users } from '../users/users.schema';
import { db } from '../../utils/database';
import { chains, TInsertChain, TUpdateChain } from './chains.schema';

export function insertChain(chain: TInsertChain) {
	return db.insert(chains).values(chain).returning({ id: chains.hash });
}

export function findChainsByUserId(ownerId: number) {
	return db
		.select({ id: chains.hash, title: chains.title, description: chains.description, shared: chains.shared })
		.from(chains)
		.where(eq(chains.ownerId, ownerId))
		.orderBy(desc(chains.createdAt));
}

export function findChainByHash(hash: string, ownerId: number | undefined) {
	return db
		.select({
			title: chains.title,
			description: chains.description,
			username: users.username,
			createdAt: chains.createdAt,
			shared: chains.shared,
		})
		.from(chains)
		.leftJoin(users, eq(users.id, chains.ownerId))
		.where(and(eq(chains.hash, hash), ownerId ? or(chains.shared, eq(chains.ownerId, ownerId)) : chains.shared))
		.limit(1);
}

export function updateChainByHash(c: TUpdateChain) {
	const { hash, ownerId, ...rest } = c;
	return db
		.update(chains)
		.set(rest)
		.where(and(eq(chains.ownerId, ownerId as number), eq(chains.hash, hash)))
		.returning({ title: chains.title, description: chains.description });
}

export function deleteChainByHash(hash: string, ownerId: number) {
	return db
		.delete(chains)
		.where(and(eq(chains.hash, hash), eq(chains.ownerId, ownerId)))
		.returning({ title: chains.title, description: chains.description });
}
