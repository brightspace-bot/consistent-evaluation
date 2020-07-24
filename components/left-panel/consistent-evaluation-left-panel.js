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
			token: { type: String },
			_evidenceUrl: {
				attribute: false,
				type: String
			}
		};
	}

	static get styles() {
		return css`
			d2l-consistent-evaluation-evidence {
				overflow: hidden;
			}
			d2l-consistent-evaluation-submissions-page {
				width: 100%;
			}
		`;
	}

	_renderEvidence(e) {
		this._evidenceUrl = e.detail.url;
	}

	_renderSubmissionList() {
		this._evidenceUrl = undefined;
	}

	render() {
		if (this._evidenceUrl) {
			return html`
			<d2l-consistent-evaluation-evidence
				.url=${this._evidenceUrl}
				.token=${this.token}
				@d2l-consistent-evaluation-evidence-back-to-user-submissions=${this._renderSubmissionList}
			></d2l-consistent-evaluation-evidence>`;
		} else {
			return html`
			<d2l-consistent-evaluation-submissions-page
				submission-type=${this.submissionInfo && this.submissionInfo.submissionType}
				.submissionList=${this.submissionInfo && this.submissionInfo.submissionList}
				.token=${this.token}></d2l-consistent-evaluation-submissions-page>
				@d2l-consistent-evaluation-submission-item-render-evidence=${this._renderEvidence}
			></d2l-consistent-evaluation-submissions-page>`;
		}
	}
}

customElements.define('d2l-consistent-evaluation-left-panel', ConsistentEvaluationLeftPanel);
