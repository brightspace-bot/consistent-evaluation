import { assert } from '@open-wc/testing';

const hasChild = (obj) => {
	return !(obj instanceof Array) && !!Object.keys(obj).length;
};

const isGetter = (obj, prop) => {
	const getter = Object.getOwnPropertyDescriptor(obj, prop);
	return (getter && getter.get);
};

export const validate = (schema, store) => {
	for (const field in store) {
		if (field !== 'root') {
			if (hasChild(store[field])) {
				validate(schema[field], store[field]);
			} else {
				assert.deepEqual(store[field], schema[field]);
			}
		}
	}
	for (const getter in Object.getPrototypeOf(store)) {
		if (isGetter(store, getter)) {
			assert.deepEqual(store[getter], schema[getter]);
		}
	}
};
