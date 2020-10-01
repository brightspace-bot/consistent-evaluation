import 'd2l-users/components/d2l-profile-image.js';
import { css, html, LitElement } from 'lit-element';
import { bodyCompactStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { UserEntity } from 'siren-sdk/src/users/UserEntity.js';

export class ConsistentEvaluationLcbUserContext extends EntityMixinLit(RtlMixin(LitElement)) {

	static get properties() {
		return {
			_displayName: {
				attribute: false,
				type: String
			}
		};
	}

	static get styles() {
		return [bodyCompactStyles, css`
			:host {
				align-items: center;
				display: flex;
			}
			.d2l-consistent-evaluation-lcb-user-name {
				margin-left: 0.5rem;
				max-width: 10rem;
				min-width: 2rem;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				width: 100%;
			}
			:host([dir="rtl"]) .d2l-consistent-evaluation-lcb-user-name {
				margin-left: 0;
				margin-right: 0.5rem;
			}
		`];
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
			<d2l-profile-image
				href="${this.href}"
				.token="${this.token}"
				small
			></d2l-profile-image>
			<span class="d2l-body-compact d2l-consistent-evaluation-lcb-user-name">${ifDefined(this._displayName)}</span>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-lcb-user-context', ConsistentEvaluationLcbUserContext);
