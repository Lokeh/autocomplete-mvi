import { mapValues, forEach } from 'lodash';

export type DisposeFn = () => void;
export interface Source {
	source: Rx.Observable<any>,
	dispose: DisposeFn
};
export interface Sources {
	[M: string]: {
		[N: string]: Source,
	}
};

export interface Driver {
	[I: string]: (sinks: Sinks) => Source,
};
export interface Drivers {
	[K: string]: Driver,
};

export type Sink<T> = Rx.Observable<T>;
export interface Sinks {
	[J: string]: Sink<any>,
};
export interface SinkProxies {
	[L: string]: Rx.Subject<any>,
}

export interface AppExecution {
	sinks: Sinks,
	sources: Sources,
	run: () => void
};

function createProxies(drivers: Drivers): SinkProxies {
	return mapValues(drivers, (driver, driverName) => {
		return new Rx.Subject();
	});
}

function executeDrivers(drivers: Drivers, sinkProxies: SinkProxies): Sources {
	return mapValues(drivers, (driver, key) =>
		mapValues(driver, (sourceCreator) =>
			sourceCreator(sinkProxies)
		)
	);
}

function link(sinks: Sinks, sinkProxies: SinkProxies) {
	console.log('[link] linking');
	const subscriptions = mapValues(sinks, (sink, name) => {
		const proxy = sinkProxies[name];
		console.log('[link] subscribing', name);
		console.log('[link]', sink);
		return sink.subscribe(proxy);
	});
}

export function App(
	main: (sources?: Sources) => Sinks,
	drivers: Drivers
): AppExecution {
	console.log('[App]', 'initialized');
	const sinkProxies = createProxies(drivers);
	console.log('[App] sinkProxies', sinkProxies);
	const sources = executeDrivers(drivers, sinkProxies);
	console.log('[App] sources', sources);
	const sinks = main(sources);
	console.log('[App] sinks', sinks);
	return {
		sinks,
		sources,
		run: () => {
			console.log('[run] running');
			link(sinks, sinkProxies)
		},
	};
}
