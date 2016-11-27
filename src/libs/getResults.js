export function getResults(term) {
	return fetch(
		`http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${term}&origin=localhost&origin=*`
	);
}
