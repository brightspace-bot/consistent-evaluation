import './consistent-evaluation-evidence.js';
import { css, html, LitElement } from 'lit-element';

export class ConsistentEvaluationLeftPanel extends LitElement {

	static get properties() {
		return {
			url: { type: String },
			token: { type: String }
		};
	}

	static get styles() {
		return css`
			#d2l-consistent-evaluation-left-panel-evidence {
				overflow: hidden;
			}
		`;
	}

	constructor() {
		super();

		// TODO: remove this once url comes from the API

		const qs = 'dropboxId=3&entityId=30220&fileId=79&submissionId=4&ou=123063&host=https%3A%2F%2F11709704b303.eu.ngrok.io';
		this.url = `http://localhost:8000?${qs}`;

		// TODO: remove this once token comes from API
		this.token = '';
	}

	render() {
		return html`
			<d2l-consistent-evaluation-evidence
				class="d2l-consistent-evaluation-left-panel-evidence"
				url="${this.url}"
				token="${this.token}"
			></d2l-consistent-evaluation-evidence>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-left-panel', ConsistentEvaluationLeftPanel);
