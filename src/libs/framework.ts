import { mapValues, map, forEach } from 'lodash';

export type DisposeFn = () => void;
type Source<T> = Rx.Observable<T>;
export interface SourceDefinition {
	source: Rx.Observable<any>,
	dispose: DisposeFn
};
export interface Sources {
	[N: string]: Source<any>,
};

export interface Driver {
	(sinks: Sinks): SourceDefinition,
};
export interface Drivers {
	[K: string]: Driver,
};

export interface Sinks {
	[J: string]: Rx.Observable<any>,
};
export interface SinkProxies {
	[L: string]: Rx.Subject<any>,
}

export interface RunFn {
	(): DisposeFn;
};

export interface AppExecution {
	sinks: Sinks,
	sources: Sources,
	run: RunFn,
};

function createProxies(drivers: Drivers): SinkProxies {
	return mapValues(drivers, (driver, driverName) => {
		return new Rx.Subject();
	});
}

function executeDrivers(drivers: Drivers, sinkProxies: SinkProxies) {
	return mapValues(drivers, (driver, key) =>
		driver(sinkProxies)
	);
}

function getSources<S extends Sources>(definitions: _.Dictionary<SourceDefinition>): S {
	return <S>mapValues(definitions, (definition) => definition.source);
}

function createSinkDisposal(definitions: _.Dictionary<SourceDefinition>) {
	const disposes = map(definitions, (definition) => definition.dispose);
	return () => disposes.forEach((dispose) => dispose());
}

function link(sinks: Sinks, sinkProxies: SinkProxies): DisposeFn {
	console.log('[link] linking');
	const subscriptions = map(sinks, (sink, name) => {
		const proxy = sinkProxies[name];
		console.log('[link] subscribing', name);
		console.log('[link]', sink);
		return sink.subscribe(proxy);
	});

	return () => {
		subscriptions.forEach((subscription) => subscription.dispose());
	};
}

export function App<S extends Sources, D extends Drivers>(
	main: (sources?: S) => Sinks,
	drivers: D
): AppExecution {
	console.log('[App]', 'initialized');

	const sinkProxies = createProxies(drivers);
	console.log('[App] sinkProxies', sinkProxies);

	const sourceDefs = executeDrivers(drivers, sinkProxies);

	const disposeSinks = createSinkDisposal(sourceDefs); 
	const sources = getSources<S>(sourceDefs);
	console.log('[App] sources', sources);
	const sinks = main(sources);
	console.log('[App] sinks', sinks);
	return {
		sinks,
		sources,
		run: () => {
			console.log('[run] running');
			const disposeProxies = link(sinks, sinkProxies);
			return () => {
				disposeSinks();
				disposeProxies();
			};
		},
	};
}
