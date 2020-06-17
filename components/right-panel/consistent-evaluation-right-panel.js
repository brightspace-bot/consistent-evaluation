import './consistent-evaluation-feedback.js';
import './consistent-evaluation-outcomes.js';
import './consistent-evaluation-rubric.js';
import './consistent-evaluation-grade-result.js';
import '../footer/consistent-evaluation-footer.js';
import '@brightspace-ui-labs/grade-result/d2l-grade-result.js';
import { css, html, LitElement } from 'lit-element';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { loadLocalizationResources } from '../locale.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { RightPanelController } from '../controllers/RightPanelController.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';

export class ConsistentEvaluationRightPanel extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			evaluationHref: { type: String },
			feedbackText: { type: String },
			rubricHref: { type: String },
			rubricAssessmentHref: { type: String },
			outcomesHref: { type: String },
			token: { type: String },
			rubricReadOnly: { type: Boolean },
			richTextEditorDisabled: { type: Boolean },
			hideRubric: { type: Boolean },
			hideGrade: { type: Boolean },
			hideFeedback: { type: Boolean },
			hideOutcomes: { type: Boolean },
			_richTextEditorConfig: { type: Object }
		};
	}

	static get styles() {
		return css``;
	}

	static async getLocalizeResources(langs) {
		return await loadLocalizationResources(langs);
	}

	constructor() {
		super();

		this._evaluationHref = undefined;
		this._token = undefined;
		this._richTextEditorConfig = {};
		this._debounceJobs = {};

		this.hideRubric = false;
		this.hideGrade = false;
		this.hideFeedback = false;
		this.hideOutcomes = false;
		this.feedbackText = '';

		// window.addEventListener('on-d2l-consistent-evaluation-save-draft', this._saveEvaluationDraft.bind(this));
	}

	get evaluationHref() {
		return this._evaluationHref;
	}

	set evaluationHref(val) {
		const oldVal = this.evaluationHref;
		if (oldVal !== val) {
			this._evaluationHref = val;
			if (this._evaluationHref && this._token) {
				if (oldVal) {
					this.requestUpdate('evaluationHref', oldVal);
				}
				else {
					this._initializeController().then(() => this.requestUpdate());
				}
			}
		}
	}

	get token() {
		return this._token;
	}

	set token(val) {
		const oldVal = this.token;
		if (oldVal !== val) {
			this._token = val;
			if (this._evaluationHref && this._token) {
				this._initializeController().then(() => this.requestUpdate());
			}
		}
	}

	async _initializeController() {
		this._controller = new RightPanelController(this._evaluationHref, this._token);
		const feedback = await this._controller.requestFeedbackEntity();
		this.feedbackText = feedback.properties.text ? feedback.properties.text : '';
	}

	async _transientSaveFeedback(e) {
		this.feedbackText = e.detail.content;

		this._debounceJobs.feedback = Debouncer.debounce(
			this._debounceJobs.feedback,
			timeOut.after(500),
			async() => { this._emitTransientSaveEvent('on-transient-save-feedback', this.feedbackText); }
		);
	}

	async _transientSaveGrade(e) {
		const type = e.detail.grade.scoreType;
		if (type === 'LetterGrade') {
			this._emitTransientSaveEvent('on-transient-save-grade', e.detail.grade.letterGrade);
		}
		else if (type === 'Numeric') {
			this._emitTransientSaveEvent('on-transient-save-grade', e.detail.grade.score);
		}
	}

	_emitTransientSaveEvent(eventName, newValue) {
		this.dispatchEvent(new CustomEvent(eventName, {
			composed: true,
			bubbles: true,
			detail: newValue
		}));
	}

	_renderRubric() {
		if (!this.hideRubric) {
			return html`
				<d2l-consistent-evaluation-rubric
					header=${this.localize('rubrics')}
					href=${this.rubricHref}
					assessmentHref=${this.rubricAssessmentHref}
					.token=${this.token}
					?readonly=${this.rubricReadOnly}
				></d2l-consistent-evaluation-rubric>
			`;
		}

		return html``;
	}

	_renderGrade() {
		if (!this.hideGrade) {
			return html`
				<d2l-consistent-evaluation-grade-result
					href=${this.evaluationHref}
					.token=${this.token}
					@on-d2l-grade-result-grade-updated-success=${this._transientSaveGrade}
				></d2l-consistent-evaluation-grade-result>
			`;
		}

		return html``;
	}

	_renderFeedback() {
		if (!this.hideFeedback) {
			return html`
				<d2l-consistent-evaluation-feedback-presentational
					canEditFeedback
					feedback=${this.feedbackText}
					href=${this.evaluationHref}
					.token=${this.token}
					@d2l-activity-text-editor-change="${this._transientSaveFeedback}"
				></d2l-consistent-evaluation-feedback-presentational>
			`;
		}

		return html``;

	}

	_renderOutcome() {
		if (!this.hideOutcomes) {
			return html`
				<d2l-consistent-evaluation-outcomes
					header=${this.localize('outcomes')}
					href=${this.outcomesHref}
					.token=${this.token}
				></d2l-consistent-evaluation-outcomes>
			`;
		}

		return html``;
	}

	render() {
		return html`
			${this._renderRubric()}
			${this._renderGrade()}
			${this._renderFeedback()}
			${this._renderOutcome()}
		`;
	}
}

customElements.define('consistent-evaluation-right-panel', ConsistentEvaluationRightPanel);
