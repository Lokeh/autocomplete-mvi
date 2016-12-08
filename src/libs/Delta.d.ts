import { Component } from './Component';

export interface Delta<P> {
    view: Component,
    state: P,
}
