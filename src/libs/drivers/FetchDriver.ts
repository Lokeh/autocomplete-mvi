import 'whatwg-fetch';
import * as Rx from 'rx';
import { Source, Sinks, Sink, Driver, DisposeFn } from '../app';

export interface FetchSink extends Sinks {
    fetch: Sink<any>,
};

export interface FetchSource extends Source {
    source: Rx.Observable<Response | FetchParams>,
    dispose: DisposeFn
}

export interface FetchDriver extends Driver {
    stream: (sinks: FetchSink) => FetchSource,
};

export interface FetchParams {
    url: string,
    options: RequestInit,
}


export function makeFetchDriver(): FetchDriver {
    return {
        stream: (sinkProxies) => {
            const source = sinkProxies.fetch
                .filter((v) => !(v instanceof Response))
                .flatMapLatest((params: FetchParams) => 
                    Rx.Observable.fromPromise(fetch((params.url)))
            );
            const subscription = source.subscribe();
            const dispose = () => subscription.dispose();

            return {
                source,
                dispose,
            };
        }
    }
}
