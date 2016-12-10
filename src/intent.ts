import { events } from './view';
import { ComponentEvent } from 'observe-component/common/ComponentEvent';
export interface Intents {
	inputChange$: Rx.Observable<string>,
	inputBlur$: Rx.Observable<React.SyntheticEvent<any>>,
	resultsClicks$: Rx.Observable<string>,
	searchRequest$: Rx.Observable<any>,
	responses$: Rx.Observable<any>,
};

function byType(desiredType: string): (event: ComponentEvent) => boolean {
	return ({ type }: ComponentEvent) => type === desiredType;
}

export function intents(responses$: Rx.Observable<any>): Intents {
	const inputChange$ = events.input$
			.filter(byType('onChange'))
			.map(({ value }): string => value.target.value);
	const inputBlur$ = events.input$
			.filter(byType('onBlur'));
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
