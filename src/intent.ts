import { events } from './view';
export interface Intents {
	inputChange$: Rx.Observable<string>,
	inputBlur$: Rx.Observable<React.SyntheticEvent<any>>,
	resultsClicks$: Rx.Observable<string>,
};

export const intent: Intents = {
	inputChange$: events.input$
		.filter(({ type }) => type === 'onChange')
		.map(({ value }) => value.target.value),
	inputBlur$: events.input$
		.filter((({ type }) => type === 'onBlur')),
	resultsClicks$: events.resultsList$
		.map(({ value }) => value.title),
};
