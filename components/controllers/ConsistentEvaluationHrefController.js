import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { assessmentRel, evaluationRel, feedbackRel, gradesRel, nextRel, previousRel, rubricRel } from './constants.js';

export class ConsistentEvaluationHrefController {
	constructor(baseHref, token) {
		if (!baseHref) {
			throw new Error('baseHref was not defined when initializing HrefController');
		}

		if (!token) {
			throw new Error('token was not defined when initializing HrefController');
		}

		this.baseHref = baseHref;
		this.token = token;
	}

	async getHrefs(bypassCache = false) {
		let root = await window.D2L.Siren.EntityStore.fetch(this.baseHref, this.token, bypassCache);

		let gradeHref = undefined;
		let feedbackHref = undefined;
		let evaluationHref = undefined;
		let nextHref = undefined;
		let previousHref = undefined;
		let rubricAssessmentHref = undefined;
		let rubricHref = undefined;

		if (root.entity) {
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

			let assessmentEntity = await window.D2L.Siren.EntityStore.fetch(rubricAssessmentHref, this.token, bypassCache);
			if (assessmentEntity.entity) {
				assessmentEntity = assessmentEntity.entity;
				rubricHref = getHref(assessmentEntity, rubricRel);
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
}
