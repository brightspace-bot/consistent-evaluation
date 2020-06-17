import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { performSirenAction } from 'siren-sdk/src/es6/SirenAction.js';
import { publishedState } from './constants.js';

export const ConsistentEvaluationFooterControllerErrors = {
	INVALID_EVALUATION_HREF: 'evaluationHref was not defined when initializing ConsistentEvaluationFooterController',
	INVALID_TOKEN: 'token was not defined when initializing ConsistentEvaluationFooterController',
	INVALID_TYPE_EVALUATION_HREF: 'evaluationHref must be a string when initializing ConsistentEvaluationFooterController',
	INVALID_TYPE_TOKEN: 'token must be a string when initializing ConsistentEvaluationFooterController',
	ERROR_FETCHING_ENTITY: 'Error while fetching evaluation entity.',
	COULD_NOT_FIND_ACTION: (actionName) => `Could not find the ${actionName} action from the evaluation entity.`
};

export class ConsistentEvaluationFooterController {
	constructor(evaluationHref, token) {
		if (!evaluationHref) {
			throw new Error(ConsistentEvaluationFooterControllerErrors.INVALID_EVALUATION_HREF);
		}

		if (typeof evaluationHref !== 'string') {
			throw new Error(ConsistentEvaluationFooterControllerErrors.INVALID_TYPE_EVALUATION_HREF);
		}

		if (!token) {
			throw new Error(ConsistentEvaluationFooterControllerErrors.INVALID_TOKEN);
		}

		if (typeof token !== 'string') {
			throw new Error(ConsistentEvaluationFooterControllerErrors.INVALID_TYPE_TOKEN);
		}

		this.evaluationHref = evaluationHref;
		this.token = token;
	}

	// kept seperate so it can be easily stubbed
	async _requestEvaluationEntity(bypassCache) {
		return await window.D2L.Siren.EntityStore.fetch(this.evaluationHref, this.token, bypassCache);
	}

	async requestEvaluationEntity(bypassCache = false) {
		const evaluationResource = await this._requestEvaluationEntity(bypassCache);

		if (!evaluationResource || !evaluationResource.entity) {
			throw new Error(ConsistentEvaluationFooterControllerErrors.ERROR_FETCHING_ENTITY);
		}

		const evaluationEntity = evaluationResource.entity;

		return evaluationEntity;
	}

	isPublished(evaluationEntity) {
		if (!evaluationEntity) {
			return false;
		}

		if (!evaluationEntity.properties) {
			return false;
		}

		return evaluationEntity.properties.state === publishedState;
	}

	async __performSirenAction(action) {
		return await performSirenAction(this.token, action, null, true);
	}

	async _performAction(entity, actionName) {
		if (entity.hasActionByName(actionName)) {
			return await this.__performSirenAction(entity.getActionByName(actionName));
		} else {
			throw new Error(ConsistentEvaluationFooterControllerErrors.COULD_NOT_FIND_ACTION(actionName));
		}
	}
}
