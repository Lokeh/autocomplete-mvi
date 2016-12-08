import * as Rx from 'rx';
import { run } from './libs/run';

// interfaces
import { ViewProps } from './view';
import { Delta } from './libs/Delta';

// app
import { view } from './view';
import { model } from './model';
import { intent } from './intent';

function main() {
	return view(model(intent));
}

run<ViewProps>(main(), document.getElementById('app'));
