import '@brightspace-ui-labs/grade-result/d2l-grade-result.js';
import './consistent-evaluation-right-panel-block';
import { html, LitElement } from 'lit-element';

export class ConsistentEvaluationGradeResult extends LitElement {

	static get properties() {
		return {
			href: { type: String },
			token: { type: String },
			lastUpdated: { type: String }
		};
	}

	constructor() {
		super();

		this._href = undefined;
		this._token = undefined;
		this._lastupdated = undefined;
	}

	get lastUpdated() {
		return this._lastUpdated;
	}

	set lastUpdated(newDate) {
		if (newDate) {
			const oldVal = this._lastupdated;
			if (oldVal !== newDate) {
				const actualGradeResult = this.shadowRoot.querySelector('d2l-labs-d2l-grade-result');
				console.log('saveGrade saving to db');
				// console.log(gradeResult);
				// gradeResult.saveGrade();
				actualGradeResult.saveGrade();
				this._lastUpdated = newDate;
				this.requestUpdate('lastUpdated', oldVal);
			}
		}
	}

	render() {
		return html`
			<d2l-consistent-evaluation-right-panel-block title="Overall Grade">
				<d2l-labs-d2l-grade-result
					.href=${this.href}
					.token=${this.token}
					.lastupdated=${this.lastUpdated}
					disableAutoSave
					_hideTitle
				></d2l-labs-d2l-grade-result>
			</d2l-consistent-evaluation-right-panel-block>
		`;
	}
}
customElements.define('d2l-consistent-evaluation-grade-result', ConsistentEvaluationGradeResult);
