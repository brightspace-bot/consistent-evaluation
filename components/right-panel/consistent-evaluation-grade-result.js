import '@brightspace-ui-labs/grade-result/d2l-grade-result.js';
import './consistent-evaluation-right-panel-block';
import { html, LitElement } from 'lit-element';

export class ConsistentEvaluationGradeResult extends LitElement {

	static get properties() {
		return {
			href: { type: String },
			token: { type: String }
		};
	}

	onInitializedSuccess(e) {
		console.log('initialized success', e);
	}

	onInitializedError(e) {
		console.log('initialized error', e);
	}

	onGradeUpdatedSuccess(e) {
		console.log('grade updated success', e);
	}

	onGradeUpdatedError(e) {
		console.log('grade updated error', e);
	}

	onGradeSavedSuccess(e) {
		console.log('grade saved success', e);
	}

	onGradeSavedError(e) {
		console.log('grade saved error', e);
	}

	render() {
		return html`
			<d2l-consistent-evaluation-right-panel-block title="Overall Grade">
				<d2l-labs-d2l-grade-result
					.href=${this.href}
					.token=${this.token}
					_hideTitle
					@d2l-grade-result-initialized-success=${this.onInitializedSuccess}
					@d2l-grade-result-initialized-error=${this.onInitializedError}
					@d2l-grade-result-grade-updated-success=${this.onGradeUpdatedSuccess}
					@d2l-grade-result-grade-updated-error=${this.onGradeUpdatedError}
					@d2l-grade-result-grade-saved-success=${this.onGradeSavedSuccess}
					@d2l-grade-result-grade-saved-error=${this.onGradeSavedError}
				></d2l-labs-d2l-grade-result>
			</d2l-consistent-evaluation-right-panel-block>
		`;
	}
}
customElements.define('d2l-consistent-evaluation-grade-result', ConsistentEvaluationGradeResult);
