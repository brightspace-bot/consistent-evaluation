import './consistent-evaluation-feedback-presentational.js';
import { html, LitElement } from 'lit-element';
import { ConsistentEvaluationFeedbackController } from '../controllers/ConsistentEvaluationFeedbackController.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { evaluationRel } from '../controllers/constants.js';
import SirenParse from 'siren-parser';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';

class ConsistentEvaluationFeedback extends LitElement {
	static get properties() {
		return {
			text: { type: String }
		};
	}

	constructor() {
		super();

		this._text = undefined;
	}

	// get href() {
	// 	return this._href;
	// }

	// set href(val) {
	// 	const oldVal = this.href;
	// 	if (oldVal !== val) {
	// 		this._href = val;
	// 		if (this._href && this._token) {
	// 			// this._initializeController().then(() => this.requestUpdate());
	// 		}
	// 	}
	// }

	// get token() {
	// 	return this._token;
	// }

	// set token(val) {
	// 	const oldVal = this.token;
	// 	if (oldVal !== val) {
	// 		this._token = val;
	// 		if (this._href && this._token) {
	// 			// this._initializeController().then(() => this.requestUpdate());
	// 		}
	// 	}
	// }

	// set lastUpdated(newDate) {
	// 	if (newDate) {
	// 		const oldVal = this._lastUpdated;
	// 		if (oldVal !== newDate) {
	// 			this._saveFeedback();
	// 			this._lastUpdated = newDate;
	// 			this.requestUpdate('lastUpdated', oldVal);
	// 		}
	// 	}
	// }

	// async _initializeController() {
	// 	this._controller = new ConsistentEvaluationFeedbackController(this._href, this._token);

	// 	this._feedbackEntity = await this._controller.requestFeedback();
	// 	this._evaluation = await this._controller.evalEntity();
	// 	this._feedbackText = this._feedbackEntity.properties.text;
	// }

	// _saveFeedback() {
	// 	console.log('_saveFeedback() hitting db');
	// 	console.log(this._evaluation);
	// 	this._controller.saveFeedbackText(this._feedbackText, this._evaluation);
	// }

	// _saveOnFeedbackChange(e) {
	// 	const feedback = e.detail.content;

	// 	this._debounceJobs.feedback = Debouncer.debounce(
	// 		this._debounceJobs.feedback,
	// 		timeOut.after(500),
	// 		() => this._saveTransient(feedback)
	// 	);
	// }

	// async _saveTransient(feedbackText) {
	// 	console.log('_saveTransient not actually writing to db');

	// 	this._feedbackText = feedbackText;
	// 	const action = this._feedbackEntity.getActionByName('SaveFeedback');
	// 	const field = action.getFieldByName('feedback');
	// 	field.value = feedbackText;
	// 	window.D2L.Siren.EntityStore.getToken(this.token)
	// 		.then((resolved) => {
	// 			const tokenValue = resolved.tokenValue;
	// 			this._performSirenAction(action, [field], tokenValue);
	// 		});
	// 	// Method below would've used performSirenAction
	// 	// this._controller.updateFeedbackText(this._feedbackText, this._feedbackEntity);
	// }

	render() {
		return html`
			<d2l-consistent-evaluation-feedback-presentational
				canEditFeedback
				feedbackText="${this._feedbackText}"
				href="${this._href}"
				.richtextEditorConfig="${this._richTextEditorConfig}"
				.token="${this._token}"
			></d2l-consistent-evaluation-feedback-presentational>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-feedback', ConsistentEvaluationFeedback);
