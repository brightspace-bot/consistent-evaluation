import d2lTelemetryBrowserClient from 'd2l-telemetry-browser-client';

export const ConsistentEvalTelemetryMixin = superclass => class extends superclass {
	static get properties() {
		return {
			dataTelemetryEndpoint: {
				type: String
			}
		};
	}
	constructor() {
		super();
		this.eventType = 'TelemetryEvent';
		this.sourceId = 'consistent-eval';
	}

	connectedCallback() {
		super.connectedCallback();
		if (this.constructor.name !== 'ConsistentEvaluation') {
			window.onload = this._sendTelemetry();
		}
	}

	_logEvent(eventBody) {
		if (!eventBody || !this.dataTelemetryEndpoint) {
			console.log('missing dataTelemetryEndpoint', this.dataTelemetryEndpoint);
			return;
		}
		console.log('datatelpt', this.dataTelemetryEndpoint);

		const client = new d2lTelemetryBrowserClient.Client({ endpoint: this.dataTelemetryEndpoint });

		const event = new d2lTelemetryBrowserClient.TelemetryEvent()
			.setDate(new Date())
			.setType(this.eventType)
			.setSourceId(this.sourceId)
			.setBody(eventBody);

		client.logUserEvent(event);

		return event;
	}
	perfMark(name) {
		if (!window.performance || !window.performance.mark) {
			return;
		}
		window.performance.mark(name);
	}
	logAndDestroyPerformanceEvent(viewName, startMark, endMark, destroyAll = false) {
		if (!window.performance || !window.performance.measure || !this._markExists(startMark)) {
			return;
		}
		window.performance.measure(viewName, startMark, endMark);
		const eventBody = new d2lTelemetryBrowserClient.PerformanceEventBody()
			.setAction('LoadView')
			.addUserTiming(window.performance.getEntriesByName(viewName))
			.addCustom('ViewName', `${viewName}LoadTime`);

		this._logEvent(eventBody);
		if (destroyAll) {
			window.performance.clearMarks(startMark);
		}
		window.performance.clearMarks(endMark);
		window.performance.clearMeasures(viewName);

		//returning event body to be consistent and to help with tests
		console.log(eventBody);
		return eventBody;
	}
	_markExists(markName) {
		return window.performance.getEntriesByName(markName, 'mark').length > 0 ? true : false;
	}
	async _sendTelemetry() {
		await this.updateComplete;
		this.perfMark(this.constructor.name);
		this.logAndDestroyPerformanceEvent(`${this.constructor.name}LoadTime`, 'ConsistentEvaluation', this.constructor.name);
	}
};
