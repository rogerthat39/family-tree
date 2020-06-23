import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import json from 'body-parser';

const { PORT, NODE_ENV } = process.env;

polka()
	.use(json())
	.use(
		compression({ threshold: 0 }),
		sirv('static'),
		sapper.middleware({
			//store session
			session: () => ({
				user: null
			})
		})
	)
	.listen(80, err => {
		if (err) console.log('error', err);
	});
