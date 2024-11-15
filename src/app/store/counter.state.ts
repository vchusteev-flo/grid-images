import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';

export interface CounterStateModel {
	count: number;
}

export class Increment {
	static readonly type = '[Counter] Increment';
}

export class Decrement {
	static readonly type = '[Counter] Decrement';
}

@State<CounterStateModel>({
	name: 'counter',
	defaults: {
		count: 0
	}
})

@Injectable({
	providedIn: 'root'
})
export class CounterState {
	@Action(Increment)
	increment(ctx: StateContext<CounterStateModel>) {
		const state = ctx.getState();
		ctx.setState({count: state.count + 1});
	}

	@Action(Decrement)
	decrement(ctx: StateContext<CounterStateModel>) {
		const state = ctx.getState();
		ctx.setState({count: state.count - 1});
	}
}