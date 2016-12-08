import * as Rx from 'rx';
import { Component } from './Component';
import { Delta } from './ViewState';

// connectedView :: View -> Observable<State> -> Observable<View, State>
export function connectedView<P>(View: Component): (Model: Rx.Observable<P>) => Rx.Observable<Delta<P>> {
	return function connectViewTo(Model: Rx.Observable<P>): Rx.Observable<Delta<P>> {
		return Model.map((state: P) => ({ view: View, state }));
	}
}
