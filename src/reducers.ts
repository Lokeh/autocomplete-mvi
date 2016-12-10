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

function createReducer(newState: Partial<Model>): Reducer {
	return (oldState: Model) =>
		Object.assign({}, oldState, newState);
}

// reducers :: Map<Observable<Delta>> -> Observable<Reducer>
export function reducers(intents: Intents): Rx.Observable<Reducer> {
	const value$ = intents.inputChange$
		.map((value) => createReducer({ value }));

	const hideResults$ = intents.inputBlur$
		.delay(300)
		.map(() => createReducer({ showResults: false }));

	const results$ = intents.responses$
		.map((body: any[]) => {
			const results = body[1];
			return createReducer({
				results,
				showResults: true,
			});
		});
	
	const highlight$ =
		Rx.Observable.merge(intents.resultsHighlighted$, intents.resultsUnhighlighted$)
		.map((highlighted) => createReducer({ highlighted }));

	const autoComplete$ = intents.resultsClicks$
		.map((value) => createReducer({
			value,
			showResults: false,
		}));

	return Rx.Observable.merge(value$, results$, autoComplete$, hideResults$, highlight$);
}
