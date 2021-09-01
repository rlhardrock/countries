<template>
	<div class="country-container container">
		<div class="back-button">
			<router-link :to="{ name: 'Home' }">
				<div class="arrow-icon">
					<svg
						aria-hidden="true"
						focusable="false"
						data-prefix="fas"
						data-icon="arrow-left"
						class="svg-inline--fa fa-arrow-left fa-w-14"
						role="img"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 448 512"
					>
						<path
							fill="currentColor"
							d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"
						></path>
					</svg>
				</div>
				<span>Back</span>
			</router-link>
		</div>
		<ErrorMessage msg="The country was not found." v-if="!country" />
		<div class="country" v-if="country">
			<div class="country-flag">
				<img :src="country.flag" :alt="`${country.name} flag`" />
			</div>
			<div class="country-details">
				<h2>{{ country.name }}</h2>
				<div class="country-info">
					<div class="info-1">
						<p><b>Native name:</b> {{ country.nativeName }}</p>
						<p>
							<b>Population:</b> {{ country.population | commaSeparatedNumber }}
						</p>
						<p><b>Region:</b> {{ country.region ? country.region : ' - ' }}</p>
						<p>
							<b>Sub Region:</b>
							{{ country.subregion ? country.subregion : ' - ' }}
						</p>
						<p>
							<b>Capital:</b> {{ country.capital ? country.capital : ' - ' }}
						</p>
					</div>
					<div class="info-2">
						<p><b>Top level domain:</b> {{ country.topLevelDomain[0] }}</p>
						<p><b>Currencies:</b> {{ currenciesToString }}</p>
						<p><b>Languages:</b> {{ languagesToString }}</p>
					</div>
				</div>
				<div class="border-countries-container">
					<h3>Border countries:</h3>
					<div class="border-countries" v-if="borderCountries.length > 0">
						<div
							class="border-country"
							v-for="country in borderCountries"
							:key="`border-${country.alpha3Code}`"
						>
							<router-link
								:to="{ name: 'Country', params: { name: country.alpha3Code } }"
							>
								<span>{{ country.name | limitCharacters(20) }}</span>
							</router-link>
						</div>
					</div>
					<div class="no-border-countries" v-else>
						<h4>Doesn't have border countries.</h4>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ErrorMessage from '@/components/ErrorMessage.vue';
export default {
	mounted() {},
	name: 'Country',
	data() {
		return {};
	},
	computed: {
		countryCode() {
			return this.$route.params.name;
		},
		country() {
			const country = this.$store.getters.country(this.countryCode);
			if (country) {
				document.title = `Where in the world? - ${country.name}`;
			}
			return country;
		},
		currenciesToString() {
			const currenciesArray = this.country.currencies.map(
				(currency) => currency.name
			);
			const currenciesString =
				currenciesArray.length > 0 ? currenciesArray.join(', ') : '-';
			return currenciesString;
		},
		languagesToString() {
			const languagesArray = this.country.languages.map(
				(language) => language.name
			);
			const languagesString =
				languagesArray.length > 0 ? languagesArray.join(', ') : '-';
			return languagesString;
		},
		borderCountries() {
			let borderCountries = [];
			const borderCountriesCodes = this.country.borders;
			borderCountriesCodes.forEach((countryCode) => {
				const { name, alpha3Code } = this.$store.getters.country(countryCode);
				borderCountries.push({
					name,
					alpha3Code,
				});
			});
			return borderCountries;
		},
	},
	components: {
		ErrorMessage,
	},
};
</script>

<style scoped lang="scss">
.country-container {
	display: flex;
	flex-direction: column;
	padding-top: 24px;
	padding-top: 24px;
	padding-bottom: 24px;
	.back-button {
		width: 125px;
		height: 45px;
		border-radius: 4px;
		background-color: $white;
		box-shadow: $shadow1;
		a {
			display: flex;
			flex-direction: row;
			text-decoration: none;
			color: inherit;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
			.arrow-icon {
				display: flex;
				align-items: center;
				height: 100%;
				margin-right: 10px;
				svg {
					width: 13px;
				}
			}
			span {
				font-size: 0.9em;
				margin-right: 10px;
			}
		}
	}
	.country {
		margin-top: 40px;
		.country-flag {
			width: 100%;
			img {
				width: 100%;
			}
		}
		.country-details {
			margin-top: 35px;
			h2 {
				margin: 0;
				margin-bottom: 30px;
				font-size: 1.5rem;
			}
			.country-info {
				font-size: 0.9rem;
				.info-1,
				.info-2 {
					margin-bottom: 35px;
				}
			}
			.border-countries-container {
				h3 {
					font-size: 1.1rem;
					font-weight: 600;
				}
				.border-countries {
					display: flex;
					flex-wrap: wrap;
					.border-country {
						background-color: $white;
						box-shadow: $shadow1;
						padding: 10px 20px;
						border-radius: 4px;
						margin-right: 15px;
						margin-bottom: 15px;
						a {
							width: 100%;
							height: 100%;
							text-decoration: none;
							color: inherit;
							font-size: 0.9rem;
						}
					}
				}
				.no-border-countries {
					h4 {
						font-weight: 400;
						font-size: 0.9rem;
					}
				}
			}
		}
	}
}

.dark {
	.country-container {
		.back-button {
			background-color: $dark-blue;
		}
	}
	.country {
		justify-content: space-between;
		.country-details {
			.border-countries-container {
				.border-countries {
					.border-country {
						background-color: $dark-blue;
					}
				}
			}
		}
	}
}

@media screen and (min-width: 768px) {
	.country-container {
		.country {
			display: flex;
			justify-content: space-between;
			.country-flag {
				width: 47%;
			}
			.country-details {
				width: 47%;
				margin-top: 0;
			}
		}
	}
}
@media screen and (min-width: 1023px) {
	.country-container {
		.country {
			display: flex;
			justify-content: space-between;
			.country-details {
				.country-info {
					display: flex;
					justify-content: space-between;
					max-width: 500px;
				}
			}
		}
	}
}
</style>
