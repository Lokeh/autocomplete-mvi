import Rx from 'rx';
import { getResults } from './libs/getResults';

console.log();

export function model(intent$) {
	const value$ = intent$
		.startWith('')
		.map((value) => ({
			type: 'VALUE',
			value,
		}));

	const results$ = value$.flatMap(({ value }) => {
		if (!value) return Rx.Observable.just([]);
		return getResults(value)
			.then((res) => res.json())
			.then((body) => {
				return {
					type: 'RESULTS',
					results: body[1],
				};
			});
	});


	return Rx.Observable.merge(value$, results$)
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
