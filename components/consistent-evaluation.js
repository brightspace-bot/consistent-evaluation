import './consistent-evaluation-page.js';
import { html } from 'lit-element';
import { MobxLitElement } from '@adobe/lit-mobx';
import RootStore from './stores/root.js';

export class ConsistentEvaluation extends MobxLitElement {
	constructor() {
		super();
		this.store = new RootStore();
	}

	handleScoreChanged(e) {
		this.store.scoresStore.setScore(e.detail.i, e.detail.score);
	}

	render() {
		return html`
        <d2l-consistent-evaluation-page
			.scores=${this.store.scoresStore.scores}
			.overallScore=${this.store.overallScoreStore.overallScore}
			.overallScoreTwo=${this.store.overallScoreStore.overallScoreTwo}
			@d2l-score-changed=${this.handleScoreChanged}>
		</d2l-consistent-evaluation-page>`;
	}
}

customElements.define('d2l-consistent-evaluation', ConsistentEvaluation);
