import { createEntityAdapter } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store"
import { BaseEntityActionsType } from "./base-entity.actions"
import type { SafeType } from "./base-store.models"
import type { BaseEntityState, UiEntity } from "./public-interfaces";

export function selectEntityId(entity: UiEntity): string {
	//In this case this would be optional since primary key is id
	return entity.id;
}

export function sortByName(entityA: UiEntity, entityB: UiEntity): number {
	return entityA.id.localeCompare(entityB.id);
}



export const adapter = createEntityAdapter<UiEntity>({
	selectId: selectEntityId,
	// sortComparer: sortByName,
});


export const BaseEntityReducer = <T extends SafeType<UiEntity>,  TState extends BaseEntityState<T>, FeatureName extends string>(
	initialState: TState, 
	baseEntityActions:  BaseEntityActionsType<T>
	) => {

	return createReducer(
		initialState,
		on(baseEntityActions.startLoading, (state) => ({ ...state, isLoading: true })),
		on(baseEntityActions.finishLoading, (state) => ({ ...state, isLoading: false })),
		on(baseEntityActions.update, (state, action ) => {	return {...action.cb(state as any) as any} }), //TODO: FIX TYPESAFETY
		on(baseEntityActions.addError, (state, { errorName, value }) => ({ ...state, errors: { [errorName]: value } })),
		on(baseEntityActions.clearErrors, (state) => ({ ...state, errors: {} })),
		on(baseEntityActions.addEntity, (state, { entity }) => {
			return adapter.addOne(entity, state)
		 }),
		 on(baseEntityActions.setEntity, (state, { entity }) => {
			return adapter.setOne(entity, state)
		 }),
		 on(baseEntityActions.upsertEntity, (state, { entity }) => {
			return adapter.upsertOne(entity, state);
		 }),
		 on(baseEntityActions.addEntities, (state, { entities }) => {
			return adapter.addMany(entities, state);
		 }),
		 on(baseEntityActions.upsertEntities, (state, { entities }) => {
			return adapter.upsertMany(entities, state);
		 }),
		 on(baseEntityActions.updateEntity, (state, { update }) => {
			return adapter.updateOne(update, state);
		 }),
		 on(baseEntityActions.updateEntities, (state, { updates }) => {
			return adapter.updateMany(updates, state);
		 }),
		//  on(baseEntityActions.mapEntity, (state, { entityMap }) => {
		// 	return adapter.mapOne(entityMap, state);
		//  }),
		//  on(baseEntityActions.mapEntities, (state, { entityMap }) => {
		// 	return adapter.map(entityMap, state);
		//  }),
		 on(baseEntityActions.deleteEntity, (state, { id }) => {
			return adapter.removeOne(id, state);
		 }),
		 on(baseEntityActions.deleteEntities, (state, { ids }) => {
			return adapter.removeMany(ids, state);
		 }),
		//  on(baseEntityActions.deleteEntitiesByPredicate, (state, { predicate }) => {
		// 	return adapter.removeMany(predicate, state);
		//  }),
		 on(baseEntityActions.loadEntities, (state, { entities }) => {
			return adapter.setAll(entities, state);
		 }),
		 on(baseEntityActions.setEntities, (state, { entities }) => {
			return adapter.setMany(entities, state);
		 }),
		 on(baseEntityActions.clearEntities, state => {
			return adapter.removeAll({ ...state, selectedEntityId: null });
		 })
	)
} 

