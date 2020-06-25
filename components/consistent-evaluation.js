import './consistent-evaluation-page.js';
import { ConsistentEvaluationHrefController } from './controllers/ConsistentEvaluationHrefController.js';
import { html } from 'lit-element';
import { MobxLitElement } from '@adobe/lit-mobx';
import RootStore from './stores/root.js';

export class ConsistentEvaluation extends MobxLitElement {

	static get properties() {
		return {
			href: { type: String },
			token: { type: String },
			_rubricReadOnly: { type: Boolean },
			_richTextEditorDisabled: { type: Boolean },
			_childHrefs: { type: Object },
			_submissionInfo: { type: Object }
		};
	}

	constructor() {
		super();
		this.store = new RootStore();

		this.href = undefined;
		this.token = undefined;
		this._rubricReadOnly = false;
		this._richTextEditorDisabled = false;
		this._childHrefs = undefined;
		this._submissionInfo = undefined;
	}

	async updated(changedProperties) {
		super.updated();

		if (changedProperties.has('href')) {
			const controller = new ConsistentEvaluationHrefController(this.href, this.token);
			this._childHrefs = await controller.getHrefs();
			this._submissionInfo = await controller.getSubmissionInfo();
		}
	}

	onNextStudentClick() {
		this.href = this._childHrefs.nextHref;
	}

	render() {
		return html`
			<d2l-consistent-evaluation-page
				.rubricHref=${this._childHrefs && this._childHrefs.rubricHref}
				.rubricAssessmentHref=${this._childHrefs && this._childHrefs.rubricAssessmentHref}
				.outcomesHref=${this._childHrefs && this._childHrefs.outcomesHref}
				.gradeHref=${this._childHrefs && this._childHrefs.gradeHref}
				.evaluationHref=${this._childHrefs && this._childHrefs.evaluationHref}
				.nextStudentHref=${this._childHrefs && this._childHrefs.nextHref}
				.feedbackHref=${this._childHrefs && this._childHrefs.feedbackHref}
				.submissionList=${this._submissionInfo && this._submissionInfo.submissionList}
				.evaluationState=${this._submissionInfo && this._submissionInfo.evaluationState}
				.submissionType=${this._submissionInfo && this._submissionInfo.submissionType}
				.activityDueDate=${this._submissionInfo && this._submissionInfo.dueDate}
				.token=${this.token}
				?rubricReadOnly=${this._rubricReadOnly}
				?richTextEditorDisabled=${this._richTextEditorDisabled}
				@next-student-click=${this.onNextStudentClick}
			></d2l-consistent-evaluation-page>
		`;
	}
}

customElements.define('d2l-consistent-evaluation', ConsistentEvaluation);
