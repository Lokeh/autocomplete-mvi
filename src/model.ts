import * as Rx from 'rxjs/Rx';
import { reducers } from './reducers';
import { Intents } from './intent';
import { Reducer } from './reducers';

export interface Model {
	value: string,
	results: string[],
	showResults: boolean,
	highlighted: number | null,
};

// model :: Map<Observable<Delta>> -> Observable<State>
export function model(intents: Intents): Rx.Observable<Model> {
	return reducers(intents)
		.startWith(<any>{
			value: '',
			results: [],
			showResults: false,
			highlighted: null,
		})
		.scan((state: Model, reducer: Reducer) => reducer(state));
}
