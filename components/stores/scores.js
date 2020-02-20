import { action, decorate, observable } from 'mobx';

class ScoresStore {
	constructor() {
		this.scores = [0, 0, 0, 0];
	}

	setScore(i, score) {
		this.scores[i] = score;
	}
}

export default decorate(ScoresStore, {
	scores: observable,
	setScore: action
});
