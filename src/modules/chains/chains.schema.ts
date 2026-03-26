import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from '../users/users.schema';
import { sql } from 'drizzle-orm';

export const chains = sqliteTable('chains', {
	id: int().primaryKey({ autoIncrement: true }),
	ownerId: int()
		.notNull()
		.references(() => users.id, { onDelete: 'set null' }),
	hash: text().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	shared: int().default(0),
	createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
});

export type TInsertChain = Pick<typeof chains.$inferInsert, 'hash' | 'title' | 'description' | 'ownerId'>;

export type TUpdateChain = Required<Pick<typeof chains.$inferInsert, 'hash' | 'ownerId'>> &
	Partial<Pick<typeof chains.$inferInsert, 'title' | 'description' | 'shared'>>;
