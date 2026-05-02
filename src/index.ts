/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { httpServerHandler } from 'cloudflare:node';
import express, { Request, Response, Router } from 'express';
import chainsRouter from './modules/chains/chains.routes';
import usersRouter from './modules/users/users.routes';
import linksRouter from './modules/links/links.routes';
import errorMiddleware from './middlewares/error.middleware';
import { authMiddleware } from './middlewares/auth.middleware';

const app = express();

// Middleware to parse JSON bodies, .use()
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
	res.json({ message: 'Express.js running on Cloudflare Workers' });
});

// routes
app.use('/auth', usersRouter);
app.use('/chains', chainsRouter);
app.use('/chains/:chainHash/links', linksRouter);

// global error handling
app.use(errorMiddleware);

app.listen(3000);

// integrates Express with the Workers runtime
export default httpServerHandler({ port: 3000 });
