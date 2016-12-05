import Rx from 'rx';
import { reducers } from './reducers';

export function model(intents) {
	return reducers(intents)
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
