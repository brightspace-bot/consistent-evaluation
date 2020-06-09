import './footer/consistent-evaluation-footer.js';
import './left-panel/consistent-evaluation-left-panel.js';
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
			feedbackHref: { type: String },
			evaluationHref: { type: String },
			nextStudentHref: { type: String },
			token: { type: String },
			rubricReadOnly: { type: Boolean },
			richTextEditorDisabled: { type: Boolean }
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
				<div slot="header"><h1>Assignment 1</h1></div>
				<div slot="primary">
					<d2l-consistent-evaluation-left-panel
					></d2l-consistent-evaluation-left-panel>
				</div>
				<div slot="secondary">
					<consistent-evaluation-right-panel
						rubricHref="../../demo/data/rubric.json"
						rubricAssessmentHref="../../demo/data/assessment.json"
						outcomesHref="../../demo/data/outcomes/suggested-level.json"
						gradeHref="../../demo/data/grade/grade.json"
						token=${this.token}
						?rubricReadOnly=${this.rubricReadOnly}
						?richTextEditorDisabled=${this.richTextEditorDisabled}
					></consistent-evaluation-right-panel>
				</div>
				<div slot="footer">
					<d2l-consistent-evaluation-footer
						.evaluationHref=${this.evaluationHref}
						.nextStudentHref=${this.nextStudentHref}
						.token=${this.token}
					></d2l-consistent-evaluation-footer>
				</div>
			</d2l-template-primary-secondary>
		`;
	}

}
customElements.define('d2l-consistent-evaluation-page', ConsistentEvaluationPage);
