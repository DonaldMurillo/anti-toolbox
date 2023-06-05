import { ActionReducer, createFeatureSelector } from "@ngrx/store";
import { capitalize, createNestedSelectors } from "./utils";

export const BaseSimpleSelectors = (featureName: string, reducer: ActionReducer<any>) => {

	const featureSelector = createFeatureSelector<Record<string, any>>(featureName);
	const nestedSelectors = createNestedSelectors(featureSelector, reducer);
	return {
		[`select${capitalize(featureName)}State`]: featureSelector,
		...nestedSelectors,
	}
}
