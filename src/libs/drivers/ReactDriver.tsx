import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ViewDelta } from '../types/Delta';
import { Sinks, Source } from '../run';

export interface ReactSource extends Sinks {
	react: Source<ViewDelta<any>>;
};

export interface ReactDriver {
	(sinks: ReactSource): void;
};

export function makeReactDriver(DOMNode: Element): ReactDriver {
	return (sinks) => {
		const source = sinks.react;
		source.subscribe(({ View, state }): void => {
			ReactDOM.render(<View {...state} />, DOMNode);
		});
	}
}
