import 'whatwg-fetch';
import * as Rx from 'rx';
import { Sources, SourceDefinition, Sinks, Sink, Drivers, Driver, DisposeFn } from '../app';

export interface FetchSink extends Sinks {
    fetch: Sink<FetchParams>,
};

export interface FetchSourceDefinition extends SourceDefinition {
    source: Rx.Observable<Response>,
    dispose: DisposeFn
}

export interface FetchSource extends Sources {
    fetch: Rx.Observable<Response>,
}

export interface FetchDriver extends Driver {
    (sinks: FetchSink): FetchSourceDefinition,
};

export interface FetchParams {
    url: string,
    options?: RequestInit,
};

export interface FetchDriverDefinition extends Drivers {
	fetch: FetchDriver,
};


export function makeFetchDriver(): FetchDriver {
    return (sinkProxies: FetchSink) => {
        const source = sinkProxies.fetch
            .flatMapLatest((params: FetchParams) => {
                return Rx.Observable.fromPromise(fetch((params.url)))
            });
        const subscription = source.subscribe();
        const dispose = () => subscription.dispose();

        return {
            source,
            dispose,
        };
    };
}
