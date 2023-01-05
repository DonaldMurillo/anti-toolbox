import { createReducer, on } from "@ngrx/store";
import { BaseSimpleActionsType } from "./base.actions";
import { BaseState } from "./models";

export const BaseSimpleReducer = <T extends BaseState, FeatureName extends string>(
	initialState: T, 
	baseSimpleActions:  BaseSimpleActionsType<T>
	) => {

	return createReducer(
		initialState,
		on(baseSimpleActions.startLoading, (state) => ({ ...state, isLoading: true })),
		on(baseSimpleActions.finishLoading, (state) => ({ ...state, isLoading: false })),
		on(baseSimpleActions.update, (state, action ) => {	return {...action.cb(state as any) as any} }), //TODO: FIX TYPESAFETY
		on(baseSimpleActions.addError, (state, { errorName, value }) => ({ ...state, errors: { [errorName]: value } })),
		on(baseSimpleActions.clearErrors, (state) => ({ ...state, errors: {} })),
		on(baseSimpleActions.reset, (state) => ({ ...initialState as any })),
	)
} 
