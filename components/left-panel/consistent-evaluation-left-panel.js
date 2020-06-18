import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import './consistent-evaluation-evidence.js';
import './consistent-evaluation-submissions-page.js';
import { css, html, LitElement } from 'lit-element';

export class ConsistentEvaluationLeftPanel extends LitElement {

	static get properties() {
		return {
			submissionList: { type: Array },
			token: { type: String },
			evaluationState: { type: String },
			displayEvidence: { type: Boolean }
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

		this._evidenceUrl = undefined;
		this._displayEvidence = false;
	}

	get displayEvidence() {
		return this._displayEvidence;
	}

	set displayEvidence(newVal) {
		const oldVal = this._displayEvidence;
		if (oldVal !== newVal) {
			this._displayEvidence = newVal;
			this.requestUpdate('displayEvidence', oldVal);
		}
	}

	connectedCallback() {
		this.addEventListener('d2l-consistent-evaluation-submission-item-render-evidence', this._renderEvidence);
		super.connectedCallback();
	}

	disconnectedCallback() {
		this.removeEventListener('d2l-consistent-evaluation-submission-item-render-evidence', this._renderEvidence);
		super.disconnectedCallback();
	}

	_renderEvidence(e) {
		this.displayEvidence = true;
		this._evidenceUrl = e.detail.url;
	}

	render() {
		return html`
			<d2l-consistent-evaluation-evidence
				class="d2l-consistent-evaluation-left-panel-evidence"
				.url=${this._evidenceUrl}
				.token=${this.token}
				?hidden=${!this.displayEvidence}
			></d2l-consistent-evaluation-evidence>
			<d2l-consistent-evaluation-submissions-page
				.submissionList=${this.submissionList}
				evaluationState=${this.evaluationState}
				.token=${this.token}
				?hidden=${this.displayEvidence}
			></d2l-consistent-evaluation-submissions-page>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-left-panel', ConsistentEvaluationLeftPanel);
