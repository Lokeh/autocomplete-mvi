import * as Rx from 'rx';
import { events } from './view';
import { ComponentEvent } from 'observe-component/common/ComponentEvent';
export interface Intents {
	// inputChange$: Rx.Observable<string>,
	// inputBlur$: Rx.Observable<ComponentEvent>,
	// resultsClicks$: Rx.Observable<string>,
	searchRequest$: Rx.Observable<any>,
	// resultsHighlighted$: Rx.Observable<number>,
	// resultsUnhighlighted$: Rx.Observable<null>,
	// responses$: Rx.Observable<any>,
	// enterPressed$: Rx.Observable<ComponentEvent>,
	// arrowDownPressed$: Rx.Observable<ComponentEvent>,
	// arrowUpPressed$: Rx.Observable<ComponentEvent>,
	value$: Rx.Observable<string>,
	hideResults$: Rx.Observable<boolean>, 
	results$: Rx.Observable<any>,
	highlight$: Rx.Observable<number>, 
	highlightMoveUp$: Rx.Observable<ComponentEvent>,
	highlightMoveDown$: Rx.Observable<ComponentEvent>,
	completeSelectedHighlight$: Rx.Observable<ComponentEvent>,
	autoComplete$: Rx.Observable<string>
};

function byType(desiredType: string): (event: ComponentEvent) => boolean {
	return ({ type }: ComponentEvent) => type === desiredType;
}

function byKey(key: string): (event: ComponentEvent) => boolean {
	return ({ value }: ComponentEvent) => value.key === key; 
}

export function intents(responses$: Rx.Observable<any>): Intents {
	const isHighlighted$ = Rx.Observable.merge(
		events.resultsList$.filter(byType('onMouseEnter'))
			.map(() => true),
		events.resultsList$.filter(byType('onMouseLeave'))
			.map(() => false),
	);

	const value$ = events.input$
		.filter(byType('onChange'))
		.map(({ value: event }): string => event.target.value);

	const hideResults$ = Rx.Observable.merge(
		events.input$.filter(byType('onBlur'))
			.withLatestFrom(isHighlighted$, (blur, isHighlighted) => isHighlighted)
			.filter((v) => !v),
		events.input$.filter(byType('onChange')).filter((v) => v === ""),
	);

	const highlight$ = Rx.Observable.merge(
		events.resultsList$.filter(byType('onMouseEnter')).map(({ value }): number => value),
		events.resultsList$.filter(byType('onMouseLeave')).map(() => null),
	);

	const searchRequest$ = value$
		.debounce(300);

	const completeSelectedHighlight$ = events.input$
		.filter(byType('onKeyPress'))
		.filter(byKey('Enter'));
	
	const highlightMoveDown$ = events.input$
		.filter(byType('onKeyDown'))
		.filter(byKey('ArrowDown'));

	const highlightMoveUp$ = events.input$
		.filter(byType('onKeyDown'))
		.filter(byKey('ArrowUp'));
	
	const autoComplete$ = events.resultsList$
		.filter(byType('onClick'))
		.map(({ value }): string => value)
		.doOnNext((v) => console.log('[intent]', v));
	
	const results$ = responses$;

	return {
		value$,
		hideResults$,
		highlight$,
		completeSelectedHighlight$,
		highlightMoveUp$,
		highlightMoveDown$,
		autoComplete$,
		searchRequest$,
		results$,
	};
}
