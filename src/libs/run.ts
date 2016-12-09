
export type Source<T> = Rx.Observable<T>;
export type Sources = {
	[N: string]: Source<any>,
};

export interface Driver {
	[I: string]: (sinks: Sinks) => Source<any> | void,
};
export interface Drivers {
	[K: string]: Driver,
};

export type Sink<T> = Rx.Observable<T>;
export interface Sinks {
	[J: string]: Sink<any>,
};

function executeDriver(driver: Driver, sink: Sinks) {
	return Object.keys(driver)
		.map((key) => driver[key](sink));
}

export function run(
	app: () => Sinks,
	drivers: Drivers
) {
	const sinks = app();
	Object.keys(drivers)
		.forEach((key) => {
			executeDriver(drivers[key], sinks);
		});
}
