import Rx from 'rx';
import { getResults } from './libs/getResults';

export function reducers(intents) {
	const value$ = intents.inputChange$
		.map((value) => ({
			type: 'VALUE',
			value,
		}));

	const hideResults$ = intents.inputBlur$
		.delay(300)
		.map(() => ({
			type: 'HIDE_RESULTS',
		}));

	const results$ = value$
		.debounce(300)
		.flatMapLatest(({ value }) => {
			if (!value) return Rx.Observable.just({ type: 'RESULTS', results: [] });
			console.log('getting');
			return getResults(value)
				.then((res) => res.json())
				.then((body) => {
					return {
						type: 'RESULTS',
						results: body[1],
					};
				});
		});

	const autoComplete$ = intents.resultsClicks$
		.map((value) => ({
			type: 'AUTOCOMPLETE',
			value,
		}));

	return Rx.Observable.merge(value$, results$, autoComplete$, hideResults$);
}
