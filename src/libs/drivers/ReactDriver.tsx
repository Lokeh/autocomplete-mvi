import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ViewDelta } from '../types/Delta';
import { Sinks, Sink, Driver } from '../run';

export interface ReactSink extends Sinks {
	react: Sink<ViewDelta<any>>;
};

export interface ReactDriver extends Driver {
	render: (sinks: ReactSink) => void;
};

export function makeReactDriver(DOMNode: Element): ReactDriver {
	return {
		render: (sinks): void => {
			const source = sinks.react;
			source.subscribe(({ View, state }): void => {
				ReactDOM.render(<View {...state} />, DOMNode);
			});
		},
	};
}
