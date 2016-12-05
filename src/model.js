import Rx from 'rx';
import { reducers } from './reducers';

// model :: Map<Observable<Delta>> -> Observable<State>
export function model(intents) {
	return reducers(intents)
		.startWith({
			value: '',
			results: [],
			showResults: false,
		})
		.scan((state, reducer) => reducer(state));
}
