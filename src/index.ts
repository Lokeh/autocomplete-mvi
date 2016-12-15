import * as Rx from 'rxjs/Rx';
import * as MVI from './libs/framework';
import * as RD from './libs/drivers/ReactDriver';
import * as FD from './libs/drivers/FetchDriver';
import { Component, StatelessComponent, ComponentClass } from 'react';

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

/*
	ComboBox:
		- should take in an `onValueChange` prop to use to emit input change
		- should render itself
		- should be usable in any React project
*/

// interface ComboBoxProps {
// 	onValueChange: (value: string) => any;
// };

// interface ComboBoxState {};

// class ComboBox extends Component<ComboBoxProps, ComboBoxState> {
// 	component: ComponentClass<ComboBoxProps> | StatelessComponent<ComboBoxState> | string;
// 	constructor() {
// 		super();
// 		this.state = {};
// 	}

// 	componentWillMount() {
// 		const response$ = new Rx.Subject();
// 		const { view$, events } = view(model(intents(response$)));
// 		view$.subscribe(({ View, state }) => {
// 			this.setState(state);
// 			if (!this.component) {
// 				this.component = View;
// 			}
// 		});
// 	}

// 	render() {
// 		const ComboBoxView = this.component;
// 		return (
// 			<ComboBoxView {...this.state} />
// 		)
// 	}
// }
