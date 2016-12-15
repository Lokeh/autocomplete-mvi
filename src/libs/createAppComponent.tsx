import * as React from 'react';
import * as MVI from './framework';
import * as RD from './drivers/ReactDriver';
import { forEach } from 'lodash';

export type Main = (sources: MVI.Sources) => MVI.Sinks;
export interface PropsMap {
	[K: string]: (state: any) => any
};

export function createAppComponent<P, S>(main: Main, drivers: MVI.Drivers, propsMap: PropsMap) {
	return class App extends React.Component<P, S> implements React.ComponentLifecycle<P, S> {
		component: React.ComponentClass<P> | React.StatelessComponent<S> | string;
        dispose: MVI.DisposeFn;
		componentWillMount() {
            const extDrivers = {
                ...drivers,
                reactDOM: RD.makeReactStateDriver(({ View, state }) => {
                    this.setState(state);
                    if (!this.component) {
                        this.component = View;
                    }
					forEach(propsMap, (v, k) => {
						if (this.props[k]) {
							this.props[k](v(state));
						}
					});
                }),
            }
			const { run } = MVI.App<MVI.Sources, MVI.Drivers>(main, extDrivers);
			this.dispose = run();
		}

        componentWillUnmount() {
			this.dispose();
        }

		render() {
			const AppView = this.component;
			return (
				<AppView {...this.state} />
			)
		}
	}
}