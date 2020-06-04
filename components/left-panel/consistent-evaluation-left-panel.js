import './consistent-evaluation-evidence.js';
import { css, html, LitElement } from 'lit-element';

export class ConsistentEvaluationLeftPanel extends LitElement {

	static get properties() {
		return {
		};
	}

	static get styles() {
		return css`
			#consistent-eval-evidence {
				overflow: hidden;
			}
		`;
	}

	constructor() {
		super();

		const qs = 'dropboxId=3&entityId=30221&fileId=79&submissionId=4&ou=123063&host=https%3A%2F%2F223f1313e448.eu.ngrok.io';

		this._iframeSrc = `http://localhost:8000?${qs}`;
		//this._iframeSrc = `//s.brightspace.com/apps/annotations-viewer/1.13.1/index.html?${qs}`;

		this._token = '';
	}

	render() {
		return html`
			<consistent-evaluation-evidence
				class="consistent-eval-evidence"
				src="${this._iframeSrc}"
				token="${this._token}"
			></consistent-evaluation-evidence>
		`;
	}
}

customElements.define('consistent-evaluation-left-panel', ConsistentEvaluationLeftPanel);
