import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		debug: false
	}
});

export default app;