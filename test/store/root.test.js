import { describe, it } from 'mocha';
import Joi from '@hapi/joi';
import RootStore from '../../components/stores/root';

export const createSchema = () => {
	return {
		scoresStore: {
			scores: Joi.array().length(4).items(Joi.number().equal(0)).required()
		},
		overallScoreStore: {
			root: Joi.object().required(),
			overallScore: Joi.number().equal(0),
			overallScoreTwo: Joi.number().equal(0)
		}
	};
};

export const validate = (schema, store) => {
	const { error } = Joi.object(schema).validate(store);
	if (error) throw error;
};

export const rootTests = () => {
	describe('Root tests', () => {
		it('test initial schema', (done) => {
			const rootStore = new RootStore();
			const schema = createSchema();
			validate(schema, rootStore);
			done();
		});
	});
};
