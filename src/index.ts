import * as Rx from 'rx';
import * as MVI from './libs/framework';
import {
	makeReactDOMDriver,
} from './libs/drivers/ReactDriver';
import {
	makeJSONDriver,
	FetchSource,
} from './libs/drivers/FetchDriver';

// app
import { view } from './view';
import { model } from './model';
import { intents, Intents } from './intent';

function generateRequest(term$: Rx.Observable<String>) {
	return term$.map((term) => ({
		url: `http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${term}&origin=localhost&origin=*`	
	}));
}

function main({ fetch }: FetchSource): MVI.Sinks {
	const responses$ = fetch;
	const actions = intents(responses$);
	const { view$, events } = view(model(actions));
	return {
		reactDOM: view$,
		fetch: generateRequest(actions.searchRequest$),
	};
}

const { run } = MVI.App(main, {
	reactDOM: makeReactDOMDriver(document.getElementById('app')),
	fetch: makeJSONDriver(),
});
run();
