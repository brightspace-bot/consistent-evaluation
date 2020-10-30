import './d2l-consistent-evaluation-lcb-user-context.js';
import './d2l-consistent-evaluation-lcb-file-context.js';
import '@brightspace-ui/core/components/colors/colors.js';
import { css, html, LitElement } from 'lit-element';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

export class ConsistentEvaluationLearnerContextBar extends SkeletonMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			userHref: {
				attribute: 'user-href',
				type: String
			},
			groupHref: {
				attribute: 'group-href',
				type: String
			},
			specialAccessHref: {
				attribute: 'special-access-href',
				type: String
			},
			token: {
				type: Object
			},
			submissionInfo: {
				attribute: false,
				type: Object
			},
			currentFileId: {
				type: String
			}
		};
	}

	constructor() {
		super();
	}

	static get styles() {
		return [super.styles, css`
			:host([skeleton]) .skeleton-user-profile-image {
				display: inline;
				height: 1.8rem;
				width: 1.8rem;
				float: left;
			}
			:host([skeleton]) .skeleton-user-display-name {
				display: inline;
				height: 1rem;
				width: 7rem;
				float: left;
				margin-left: 0.5rem;
				top: 0.4rem;
			}
			:host([skeleton]) .skeleton-submission-select {
				display: inline;
				height: 1rem;
				width: 7rem;
				float: left;
				margin-left: 0.5rem;
				top: 0.4rem;
			}
			:host([skeleton]) .consistent-evaluation-learner-context-bar {
				display:none;
			}
			.consistent-evaluation-learner-context-bar {
				display:flex;
			}
			:host {
				border-bottom: 0.05rem solid var(--d2l-color-gypsum);
				display: flex;
				height: 100%;
				padding: 0.75rem 0 0.75rem 1.5rem;
			}
			:host([hidden]) {
				display: none;
			}
			:host([dir="rtl"]) {
				padding-left: 0;
				padding-right: 1.5rem;
			}
			@media (max-width: 929px) and (min-width: 768px) {
				:host {
					padding-left: 1.2rem;
				}
				:host([dir="rtl"]) {
					padding-left: 0;
					padding-right: 1.2rem;
				}
			}
			@media (max-width: 767px) {
				:host {
					padding-left: 0.9rem;
				}
				:host([dir="rtl"]) {
					padding-left: 0;
					padding-right: 0.9rem;
				}
			}
		`];
	}

	updated(changedProperties) {
		super.updated();
		if(changedProperties.has('userHref')){
			this.skeleton = true;
		}
	};

	_getIsExempt() {
		return this.submissionInfo && this.submissionInfo.isExempt;
	}

	_getActorHref() {
		return this.userHref ? this.userHref : this.groupHref;
	}

	handleComponentReady(e) {
		this.dispatchEvent(new CustomEvent('d2l-consistent-evaluation-loading-finished', {
			composed: true,
			bubbles: true,
			detail: {
				component: 'lcb'
			}
		}));
	}

	render() {
		return html`
			<div class="skeleton-learner-context-bar" aria-hidden="${!this.skeleton}">
				<div class="skeleton-user-profile-image d2l-skeletize"></div>
				<div class="skeleton-user-display-name d2l-skeletize"></div>
				<div class="skeleton-submission-select d2l-skeletize"></div>
			</div>
			<div class="consistent-evaluation-learner-context-bar">
				<d2l-consistent-evaluation-lcb-user-context
					.href=${this._getActorHref()}
					.token=${this.token}
					?is-exempt=${this._getIsExempt()}
					?is-group-activity=${this.groupHref}
				></d2l-consistent-evaluation-lcb-user-context>
				<d2l-consistent-evaluation-lcb-file-context
					@d2l-consistent-evaluation-submission-list-ready=${this.handleComponentReady}
					.token=${this.token}
					special-access-href=${this.specialAccessHref}
					.currentFileId=${this.currentFileId}
					.submissionInfo=${this.submissionInfo}
				></d2l-consistent-evaluation-lcb-file-context>
			</div>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-learner-context-bar', ConsistentEvaluationLearnerContextBar);
