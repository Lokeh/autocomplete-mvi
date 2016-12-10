import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Component } from '../types/Component';
import { ViewDelta } from '../types/Delta';
import { Sinks, Sources, SourceDefinition, Drivers, Driver, DisposeFn } from '../framework';


export interface ReactSink extends Sinks {
	reactDOM: Rx.Observable<ViewDelta<any>>;
};

export interface ReactSourceDefinition extends SourceDefinition {
	source: Rx.Observable<void>,
	dispose: DisposeFn,
}

export interface ReactSource {
	reactDOM: Rx.Observable<void>,
};

export interface ReactDriver extends Driver {
	(sinks: ReactSink): ReactSourceDefinition;
};

export interface ReactDriverDefinition extends Drivers {
	reactDOM: ReactDriver,
};

export function makeReactDOMDriver(DOMNode: Element): ReactDriver {
	console.log('[ReactDriver] initiated');
	return (sinkProxies: ReactSink) => {
		console.log('[ReactDriver] rendering started');
		const proxy = sinkProxies.reactDOM;
		// proxy.subscribe((v) => console.log(v));
		const source = proxy.map(({ View, state }) => {
			console.log('[ReactDriver] rendering');
			ReactDOM.render(<View {...state} />, DOMNode);
		});
		const subscription = source.subscribe();
		const dispose = () => subscription.dispose();
		return {
			source,
			dispose,	
		};
	};
}

// connectedView :: View -> Observable<State> -> Observable<{View, State}>
export function connectedView<P, E>(View: Component, events: E): (model: Rx.Observable<P>) => any {
	return function connectViewTo(model: Rx.Observable<P>): any {
		return {
			view$: model.map((state: P): ViewDelta<P> => ({ View, state })),
			events,
		};
	};
}
