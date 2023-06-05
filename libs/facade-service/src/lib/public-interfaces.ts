export interface BaseState {
	isLoading: boolean;
	errors: Record<string,string>
}

export interface BaseEntityState<T extends UiEntity> extends BaseState {
	entities: Record<string,T>;
	ids: string[];
	selectedEntity: T | null;
}

export interface UiEntity {
	id: string;
}
