import './right-panel/consistent-evaluation-right-panel.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui/core/templates/primary-secondary/primary-secondary.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

export default class ConsistentEvaluationPage extends LitElement {

	static get properties() {
		return {
			rubricHref: { type: String },
			rubricAssessmentHref: { type: String },
			outcomesHref: { type: String },
			gradeHref: { type: String },
			token: { type: String },
			rubricReadOnly: { type: Boolean },
			richTextEditorDisabled: { type: Boolean },
			hideRubric: { type: Boolean },
			hideGrade: { type: Boolean },
			hideFeedback: { type: Boolean },
			hideOutcomes: { type: Boolean },
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	render() {
		return html`
			<d2l-template-primary-secondary>
				<div slot="header"><h1>Hello, consistent-evaluation!</h1></div>
				<div slot="primary">
					<div>
						<span>evidence</span>
					</div>
				</div>
				<div slot="secondary">
					<consistent-evaluation-right-panel
						rubricHref=${this.rubricHref}
						rubricAssessmentHref=${this.rubricAssessmentHref}
						outcomesHref=${this.outcomesHref}
						gradeHref=${this.gradeHref}
						token=${this.token}
						?rubricReadOnly=${this.rubricReadOnly}
						?richTextEditorDisabled=${this.richTextEditorDisabled}
						?hideRubric=${this.hideRubric}
						?hideGrade=${this.hideGrade}
						?hideFeedback=${this.hideFeedback}
						?hideOutcomes=${this.hideOutcomes}
					></consistent-evaluation-right-panel>
				</div>
			</d2l-template-primary-secondary>
		`;
	}

}
customElements.define('d2l-consistent-evaluation-page', ConsistentEvaluationPage);
