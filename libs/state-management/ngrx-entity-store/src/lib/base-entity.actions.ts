import { ActionCreator, createAction, props } from "@ngrx/store";
import { EntityMapOne, EntityMap, Update, Predicate } from '@ngrx/entity';
import type { SafeType, TypeSafeCallBack } from "@anti-toolbox/state-management/interfaces";
import type { UiEntity } from "./models";

// const createTypedAction = <T>(featureName: string) => {

// 	return createAction(`[${featureName}]: Update state`, props<{ cb: TypeSafeCallBack<T>}>())
// }


export function BaseEntityActions<T extends SafeType<UiEntity>, E extends { [key: string]: ActionCreator<any> } | undefined>(featureName: string, extendedActions?: E) {

	return {
		startLoading: createAction(`[${featureName}]: Start Loading`),
		finishLoading: createAction(`[${featureName}]: Finish Loading`),
		update: createAction(`[${featureName}]: Update state`, props<{ cb: TypeSafeCallBack<T> }>()),
		addError: createAction(`[${featureName}]: Add Error`, props<{ errorName: string, value: any }>()),
		clearErrors: createAction(`[${featureName}]: Clear Error`),
		loadEntities: createAction(`[${featureName}] Load Entities`, props<{ entities: T[] }>()),
		setEntities: createAction(`[${featureName}] Set Entities`, props<{ entities: T[] }>()),
		addEntity: createAction(`[${featureName}] Add Entity`, props<{ entity: T }>()),
		setEntity: createAction(`[${featureName}] Set Entity`, props<{ entity: T }>()),
		upsertEntity: createAction(`[${featureName}] Upsert Entity`, props<{ entity: T }>()),
		addEntities: createAction(`[${featureName}] Add Entities`, props<{ entities: T[] }>()),
		upsertEntities: createAction(`[${featureName}] Upsert Entities`, props<{ entities: T[] }>()),
		updateEntity: createAction(`[${featureName}] Update Entity`, props<{ update: Update<T> }>()),
		updateEntities: createAction(`[${featureName}] Update Entities`, props<{ updates: Update<T>[] }>()),
		mapEntity: createAction(`[${featureName}] Map Entity`, props<{ entityMap: EntityMapOne<T> }>()),
		mapEntities: createAction(`[${featureName}] Map Entities`, props<{ entityMap: EntityMap<T> }>()),
		deleteEntity: createAction(`[${featureName}] Delete Entity`, props<{ id: string }>()),
		deleteEntities: createAction(`[${featureName}] Delete Entities`, props<{ ids: string[] }>()),
		deleteEntitiesByPredicate: createAction(`[${featureName}] Delete Entities By Predicate`, props<{ predicate: Predicate<T> }>()),
		clearEntities: createAction(`[${featureName}] Clear Entities`),
		...extendedActions
	}
}

export type BaseEntityActionsType<
	T extends UiEntity, 
	E extends { [key: string]: ActionCreator<any> } | undefined = undefined
> = ReturnType<typeof BaseEntityActions<SafeType<T>, E >>

// & {
// 	update: ActionCreator<`[${FeatureName}]: Update state`, (props: {
// 		cb: TypeSafeCallBack<T>
// 	}) => {
// 		cb: TypeSafeCallBack<T>
// 	} & TypedAction<`[${FeatureName}]: Update state`>>
// }

