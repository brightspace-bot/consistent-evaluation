import './consistent-evaluation-feedback-presentational.js';
import { html, LitElement } from 'lit-element';
import { ConsistentEvaluationFeedbackController } from '../controllers/ConsistentEvaluationFeedbackController.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';

class ConsistentEvaluationFeedback extends LitElement {
	static get properties() {
		return {
			href: { type: String },
			token: { type: String }
		};
	}

	constructor() {
		super();

		this._href = undefined;
		this._token = undefined;
		this._lastUpdated = undefined;

		this._debounceJobs = {};
		this._feedbackEntity = {};
		this._feedbackText = '';
		this._richTextEditorConfig = {};
		window.addEventListener('my-custom-event-save-draft-click', this.test, false);
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

	set lastUpdated(newDate) {
		if (newDate) {
			const oldVal = this._lastUpdated;
			if (oldVal !== newDate) {
				this._saveFeedback();
				this._lastUpdated = newDate;
				this.requestUpdate('lastUpdated', oldVal);
			}
		}
	}

	async _initializeController() {
		this._controller = new ConsistentEvaluationFeedbackController(this._href, this._token);

		this._feedbackEntity = await this._controller.requestFeedback();
		this._feedbackText = this._feedbackEntity.entities[0].entities[0].properties.text;
	}

	test(e) {
		console.log('reaching here FEEDBACK');
		console.log(e);
	}

	_saveFeedback() {
		console.log('_saveFeedback() hitting db');
		this._controller.updateFeedbackText(this._feedbackText, this._feedbackEntity);
	}

	_saveOnFeedbackChange(e) {
		const feedback = e.detail.content;

		this._debounceJobs.feedback = Debouncer.debounce(
			this._debounceJobs.feedback,
			timeOut.after(500),
			() => this._saveTransient(feedback, this._feedbackEntity)
		);
	}

	_saveTransient(feedbackText, entity) {
		this._feedbackText = feedbackText;
		console.log('_saveTransient not actually writing to db');
		// probably something like ...
		// this._controller.updateTransientFeedbackText(feedback, entity);
	}

	render() {
		return html`
			<d2l-consistent-evaluation-feedback-presentational
				can-edit-feedback
				feedback-text="${this._feedbackText}"
				href="${this._href}"
				.richtextEditorConfig="${this._richTextEditorConfig}"
				@d2l-activity-text-editor-change="${this._saveOnFeedbackChange}"
				.token="${this._token}"
			></d2l-consistent-evaluation-feedback-presentational>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-feedback', ConsistentEvaluationFeedback);
