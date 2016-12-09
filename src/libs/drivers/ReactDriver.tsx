import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Component } from '../types/Component';
import { ViewDelta } from '../types/Delta';
import { Sinks, Sink, Source, Driver, DisposeFn } from '../app';


export interface ReactSink extends Sinks {
	react: Sink<ViewDelta<any>>;
};

export interface ReactSource extends Source {
	source: Rx.Observable<void>,
	dispose: DisposeFn,
}

export interface ReactDriver extends Driver {
	render: (sinks: ReactSink) => ReactSource;
};

export function makeReactDriver(DOMNode: Element): ReactDriver {
	console.log('[ReactDriver] initiated');
	return {
		render: (sinkProxies) => {
			console.log('[ReactDriver] rendering started');
			const proxy = sinkProxies.react;
			console.log('[ReactDriver]', proxy);
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
		},
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
