import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { chains } from '../chains/chains.schema';
import { sql } from 'drizzle-orm';

export const links = sqliteTable('links', {
	id: int().primaryKey({ autoIncrement: true }),
	chainId: int()
		.notNull()
		.references(() => chains.id, { onDelete: 'cascade' }),
	hash: text().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	url: text().notNull(),
	imgUrl: text().notNull(),
	createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
});

export type TInsertLink = Pick<typeof links.$inferInsert, 'hash' | 'title' | 'description' | 'url' | 'imgUrl'>;

export type TUpdateLink = Required<Pick<typeof links.$inferInsert, 'hash'>> &
	Partial<Pick<typeof links.$inferInsert, 'title' | 'description' | 'url' | 'imgUrl'>>;
