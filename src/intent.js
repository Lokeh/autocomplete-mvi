import { events } from './view';
export const intent =
	events.input$.map(({ event }) => event.target.value);
