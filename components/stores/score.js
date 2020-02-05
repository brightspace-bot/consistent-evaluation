import { action } from 'mobx';

const DEFAULT_SCORES = [0, 0, 0, 0];

function average(scores) {
	let sum = 0;
	scores.forEach(s => sum += s);

	return sum / scores.length;
}

export const addScore = (store) => {
	store.score = {};
	store.score.scores = DEFAULT_SCORES;
	store.score.overallScore = average(store.score.scores);

	store.setScore = action((i, score) => {
		console.log('setScore', i, score);
		store.score.scores[i] = score;
		store.score.overallScore = average(store.score.scores);
	});

	return store;
};
