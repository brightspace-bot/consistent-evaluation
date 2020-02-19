import { createSchema } from './schema';
import RootStore from '../../components/stores/root';
import { validate } from './utils';

describe('Root tests', () => {
	it('test initial schema', () => {
		const rootStore = new RootStore();
		const schema = createSchema();
		validate(schema, rootStore);
	});
});
