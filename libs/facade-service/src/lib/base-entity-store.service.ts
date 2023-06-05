import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { Action, ActionCreator, Store } from "@ngrx/store";
import { BehaviorSubject } from "rxjs";
import { BaseEntityActions, BaseEntityActionsType } from "./base-entity.actions";
import type { BaseSimpleSelectorsType } from "./base-store.models";
import { BaseEntityReducer } from './base-entity.reducer';
import { capitalize } from "./utils";
import { BaseSimpleSelectors } from "./base-simple.selectors";
import { BaseEntityState, UiEntity } from "./public-interfaces";


// TODO: MAYBE WRAP THIS IN A FUNCTION TO COERSE THE STORE NAME

export class BaseEntityStoreService<
	T extends UiEntity,
	TEntityState extends BaseEntityState<T>, 
	FeatureName extends keyof Record<string, any> & string,
	ExtendedActions extends Record<string, ActionCreator<any>> = Record<string, ActionCreator<any>>
	> {

	protected http = inject(HttpClient);
	protected store = inject(Store);
	private stateSnapshot$?: BehaviorSubject<TEntityState>;
	
	private selectors!: BaseSimpleSelectorsType<TEntityState, FeatureName>;
	private actions!: BaseEntityActionsType<T, ExtendedActions> & ExtendedActions;

	constructor(private storeConfig: { 
		featureName: FeatureName, 
		initialState: TEntityState, 
		withSnapshot?: boolean,
		extendedActions?: ExtendedActions,
		extendedReducer?: any
	}) {
		
		const featureSelectorString = `select${capitalize(storeConfig.featureName)}State`;
		this.actions = BaseEntityActions<T, ExtendedActions>(storeConfig.featureName, storeConfig.extendedActions) as any;
		const reducer = BaseEntityReducer<T, TEntityState, FeatureName>(storeConfig.initialState, this.actions);
		this.store.addReducer(storeConfig.featureName, reducer);
		const selectors = BaseSimpleSelectors(storeConfig.featureName, reducer) as { [key: string]: any};

		for (const key in storeConfig.initialState) {
			this.selectors = { ...this.selectors, [`select${capitalize(key)}`]: this.store.select(selectors[`select${capitalize(key)}`]) }
		}
		this.selectors = { ...this.selectors, [featureSelectorString]: this.store.select(selectors[featureSelectorString]) }

		if (storeConfig.withSnapshot) {
			this.stateSnapshot$ = new BehaviorSubject(storeConfig.initialState);
			// TODO: HANDLE UNSUBSCRIBE
			this.store.select(selectors[featureSelectorString]).subscribe({ next: state => this.stateSnapshot$?.next(state)})
		}

	}

	getCurrentStateSnapshot(): TEntityState {
		if (!this.storeConfig.withSnapshot || this.stateSnapshot$ === undefined) throw 'Snapshots are not enabled for this feature store.';
		return this.stateSnapshot$.value;
	}

	getActions() { return {...this.actions} };

	dispatch<K extends keyof typeof this.actions>(action: K, ...args: Parameters<typeof this.actions[K]>) {
		
		this.store.dispatch(this.actions[action](...args) as Action)
	}

	select<K extends keyof BaseSimpleSelectorsType<TEntityState, FeatureName>>(type: K) {
		return this.selectors[type];
	}

}