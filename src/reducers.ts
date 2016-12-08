import * as Rx from 'rx';
import { getResults } from './libs/getResults';
import { Intents } from './intent';
import { Model } from './model';

/*
	# Reducer pattern
	
	Intents are mapped to new states:
		Intent<Delta>.map(ReducerFactory)
	
	ReducerFactory have the following signature:
		ReducerFactory :: delta -> (state -> newState)

	Thus reducing the intents from a stream of UI changes, to a stream of
	functions with the signature:
		reducer :: state -> newState

	This means that the model can then transform the intent like so:
		model = reducers(intents)
			// reducer :: state -> newState
			.scan((state, reducer) => reducer(state));
*/

export type Reducer = (state: Model) => Model

// reducers :: Map<Observable<Delta>> -> Observable<Reducer>
export function reducers(intents: Intents): Rx.Observable<Reducer> {
	const value$ = intents.inputChange$
		.map((value) => ({ results, showResults }: Model): Model => ({
			results,
			value,
			showResults,
		}));

	const hideResults$ = intents.inputBlur$
		.delay(300)
		.map(() => ({ results, value }: Model): Model => ({
			results,
			value,
			showResults: false,
		}));

	const results$ = intents.inputChange$
		.debounce(300)
		.flatMapLatest((value) => {
			if (!value) return Rx.Observable.just({
						results: [],
						value,
						showResults: false,
					});
			return getResults(value)
				.then((res: any): any => res.json())
				.then((body: [string[]]): any => {
					return {
						results: body[1],
						value,
						showResults: true,
					};
				});
		})
		.map((newState: Model) => (oldState: Model) => newState);

	const autoComplete$ = intents.resultsClicks$
		.map((value) => ({ results, showResults }: Model): Model => ({
			results,
			value: value,
			showResults: false,
		}));

	return Rx.Observable.merge(value$, results$, autoComplete$, hideResults$);
}
