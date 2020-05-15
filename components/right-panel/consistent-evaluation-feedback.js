import 'd2l-activities/components/d2l-activity-editor/d2l-activity-text-editor.js';
import 'd2l-activities/components/d2l-activity-editor/d2l-activity-attachments/d2l-activity-attachments-editor.js';
import { css, html, LitElement } from 'lit-element';
import { ConsistentEvaluationFeedbackController } from '../controllers/ConsistentEvaluationFeedbackController.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { loadLocalizationResources } from '../locale.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';

class ConsistentEvaluationFeedback extends LocalizeMixin(LitElement) {
	static get properties() {
		return {
			canEditFeedback: {
				attribute: 'can-edit-feedback',
				reflect: true,
				type: Boolean
			},
			_feedbackEntity: {type: Object },
			_feedbackText: { type: String },
			header: { type: String },
			href: { type: String },
			richTextEditorConfig: { type: Object },
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

		this._href = undefined;
		this._token = undefined;

		this._feedbackText = '';
		this._debounceJobs = {};

		this.canEditFeedback = false;
	}

	get href() {
		return this._href;
	}

	set href(val) {
		const oldVal = this.href;
		if (oldVal !== val) {
			this._href = val;
			if (this._href && this._token) {
				this._initializeController().then(() => this.requestUpdate());
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
			if (this._href && this._token) {
				this._initializeController().then(() => this.requestUpdate());
			}
		}
	}

	async _initializeController() {
		this._controller = new ConsistentEvaluationFeedbackController(this._href, this._token);

		this._feedbackEntity = await this._controller.requestFeedback();
		this._feedbackText = this._feedbackEntity.entities[0].entities[0].properties.text;
	}

	_saveFeedback(feedback, entity) {
		this._debounceJobs.value = Debouncer.debounce(
			this._debounceJobs.value,
			timeOut.after(2000),
			() => this._controller.updateFeedbackText(feedback, entity)
		);
	}

	_saveOnFeedbackChange(e) {
		const feedback = e.detail.content;

		this._debounceJobs.feedback = Debouncer.debounce(
			this._debounceJobs.feedback,
			timeOut.after(500),
			() => this._saveFeedback(feedback, this._feedbackEntity)
		);
	}

	render() {
		return html`
			<d2l-consistent-evaluation-right-panel-block title=${this.header}>
				<div id="feedback-container">
					<d2l-activity-text-editor
						.value="${this._feedbackText}"
						.richtextEditorConfig="${this.richTextEditorConfig}"
						@d2l-activity-text-editor-change="${this._saveOnFeedbackChange}"
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

customElements.define('d2l-consistent-evaluation-feedback', ConsistentEvaluationFeedback);
