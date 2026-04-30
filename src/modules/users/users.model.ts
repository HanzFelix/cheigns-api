import { db } from '../../utils/database';
import { users } from './users.schema';
import { and, eq } from 'drizzle-orm';

export function getUser(u: { username: string; password: string }) {
	return db
		.select({ id: users.id, username: users.username })
		.from(users)
		.where(and(eq(users.username, u.username), eq(users.password, u.password)));
}

export function createUser(u: { username: string; email: string; password: string }) {
	return db.insert(users).values(u);
}
