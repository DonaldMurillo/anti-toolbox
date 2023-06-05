import { ActionReducer, createSelector, DefaultProjectorFn, MemoizedSelector } from "@ngrx/store";

export function capitalize(text: string) {
	return (text.charAt(0).toUpperCase() + text.substring(1));
}
export function isArray(target: unknown) {
	return Array.isArray(target);
}
export function isObjectLike(target: unknown) {
	return typeof target === 'object' && target !== null;
}
export function isObject(target: unknown) {
	return isObjectLike(target) && !isArray(target);
}
export function isPlainObject(target: unknown) {
	if (!isObject(target)) {
		return false;
	}
	const targetPrototype = Object.getPrototypeOf(target);
	return targetPrototype === Object.prototype || targetPrototype === null;
}

export function getInitialState(reducer: ActionReducer<any>) {
	return reducer(undefined, { type: '@ngrx/feature/init' });
}


export function createNestedSelectors<T extends Record<string, any>>(featureSelector: MemoizedSelector<object, T, DefaultProjectorFn<unknown>>, reducer: ActionReducer<any>) {
	const initialState = getInitialState(reducer);
	const nestedKeys = (isPlainObject(initialState) ? Object.keys(initialState) : []) as [keyof T];
	return nestedKeys.reduce((nestedSelectors, nestedKey) => ({
		 ...nestedSelectors,
		 [`select${capitalize(String(nestedKey))}`]: createSelector(featureSelector, (parentState) => parentState?.[nestedKey]),
	}), {});
}
