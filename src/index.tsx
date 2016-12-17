import * as Rx from 'rxjs/Rx';
import * as MVI from './libs/framework';
import * as RD from './libs/drivers/ReactDriver';
import * as FD from './libs/drivers/FetchDriver';
import * as ED from './libs/drivers/EventDriver';
import * as React from 'react';
import { render } from 'react-dom';
import { createAppComponent } from './libs/createAppComponent';

// app
import { view, ViewEvents } from './view';
import { model } from './model';
import { intents } from './intent';

type Sources = RD.ReactSource & FD.FetchSource & ED.EventSource;
type Drivers = RD.ReactDriverDefinition & FD.FetchDriverDefinition & ED.EventDriverDefinition;
type Sinks = RD.ReactSink & FD.FetchSink & ED.EventSink;

function generateRequest(term$: Rx.Observable<String>) {
	return term$
		.filter((term) => term !== "")
		.map((term) => ({
			url: `http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${term}&origin=localhost&origin=*`	
		}));
}

function main(sources: Sources): Sinks {
	const events = ED.selectable(sources.events);
	const responses$ = sources.fetch;
	const actions = intents(responses$, events);
	const { view$, events$ } = view(model(actions));
	return {
		render: view$,
		fetch: generateRequest(actions.searchRequest$),
		events: events$,
	};
}

const { run } = MVI.App<Sources, Drivers>(main, {
	render: RD.makeReactDOMDriver(document.getElementById('app')),
	fetch: FD.makeJSONDriver(),
	events: ED.makeEventDriver(),
});
run();

// const drivers: FD.FetchDriverDefinition = {
// 	fetch: FD.makeJSONDriver(),
// }

// interface ComboBoxProps {
// 	onChangeValue: (state: any) => any,
// };

// const ComboBox = createAppComponent<ComboBoxProps>(
// 	main,
// 	drivers,
// 	{
// 		onChangeValue: (state: any) => state.value
// 	},
// 	'ComboBox'
// );

// render(<ComboBox onChangeValue={(v) => console.log(v)} />, document.getElementById('app'));
