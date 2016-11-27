export function model(intent) {
	return intent
		.startWith({ value: '' })
		.scan((state, delta) => ({ value: delta }));
}
