import { events } from './view';
export const intent = {
	inputChange$: events.input$
		.filter(({ type }) => type === 'onChange')
		.map(({ event }) => event.target.value),
	inputBlur$: events.input$
		.filter((({ type }) => type === 'onBlur')),
	resultsClicks$: events.resultsList$
		.map(({ event }) => event.title),
};
