import * as Rx from 'rx';
import * as MVI from './libs/app';
import { makeReactDriver } from './libs/drivers/ReactDriver';
import { makeFetchDriver } from './libs/drivers/FetchDriver';

// app
import { view } from './view';
import { model } from './model';
import { intent } from './intent';

function main(sources: MVI.Sources) {
	console.log('[main]', sources);
	const { view$, events } = view(model(intent));
	return {
		react: view$,
	};
}

const drivers: MVI.Drivers = {
	react: makeReactDriver(document.getElementById('app')),
	fetch: makeFetchDriver(),
};

const { run } = MVI.App(main, drivers);
run();
