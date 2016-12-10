import * as Rx from 'rx';
import * as MVI from './libs/app';
import {
	makeReactDOMDriver,
	ReactDriver,
	ReactSink,
	ReactSource,
	ReactDriverDefinition
} from './libs/drivers/ReactDriver';
import {
	makeFetchDriver,
	FetchDriver,
	FetchSink,
	FetchSource,
	FetchDriverDefinition
} from './libs/drivers/FetchDriver';

// app
import { view } from './view';
import { model } from './model';
import { intents, Intents } from './intent';

type Sources = ReactSource & FetchSource;

function generateRequest(term$: Rx.Observable<String>) {
	return term$.map((term) => ({
		url: `http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${term}&origin=localhost&origin=*`	
	}));
}

function main({ fetch }: Sources): ReactSink & FetchSink {
	const responses$ = fetch;
	const actions: Intents = intents(responses$);
	const { view$, events } = view(model(actions));
	return {
		reactDOM: view$,
		fetch: generateRequest(actions.searchRequest$),
	};
}

type Drivers = ReactDriverDefinition & FetchDriverDefinition;

const drivers: Drivers = {
	reactDOM: makeReactDOMDriver(document.getElementById('app')),
	fetch: makeFetchDriver(),
};

const { run } = MVI.App(main, drivers);
run();
