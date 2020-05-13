import 'd2l-polymer-siren-behaviors/store/entity-store.js';
import { ConsistentEvaluationFeedbackController, FeedbackControllerErrors } from '../components/controllers/ConsistentEvaluationFeedbackController.js';
import { assert } from '@open-wc/testing';
import sinon from 'sinon';

describe('ConsistentEvaluationFeedbackController', () => {
	describe('instantiates properly', () => {
		it('accepts a proper href and token string', () => {
			assert.doesNotThrow(() => {
				new ConsistentEvaluationFeedbackController('href', 'token');
			});
		});

		it('throws an error when empty string given for href', () => {
			assert.throws(() => {
				new ConsistentEvaluationFeedbackController('', 'token');
			}, FeedbackControllerErrors.INVALID_BASE_HREF);
		});

		it('throws an error when empty string given for token', () => {
			assert.throws(() => {
				new ConsistentEvaluationFeedbackController('href', '');
			}, FeedbackControllerErrors.INVALID_TOKEN);
		});

		it('throws an error for null href', () => {
			assert.throws(() => {
				new ConsistentEvaluationFeedbackController(null, 'token');
			}, FeedbackControllerErrors.INVALID_BASE_HREF);
		});

		it('throws an error for null token', () => {
			assert.throws(() => {
				new ConsistentEvaluationFeedbackController('href', null);
			}, FeedbackControllerErrors.INVALID_TOKEN);
		});

		it('throws an error for non string href', () => {
			assert.throws(() => {
				new ConsistentEvaluationFeedbackController(20, 'token');
			}, FeedbackControllerErrors.INVALID_TYPE_BASE_HREF);
		});

		it('throws an error for non string token', () => {
			assert.throws(() => {
				new ConsistentEvaluationFeedbackController('href', 20);
			}, FeedbackControllerErrors.INVALID_TYPE_TOKEN);
		});
	});

	describe('requestFeedback', () => {

		describe('can properly get feedback', () => {
			before(() => {
				sinon.stub(window.D2L.Siren.EntityStore, 'fetch').returns({
					entity: {
						properties: {
							text: 'ree',
							html: '<h1>ree</h1>'
						}
					}
				});
			});

			after(() => {
				window.D2L.Siren.EntityStore.fetch.restore();
			});

			it('can retrieve feedback and parse it properly', () => {
				assert.doesNotThrow(async() => {
					const controller = new ConsistentEvaluationFeedbackController('href', 'token');
					const feedback = await controller.requestFeedback();
					assert.deepEqual(feedback.getEntity(), {
						properties: {
							text: 'ree',
							html: '<h1>ree</h1>'
						}
					});
				});
			});
		});

		describe('will throw an error if entity not present', () => {
			before(() => {
				sinon.stub(window.D2L.Siren.EntityStore, 'fetch').returns({});
			});

			after(() => {
				window.D2L.Siren.EntityStore.fetch.restore();
			});

			it('throws an error when entity is not found', async() => {
				try {
					const controller = new ConsistentEvaluationFeedbackController('href', 'token');
					await controller.requestFeedback();
					assert.fail();
				} catch (e) {
					assert.equal(e.message, FeedbackControllerErrors.ENTITY_NOT_FOUND_REQUEST_FEEDBACK);
				}
			});
		});

		describe('will throw an error for bad response', () => {
			before(() => {
				sinon.stub(window.D2L.Siren.EntityStore, 'fetch').returns(undefined);
			});

			after(() => {
				window.D2L.Siren.EntityStore.fetch.restore();
			});

			it('throws an error for no response', async() => {
				try {
					const controller = new ConsistentEvaluationFeedbackController('href', 'token');
					await controller.requestFeedback();
					assert.fail();
				} catch (e) {
					assert.equal(e.message, FeedbackControllerErrors.REQUEST_FAILED);
				}
			});
		});
	});

	describe('updateFeedbackText', () => {
		describe('proper feedback object should save properly', () => {
			const fakeEntity = {
				entity: {
					properties: {
						text: 'ree',
						html: '<h1>ree</h1>'
					},
					hasActionByName: (name) => name === 'SaveFeedback',
					getActionByName: () => ({
						hasFieldByName: (name) => name === 'feedback',
						getFieldByName: () => ({ value: undefined })
					})
				}
			};

			before(() => {
				sinon.stub(window.D2L.Siren.EntityStore, 'fetch').returns(fakeEntity);
			});

			after(() => {
				window.D2L.Siren.EntityStore.fetch.restore();
			});

			it('can retrieve feedback and parse it properly', () => {
				assert.doesNotThrow(async() => {
					const controller = new ConsistentEvaluationFeedbackController('href', 'token');
					const feedback = await controller.requestFeedback();
					sinon.stub(controller, '_performAction').returns(fakeEntity.entity);
					const updatedFeedback = await controller.updateFeedbackText('ree', feedback);
					controller._performAction.restore();
					assert.deepEqual(updatedFeedback, feedback);
				});
			});
		});

		describe('bad feedback object should throw errors', () => {

			it('throws an error for null feedback', async() => {
				try {
					const controller = new ConsistentEvaluationFeedbackController('href', 'token');
					await controller.updateFeedbackText(null);
					assert.fail();
				} catch (e) {
					assert.equal(e.message, FeedbackControllerErrors.INVALID_FEEDBACK_TEXT);
				}
			});

			it('throws an error for undefined feedback', async() => {
				try {
					const controller = new ConsistentEvaluationFeedbackController('href', 'token');
					await controller.updateFeedbackText();
					assert.fail();
				} catch (e) {
					assert.equal(e.message, FeedbackControllerErrors.INVALID_FEEDBACK_TEXT);
				}
			});
			it('throws an error for non string feedback', async() => {
				try {
					const controller = new ConsistentEvaluationFeedbackController('href', 'token');
					await controller.updateFeedbackText(1, 2);
					assert.fail();
				} catch (e) {
					assert.equal(e.message, FeedbackControllerErrors.INVALID_FEEDBACK_TEXT);
				}
			});

			it('throws an error for feedback with no entity', async() => {
				try {
					const controller = new ConsistentEvaluationFeedbackController('href', 'token');
					await controller.updateFeedbackText('ree');
					assert.fail();
				} catch (e) {
					assert.equal(e.message, FeedbackControllerErrors.FEEDBACK_MUST_HAVE_ENTITY);
				}
			});

			it('throws an error when feedback does not have proper action', async() => {
				try {
					const controller = new ConsistentEvaluationFeedbackController('href', 'token');
					await controller.updateFeedbackText('ree', {
						properties: {
							text: 'ree',
							html: '<h1>ree</h1>'
						},
						hasActionByName: () => false,
					}
					);
					assert.fail();
				} catch (e) {
					assert.equal(e.message, FeedbackControllerErrors.NO_SAVE_FEEDBACK_ACTION);
				}
			});

			it('throws an error when feedback does not have action with expected field', async() => {
				try {
					const controller = new ConsistentEvaluationFeedbackController('href', 'token');
					await controller.updateFeedbackText('ree',
						{
							properties: {
								text: 'ree',
								html: '<h1>ree</h1>'
							},
							hasActionByName: (name) => name === 'SaveFeedback',
							getActionByName: () => ({
								name: 'SaveFeedback',
								hasFieldByName: () => false,
							})
						}
					);
					assert.fail();
				} catch (e) {
					assert.equal(e.message, FeedbackControllerErrors.FIELD_IN_ACTION_NOT_FOUND('SaveFeedback', 'feedback'));
				}
			});

		});
	});
});
