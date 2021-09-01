<template>
	<div class="home container">
		<!-- filter options -->
		<div class="filter-options">
			<div class="search">
				<input
					type="text"
					placeholder="Search for a country."
					class="search-input"
					v-model="query"
				/>
				<div class="search-icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
						focusable="false"
						data-prefix="fas"
						data-icon="search"
						class="svg-inline--fa fa-search fa-w-16"
						role="img"
						viewBox="0 0 512 512"
					>
						<path
							fill="currentColor"
							d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
						/>
					</svg>
				</div>
			</div>
			<div class="region" id="region-menu">
				<div
					class="selection"
					@click="displayRegionsMenu = !displayRegionsMenu"
				>
					<p>
						{{
							regionSelected.name === 'All'
								? 'Filter by Region'
								: regionSelected.name
						}}
					</p>
					<div class="icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
							focusable="false"
							data-prefix="fas"
							data-icon="caret-down"
							class="svg-inline--fa fa-caret-down fa-w-10"
							role="img"
							viewBox="0 0 320 512"
						>
							<path
								fill="currentColor"
								d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
							/>
						</svg>
					</div>
				</div>
				<div
					class="options"
					v-if="displayRegionsMenu"
					v-closeMenuEvents="closeMenu"
				>
					<ul>
						<li
							v-for="region in regions"
							:key="region.value"
							@click="selectRegion(region)"
						>
							{{ region.name }}
						</li>
					</ul>
				</div>
			</div>
		</div>
		<!-- Countries cards -->
		<div class="countries">
			<div
				class="no-found-message"
				v-if="filteredCountries.length === 0 && query.length > 0"
			>
				<h2>No country was found that matches "{{ query }}"</h2>
			</div>
			<div class="cards-container">
				<div
					class="card"
					v-for="country in filteredCountries"
					:key="country.name"
				>
					<RouterLink
						:to="{ name: 'Country', params: { name: country.alpha3Code } }"
					>
						<div class="country-flag">
							<img :src="country.flag" :alt="`${country.name} flag`" />
						</div>
						<div class="country-info">
							<h2 class="country-name">
								{{ country.name | limitCharacters(35) }}
							</h2>
							<p>
								<b>Population: </b>
								{{ country.population | commaSeparatedNumber }}
							</p>
							<p>
								<b>Region: </b> {{ country.region ? country.region : ' - ' }}
							</p>
							<p>
								<b>Capital: </b> {{ country.capital ? country.capital : ' - ' }}
							</p>
						</div>
					</RouterLink>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
	mounted() {
		document.addEventListener('scroll', this.handleInfiniteScroll);
		document.title = 'Where in the world?';
	},
	name: 'Home',
	data() {
		return {
			query: '',
			displayRegionsMenu: false,
			countriesLimit: 20,
			countriesPerPage: 20,
			regionSelected: {
				name: 'All',
				value: 'All',
			},
			regions: [
				{
					name: 'All',
					value: 'All',
				},
				{
					name: 'Africa',
					value: 'Africa',
				},
				{
					name: 'America',
					value: 'Americas',
				},
				{
					name: 'Asia',
					value: 'Asia',
				},
				{
					name: 'Europe',
					value: 'Europe',
				},
				{
					name: 'Oceania',
					value: 'Oceania',
				},
			],
		};
	},
	computed: {
		...mapState(['darkMode']),
		filteredCountries() {
			const allCountries = this.$store.getters.allCountries;
			let filteredCountries = allCountries.map((el) => el);
			if (this.regionSelected.value !== 'All') {
				filteredCountries = filteredCountries.filter(
					(country) => country.region === this.regionSelected.value
				);
			}
			if (this.query.trim().length > 0) {
				filteredCountries = filteredCountries.filter((country) =>
					country.name.toLowerCase().includes(this.query.trim().toLowerCase())
				);
			}
			return filteredCountries.slice(0, this.countriesLimit);
		},
	},
	methods: {
		closeMenu() {
			this.displayRegionsMenu = false;
		},
		selectRegion(region) {
			this.regionSelected = region;
			this.displayRegionsMenu = false;
		},
		handleInfiniteScroll() {
			const {
				scrollTop,
				scrollHeight,
				clientHeight,
			} = document.documentElement;

			if (scrollTop + clientHeight >= scrollHeight) {
				this.countriesLimit = this.countriesLimit + this.countriesPerPage;
			}
		},
	},
	directives: {
		closeMenuEvents: {
			bind(el, binding, vnode) {
				el.closeMenuEvent = function(event) {
					if (event.type === 'keyup') {
						if (event.key === 'Escape') {
							vnode.context[binding.expression](event);
						}
						return;
					}

					if (
						!(
							event.target === document.querySelector('#region-menu') ||
							document.querySelector('#region-menu').contains(event.target)
						)
					) {
						vnode.context[binding.expression](event);
					}
				};
				document.body.addEventListener('click', el.closeMenuEvent);
				document.body.addEventListener('keyup', el.closeMenuEvent);
			},
			unbind(el) {
				document.body.removeEventListener('click', el.closeMenuEvent);
				document.body.removeEventListener('keyup', el.closeMenuEvent);
			},
		},
	},
};
</script>

