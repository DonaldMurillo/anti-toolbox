import { BaseSimpleState } from "@anti-toolbox/state-management/interfaces";

export interface UiEntity {
	id: string;
}

export interface BaseEntityState<T extends UiEntity> extends BaseSimpleState {
	entities: Record<string,T>;
	ids: string[];
	selectedEntity: T | null;
}
