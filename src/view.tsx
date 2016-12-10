import * as React from 'react';
import { observeComponent, fromComponent } from 'observe-component/rx';
import { connectedView } from './libs/drivers/ReactDriver';

export interface ViewProps {
	value: string,
	results: Object[],
	showResults: boolean,
	highlighted: number,
};

interface ResultsListProps {
	results: Object[],
	highlighted: number,
	onClick?: Function,
	onMouseEnter?: Function,
	onMouseLeave?: Function,
};

const SearchInput = observeComponent<React.HTMLProps<any>>('onChange', 'onBlur')('input');

// View :: state -> DOM
function View({ value, results = [], showResults = false, highlighted = null }: ViewProps) {
	return (
		<div>
			<SearchInput style={styles.search} type="text" value={value} />
			{showResults ?
				<ResultsList
					results={results}
					highlighted={highlighted}
				/> :
				null
			}
		</div>
	);
}

const ResultsList = 
	observeComponent<ResultsListProps>(
		'onClick',
		'onMouseEnter',
		'onMouseLeave',
	)(({ results, onClick, onMouseEnter, onMouseLeave, highlighted }: ResultsListProps) => (
		<ul style={styles.resultsBox}>
			{results.map((title: string, i: number) => 
				<li
					key={i}
					onClick={() => onClick({ title })}
					onMouseEnter={() => onMouseEnter(i)}
					style={Object.assign(
						{},
						styles.result,
						i === highlighted ? styles.highlighted : {},
					)}
					onMouseLeave={() => onMouseLeave()}
				>
					{title}
				</li>
			)}
		</ul>
	));

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
	highlighted: {
		backgroundColor: 'green',
	},
};

export const events = {
	input$: fromComponent(SearchInput),
	resultsList$: fromComponent(ResultsList),
};
export const view = connectedView<ViewProps, any>(View, events);
