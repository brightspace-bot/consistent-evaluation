import { computed, decorate } from 'mobx';

// This probably should be inside ScoreStore but let's do it this way just to
// demonstrate inter-store dependencies
class OverallScoreStore {
	constructor(root) {
		this.root = root;
	}

	set overallScore(overallScore) {}
	set overallScoreTwo(overallScoreTwo) {}

	get overallScore() {
		const scores = this.root.scoresStore.scores;

		let sum = 0;
		this.root.scoresStore.scores.forEach(s => sum += s);

		return sum / scores.length;
	}

	// Can have a computed property on another computed property
	get overallScoreTwo() {
		return this.overallScore * 2;
	}
}

export default decorate(OverallScoreStore, {
	overallScore: computed,
	overallScoreTwo: computed
});
