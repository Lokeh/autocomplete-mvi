import React from 'react';
import { observeComponent, fromComponent } from 'observe-component/rx';
import { connectedView } from './libs/connectedView';

const ObservableInput = observeComponent('input', ['onChange']);

function View({ value, results = [] }) {
	// console.log(value);
	return (
		<div>
			<ObservableInput type="text" value={value} />
			<div>
				{results.map((title, i) => 
					<div key={i}>{title}</div>
				)}
			</div>
		</div>
	);
}

export const view = connectedView(View);
export const events = {
	input$: fromComponent(ObservableInput),
};
