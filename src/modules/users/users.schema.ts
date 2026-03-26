import { sql } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: int().primaryKey({ autoIncrement: true }),
	username: text().notNull().unique(),
	email: text().notNull().unique(),
	password: text(),
	createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
});

export type TSelectUser = Omit<typeof users.$inferSelect, 'createdAt' | 'password'>;
