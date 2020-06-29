import './footer/consistent-evaluation-footer.js';
import './right-panel/consistent-evaluation-right-panel.js';
import './left-panel/consistent-evaluation-submissions-page.js';
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
			richTextEditorDisabled: { type: Boolean },
			submissionList: { type: Array },
			evaluationState: { type: String }
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
						<d2l-consistent-evaluation-submissions-page
						.submissionList=${this.submissionList}
						evaluationState=${this.evaluationState}
						.token=${this.token}></d2l-consistent-evaluation-submissions-page>
					</div>
				</div>
				<div slot="secondary">
					<consistent-evaluation-right-panel
						rubricHref=${this.rubricHref}
						rubricAssessmentHref=${this.rubricAssessmentHref}
						outcomesHref=${this.outcomesHref}
						gradeHref=${this.gradeHref}
						feedbackHref=${this.evaluationHref}
						.token=${this.token}
						?rubricReadOnly=${this.rubricReadOnly}
						?richTextEditorDisabled=${this.richTextEditorDisabled}
						?hideRubric=${this.rubricHref === undefined}
						?hideGrade=${this.gradeHref === undefined}
						?hideOutcomes=${this.outcomesHref === undefined}
						?hideFeedback=${this.feedbackHref === undefined}
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
