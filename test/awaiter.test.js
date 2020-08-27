import { assert } from '@open-wc/testing';
import { Awaiter } from '../components/awaiter.js';

class MyObject {
	constructor(awaiter) {
		this.val = 'this is my object';
		this.awaiter = awaiter;
	}
	async change(newVal) {
		const unlock = await this.awaiter.lock();
		await new Promise((resolve) => {
			this.val = newVal;
			resolve();
		});
		unlock();
		return Promise.resolve();
	}
}

describe('Awaiter', () => {
	it('should do nothing when there is only one lock', async() => {
		const awaiter = new Awaiter();
		const obj = new MyObject(awaiter);
		await obj.change('changed object');
		assert.equal(obj.val, 'changed object');
	});

	it('should lock and unlock properly', async() => {
		const awaiter = new Awaiter();
		const obj1 = new MyObject(awaiter);
		const unlock = await awaiter.lock();
		const resolve = obj1.change('changed!');
		assert.equal(obj1.val, 'this is my object');
		await unlock();
		await resolve;
		assert.equal(obj1.val, 'changed!');
	});
});
