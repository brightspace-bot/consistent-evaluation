import './consistent-evaluation-page.js';
import { createStore } from './stores/store.js';
import { html } from 'lit-element';
import { MobxLitElement } from '@adobe/lit-mobx';

export class ConsistentEvaluation extends MobxLitElement {
	constructor() {
		super();
		this.store = createStore();
	}

	handleScoreChanged(e) {
		this.store.setScore(e.detail.i, e.detail.score);
	}

	render() {
		return html`
        <d2l-consistent-evaluation-page
			.scores=${this.store.score.scores}
			.overallScore=${this.store.score.overallScore}
			@d2l-score-changed=${this.handleScoreChanged}>
		</d2l-consistent-evaluation-page>`;
	}
}

customElements.define('d2l-consistent-evaluation', ConsistentEvaluation);
