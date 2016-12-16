import * as Rx from 'rxjs/Rx';
import * as MVI from 'cactus/core';
import * as React from 'cactus/drivers/react';
import * as Fetch from 'cactus/drivers/fetch';
import * as Events from 'cactus/drivers/events';
import { selectable } from 'cactus/events';
// import { createAppComponent } from 'cactus/createAppComponent';

// app
import { view, ViewEvents } from './view';
import { model } from './model';
import { intents } from './intent';

type Sources = React.RenderSource & Fetch.FetchSource & Events.EventSource;
type Drivers = React.RenderDriverDefinition & Fetch.FetchDriverDefinition & Events.EventDriverDefinition;
type Sinks = React.RenderSink & Fetch.FetchSink & Events.EventSink;

function generateRequest(term$: Rx.Observable<String>) {
	return term$
		.filter((term) => term !== "")
		.map((term) => ({
			url: `http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${term}&origin=localhost&origin=*`	
		}));
}

function main(sources: Sources): Sinks {
	const events = selectable(sources.events);
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
	render: React.makeReactDOMDriver(document.getElementById('app')),
	fetch: Fetch.makeJSONDriver(),
	events: Events.makeEventDriver(),
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
