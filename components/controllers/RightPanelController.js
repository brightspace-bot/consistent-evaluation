import 'd2l-polymer-siren-behaviors/store/entity-store.js';

export const RightPanelControllerErrors = {
	INVALID_EVALUATION_HREF: 'evaluationHref was not defined when initializing ConsistentEvaluationFooterController',
	INVALID_TOKEN: 'token was not defined when initializing ConsistentEvaluationFooterController',
	INVALID_TYPE_EVALUATION_HREF: 'evaluationHref must be a string when initializing ConsistentEvaluationFooterController',
	INVALID_TYPE_TOKEN: 'token must be a string when initializing ConsistentEvaluationFooterController',
	ERROR_FETCHING_ENTITY: 'Error while fetching evaluation entity.'
};

export class RightPanelController {
	constructor(evaluationHref, token) {
		if (!evaluationHref) {
			throw new Error(RightPanelControllerErrors.INVALID_EVALUATION_HREF);
		}

		if (typeof evaluationHref !== 'string') {
			throw new Error(RightPanelControllerErrors.INVALID_TYPE_EVALUATION_HREF);
		}

		if (!token) {
			throw new Error(RightPanelControllerErrors.INVALID_TOKEN);
		}

		if (typeof token !== 'string') {
			throw new Error(RightPanelControllerErrors.INVALID_TYPE_TOKEN);
		}

		this.evaluationHref = evaluationHref;
		this.token = token;
	}

	async _requestEvaluationEntity(bypassCache = false) {
		return await window.D2L.Siren.EntityStore.fetch(this.evaluationHref, this.token, bypassCache);
	}

	async requestEvaluationEntity(bypassCache = false) {
		const response = await this._requestEvaluationEntity(bypassCache);

		if (!response || !response.entity) {
			throw new Error(RightPanelControllerErrors.ERROR_FETCHING_ENTITY);
		}

		const evaluationEntity = response.entity;

		return evaluationEntity;
	}

	async requestFeedbackEntity() {
		const response = await this.requestEvaluationEntity();
		const feedbackEntity = response.getSubEntityByRel('feedback');
		return feedbackEntity;
	}
}
