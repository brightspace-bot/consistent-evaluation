export class Awaiter {
	constructor() {
		this.mutex = Promise.resolve();
	}

	lock() {
		let begin = () => {};

		this.mutex = this.mutex.then(() => {
			return new Promise(begin);
		});

		return new Promise(res => {
			begin = res;
		});
	}
}
