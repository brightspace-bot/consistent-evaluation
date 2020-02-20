import { assert } from '@open-wc/testing';

const hasChild = (obj) => {
	return !(obj instanceof Array) && !!Object.keys(obj).length;
};

export const validate = (schema, store) => {
	for (const field in schema) {
		if (hasChild(schema[field])) {
			validate(schema[field], store[field]);
		} else {
			assert.deepEqual(store[field], schema[field]);
		}
	}
};
