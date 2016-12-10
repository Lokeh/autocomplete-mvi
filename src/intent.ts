import { events } from './view';
export interface Intents {
	inputChange$: Rx.Observable<string>,
	inputBlur$: Rx.Observable<React.SyntheticEvent<any>>,
	resultsClicks$: Rx.Observable<string>,
	searchRequest$: Rx.Observable<any>,
	responses$: Rx.Observable<Response>,
};

export function intents(responses$: Rx.Observable<any>): Intents {
	
	const inputChange$ = events.input$
			.filter(({ type }) => type === 'onChange')
			.map(({ value }): string => value.target.value);
	const inputBlur$ = events.input$
			.filter((({ type }) => type === 'onBlur'));
	const resultsClicks$ = events.resultsList$
			.map(({ value }): string => value.title);
	const searchRequest$ = inputChange$
			.debounce(300);
	return {
		inputChange$,
		inputBlur$,
		resultsClicks$,
		searchRequest$,
		responses$,
	};
}
