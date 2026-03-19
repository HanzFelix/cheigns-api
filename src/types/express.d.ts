import { TSelectUser } from '../modules/users/users.schema';

declare global {
	namespace Express {
		interface Request {
			user?: TSelectUser; // Optional for public routes
		}
	}
}
