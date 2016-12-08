import * as Rx from 'rx';
import { reducers } from './reducers';
import { Intents } from './intent';
import { Reducer } from './reducers';

export interface Model {
	value: string,
	results: string[],
	showResults: boolean,
};

// model :: Map<Observable<Delta>> -> Observable<State>
export function model(intents: Intents): Rx.Observable<Model> {
	return reducers(intents)
		.startWith(<any>{
			value: '',
			results: [],
			showResults: false,
		})
		.scan((state: Model, reducer: Reducer) => reducer(state));
}
