import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { publishActionName, retractActionName } from './constants.js';
import { performSirenAction } from 'siren-sdk/src/es6/SirenAction.js';

export class ConsistentEvaluationFooterController {
	constructor(evaluationHref, token) {
		this.evaluationHref = evaluationHref;
		this.token = token;
	}

	async requestEvaluationEntity(bypassCache = false) {
		const evaluationResource = await window.D2L.Siren.EntityStore.fetch(this.evaluationHref, this.token, bypassCache);

		if (!evaluationResource || !evaluationResource.entity) {
			throw new Error('Error while fetching evaluation entity.');
		}

		const evaluationEntity = evaluationResource.entity;

		evaluationEntity.published = false;

		return evaluationEntity;
	}

	isPublished(evaluationEntity) {
		return evaluationEntity.published;
	}

	async _performAction(entity, actionName) {
		if (entity.hasActionByName(actionName)) {
			await performSirenAction(this.token, entity.getActionByName(actionName), null, true);
		} else {
			throw new Error(`Could not find the ${actionName} action from the evaluation entity.`);
		}
	}

	async publish(evaluationEntity) {
		await this._performAction(evaluationEntity, publishActionName);
		evaluationEntity.published = true;
	}

	async retract(evaluationEntity) {
		await this._performAction(evaluationEntity, retractActionName);
		evaluationEntity.published = false;
	}
}
