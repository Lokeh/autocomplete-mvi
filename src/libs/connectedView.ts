import * as Rx from 'rx';
import { Component } from './types/Component';
import { ViewDelta } from './types/Delta';

// connectedView :: View -> Observable<State> -> Observable<{View, State}>
export function connectedView<P>(View: Component): (model: Rx.Observable<P>) => Rx.Observable<ViewDelta<P>> {
	return function connectViewTo(model: Rx.Observable<P>): Rx.Observable<ViewDelta<P>> {
		return model.map((state: P): ViewDelta<P> => ({ View, state }));
	};
}
