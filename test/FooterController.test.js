
import { ConsistentEvaluationFooterController, ConsistentEvaluationFooterControllerErrors } from '../components/controllers/FooterController';
import { assert } from '@open-wc/testing';
import sinon from 'sinon';

describe('FooterController', () => {
	describe('instantiates properly and throws the correct errors', () => {
		it('accepts a proper href and token string', () => {
			assert.doesNotThrow(() => {
				new ConsistentEvaluationFooterController('href', 'token');
			});
		});

		it('throws an error when empty string given for href', () => {
			assert.throws(() => {
				new ConsistentEvaluationFooterController('', 'token');
			}, ConsistentEvaluationFooterControllerErrors.INVALID_EVALUATION_HREF);
		});

		it('throws an error when empty string given for token', () => {
			assert.throws(() => {
				new ConsistentEvaluationFooterController('href', '');
			}, ConsistentEvaluationFooterControllerErrors.INVALID_TOKEN);
		});

		it('throws an error for null href', () => {
			assert.throws(() => {
				new ConsistentEvaluationFooterController(null, 'token');
			}, ConsistentEvaluationFooterControllerErrors.INVALID_EVALUATION_HREF);
		});

		it('throws an error for null token', () => {
			assert.throws(() => {
				new ConsistentEvaluationFooterController('href', null);
			}, ConsistentEvaluationFooterControllerErrors.INVALID_TOKEN);
		});

		it('throws an error for non string href', () => {
			assert.throws(() => {
				new ConsistentEvaluationFooterController(20, 'token');
			}, ConsistentEvaluationFooterControllerErrors.INVALID_TYPE_EVALUATION_HREF);
		});

		it('throws an error for non string token', () => {
			assert.throws(() => {
				new ConsistentEvaluationFooterController('href', 20);
			}, ConsistentEvaluationFooterControllerErrors.INVALID_TYPE_TOKEN);
		});
	});

	describe('isPublished', () => {
		it('returns the correct state if published', () => {
			const controller = new ConsistentEvaluationFooterController('href', 'token');
			const entity = {
				properties: {
					state: 'Published'
				}
			};
			assert.equal(controller.isPublished(entity), true);
		});

		it('returns the correct state if not published', () => {
			const controller = new ConsistentEvaluationFooterController('href', 'token');
			const entity = {
				properties: {
					state: 'anything but published'
				}
			};
			assert.equal(controller.isPublished(entity), false);
		});

		it('returns the correct state if undefined input', () => {
			it('returns the correct state if not published', () => {
				const controller = new ConsistentEvaluationFooterController('href', 'token');
				const entity = undefined;
				assert.equal(controller.isPublished(entity), false);
			});
		});

		it('returns the correct state if no properties', () => {
			const controller = new ConsistentEvaluationFooterController('href', 'token');
			const entity = {};
			assert.equal(controller.isPublished(entity), false);
		});

		it('returns the correct state if state property not present', () => {
			const controller = new ConsistentEvaluationFooterController('href', 'token');
			const entity = {
				properties: {
					randomProperty: true
				}
			};
			assert.equal(controller.isPublished(entity), false);
		});
	});

	describe('requestEvaluationEntity', () => {
		it('throws an error if undefined response', async() => {
			const controller = new ConsistentEvaluationFooterController('href', 'token');
			sinon.stub(controller, '_requestEvaluationEntity').returns(Promise.resolve(undefined));

			try {
				await controller.requestEvaluationEntity(true);
				assert.fail();
			} catch (e) {
				assert.equal(e.message, ConsistentEvaluationFooterControllerErrors.ERROR_FETCHING_ENTITY);
			}

			controller._requestEvaluationEntity.restore();
		});

		it('throws an error if entity could not be found', async() => {
			const controller = new ConsistentEvaluationFooterController('href', 'token');
			sinon.stub(controller, '_requestEvaluationEntity').returns(Promise.resolve({ someProperty: true }));

			try {
				await controller.requestEvaluationEntity(true);
				assert.fail();
			} catch (e) {
				assert.equal(e.message, ConsistentEvaluationFooterControllerErrors.ERROR_FETCHING_ENTITY);
			}

			controller._requestEvaluationEntity.restore();
		});

		it('successfully returns a proper entity', async() => {
			const controller = new ConsistentEvaluationFooterController('href', 'token');
			sinon.stub(controller, '_requestEvaluationEntity').returns(Promise.resolve({
				entity: {
					properties: {
						state: 'Published'
					}
				}
			}));

			const entity = await controller.requestEvaluationEntity(true);

			assert.equal(entity.properties.state, 'Published');

			controller._requestEvaluationEntity.restore();
		});
	});
});
