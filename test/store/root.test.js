import RootStore from '../../components/stores/root';
import { validate } from './utils';

export const createSchema = () => {
	return {
		scoresStore: {
			scores: [0, 0, 0, 0]
		},
		overallScoreStore: {
			overallScore: 0,
			overallScoreTwo: 0,
		}
	};
};

describe('Root tests', () => {
	it('test initial schema', () => {
		const rootStore = new RootStore();
		const schema = createSchema();
		validate(schema, rootStore);
	});
});
