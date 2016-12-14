import 'whatwg-fetch';
export function getResults(term: string): Promise<Response> {
	return fetch(
		`http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${term}&origin=localhost&origin=*`
	);
}
