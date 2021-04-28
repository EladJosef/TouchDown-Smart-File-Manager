<script>
	import Dashboard from "./Dashboard.svelte";
	const { ipcRenderer } = require("electron");

	export let debug;
	let has_login = false;
	let sign_up = false;
	let bad_login = false;
	let email = "";
	let password = "";

	function exit() {
		window.close();
	}
	function login() {
		if (try_login(email, password)) {
			has_login = true;
			ipcRenderer.send("full_screen");
		} else {
			bad_login = true;
		}
	}
	function try_login(email, password) {
		return true;
	}
</script>

<main>
	{#if has_login || debug}
		<Dashboard />
	{:else}
		<div class="drag">
			<svg
				on:click={exit}
				class="exit {sign_up ? 'left' : 'right'}"
				xmlns="http://www.w3.org/2000/svg"
				height="4%"
				viewBox="0 0 24 24"
				width="4%"
				fill="#fff"
				><path d="M0 0h24v24H0V0z" fill="none" /><path
					d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
				/></svg
			>
		</div>
		<div
			class=" {sign_up ? 'container right-panel-active' : 'container'}"
			id="container"
		>
			<div class="form-container sign-up-container">
				<form action="#">
					<h1 class="titel-form">Sign up</h1>
					<span class="info">Create your new account</span>
					<input type="text" placeholder="Name" />
					<input type="email" placeholder="Email" />
					<input type="password" placeholder="Password" />
					<input type="password" placeholder="Re-enter Password" />
					<button>Sign Up</button>
				</form>
			</div>
			<div class="form-container sign-in-container">
				<form on:submit={login} action="#">
					<h1 class="titel-form">Sign in</h1>
					<span class="info">Or sign in your account</span>
					<input
						type="email"
						placeholder="Email"
						bind:value={email}
					/>
					<input
						type="password"
						placeholder="Password"
						bind:value={password}
					/>
					<button type="submit">Sign In</button>
					{#if bad_login}
						<h1 class="user-bad-login">
							Incorrect password or username
						</h1>
					{/if}
				</form>
			</div>
			<div class="overlay-container">
				<div class="overlay">
					<div class="overlay-panel overlay-left">
						<h1 class="titel-overlay">Hello, Friend!</h1>
						<p class="info">
							Please enter the necessary information to register
							for the system
						</p>
						<button
							on:click={() => (sign_up = false)}
							class="ghost"
							id="signIn">Sign In</button
						>
					</div>
					<div class="overlay-panel overlay-right">
						<h1 class="titel-overlay">Long time my friend!</h1>
						<p class="info">
							Please enter your details so we can find your
							account
						</p>
						<button
							on:click={() => (sign_up = true)}
							class="ghost"
							id="signUp">Sign Up</button
						>
					</div>
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	@import url("https://fonts.googleapis.com/css?family=Montserrat:400,800");
	* {
		box-sizing: border-box;
	}

	main {
		width: 100vw;
		height: 100vh;
	}

	button {
		border-radius: 1vh;
		border: none;
		background-color: var(--main-color);
		color: var(--blank-color);
		font-size: 2vh;
		font-weight: bold;
		padding: 3vh 6vh;
		margin-top: 4vh;
		letter-spacing: 1px;
		text-transform: uppercase;
		transition: transform 80ms ease-in;
	}

	button:active {
		transform: scale(0.95);
	}

	button:focus {
		outline: 0;
	}

	button.ghost {
		background-color: transparent;
		border-color: var(--blank-color);
		border: 0.1vh solid var(--blank-color);
	}

	form {
		background-color: var(--blank-color);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 0 10vh;
		margin-top: -3vh;
		height: 100%;
		text-align: center;
	}

	input {
		background-color: var(--blank-color);
		border: 0.1vh solid var(--secondary-color);
		border-radius: 3vh;
		padding: 2vh 2vh;
		margin: 2vh 0;
		width: 100%;
		font-size: 2.5vh;
	}

	input:focus {
		outline: 0;
		border: 0.4vh solid var(--main-color);
		color: var(--main-color);
	}

	input:focus::placeholder {
		color: var(--main-color);
	}

	p.info {
		margin-bottom: 3vh;
		margin-top: -2vh;
		font-size: 3.5vh;
	}
	span.info {
		margin-bottom: 3vh;
		margin-top: -3vh;
		font-size: 3.5vh;
	}
	h1.titel-form {
		font-size: 10vh;
	}
	h1.user-bad-login {
		padding-top: 3vh;
		font-size: 3vh;
		color: crimson;
	}

	.titel-overlay {
		font-size: 7vh;
	}

	.drag {
		height: 5vh;
		background: var(--main-color);
		-webkit-user-select: none;
		-webkit-app-region: drag;
		color: var(--pure-whit);
	}

	.exit {
		position: absolute;
		height: 5vh;
		top: 1%;
		background: var(--main-color);
		-webkit-user-select: none;
		-webkit-app-region: none;
		color: var(--pure-whit);
	}

	.exit:hover {
		cursor: pointer;
	}

	.exit.left {
		animation-duration: 1s;
		animation-name: left-animation;
	}

	.exit.right {
		animation-duration: 1s;
		animation-name: right-animation;
		left: 96%;
	}

	.container {
		background-color: var(--pure-whit);
		position: relative;
		overflow: hidden;
		width: 100%;
		height: 95vh;
		-webkit-user-select: none;
		font-family: "Montserrat", sans-serif;
	}

	.form-container {
		position: absolute;
		top: 0;
		height: 100%;
		transition: all 0.6s ease-in-out;
	}

	.sign-in-container {
		left: 0;
		width: 50%;
		z-index: 2;
	}

	.container.right-panel-active .sign-in-container {
		transform: translateX(100%);
	}

	.sign-up-container {
		left: 0;
		width: 50%;
		opacity: 0;
		z-index: 1;
	}

	.container.right-panel-active .sign-up-container {
		transform: translateX(100%);
		opacity: 1;
		z-index: 5;
		animation: show 0.6s;
	}

	@keyframes show {
		0%,
		49.99% {
			opacity: 0;
			z-index: 1;
		}

		50%,
		100% {
			opacity: 1;
			z-index: 5;
		}
	}

	.overlay-container {
		position: absolute;
		top: 0;
		left: 50%;
		width: 50%;
		height: 100%;
		overflow: hidden;
		transition: transform 0.6s ease-in-out;
		z-index: 100;
	}

	.container.right-panel-active .overlay-container {
		transform: translateX(-100%);
	}

	.overlay {
		background: var(--background-color);
		background-repeat: no-repeat;
		background-size: cover;
		background-position: 0 0;
		color: var(--blank-color);
		position: relative;
		left: -100%;
		height: 100%;
		width: 200%;
		transform: translateX(0);
		transition: transform 0.6s ease-in-out;
	}

	.container.right-panel-active .overlay {
		transform: translateX(50%);
	}

	.overlay-panel {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 0 5vh;
		text-align: center;
		top: 0;
		height: 100%;
		width: 50%;
		transform: translateX(0);
		transition: transform 0.6s ease-in-out;
	}

	.overlay-left {
		transform: translateX(-20%);
	}

	.container.right-panel-active .overlay-left {
		transform: translateX(0);
	}

	.overlay-right {
		right: 0;
		transform: translateX(0);
	}

	.container.right-panel-active .overlay-right {
		transform: translateX(20%);
	}

	@keyframes left-animation {
		0% {
			left: 96%;
		}
		100% {
			left: 0;
		}
	}
	@keyframes right-animation {
		0% {
			left: 0;
		}
		100% {
			left: 96%;
		}
	}
</style>
