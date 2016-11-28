import Rx from 'rx';
import { getResults } from './libs/getResults';

console.log();

export function model(intents) {
	const value$ = intents.inputChange$
		.map((value) => ({
			type: 'VALUE',
			value,
		}));

	const hideResults$ = intents.inputBlur$
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


	return Rx.Observable.merge(value$, results$, autoComplete$, hideResults$)
		.startWith({
			value: '',
			results: [],
		})
		.scan(({ value, results, showResults }, delta) => {
			console.log(delta);
			switch (delta.type) {
				case 'VALUE':
					return {
						results,
						value: delta.value,
						showResults,
					};
					break;
				case 'RESULTS':
					return {
						results: delta.results,
						value,
						showResults: true,
					};
				case 'AUTOCOMPLETE':
					return {
						results,
						value: delta.value,
						showResults: false,
					}
				case 'HIDE_RESULTS':
					return {
						results,
						value,
						showResults: false,
					};
				default:
					return {
						results,
						value,
					};
			}
		});
;
}
