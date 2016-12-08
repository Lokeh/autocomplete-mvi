import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Component } from './Component';
import { Delta } from './Delta';

function renderDOM(DOMNode: Element, View: Component, state: any) {
	ReactDOM.render(<View {...state} />, DOMNode);
}

export function run<M>(viewStream: Rx.Observable<Delta<M>>, DOMNode: Element) {
	viewStream.subscribe(({ view, state }): void => renderDOM(DOMNode, view, state));
}
