import React from 'react';
import { observeComponent, fromComponent } from 'observe-component/rx';
import { connectedView } from './libs/connectedView';

const SearchInput = observeComponent('input', ['onChange', 'onBlur']);

function View({ value, results = [], showResults = false }) {
	// console.log(value);
	return (
		<div>
			<SearchInput type="text" value={value} />
			{showResults ?
				<ResultsList results={results} /> :
				null
			}
		</div>
	);
}

const ResultsList = observeComponent(({ results, onClick }) => (
	<div>
		{results.map((title, i) => 
			<div key={i} onClick={() => onClick({ title })}>{title}</div>
		)}
	</div>
), ['onClick']);

export const view = connectedView(View);
export const events = {
	input$: fromComponent(SearchInput),
	resultsList$: fromComponent(ResultsList),
};
