import { BaseSimpleState, SafeType, TypeSafeCallBack } from "@anti-toolbox/state-management/interfaces";
import { ActionCreator, createAction, props } from "@ngrx/store";

export function BaseSimpleActions<T extends SafeType<BaseSimpleState>, E extends { [key: string]: ActionCreator<any> } | undefined>(featureName: string, extendedActions?: E) {

	return {
		startLoading: createAction(`[${featureName}]: Start Loading`),
		finishLoading: createAction(`[${featureName}]: Finish Loading`),
		update: createAction(`[${featureName}]: Update state`, props<{ cb: TypeSafeCallBack<T>}>()),
		addError: createAction(`[${featureName}]: Add Error`, props<{ errorName: string, value: any }>()),
		clearErrors: createAction(`[${featureName}]: Clear Error`),
		reset: createAction(`[${featureName}]: Reset Store`),
		...extendedActions
	}
}

export type BaseSimpleActionsType< T extends BaseSimpleState, E extends { [key: string]: ActionCreator<any> } | undefined = undefined> = ReturnType<typeof BaseSimpleActions<T, E >> 