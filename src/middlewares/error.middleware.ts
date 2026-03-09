import type { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/exception';

function errorMiddleware(err: HttpException, req: Request, res: Response, next: NextFunction) {
	if (!err.statusCode) {
		res.status(500).send({ success: false, message: 'Internal server error.' });
	} else {
		res.status(err.statusCode).send({ success: false, message: err.message });
	}
	console.error(err.message);
}

export default errorMiddleware;
