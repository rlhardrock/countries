import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		allCountries: [],
		darkMode: false,
		countriesLoaded: false,
		apiError: null,
	},
	mutations: {
		setAllCountries(state, payload) {
			state.allCountries = payload;
			state.countriesLoaded = true;
		},
		setApiError(state, payload) {
			state.apiError = payload;
			state.countriesLoaded = true;
		},
		toggleDarkMode(state) {
			state.darkMode = !state.darkMode;
			if (state.darkMode) {
				localStorage.setItem('darkMode', true);
			} else {
				localStorage.removeItem('darkMode');
			}
		},
		setDarkMode(state, payload) {
			state.darkMode = payload;
			if (state.darkMode) {
				localStorage.setItem('darkMode', true);
			} else {
				localStorage.removeItem('darkMode');
			}
		},
	},
	actions: {
		async getAllCountries({ commit }) {
			try {
				const res = await axios.get(`https://restcountries.eu/rest/v2/all`);
				const data = await res.data;
				if (res.status >= 200 && res.status < 300) {
					commit('setAllCountries', data);
					return;
				}
			} catch (error) {
				commit('setApiError', error);
				throw new Error(error);
			}
		},
		readDarkMode({ commit }) {
			const darkMode = localStorage.getItem('darkMode');
			if (darkMode) {
				commit('setDarkMode', true);
			} else {
				commit('setDarkMode', false);
			}
		},
	},
	getters: {
		darkMode(state) {
			return state.darkMode;
		},
		allCountries(state) {
			return state.allCountries;
		},
		country(state) {
			return (countryCode) => {
				return state.allCountries.find(
					(country) => country.alpha3Code === countryCode
				);
			};
		},
	},
	modules: {},
});
