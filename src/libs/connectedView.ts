import * as Rx from 'rx';
import { Component } from './Component';
import { Delta } from './Delta';

// connectedView :: View -> Observable<State> -> Observable<{View, State}>
export function connectedView<P>(View: Component): (model: Rx.Observable<P>) => Rx.Observable<Delta<P>> {
	return function connectViewTo(model: Rx.Observable<P>): Rx.Observable<Delta<P>> {
		return model.map((state: P): Delta<P> => ({ View, state }));
	};
}
