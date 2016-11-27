import Rx from 'rx';
import { getResults } from './libs/getResults';

console.log();

export function model(intents) {
	const value$ = intents.input$
		.map((value) => ({
			type: 'VALUE',
			value,
		}));

	const results$ = value$
		.debounce(300)
		.flatMap(({ value }) => {
			if (!value) return Rx.Observable.just({ type: 'RESULTS', results: [] });
			return getResults(value)
				.then((res) => res.json())
				.then((body) => {
					return {
						type: 'RESULTS',
						results: body[1],
					};
				});
		})
		.do(x => console.log(x));


	return Rx.Observable.merge(value$, results$)
		.startWith({
			value: '',
			results: [],
		})
		.scan(({ value, results }, delta) => {
			switch (delta.type) {
				case 'VALUE':
					return {
						results,
						value: delta.value,
					};
					break;
				case 'RESULTS':
					return {
						results: delta.results,
						value,
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
