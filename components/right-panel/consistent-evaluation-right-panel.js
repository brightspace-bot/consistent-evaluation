import './consistent-evaluation-feedback.js';
import './consistent-evaluation-outcomes.js';
import './consistent-evaluation-rubric.js';
import './consistent-evaluation-grade-result.js';
import '@brightspace-ui-labs/grade-result/d2l-grade-result.js';
import { css, html, LitElement } from 'lit-element';
import { loadLocalizationResources } from '../locale.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

export class ConsistentEvaluationRightPanel extends LocalizeMixin(LitElement) {

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
			hideRubric: {
				attribute: 'hide-rubric',
				type: Boolean
			},
			hideGrade: {
				attribute: 'hide-grade',
				type: Boolean
			},
			hideFeedback: {
				attribute: 'hide-feedback',
				type: Boolean
			},
			hideOutcomes: {
				attribute: 'hide-outcomes',
				type: Boolean
			},
			_richTextEditorConfig: {
				type: Object
			}
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

		this._richTextEditorConfig = {};

		this.hideRubric = false;
		this.hideGrade = false;
		this.hideFeedback = false;
		this.hideOutcomes = false;
	}

	_renderRubric() {
		if (!this.hideRubric) {
			return html`
				<d2l-consistent-evaluation-rubric
					header=${this.localize('rubrics')}
					href=${this.rubricHref}
					assessment-href=${this.rubricAssessmentHref}
					.token=${this.token}
					?read-only=${this.rubricReadOnly}
				></d2l-consistent-evaluation-rubric>
			`;
		}

		return html``;
	}

	_renderGrade() {
		if (!this.hideGrade) {
			return html`
				<d2l-consistent-evaluation-grade-result
					href=${this.gradeHref}
					.token=${this.token}
				></d2l-consistent-evaluation-grade-result>
			`;
		}

		return html``;
	}

	_renderFeedback() {
		if (!this.hideFeedback) {
			return html`
				<d2l-consistent-evaluation-feedback
					href=${this.feedbackHref}
					.token=${this.token}
				></d2l-consistent-evaluation-feedback>
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
