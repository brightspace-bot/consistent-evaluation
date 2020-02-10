import { computed, decorate } from 'mobx';

// This probably should be inside ScoreStore but let's do it this way just to
// demonstrate inter-store dependencies
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
	set overallScore(overallScore) {}
	// Can have a computed property on another computed property
	get overallScoreTwo() {
		return this.overallScore * 2;
	}
	set overallScoreTwo(overallScoreTwo) {}

}

export default decorate(OverallScoreStore, {
	overallScore: computed,
	overallScoreTwo: computed
});
