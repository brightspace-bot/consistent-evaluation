import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import './consistent-evaluation-evidence.js';
import './consistent-evaluation-submissions-page.js';
import { css, html, LitElement } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export class ConsistentEvaluationLeftPanel extends LitElement {

	static get properties() {
		return {
			submissionInfo: {
				attribute: false,
				type: Object
			},
			token: { type: String }
		};
	}

	static get styles() {
		return css`
			#d2l-consistent-evaluation-left-panel-evidence {
				overflow: hidden;
			}
			d2l-consistent-evaluation-submissions-page {
				width: 100%;
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
		this.addEventListener('d2l-consistent-evaluation-evidence-back-to-user-submissions', this._renderSubmissionList);
		super.connectedCallback();
	}

	disconnectedCallback() {
		this.removeEventListener('d2l-consistent-evaluation-submission-item-render-evidence', this._renderEvidence);
		this.removeEventListener('d2l-consistent-evaluation-evidence-back-to-user-submissions', this._renderSubmissionList);
		super.disconnectedCallback();
	}

	_renderEvidence(e) {
		this.displayEvidence = true;
		this._evidenceUrl = e.detail.url;
	}

	_renderSubmissionList() {
		this.displayEvidence = false;
		this._evidenceUrl = undefined;
	}

	render() {
		return html`${this.displayEvidence ?
			html`
			<d2l-consistent-evaluation-evidence
				class="d2l-consistent-evaluation-left-panel-evidence"
				.url=${this._evidenceUrl}
				.token=${this.token}
			></d2l-consistent-evaluation-evidence>` :
			html`
			<d2l-consistent-evaluation-submissions-page
				due-date=${ifDefined(this.submissionInfo && this.submissionInfo.dueDate)}
				evaluation-state=${this.submissionInfo && this.submissionInfo.evaluationState}
				submission-type=${this.submissionInfo && this.submissionInfo.submissionType}
				.submissionList=${this.submissionInfo && this.submissionInfo.submissionList}
				.token=${this.token}
			></d2l-consistent-evaluation-submissions-page>`
		}`;
	}
}

customElements.define('d2l-consistent-evaluation-left-panel', ConsistentEvaluationLeftPanel);
