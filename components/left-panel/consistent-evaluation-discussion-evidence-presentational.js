import 'd2l-users/components/d2l-profile-image.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { d2lTableStyles } from './styles/d2l-table-styles.js';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

export class ConsistentEvaluationDiscussionEvidencePresentational extends RtlMixin(LitElement) {
	static get properties() {
		return {
			posts: { type: Array },
			profileImageHref: { type: String },
			token: { type: String },
			userName: { type: String }
		};
	}

	static get styles() {
		return [d2lTableStyles,
			inputLabelStyles,
			selectStyles,
			css`
				.d2l-consistent-evaluation-discussion-evidence-container {
					display: grid;
					grid-template-columns: 5rem auto 10rem;
					grid-template-rows: 6rem auto 3rem;
					grid-template-areas: 
						"profile-image user sort-order"
						"posts posts posts"
						". . paging";
					align-items: center;
				}

				.d2l-consistent-evaluation-discussion-evidence-profile-image {
					grid-area: profile-image;
				}

				.d2l-consistent-evaluation-discussion-evidence-profile-user {
					grid-area: user;
				}

				.d2l-consistent-evaluation-discussion-evidence-profile-posts-sort-order {
					grid-area: sort-order;
					justify-self: end;
				}

				.d2l-consistent-evaluation-discussion-evidence-profile-posts {
					grid-area: posts;
				}

				.d2l-consistent-evaluation-discussion-evidence-profile-posts-paging {
					grid-area: paging;
					justify-self: end;
				}
			`];
	}

	_renderDiscussionPosts() {
		return html`${this.posts.map((post) => html`
			<tr>
				<td>${post}</td>
			</tr>
		`)}`;
	}

	render() {
		return html`
			<div class="d2l-consistent-evaluation-discussion-evidence-container">
				<d2l-profile-image
					class="d2l-consistent-evaluation-discussion-evidence-profile-image"
					href="${this.profileImageHref}"
					token="${this.token}"
					x-large
				></d2l-profile-image>

				<div class="d2l-consistent-evaluation-discussion-evidence-profile-user">
					${this.userName}
				</div>

				<div class="d2l-consistent-evaluation-discussion-evidence-profile-posts-sort-order">
					<label>
						<span class="d2l-input-label">Sort By:</span>
						<select class="d2l-input-select">
							<option>Post Date</option>
							<option>Post Subject</option>
							<option>Average Rating</option>
						</select>
					</label>
				</div>

				<div class="d2l-consistent-evaluation-discussion-evidence-profile-posts">
					<table>
						<thead>
							<tr>
								<th>Post</th>
							</tr>
						</thead>
						<tbody>
							${this._renderDiscussionPosts()}
						</tbody>
					</table>
				</div>

				<div class="d2l-consistent-evaluation-discussion-evidence-profile-posts-paging">
					<select class="d2l-input-select">
						<option>10 per page</option>
						<option>20 per page</option>
						<option>50 per page</option>
					</select>
				</div>
			</div>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-discussion-evidence-presentational', ConsistentEvaluationDiscussionEvidencePresentational);
