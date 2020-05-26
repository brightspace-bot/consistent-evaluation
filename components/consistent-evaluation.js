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
			lastUpdated: { type: String }
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
		this.lastUpdated = undefined;
	}

	async updated(changedProperties) {
		//console.log(this.lastUpdated);
		super.updated();

		if (changedProperties.has('lastUpdated')) {
			this.lastUpdated = new Date().toTimeString();
		}

		if (changedProperties.has('href')) {
			const controller = new ConsistentEvaluationHrefController(this.href, this.token);
			this._childHrefs = await controller.getHrefs();
		}
	}

	onNextStudentClick() {
		this.href = this._childHrefs.nextHref;
	}

	saveDraft(e) {
		this.lastUpdated = new Date().toTimeString();
		const event = new CustomEvent('my-custom-event-save-draft-click',
			{ 'detail': this });
		window.dispatchEvent(event);
	}

	render() {
		return html`
			<d2l-consistent-evaluation-page id='zero'
				.rubricHref=${this._childHrefs && this._childHrefs.rubricHref}
				.rubricAssessmentHref=${this._childHrefs && this._childHrefs.rubricAssessmentHref}
				.outcomesHref=${this._childHrefs && this._childHrefs.outcomesHref}
				.gradeHref=${this._childHrefs && this._childHrefs.gradeHref}
				.evaluationHref=${this._childHrefs && this._childHrefs.evaluationHref}
				.nextStudentHref=${this._childHrefs && this._childHrefs.nextHref}
				.feedbackHref=${this._childHrefs && this._childHrefs.feedbackHref}
				.lastUpdated=${this.lastUpdated}
				.token=${this.token}
				?rubricReadOnly=${this._rubricReadOnly}
				?richTextEditorDisabled=${this._richTextEditorDisabled}
				@next-student-click=${this.onNextStudentClick}
				@save-draft=${this.saveDraft}
			></d2l-consistent-evaluation-page>
		`;
	}
}

customElements.define('d2l-consistent-evaluation', ConsistentEvaluation);
