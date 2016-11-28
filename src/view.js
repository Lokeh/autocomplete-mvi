import React from 'react';
import { observeComponent, fromComponent } from 'observe-component/rx';
import { connectedView } from './libs/connectedView';

const SearchInput = observeComponent('input', ['onChange', 'onBlur']);

function View({ value, results = [], showResults = false }) {
	// console.log(value);
	return (
		<div>
			<SearchInput style={styles.search} type="text" value={value} />
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
			<div
				key={i}
				onClick={() => onClick({ title })}
				style={styles.result}
			>
				{title}
			</div>
		)}
	</div>
), ['onClick']);

const styles = {
	search: {
		fontSize: 20,
		width: "100%",
		fontFamily: "sans-serif"
	},
	result: {
		fontFamily: "sans-serif",
		fontSize: 16,
		border: "1px solid #d3d3d3",
		padding: 5,
	},
};

export const view = connectedView(View);
export const events = {
	input$: fromComponent(SearchInput),
	resultsList$: fromComponent(ResultsList),
};
