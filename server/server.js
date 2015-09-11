/* eslint-disable no-console, no-use-before-define */

import path from 'path';
import Express from 'express';
import qs from 'qs';

import Router from 'react-router';
import Location from 'react-router/lib/Location'

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import configureStore from '../common/store/configureStore';
import HtmlDocument from './HtmlDocument';

// import App from '../common/containers/App';
// import { fetchCounter } from '../common/api/counter';

// import cors from 'cors';

const app = new Express();
const port = 3000;

// server static files webpack builds into dist
app.use(require('serve-static')(path.join(__dirname, '../dist')));

app.get('*', (req, res, next) => {
	console.log(req.url);
	const store = configureStore();
	const location = new Location(req.path, req.query);
	const state = store.getState();

	Router.run(routes, location, (error, initialState, transition) => {
		if (err) return next(err);

		if (transition.isCancelled) {
			if (transition.redirectInfo) {
				return req.redirect(transition.redirectInfo.pathname);
			} else {
				return next(transition.abortReason);
			}
		}

		let markup = React.renderToString(
			<Provider store={store}>
				{ () => <Router {...initialState} /> }
			</Provider>
		);

		let html = React.renderToStaticMarkup(
			<HtmlDocument store={store} markup={markup} />
		);

		res.status(200);
		res.send('<!doctype html>' + html);
	});
});


// this is fired every time the server receives a request
// app.use(handleRender);

// function handleRender(req, res) {
	// fetchCounter(apiResult => {
	// 	const params = qs.parse(req.query);
	// 	const counter = parseInt(params.counter, 10) || apiResult || 0;
	// });

	// const initialState = { counter: 10 };
	// const store = configureStore(initialState);

	// const html = React.renderToString(
	// 	<Provider store={store}>
	// 		{ () => <App/> }
	// 	</Provider>
	// );
// 	const finalState = store.getState();

// 	res.send(renderFullPage(html, finalState));
// }

// function renderFullPage(html, initialState) {
// 	console.log(initialState);
// 	return `
// 		<!doctype html>
// 		<html>
// 			<head>
// 				<title>React Redux Passport Starter</title>
// 			</head>
// 			<body>
// 				<div id="app">${html}</div>
// 				<script>
// 					window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
// 				</script>
// 				<script src="/bundle.js"></script>
// 			</body>
// 		</html>
// 	`;
// }

app.listen(port, (error) => {
	if (error) {
		console.error(error);
	} else {
		console.info(`==> 🌎 Listening on port ${port}. Open up to http://localhost:${port}/ in your browser.`);
	}
})