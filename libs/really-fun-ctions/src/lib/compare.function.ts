/**
 * Compares 2 strongly typed objects. If object has nested objects or is array, it performs recursion
 * @template T defining the type creates initial comparison;
 * @param objOne
 * @param objTwo
 * @param exclude
 * @returns
 */

export function compareObject<T>(
	objOne: T,
	objTwo: T,
	exclude?: [keyof T]
): boolean {
	//IF NULL OR UNDEFINED
	if (
		(objOne === null && objTwo === null) ||
		(objOne === undefined && objTwo === undefined)
	) {
		return true;
	} else if (
		(objOne === null && objTwo !== null) ||
		(objOne !== null && objTwo === null)
	) {
		return false;
	} else if (
		(objOne === undefined && objTwo !== undefined) ||
		(objOne !== undefined && objTwo === undefined)
	) {
		return false;
	}
	// IF STRINGS
	else if (typeof objOne === 'string' && typeof objTwo === 'string') {
		return objOne.trim() === objTwo.trim();
	}
	// IF ARRAY
	else if (Array.isArray(objOne) && Array.isArray(objTwo)) {
		if (objOne.length !== objTwo.length) return false;
		return objOne.every((item) => objTwo.find((i) => compareObject(i, item))); //TODO: VERIFY
	}
	// IF OBJECTS
	else if (typeof objOne === 'object' && typeof objTwo === 'object' && objOne && objTwo) {
		const objOneKeys =
			(Object.keys(objOne) as [keyof T])?.filter(
				(k) => !exclude?.includes(k)
			) ?? [];
		const objTwoKeys =
			(Object.keys(objTwo) as [keyof T])?.filter(
				(k) => !exclude?.includes(k)
			) ?? [];
		if (objOneKeys.length !== objTwoKeys.length) return false;
		else {
			return objOneKeys.every((k) => compareObject(objOne[k], objTwo[k]));
		}
	}
	// EVERYTHING ELSE
	else return objOne === objTwo;
}
