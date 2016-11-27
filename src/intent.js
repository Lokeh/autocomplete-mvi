import { events } from './view';
export const intent = {
	input$: events.input$.map(({ event }) => event.target.value),
};
