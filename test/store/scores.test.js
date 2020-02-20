import { createSchema } from './schema';
import RootStore from '../../components/stores/root';
import { validate } from './utils';

describe('Score tests', () => {
	it('set a score', () => {
		const rootStore = new RootStore();
		const schema = createSchema();

		rootStore.scoresStore.setScore(0, 5);

		schema.scoresStore.scores = [5, 0, 0, 0];
		schema.overallScoreStore.overallScore = 1.25;
		schema.overallScoreStore.overallScoreTwo = 2.5;

		validate(schema, rootStore);
	});
});
