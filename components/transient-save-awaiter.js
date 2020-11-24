export class TransientSaveAwaiter {
    constructor() {
        this._pendingTransientSaves = [];
    }

    addTransientSave(promise) {
        this._pendingTransientSaves.push(promise);
        return this._pendingTransientSaves;
	}

	async awaitAllTransientSaves() {
        const resolvedSaves = await Promise.all(this._pendingTransientSaves);
        this._pendingTransientSaves = [];
        return resolvedSaves;
	}
}