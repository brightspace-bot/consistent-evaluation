import './consistent-evaluation-feedback.js';
import './consistent-evaluation-outcomes.js';
import './consistent-evaluation-rubric.js';
import './consistent-evaluation-grade-result.js';
import { css, html, LitElement } from 'lit-element';
import { loadLocalizationResources } from '../locale.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

export class ConsistentEvaluationRightPanel extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			rubricHref: { type: String },
			rubricAssessmentHref: { type: String },
			outcomesHref: { type: String },
			evaluationHref: {type: String},
			token: { type: String },
			rubricReadOnly: { type: Boolean },
			richTextEditorDisabled: { type: Boolean },
			hideRubric: { type: Boolean },
			hideGrade: { type: Boolean },
			hideFeedback: { type: Boolean },
			hideOutcomes: { type: Boolean },
			feedbackText: { type: String },
			grade: { type: Object }
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

		this._token = undefined;
		this._richTextEditorConfig = {};

		this.hideRubric = false;
		this.hideGrade = false;
		this.hideFeedback = false;
		this.hideOutcomes = false;
	}

	async _transientSaveFeedback(e) {
		this._emitTransientSaveEvent('on-d2l-consistent-eval-transient-save-feedback', e.detail);
	}

	async _transientSaveGrade(e) {
		const type = e.detail.grade.scoreType;
		if (type === 'LetterGrade') {
			this._emitTransientSaveEvent('on-d2l-consistent-eval-transient-save-grade', e.detail.grade.letterGrade);
		}
		else if (type === 'Numeric') {
			this._emitTransientSaveEvent('on-d2l-consistent-eval-transient-save-grade', e.detail.grade.score);
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
					.grade=${this.grade}
					@on-d2l-consistent-eval-grade-changed=${this._transientSaveGrade}
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
					.feedbackText=${this.feedbackText}
					.href=${this.evaluationHref}
					.richTextEditorConfig=${this._richTextEditorConfig}
					.token=${this.token}
					@d2l-consistent-eval-on-feedback-edit=${this._transientSaveFeedback}
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
