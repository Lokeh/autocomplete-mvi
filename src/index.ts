import * as Rx from 'rx';
import * as MVI from './libs/framework';
import * as RD from './libs/drivers/ReactDriver';
import * as FD from './libs/drivers/FetchDriver';

// app
import { view } from './view';
import { model } from './model';
import { intents } from './intent';

type Sources = RD.ReactSource & FD.FetchSource;
type Drivers = RD.ReactDriverDefinition & FD.FetchDriverDefinition;
type Sinks = RD.ReactSink & FD.FetchSink;

function generateRequest(term$: Rx.Observable<String>) {
	return term$
		.filter((term) => term !== "")
		.map((term) => ({
			url: `http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${term}&origin=localhost&origin=*`	
		}));
}

function main(sources: Sources): Sinks {
	const responses$ = sources.fetch;
	const actions = intents(responses$);
	const { view$, events } = view(model(actions));
	return {
		reactDOM: view$,
		fetch: generateRequest(actions.searchRequest$),
	};
}

const { run } = MVI.App<Sources, Drivers>(main, {
	reactDOM: RD.makeReactDOMDriver(document.getElementById('app')),
	fetch: FD.makeJSONDriver(),
});
run();
