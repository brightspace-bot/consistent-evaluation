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
			_childHrefs: { type: Object }
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
	}

	async firstUpdated() {
		super.firstUpdated();

		const controller = new ConsistentEvaluationHrefController(this.href, this.token);
		this._childHrefs = await controller.getHrefs();
	}

	render() {
		return html`
			<d2l-consistent-evaluation-page
				.rubricHref=${this._childHrefs && this._childHrefs.rubricHref}
				.rubricAssessmentHref=${this._childHrefs && this._childHrefs.rubricAssessmentHref}
				.outcomesHref=${this._childHrefs && this._childHrefs.outcomesHref}
				.gradeHref=${this._childHrefs && this._childHrefs.gradeHref}
				.token=${this.token}
				?rubricReadOnly=${this._rubricReadOnly}
				?richTextEditorDisabled=${this._richTextEditorDisabled}
			></d2l-consistent-evaluation-page>
		`;
	}
}

customElements.define('d2l-consistent-evaluation', ConsistentEvaluation);
