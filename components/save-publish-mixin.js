export const savePublishMixin = superclass => class extends superclass {
	static get properties() {
		return {
			_components: { type: Object },
			_eventHandlers: { type: Object }
		};
	}

	constructor() {
		super();
		this._components = [];
		this._eventHandlers = {};
	}

	/**
	 * Subscribe to event, usage:
	 *  menu.on('select', function(item) { ... }
	*/
	on(eventName, handler) {
		if (!this._eventHandlers) this._eventHandlers = {};
		if (!this._eventHandlers[eventName]) {
			this._eventHandlers[eventName] = [];
		}
		this._eventHandlers[eventName].push(handler);
	}

	/**
	 * Cancel the subscription, usage:
	 *  menu.off('select', handler)
	 */
	off(eventName, handler) {
		const handlers = this._eventHandlers?.[eventName];
		if (!handlers) return;
		for (let i = 0; i < handlers.length; i++) {
			if (handlers[i] === handler) {
				handlers.splice(i--, 1);
			}
		}
	}

	/**
	 * Generate an event with the given name and data
	 *  this.trigger('select', data1, data2);
	 */
	trigger(eventName, ...args) {
		console.log('in the save-publish-mixin', eventName);
		if (!this._eventHandlers || !this._eventHandlers[eventName]) {
			return; // no handlers for that event name
		}

		// call the handlers
		this._eventHandlers[eventName].forEach(handler => handler.apply(this, args));
	}

	mixinSave() {

	}
};
