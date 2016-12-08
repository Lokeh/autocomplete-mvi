import { Component } from './Component';

export interface Delta<P> {
    View: Component,
    state: P,
}
