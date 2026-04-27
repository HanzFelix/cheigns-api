import { HttpException } from '../../exceptions/exception';
import { env } from 'cloudflare:workers';
import jwt from 'jsonwebtoken';
import { createUser, getUser } from './users.model';

export async function loginUser(u: { username: string; password: string }) {
	const { username, password } = u;

	if (!username || !password) {
		throw new HttpException('Username and password are required', 400);
	}

	const results = await getUser(u);

	// user not found
	if (results.length == 0) {
		throw new HttpException('incorrect username and/or password', 400);
	}

	const token = jwt.sign(results[0], env.JWT_SECRET, { expiresIn: '15m' });

	return { token: token, user: results[0] };
}

export async function registerUser(u: { email: string; username: string; password: string }) {
	const { email, username, password } = u;

	// Validate input
	if (!username || !email || !password) {
		throw new HttpException('Username, email and password are required', 400);
	}

	// Basic email validation (simplified for showcase purposes)
	// For production, consider using a validation library or more comprehensive checks
	if (!email.includes('@') || !email.includes('.')) {
		throw new HttpException('Invalid email format', 400);
	}

	const result = await createUser({ username, email, password });

	if (result.success) {
		return { id: result.meta.last_row_id, username };
	} else {
		throw new HttpException('Failed to create user', 500);
	}
}
