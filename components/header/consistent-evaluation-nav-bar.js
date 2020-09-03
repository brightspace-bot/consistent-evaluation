import 'd2l-navigation/d2l-navigation.js';
import 'd2l-navigation/d2l-navigation-main-header.js';
import 'd2l-navigation/d2l-navigation-link-back.js';
import 'd2l-navigation/components/d2l-navigation-iterator/d2l-navigation-link-iterator.js';

import { css, html, LitElement } from 'lit-element';
import { labelStyles } from '@brightspace-ui/core/components/typography/styles.js';

class ConsistentEvaluationNavBar extends LitElement {
	static get properties() {
		return {
			_assignmentName: {
				attribute: false,
				type: Object
			},
			_courseName: {
				attribute: false,
				type: Object
			},
		};
	}

	static get styles() {
		return [labelStyles, css`
			.d2l-navigation-header-left{
				padding-right: 1rem;
			}
			.d2l-user-iterator {
				padding-left: 1rem;
				padding-right: 1rem;
			}
		`];
	}

	constructor() {
		super();
		this._assignmentName = 'Assignment 1 - File Submission';
		this._courseName = 'History 1170-03';
	}

	_backButtonClicked() {
		// go back to previous page
		console.log('This should go to previous page');
	}

	render() {
		return html`
			<d2l-navigation>
				<d2l-navigation-main-header>

					<div slot="left" class="d2l-navigation-header-left">
						<d2l-navigation-link-back 
							class="d2l-label-text"
							@click="${this._backButtonClicked}"
							text="Back to Quick Eval">
						</d2l-navigation-link-back>
					</div>

					<div slot="left">
						<div class="d2l-heading-3">${this._assignmentName}</div>
						<div class="d2l-label-text">${this._courseName}</div>
					</div>

					<div slot="right" class="d2l-navigation-header-right">
						<d2l-navigation-link-iterator previous-href="https://www.d2l.com" next-href="https://www.nfl.com" hide-text>
							<span class="d2l-user-iterator d2l-label-text">User 1 of 17</span>
						</d2l-navigation-link-iterator>
					</div>

				</d2l-navigation-main-header>
			</d2l-navigation>
		`;
	}
}

customElements.define('d2l-consistent-evaluation-nav-bar', ConsistentEvaluationNavBar);
