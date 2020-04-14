import './consistent-evaluation-page.js';
import { html } from 'lit-element';
import { MobxLitElement } from '@adobe/lit-mobx';
import RootStore from './stores/root.js';

export class ConsistentEvaluation extends MobxLitElement {

	static get properties() {
		return {
			rubricHref: { type: String },
			rubricAssessmentHref: { type: String },
			outcomesHref: { type: String },
			gradeHref: { type: String },
			token: { type: String },
			_rubricReadOnly: { type: Boolean },
			_richTextEditorDisabled: { type: Boolean },
			_hideRubric: { type: Boolean },
			_hideGrade: { type: Boolean },
			_hideFeedback: { type: Boolean },
			_hideOutcomes: { type: Boolean },
		};
	}

	constructor() {
		super();
		this.store = new RootStore();

		this._rubricReadOnly = false;
		this._richTextEditorDisabled = false;
		this._hideRubric = false;
		this._hideGrade = false;
		this._hideFeedback = false;
		this._hideOutcomes = false;
	}

	render() {
		return html`
			<d2l-consistent-evaluation-page
				.rubricHref=${this.rubricHref}
				.rubricAssessmentHref=${this.rubricAssessmentHref}
				.outcomesHref=${this.outcomesHref}
				.gradeHref=${this.gradeHref}
				.token=${this.token}
				?rubricReadOnly=${this._rubricReadOnly}
				?richTextEditorDisabled=${this._richTextEditorDisabled}
				?hideRubric=${this._hideRubric}
				?hideGrade=${this._hideGrade}
				?hideFeedback=${this._hideFeedback}
				?hideOutcomes=${this._hideOutcomes}
			></d2l-consistent-evaluation-page>
		`;
	}
}

customElements.define('d2l-consistent-evaluation', ConsistentEvaluation);
