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
		window.addEventListener('my-custom-event-save-draft-click', this.test, false);
	}

	get lastUpdated() {
		return this._lastUpdated;
	}

	set lastUpdated(newDate) {
		console.log('newDate');
		console.log(newDate);
		if (newDate) {
			// console.log(newDate);
			const oldVal = this._lastupdated;
			if (oldVal !== newDate) {
				console.log('this for grade result lastUpdated');
				console.log(this);
				let gradeBlock = this.shadowRoot.getElementById('graderpblock');
				if (gradeBlock) {
					const gradeResult = gradeBlock.getElementsByTagName('d2l-labs-d2l-grade-result')[0];
					// this works but is really ugly. is there a better way?
					console.log('saveGrade saving to db');
					// console.log(gradeResult);
					gradeResult.saveGrade();
				}
				this._lastUpdated = newDate;
				this.requestUpdate('lastUpdated', oldVal);
			}
		}
	}

	test(e) {
		console.log('reaching here');
		const page = e.detail;
		console.log(page);
	}

	render() {
		return html`
			<d2l-consistent-evaluation-right-panel-block title="Overall Grade" id="graderpblock">
				<d2l-labs-d2l-grade-result
					.href=${this.href}
					.token=${this.token}
					.lastupdated=${this.lastUpdated}
					@my-custom-event-save-draft-click=${this.test}
					disableAutoSave
					_hideTitle
				></d2l-labs-d2l-grade-result>
			</d2l-consistent-evaluation-right-panel-block>
		`;
	}
}
customElements.define('d2l-consistent-evaluation-grade-result', ConsistentEvaluationGradeResult);
