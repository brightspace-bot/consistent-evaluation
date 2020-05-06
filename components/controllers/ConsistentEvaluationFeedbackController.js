import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { performSirenAction } from 'siren-sdk/src/es6/SirenAction.js';

export class ConsistentEvaluationFeedbackController {
	constructor(baseHref, token) {
		if (!baseHref) {
			throw new Error('baseHref was not defined when initializing FeedbackController');
		}

		if (!token) {
			throw new Error('token was not defined when initializing FeedbackController');
		}

		this.baseHref = baseHref;
		this.token = token;
	}
	async requestFeedback() {
		const response = await window.D2L.Siren.EntityStore.fetch(this.baseHref, this.token);
		if (!response) {
			throw new Error('request for feedback failed');
		}
		if (!response.entity) {
			throw new Error('entity not found for requestFeedback');
		}
		const entity = response.entity;

		return entity;
	}
	async updateFeedbackText(feedbackText, entity) {
		if (!feedbackText) {
			throw new Error('Feedback Text must be provided to update a feedback text.');
		}
		if (!entity) {
			throw new Error('entity must be provided with the feedback to update feedback.');
		}

		const actionName = 'SaveFeedback';
		const fieldName = 'feedback';

		if (!entity.hasActionByName(actionName)) {
			throw new Error('Could not find the SaveFeedback action from entity.');
		}

		const saveFeedbackAction = entity.getActionByName(actionName);

		if (!saveFeedbackAction.hasFieldByName(fieldName)) {
			throw new Error(`Expected the ${this.saveFeedbackAction.name} action to have a ${fieldName} field.`);
		}

		const field = saveFeedbackAction.getFieldByName(fieldName);
		field.value = feedbackText;

		const newFeedbackEntity = await performSirenAction(this.token, saveFeedbackAction, [field], true);
		return newFeedbackEntity;

	}
}
