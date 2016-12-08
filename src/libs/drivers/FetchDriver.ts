import 'whatwg-fetch';
import { Sinks, Source } from '../run';

export interface FetchSource extends Sinks {
    fetch: Source<any>,
};

export interface FetchDriver {
    (sinks: FetchSource): void;
};

function makeFetchDriver(url: string): FetchDriver;
function makeFetchDriver(url: (param: string) => string): FetchDriver {
    if (typeof url === "string") {
        return (sinks) => {
            const source = sinks.fetch;

        }
    }
    else {
        return (sinks) => {
            
        }
    }
}
