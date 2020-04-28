import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { performSirenAction } from 'siren-sdk/src/es6/SirenAction.js';

// these will eventually be exported to a global configuration namespace
const publishActionName = 'publish';
const retractActionName = 'retract';

export class ConsistentEvaluationFooterController {
	constructor(evaluationHref, token) {
		this.evaluationHref = evaluationHref;
		this.token = token;
	}

	async getEvaluationEntity(bypassCache = false) {
		const evaluationResource = await window.D2L.Siren.EntityStore.fetch(this.evaluationHref, this.token, bypassCache);

		if (!evaluationResource || !evaluationResource.entity) {
			throw new Error('Error while fetching evaluation entity.');
		}

		return evaluationResource.entity;
	}

	isPublished(evaluationEntity) {
		return evaluationEntity.hasActionByName(retractActionName);
	}

	async publish(evaluationEntity) {
		if (evaluationEntity.hasActionByName(publishActionName)) {
			const publishAction = evaluationEntity.getActionByName(publishActionName);
			await performSirenAction(this.token, publishAction, null, true);
		} else {
			throw new Error('Could not find the publish action from the evaluation entity.');
		}
	}

	async retract(evaluationEntity) {
		if (evaluationEntity.hasActionByName(retractActionName)) {
			const retractAction = evaluationEntity.getActionByName(retractActionName);
			await performSirenAction(this.token, retractAction, null, true);
		} else {
			throw new Error('Could not find the retract action from the evaluation entity.');
		}
	}
}
