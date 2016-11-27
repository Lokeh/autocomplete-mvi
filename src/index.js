import { run } from './libs/run';

// app
import { view } from './view';
import { model } from './model';
import { intent } from './intent';

function main() {
	return view(model(intent));
}

run(main(), document.getElementById('app'));
