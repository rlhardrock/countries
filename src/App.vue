<template>
	<main :class="{ dark: darkMode }" class="main">
		<div class="loader" v-if="!countriesLoaded">
			<img src="@/assets/gif/loader.gif" alt="loader" v-if="!darkMode" />
			<img src="@/assets/gif/loader-dark.gif" alt="loader-dark" v-else />
			<h2>Loading countries...</h2>
		</div>
		<ErrorMessage v-if="apiError" :msg="apiError" />
		<Header></Header>
		<router-view v-if="countriesLoaded && !apiError" />
	</main>
</template>

<script>
import Header from '@/components/Header.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import { mapState } from 'vuex';

export default {
	beforeCreate() {
		this.$store.dispatch('getAllCountries');
		this.$store.dispatch('readDarkMode');
	},
	methods: {},
	computed: {
		...mapState(['countriesLoaded', 'apiError']),
		darkMode() {
			return this.$store.getters.darkMode;
		},
	},
	components: { Header, ErrorMessage },
};
</script>

<style lang="scss">
body,
html {
	width: 100%;
	min-height: 100vh;
	padding: 0;
	margin: 0;
}

*,
*::before,
*::after {
	box-sizing: border-box;
}

body {
	font-family: 'Nunito Sans', sans-serif;
}

.main {
	width: 100%;
	min-height: 100vh;
	padding-top: 75px;

	background-color: $very-light-gray;
	color: $very-dark-blue;
	&.dark {
		background-color: $very-dark-blue2;
		color: $white;
	}
}

.container {
	padding: 0 16px;
	height: 100%;
	width: 100%;
	margin: 0 auto;
	max-width: 1300px;
}

.loader {
	margin-top: 40px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	img {
		width: 80px;
		height: 80px;
	}
	h2 {
		font-size: 1.3rem;
	}
}

@media screen and (min-width: 768px) {
	.container {
		padding: 0 24px;
	}
}
</style>
