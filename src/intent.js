import { events } from './view';
export const intent = {
	inputChange$: events.input$
		.filter(({ type }) => type === 'onChange')
		.map(({ value }) => value.target.value),
	inputBlur$: events.input$
		.filter((({ type }) => type === 'onBlur')),
	resultsClicks$: events.resultsList$
		.map(({ value }) => value.title),
};
