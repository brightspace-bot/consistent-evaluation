import './footer/consistent-evaluation-footer.js';
import './right-panel/consistent-evaluation-right-panel.js';
import './left-panel/consistent-evaluation-submissions-page.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui/core/templates/primary-secondary/primary-secondary.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

export default class ConsistentEvaluationPage extends LitElement {

	static get properties() {
		return {
			rubricHref: {
				attribute: 'rubric-href',
				type: String
			},
			rubricAssessmentHref: {
				attribute: 'rubric-assessment-href',
				type: String
			},
			outcomesHref: {
				attribute: 'outcomes-href',
				type: String
			},
			gradeHref: {
				attribute: 'grade-href',
				type: String
			},
			feedbackHref: {
				attribute: 'feedback-href',
				type: String
			},
			evaluationHref: {
				attribute: 'evaluation-href',
				type: String
			},
			nextStudentHref: {
				attribute: 'next-student-href',
				type: String
			},
			token: {
				type: String
			},
			rubricReadOnly: {
				attribute: 'rubric-read-only',
				type: Boolean
			},
			richTextEditorDisabled: {
				attribute: 'rich-text-editor-disabled',
				type: Boolean
			},
			submissionList: {
				attribute: 'submission-list',
				type: Array
			},
			evaluationState: {
				attribute: 'evaluation-state',
				type: String
			}
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
						.submission-list=${this.submissionList}
						evaluation-state=${this.evaluationState}
						.token=${this.token}></d2l-consistent-evaluation-submissions-page>
					</div>
				</div>
				<div slot="secondary">
					<consistent-evaluation-right-panel
						rubric-href=${this.rubricHref}
						rubric-assessment-href=${this.rubricAssessmentHref}
						outcomes-href=${this.outcomesHref}
						grade-href=${this.gradeHref}
						feedback-href=${this.feedbackHref}
						.token=${this.token}
						?rubric-read-only=${this.rubricReadOnly}
						?rich-text-editor-disabled=${this.richTextEditorDisabled}
						?hide-rubric=${this.rubricHref === undefined}
						?hide-grade=${this.gradeHref === undefined}
						?hide-outcomes=${this.outcomesHref === undefined}
						?hide-feedback=${this.feedbackHref === undefined}
					></consistent-evaluation-right-panel>
				</div>
				<div slot="footer">
					<d2l-consistent-evaluation-footer
						.evaluation-href=${this.evaluationHref}
						.nextStudent-href=${this.nextStudentHref}
						.token=${this.token}
					></d2l-consistent-evaluation-footer>
				</div>
			</d2l-template-primary-secondary>
		`;
	}

}
customElements.define('d2l-consistent-evaluation-page', ConsistentEvaluationPage);
