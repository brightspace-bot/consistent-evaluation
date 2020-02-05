import { addScore } from './score';
import { observable } from 'mobx';

export const createStore = () => {
	let store = observable({});

	store = addScore(store);

	return store;
};

export default createStore();
