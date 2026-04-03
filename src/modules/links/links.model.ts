import { and, eq, or, sql } from 'drizzle-orm';
import { db } from '../../utils/database';
import { links, TInsertLink, TUpdateLink } from './links.schema';
import { chains } from '../chains/chains.schema';

export function insertLink(chainHash: string, userId: number, link: TInsertLink) {
	const chain = db.$with('chain').as(
		db
			.select({ id: chains.id })
			.from(chains)
			.where(and(eq(chains.hash, chainHash), eq(chains.ownerId, userId)))
			.limit(1),
	);
	return db
		.with(chain)
		.insert(links)
		.values({ chainId: sql`(select id from ${chain})`, ...link })
		.returning({ id: links.hash });
}

export async function findLinksByChainHash(chainHash: string, ownerId: number | undefined) {
	return db
		.select({ id: links.hash, title: links.title, description: links.description, url: links.url, imgUrl: links.imgUrl })
		.from(links)
		.leftJoin(chains, eq(chains.id, links.chainId))
		.where(and(eq(chains.hash, chainHash), ownerId ? or(chains.shared, eq(chains.ownerId, ownerId)) : chains.shared));
}

export async function findLinkByLinkHash(linkHash: string, ownerId: number | undefined) {
	return db
		.select({ id: links.hash, title: links.title, description: links.description, url: links.url, imgUrl: links.imgUrl })
		.from(links)
		.leftJoin(chains, eq(chains.id, links.chainId))
		.where(and(eq(links.hash, linkHash), ownerId ? or(chains.shared, eq(chains.ownerId, ownerId)) : chains.shared))
		.limit(1);
}

export async function updateLinkByHash(ownerId: number, l: TUpdateLink) {
	const { hash, ...rest } = l;
	return db
		.update(links)
		.set(rest)
		.from(chains)
		.where(and(eq(chains.ownerId, ownerId as number), eq(links.hash, hash), eq(links.chainId, chains.id)))
		.returning({
			id: links.hash,
			title: links.title,
			description: links.description,
			url: links.url,
			imgUrl: links.imgUrl,
		});
}

export async function deleteLinkByHash(linkHash: string, ownerId: number) {
	console.log(linkHash, ownerId);
	const filteredLink = db.$with('filteredLink').as(
		db
			.select({ id: links.id })
			.from(links)
			.innerJoin(chains, eq(chains.id, links.chainId))
			.where(and(eq(links.hash, linkHash), eq(chains.ownerId, ownerId)))
			.limit(1),
	);
	return db
		.with(filteredLink)
		.delete(links)
		.where(eq(links.id, sql`(select id from ${filteredLink})`))
		.returning({
			id: links.hash,
			title: links.title,
			description: links.description,
			url: links.url,
			imgUrl: links.imgUrl,
		});
}
