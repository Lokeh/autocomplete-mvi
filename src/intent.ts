import { events } from './view';
import { ComponentEvent } from 'observe-component/common/ComponentEvent';
export interface Intents {
	inputChange$: Rx.Observable<string>,
	inputBlur$: Rx.Observable<ComponentEvent>,
	resultsClicks$: Rx.Observable<string>,
	searchRequest$: Rx.Observable<any>,
	resultsHighlighted$: Rx.Observable<number>,
	resultsUnhighlighted$: Rx.Observable<null>,
	responses$: Rx.Observable<any>,
	enterPressed$: Rx.Observable<ComponentEvent>,
	arrowDownPressed$: Rx.Observable<ComponentEvent>,
	arrowUpPressed$: Rx.Observable<ComponentEvent>,
};

function byType(desiredType: string): (event: ComponentEvent) => boolean {
	return ({ type }: ComponentEvent) => type === desiredType;
}

function byKey(key: string): (event: ComponentEvent) => boolean {
	return ({ value }: ComponentEvent) => value.key === key; 
}

export function intents(responses$: Rx.Observable<any>): Intents {
	const inputChange$ = events.input$
		.filter(byType('onChange'))
		.map(({ value }): string => value.target.value);

	const inputBlur$ = events.input$
		.filter(byType('onBlur'));

	const resultsClicks$ = events.resultsList$
		.filter(byType('onClick'))
		.map(({ value }): string => value.title);

	const resultsHighlighted$ = events.resultsList$
		.filter(byType('onMouseEnter'))
		.map(({ value }): number => value);

	const resultsUnhighlighted$ = events.resultsList$
		.filter(byType('onMouseLeave'))
		.map(() => null);

	const searchRequest$ = inputChange$
		.debounce(300);

	const enterPressed$ = events.input$
		.filter(byType('onKeyPress'))
		.filter(byKey('Enter'));
	
	const arrowDownPressed$ = events.input$
		.filter(byType('onKeyDown'))
		.filter(byKey('ArrowDown'));

	const arrowUpPressed$ = events.input$
		.filter(byType('onKeyDown'))
		.filter(byKey('ArrowUp'));

	const test = events.input$
		.subscribe((s) => console.log('[intents]', s.type, s.value.key));

	return {
		inputChange$,
		inputBlur$,
		resultsClicks$,
		searchRequest$,
		resultsHighlighted$,
		resultsUnhighlighted$,
		responses$,
		enterPressed$,
		arrowDownPressed$,
		arrowUpPressed$,
	};
}
