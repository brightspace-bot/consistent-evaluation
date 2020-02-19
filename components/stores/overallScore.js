import { computed, decorate } from 'mobx';

class OverallScoreStore {
	constructor(root) {
		this.root = root;
	}

	get overallScore() {
		const scores = this.root.scoresStore.scores;

		let sum = 0;
		this.root.scoresStore.scores.forEach(s => sum += s);

		return sum / scores.length;
	}

	get overallScoreTwo() {
		return this.overallScore * 2;
	}

}

decorate(OverallScoreStore, {
	overallScore: computed,
	overallScoreTwo: computed
});

['overallScore', 'overallScoreTwo'].forEach(getter => Object.defineProperty(OverallScoreStore, getter, { enumerable: true }));

export { OverallScoreStore as default };
