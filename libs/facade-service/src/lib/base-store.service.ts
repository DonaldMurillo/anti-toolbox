import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { Action, ActionCreator, Store } from "@ngrx/store";
import { BehaviorSubject } from "rxjs";
import { BaseSimpleActions, BaseSimpleActionsType } from "./base-simple.actions";
import { BaseSimpleReducer } from "./base-simple.reducer";
import { BaseSimpleSelectors } from "./base-simple.selectors";
import type { BaseSimpleSelectorsType, TypeSafeCallBack } from "./base-store.models";
import type { BaseState } from "./public-interfaces";
import { capitalize } from "./utils";


export class BaseStoreService<
	TState extends BaseState, 
	FeatureName extends keyof Record<string, any> & string,
	ExtendedActions extends Record<string, ActionCreator<any>> = Record<string, ActionCreator<any>>
	> {

	protected http = inject(HttpClient);
	protected store = inject(Store);
	private stateSnapshot$?: BehaviorSubject<TState>;
	private selectors!: BaseSimpleSelectorsType<TState, FeatureName>;
	protected actions!: BaseSimpleActionsType<TState, ExtendedActions> & ExtendedActions;

	constructor(private storeConfig: { 
		featureName: FeatureName, 
		initialState: TState, 
		withSnapshot?: boolean,
		extendedActions?: ExtendedActions,
		extendedReducer?: any
	}) {

		const featureSelectorString = `select${capitalize(storeConfig.featureName)}State`;
		this.actions = BaseSimpleActions<TState, ExtendedActions>(storeConfig.featureName, storeConfig.extendedActions) as any;
		const reducer = BaseSimpleReducer<TState, FeatureName>(storeConfig.initialState, this.actions);
		this.store.addReducer(storeConfig.featureName, reducer);
		const selectors = BaseSimpleSelectors(storeConfig.featureName, reducer) as { [key: string]: any};

		for (const key in storeConfig.initialState) {
			this.selectors = { ...this.selectors, [`select${capitalize(key)}`]: this.store.select(selectors[`select${capitalize(key)}`]) };
		}
		this.selectors = { ...this.selectors, [featureSelectorString]: this.store.select(selectors[featureSelectorString]) }
	
		if (storeConfig.withSnapshot) {
			this.stateSnapshot$ = new BehaviorSubject(storeConfig.initialState);
			// TODO: HANDLE UNSUBSCRIBE
			this.store.select(selectors[featureSelectorString]).subscribe({ next: state => this.stateSnapshot$?.next(state)})
		}

	}

	getCurrentStateSnapshot(): TState {
		if (!this.storeConfig.withSnapshot || this.stateSnapshot$ === undefined) throw 'Snapshots are not enabled for this feature store.';
		return this.stateSnapshot$.value;
	}

	update(cb: TypeSafeCallBack<TState>) {
		this.store.dispatch(this.actions.update({ cb }))
	}

	dispatch<K extends keyof typeof this.actions>(action: K, ...args: Parameters<typeof this.actions[K]>) {
		
		this.store.dispatch(this.actions[action](...args) as Action)
	}

	select<K extends keyof BaseSimpleSelectorsType<TState, FeatureName>>(type: K & keyof Record<string, ActionCreator<any>>) {
		return this.selectors[type];
	}

}