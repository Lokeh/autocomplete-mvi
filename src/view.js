import React from 'react';
import { observeComponent, fromComponent } from 'observe-component/rx';
import { connectedView } from './libs/connectedView';

const ObservableInput = observeComponent('input', ['onChange']);

function View({ value }) {
	console.log(value);
	return (
		<div>
			<ObservableInput type="text" value={value} />
		</div>
	);
}

export const view = connectedView(View);
export const events = {
	input$: fromComponent(ObservableInput),
};
