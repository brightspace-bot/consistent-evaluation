import 'd2l-polymer-siren-behaviors/store/entity-store.js';

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

		const gradesRel = 'https://activities.api.brightspace.com/rels/grade';
		const feedbackRel = 'https://activities.api.brightspace.com/rels/feedback';
		const evaluationRel = 'https://activities.api.brightspace.com/rels/evaluation';
		const assessmentRel = 'https://api.brightspace.com/rels/assessment';
		const rubricRel = 'https://api.brightspace.com/rels/rubric';
		const nextRel = 'next';
		const previousRel = 'previous';

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
