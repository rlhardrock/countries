import Vue from 'vue';

Vue.filter('commaSeparatedNumber', (value) => {
	let val = value;
	while (/(\d+)(\d{3})/.test(val.toString())) {
		val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
	}
	return val;
});

Vue.filter('limitCharacters', (value, characters) => {
	if (value.length < characters) {
		return value;
	}
	return value.slice(0, characters).trim() + '...';
});