<style lang="scss" scoped>
.home {
	padding-top: 24px;
	padding-bottom: 24px;
	.filter-options {
		width: 100%;
		.search {
			position: relative;
			color: $dark-gray;
			font-family: inherit;
			width: 100%;
			.search-input {
				height: 50px;
				width: 100%;
				padding-left: 50px;
				border-radius: 4px;
				border: none;
				box-shadow: $shadow1;
				outline: none;
			}
			.search-icon {
				position: absolute;
				display: flex;
				justify-content: center;
				align-items: center;
				top: 0;
				height: 100%;
				width: 50px;
				svg {
					height: 16px;
					width: 16px;
				}
			}
		}
		.region {
			position: relative;
			width: 50%;
			height: 50px;
			background-color: $white;
			display: flex;
			align-items: center;
			font-size: 0.8em;
			margin-top: 20px;
			border-radius: 4px;
			box-shadow: $shadow1;
			max-width: 200px;
			user-select: none;
			.selection {
				position: relative;
				padding: 0 15px;
				display: flex;
				align-items: center;
				height: 100%;
				width: 100%;
				.icon {
					position: absolute;
					width: 8px;
					right: 20px;
				}
			}
			.options {
				position: absolute;
				width: 100%;
				background-color: $white;
				top: 55px;
				box-shadow: $shadow1;
				border-radius: 4px;
				z-index: 99;
				ul {
					list-style: none;
					width: 100%;
					height: 100%;
					padding: 2px;
					margin: 0;
					li {
						padding: 8px 20px;
						border-radius: 4px;
						&:active,
						&:hover {
							background-color: lighten($dark-gray, 35%);
						}
					}
				}
			}
		}
	}
	.countries {
		margin-top: 30px;
		.no-found-message {
			width: 100%;
			text-align: center;
			h2 {
				font-size: 1.25rem;
			}
		}

		.cards-container {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			.card {
				border-radius: 4px;
				box-shadow: $shadow1;
				overflow: hidden;
				margin-bottom: 20px;
				margin-right: 20px;
				width: 264px;
				height: 335px;
				a {
					width: 100%;
					height: 100%;
					display: block;
					text-decoration: none;
					color: inherit;
					.country-flag {
						width: 100%;
						height: 160px;
						img {
							width: 100%;
							height: 100%;
							object-fit: cover;
						}
					}
					.country-info {
						padding: 30px 25px;
						h2 {
							margin: 0;
							margin-bottom: 23px;
							font-size: 1.15em;
						}
						p {
							font-size: 0.8em;
							margin: 0;
							margin-bottom: 10px;
						}
					}
				}
			}
		}
	}
}

.dark {
	.home {
		.filter-options {
			.search {
				color: inherit;
				input {
					color: inherit;
					background-color: $dark-blue;
					&::placeholder {
						color: inherit;
					}
				}
			}
			.region {
				background-color: $dark-blue;
				.options {
					background-color: $dark-blue;
					ul {
						li {
							&:active,
							&:hover {
								background-color: darken($dark-blue, 5%);
							}
						}
					}
				}
			}
		}
		.countries {
			.cards-container {
				.card {
					background-color: $dark-blue;
				}
			}
		}
	}
}

@media screen and (min-width: 768px) {
	.home {
		.filter-options {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			.search {
				width: 480px;
			}
			.region {
				margin: 0;
			}
		}
	}
}
</style>
