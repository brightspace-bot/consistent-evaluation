// import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { assessmentRel, evaluationRel, nextRel, previousRel, rubricRel } from '../components/controllers/constants.js';
import { ConsistentEvaluationHrefController, ConsistentEvaluationHrefControllerErrors } from '../components/controllers/ConsistentEvaluationHrefController';
import { assert } from '@open-wc/testing';
import sinon from 'sinon';

describe('ConsistentEvaluationHrefController', () => {
	describe('instantiates properly and throws the correct errors', () => {
		it('accepts a proper href and token string', () => {
			assert.doesNotThrow(() => {
				new ConsistentEvaluationHrefController('href', 'token');
			});
		});

		it('throws an error when empty string given for href', () => {
			assert.throws(() => {
				new ConsistentEvaluationHrefController('', 'token');
			}, ConsistentEvaluationHrefControllerErrors.INVALID_BASE_HREF);
		});

		it('throws an error when empty string given for token', () => {
			assert.throws(() => {
				new ConsistentEvaluationHrefController('href', '');
			}, ConsistentEvaluationHrefControllerErrors.INVALID_TOKEN);
		});

		it('throws an error for null href', () => {
			assert.throws(() => {
				new ConsistentEvaluationHrefController(null, 'token');
			}, ConsistentEvaluationHrefControllerErrors.INVALID_BASE_HREF);
		});

		it('throws an error for null token', () => {
			assert.throws(() => {
				new ConsistentEvaluationHrefController('href', null);
			}, ConsistentEvaluationHrefControllerErrors.INVALID_TOKEN);
		});

		it('throws an error for non string href', () => {
			assert.throws(() => {
				new ConsistentEvaluationHrefController(20, 'token');
			}, ConsistentEvaluationHrefControllerErrors.INVALID_TYPE_BASE_HREF);
		});

		it('throws an error for non string token', () => {
			assert.throws(() => {
				new ConsistentEvaluationHrefController('href', 20);
			}, ConsistentEvaluationHrefControllerErrors.INVALID_TYPE_TOKEN);
		});
	});

	describe('getHrefs works properly and will set the correct hrefs', () => {
		const relations = [
			{ key: 'evaluationHref', rel: evaluationRel },
			{ key: 'nextHref', rel: nextRel },
			{ key: 'previousHref', rel: previousRel },
		];

		// testing that each href is solely set
		relations.forEach(({ key, rel }) => {
			it(`sets only the ${key} properly`, async() => {

				const controller = new ConsistentEvaluationHrefController('href', 'token');
				const href = 'the_href_to_find';

				sinon.stub(controller, '_getRootEntity').returns({
					entity: {
						hasLinkByRel: (r) => r === rel,
						getLinkByRel: (r) => (r === rel ? { href } : undefined)
					}
				});

				const hrefs = await controller.getHrefs(true);

				// make sure that only the current key is assigned an href
				relations.forEach(relation => {
					assert.equal(hrefs[relation.key], relation.key === key ? href : undefined);
				});

				controller._getRootEntity.restore();
			});
		});

		it('sets only the rubric assessment href properly', async() => {
			const expectedAssessmentHref = 'the_assessment_href_to_find';

			const controller = new ConsistentEvaluationHrefController('href', 'token');

			sinon.stub(controller, '_getRootEntity').returns({
				entity: {
					hasLinkByRel: (r) => r === assessmentRel,
					getLinkByRel: (r) => (r === assessmentRel ? { href: expectedAssessmentHref } : undefined)
				}
			});
			sinon.stub(controller, '_getAssessmentEntity').returns(undefined);

			const hrefs = await controller.getHrefs(true);

			assert.equal(hrefs.rubricAssessmentHref, expectedAssessmentHref);

			controller._getRootEntity.restore();
			controller._getAssessmentEntity.restore();
		});

		it('sets the rubric href and the rubric assessment href  properly', async() => {
			const expectedAssessmentHref = 'the_assessment_href_to_find';
			const expectedRubricHref = 'the_rubric_href_to_find';

			const controller = new ConsistentEvaluationHrefController('href', 'token');
			sinon.stub(controller, '_getRootEntity').returns({
				entity: {
					hasLinkByRel: (r) => r === assessmentRel,
					getLinkByRel: (r) => (r === assessmentRel ? { href: expectedAssessmentHref } : undefined)
				}
			});
			sinon.stub(controller, '_getAssessmentEntity').returns({
				entity: {
					hasLinkByRel: (r) => r === rubricRel,
					getLinkByRel: (r) => (r === rubricRel ? { href: expectedRubricHref } : undefined)
				}
			});

			const hrefs = await controller.getHrefs(true);

			assert.equal(hrefs.rubricAssessmentHref, expectedAssessmentHref);
			assert.equal(hrefs.rubricHref, expectedRubricHref);

			controller._getRootEntity.restore();
			controller._getAssessmentEntity.restore();
		});

	});
});
