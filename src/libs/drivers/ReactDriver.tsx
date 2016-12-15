import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Rx from 'rxjs/rx';
import { map } from 'lodash';
import { Component } from '../types/Component';
import { ViewDelta } from '../types/Delta';
import {
	Sinks,
	Sources,
	SourceDefinition,
	Drivers,
	Driver,
	DisposeFn,
	App,
} from '../framework';


export interface ReactSink extends Sinks {
	render: Rx.Observable<ViewDelta<any>>,
};

export interface ReactSourceDefinition extends SourceDefinition {
	source: Rx.Observable<void>,
	dispose: DisposeFn,
}

export interface ReactSource {
	render: Rx.Observable<void>,
};

export interface ReactDriver extends Driver {
	(sinks: ReactSink): ReactSourceDefinition;
};

export interface ReactDriverDefinition extends Drivers {
	render: ReactDriver,
};

export function makeReactDOMDriver(DOMNode: Element): ReactDriver {
	console.log('[ReactDOMDriver] initiated');
	return (sinkProxies: ReactSink) => {
		console.log('[ReactDOMDriver] rendering started');
		const proxy = sinkProxies.render;
		const source = proxy.map(({ View, state }) => {
			console.log('[ReactDOMDriver] rendering');
			ReactDOM.render(<View {...state} />, DOMNode);
		});
		const subscription = source.subscribe();
		const dispose = () => subscription.unsubscribe();
		return {
			source,
			dispose,	
		};
	};
}

export function makeReactEventDriver() {
	return (sinkProxies: ReactSink) => {
		
	}
}

export function makeReactStateDriver(cb: (v: any) => void): ReactDriver {
	console.log('[ReactStateDriver] initiated');
	return (sinkProxies: ReactSink) => {
		console.log('[ReactStateDriver] state change started');
		const proxy = sinkProxies.render;
		const source = proxy.map(({ View, state }) => {
			console.log('[ReactStateDriver] changing state');
			cb({ View, state });
		});
		const subscription = source.subscribe();
		const dispose = () => subscription.unsubscribe();
		return {
			source,
			dispose,
		};
	};
}

interface Events {
	[K: string]: Rx.Observable<any>
};

type EventDefinition = {
	category: string,
	event: any,
};

type EventSink = {
	select: (k: string) => Rx.Observable<any>,
	stream: Rx.Observable<EventDefinition>,
};

function makeEventSink(events: Events): EventSink {
	const eventDefs = map(events, (event$, key) => {
		return event$.map((ev): EventDefinition => ({
			category: key,
			event: ev,
		}));
	});

	const stream = Rx.Observable.merge(...eventDefs);

	return {
		select: (category) => {
			return stream.filter((eventDef) => eventDef.category === category)
				.map((eventDef) => eventDef.event);
		},
		stream,
	};
}

export function connectedView<P>(View: Component, events: Events) {
	return function connectViewTo(model: Rx.Observable<P>) {
		return {
			view$: model.map((state: P): ViewDelta<P> => ({ View, state })),
			events: makeEventSink(events),
		};
	};
}
