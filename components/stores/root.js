import OverallScoreStore from './overallScore';
import ScoresStore from './scores';

export default class RootStore {
	constructor() {
		this.scoresStore = new ScoresStore();
		this.overallScoreStore = new OverallScoreStore(this);
	}
}
