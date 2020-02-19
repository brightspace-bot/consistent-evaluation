import OverallScoreStore from '../../components/stores/overallScore';

const enumerable = (obj, getter) => {
	Object.defineProperty(obj, getter, { enumerable: true });
};

['overallScore', 'overallScoreTwo']
	.forEach(getter => enumerable(OverallScoreStore, getter));

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
