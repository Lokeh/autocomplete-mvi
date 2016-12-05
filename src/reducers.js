import Rx from 'rx';
import { getResults } from './libs/getResults';

export function reducers(intents) {
	const value$ = intents.inputChange$
		.map((value) => ({ results, showResults }) => ({
			results,
			value,
			showResults,
		}));

	const hideResults$ = intents.inputBlur$
		.delay(300)
		.map(() => ({ results, value }) => ({
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
				.then((res) => res.json())
				.then((body) => {
					return {
						results: body[1],
						value,
						showResults: true,
					};
				});
		})
		.map((newState) => (oldState) => newState);

	const autoComplete$ = intents.resultsClicks$
		.map((value) => ({ results }) => ({
			results,
			value: value,
			showResults: false,
		}));

	return Rx.Observable.merge(value$, results$, autoComplete$, hideResults$);
}
