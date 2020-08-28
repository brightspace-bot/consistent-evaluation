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
	logAndDestroyPerformanceEvent(component, startMark, endMark, destroyAll = false) {
		if (!window.performance || !window.performance.measure || !this._markExists(startMark)) {
			return;
		}
		window.performance.measure(component, startMark, endMark);
		const eventBody = new d2lTelemetryBrowserClient.PerformanceEventBody()
			.setAction('RenderComponent')
			.addUserTiming(window.performance.getEntriesByName(component))
			.addCustom('Component', `${component}LoadTime`);

		this._logEvent(eventBody);
		if (destroyAll) {
			window.performance.clearMarks(startMark);
		}
		window.performance.clearMarks(endMark);
		window.performance.clearMeasures(component);

		//returning event body to be consistent and to help with tests
		return eventBody;
	}
	_markExists(markName) {
		return window.performance.getEntriesByName(markName, 'mark').length > 0 ? true : false;
	}
	async _sendTelemetry() {
		await this.updateComplete;
		this.perfMark(`${this.constructor.name}End`);
		this.logAndDestroyPerformanceEvent(`${this.constructor.name}`, 'ConsistentEvaluationStart', `${this.constructor.name}End`);
	}
};
