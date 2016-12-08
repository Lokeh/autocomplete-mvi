import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface Drivers {
	[K: string]: (sinks: Sinks) => void,
};

export type Source<T> = Rx.Observable<T>;
export interface Sinks {
	[J: string]: Source<any>,
};

export function run<S extends Sinks, D extends Drivers>(
	app: () => S,
	drivers: D
) {
	const sinks = app();
	Object.keys(drivers)
		.forEach((key) => {
			drivers[key](sinks);
		});
}
