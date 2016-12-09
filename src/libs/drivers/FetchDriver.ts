import 'whatwg-fetch';
import { Sinks, Sink } from '../run';

export interface FetchSink extends Sinks {
    fetch: Sink<any>,
};

export interface FetchDriver {
    (sinks: FetchSink): void;
};

function makeFetchDriver(url: (param: string) => string): FetchDriver;
function makeFetchDriver(url: string): FetchDriver {
    if (typeof url === "string") {
        return (sinks) => {
            const source = sinks.fetch;
            sinks.
        }
    }
    else {
        return (sinks) => {
            
        }
    }
}
