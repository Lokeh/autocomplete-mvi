import * as Rx from 'rx';
import * as MVI from './libs/run';
import { makeReactDriver } from './libs/drivers/ReactDriver';

// app
import { view } from './view';
import { model } from './model';
import { intent } from './intent';

function main() {
	return {
		react: view(model(intent)),
	};
}

const drivers: MVI.Drivers = {
	react: makeReactDriver(document.getElementById('app')),
};

MVI.run(main, drivers);
