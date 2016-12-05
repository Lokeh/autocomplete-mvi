import React from 'react';
import { observeComponent, fromComponent } from 'observe-component/rx';
import { connectedView } from './libs/connectedView';

const SearchInput = observeComponent('input', ['onChange', 'onBlur']);

function View({ value, results = [], showResults = false }) {
	// console.log(results);
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
	<ul style={styles.resultsBox}>
		{results.map((title, i) => 
			<li
				key={i}
				onClick={() => onClick({ title })}
				style={styles.result}
			>
				{title}
			</li>
		)}
	</ul>
), ['onClick']);

const styles = {
	search: {
		fontSize: 20,
		width: "100%",
		fontFamily: "sans-serif"
	},
	resultsBox: {
		listStyle: "none",
		padding: 0,
		margin: 0,
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
