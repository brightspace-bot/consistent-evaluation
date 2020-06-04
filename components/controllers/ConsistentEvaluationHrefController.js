import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { assessmentRel, evaluationRel, feedbackRel, gradesRel, nextRel, previousRel, rubricRel } from './constants.js';

export const ConsistentEvaluationHrefControllerErrors = {
	INVALID_BASE_HREF: 'baseHref was not defined when initializing ConsistentEvaluationHrefController',
	INVALID_TYPE_BASE_HREF: 'baseHref must be a string when initializing ConsistentEvaluationHrefController',
	INVALID_TOKEN: 'token was not defined when initializing ConsistentEvaluationHrefController',
	INVALID_TYPE_TOKEN: 'token must be a string when initializing ConsistentEvaluationHrefController'
};

export class ConsistentEvaluationHrefController {
	constructor(baseHref, token) {
		if (!baseHref) {
			throw new Error(ConsistentEvaluationHrefControllerErrors.INVALID_BASE_HREF);
		}

		if (typeof baseHref !== 'string') {
			throw new Error(ConsistentEvaluationHrefControllerErrors.INVALID_TYPE_BASE_HREF);
		}

		if (!token) {
			throw new Error(ConsistentEvaluationHrefControllerErrors.INVALID_TOKEN);
		}

		if (typeof token !== 'string') {
			throw new Error(ConsistentEvaluationHrefControllerErrors.INVALID_TYPE_TOKEN);
		}

		this.baseHref = baseHref;
		this.token = token;
	}

	// these are in their own methods so that they can easily be stubbed in testing
	async _getRootEntity(bypassCache) {
		return await window.D2L.Siren.EntityStore.fetch(this.baseHref, this.token, bypassCache);
	}

	async _getAssessmentEntity(rubricAssessmentHref, bypassCache) {
		return await window.D2L.Siren.EntityStore.fetch(rubricAssessmentHref, this.token, bypassCache);
	}

	async getHrefs(bypassCache = false) {
		let root = await this._getRootEntity(bypassCache);

		let gradeHref = undefined;
		let feedbackHref = undefined;
		let evaluationHref = undefined;
		let nextHref = undefined;
		let previousHref = undefined;
		let rubricAssessmentHref = undefined;
		let rubricHref = undefined;

		if (root && root.entity) {
			root = root.entity;

			const getHref = (root, rel) => {
				if (root.hasLinkByRel(rel)) {
					return root.getLinkByRel(rel).href;
				}
				return undefined;
			};

			gradeHref = getHref(root, gradesRel);
			feedbackHref = getHref(root, feedbackRel);
			evaluationHref = getHref(root, evaluationRel);
			nextHref = getHref(root, nextRel);
			previousHref = getHref(root, previousRel);
			rubricAssessmentHref = getHref(root, assessmentRel);

			if (rubricAssessmentHref) {
				const assessmentEntity = await this._getAssessmentEntity(rubricAssessmentHref, bypassCache);
				if (assessmentEntity && assessmentEntity.entity) {
					rubricHref = getHref(assessmentEntity.entity, rubricRel);
				}
			}
		}

		// we still need the outcomes href

		return {
			root,
			gradeHref,
			feedbackHref,
			evaluationHref,
			nextHref,
			previousHref,
			rubricAssessmentHref,
			rubricHref
		};
	}

	async getSubmissionInfo() {
		let root = await this._getRootEntity(false);
		let submissionList = undefined;
		let evaluationState = undefined;
		if (root && root.entity) {
			root = root.entity;
			submissionList = root.getSubEntityByClass('assignment-submission-list').links;
			evaluationState = root.getSubEntityByClass('evaluation').properties.state;
		}
		return {
			submissionList,
			evaluationState
		};
	}
}
