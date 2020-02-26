import './consistent-evaluation-page.js';
import { html } from 'lit-element';
import { MobxLitElement } from '@adobe/lit-mobx';
import RootStore from './stores/root.js';

export class ConsistentEvaluation extends MobxLitElement {

	static get properties() {
		return {
			rubricHref: { type: String },
			token: { type: String },
			rubricAssessmentHref: { type: String },
			outcomesHref: { type: String }
		};
	}

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
			.rubricHref=${this.rubricHref}
			.token=${this.token}
			.rubricAssessmentHref=${this.rubricAssessmentHref}
			.outcomesHref=${this.outcomesHref}
			@d2l-score-changed=${this.handleScoreChanged}>
		</d2l-consistent-evaluation-page>`;
	}
}

customElements.define('d2l-consistent-evaluation', ConsistentEvaluation);
