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

		// TODO: get these from API as properties
		const dropboxId = 3;
		const entityId = 30221;
		const fileId = 79;
		const submissionId = 4;
		const ou = 123063;
		const host = 'f1ee0a3f5111.eu.ngrok.io';

		const qs = `dropboxId=${dropboxId}&entityId=${entityId}&fileId=${fileId}&submissionId=${submissionId}&ou=${ou}&host=https%3A%2F%2F${host}`;

		this._src = `http://localhost:8000?${qs}`;

		// TODO: use CDN for annotations viewer
		//this._iframeSrc = `//s.brightspace.com/apps/annotations-viewer/1.13.1/index.html?${qs}`;

		// TODO: get token from API
		this._token = '';
	}

	render() {
		return html`
			<consistent-evaluation-evidence
				class="consistent-eval-evidence"
				src="${this._src}"
				token="${this._token}"
			></consistent-evaluation-evidence>
		`;
	}
}

customElements.define('consistent-evaluation-left-panel', ConsistentEvaluationLeftPanel);
