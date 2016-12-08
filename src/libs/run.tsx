import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Component } from './Component';
import { Delta } from './Delta';

function renderDOM<P>(DOMNode: Element, View: Component, state: P) {
	ReactDOM.render(<View {...state} />, DOMNode);
}

export function run<P>(viewStream: Rx.Observable<Delta<P>>, DOMNode: Element) {
	viewStream.subscribe(({ View, state }): void =>
		renderDOM<P>(DOMNode, View, state));
}
