import 'd2l-activities/components/d2l-activity-editor/d2l-activity-text-editor.js';
import 'd2l-activities/components/d2l-activity-editor/d2l-activity-attachments/d2l-activity-attachments-editor.js';
import './consistent-evaluation-right-panel-block';
import { css, html, LitElement } from 'lit-element';
import { loadLocalizationResources } from '../locale.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

class ConsistentEvaluationFeedbackPresentational extends LocalizeMixin(LitElement) {
	static get properties() {
		return {
			canEditFeedback: {
				attribute: 'can-edit-feedback',
				reflect: true,
				type: Boolean
			},
			feedbackText: {
				attribute: 'feedback-text',
				reflect: true,
				type: String
			},
			href: { type: String },
			richTextEditorConfig: { type: Object },
			saveOnFeedbackChange: { type: Object },
			token: { type: String }
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

		this.canEditFeedback = false;
	}

	render() {
		return html`
			<d2l-consistent-evaluation-right-panel-block title="${this.localize('overallFeedback')}">
				<div id="feedback-container">
					<d2l-activity-text-editor
						.value="${this.feedbackText}"
						.richtextEditorConfig="${this.richTextEditorConfig}"
						@d2l-activity-text-editor-change="${this.saveOnFeedbackChange}"
						ariaLabel="${this.localize('overallFeedback')}"
						?disabled="${!this.canEditFeedback}">
					</d2l-activity-text-editor>
				</div>
				
				<div id="feedback-actions-container" ?hidden="${!this.href}">
					<d2l-activity-attachments-editor
						href="${this.href}"
						.token="${this.token}">
					</d2l-activity-attachments-editor>
				</div>
			</d2l-consistent-evaluation-right-panel-block>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-feedback-presentational', ConsistentEvaluationFeedbackPresentational);
