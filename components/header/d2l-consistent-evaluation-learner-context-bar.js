import './d2l-consistent-evaluation-lcb-user-context.js';
import { css, html, LitElement } from 'lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { UserEntity } from 'siren-sdk/src/users/UserEntity.js';

export class ConsistentEvaluationLearnerContextBar extends (EntityMixinLit(RtlMixin(LitElement))) {

	static get properties() {
		return {
			_displayName: {
				attribute: false,
				type: String
			}
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
				height: 100%;
				margin: 0.75rem 0 0.75rem 1.5rem;
			}
			:host([hidden]) {
				display: none;
			}
			:host([dir="rtl"]) {
				margin-left: 0;
				margin-right: 1.5rem;
			}
			@media (max-width: 929px) and (min-width: 768px) {
				:host {
					margin-left: 1.2rem;
				}
				:host([dir="rtl"]) {
					margin-left: 0;
					margin-right: 1.2rem;
				}
			}
			@media (max-width: 767px) {
				:host {
					margin-left: 0.9rem;
				}
				:host([dir="rtl"]) {
					margin-left: 0;
					margin-right: 0.9rem;
				}
			}
		`;
	}

	constructor() {
		super();

		this._setEntityType(UserEntity);
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			this._onUserEntityChanged(entity);
			super._entity = entity;
		}
	}

	_onUserEntityChanged(userEntity, error) {
		if (error || userEntity === null) {
			return;
		}

		this._displayName = userEntity.getDisplayName();
	}

	render() {
		return html`
			<d2l-consistent-evaluation-lcb-user-context
				profile-image-href="${this.href}"
				display-name="${ifDefined(this._displayName)}"
				.token="${this.token}"
			></d2l-consistent-evaluation-lcb-user-context>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-learner-context-bar', ConsistentEvaluationLearnerContextBar);
