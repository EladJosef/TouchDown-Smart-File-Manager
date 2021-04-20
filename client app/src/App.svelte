<script>
	export let debug;
	let sign_up = false;
</script>

<main>
	<div class="logo">
		<img src="" alt="" class="logo-img" />
	</div>
	<div
		class=" {sign_up ? 'container right-panel-active' : 'container'}"
		id="container"
	>
		<div class="form-container sign-up-container">
			<form action="#">
				<h1>Create Account</h1>
				<span>or use your email for registration</span>
				<input type="text" placeholder="Name" />
				<input type="email" placeholder="Email" />
				<input type="password" placeholder="Password" />
				<button>Sign Up</button>
			</form>
		</div>
		<div class="form-container sign-in-container">
			<form action="#">
				<h1>Sign in</h1>
				<span>or use your account</span>
				<input type="email" placeholder="Email" />
				<input type="password" placeholder="Password" />
				<button>Sign In</button>
			</form>
		</div>
		<div class="overlay-container">
			<div class="overlay">
				<div class="overlay-panel overlay-left">
					<h1>Welcome Back!</h1>
					<p>
						To keep connected with us please login with your
						personal info
					</p>
					<button
						on:click={() => (sign_up = false)}
						class="ghost"
						id="signIn">Sign In</button
					>
				</div>
				<div class="overlay-panel overlay-right">
					<h1>Hello, Friend!</h1>
					<p>Enter your personal details and start journey with us</p>
					<button
						on:click={() => (sign_up = true)}
						class="ghost"
						id="signUp">Sign Up</button
					>
				</div>
			</div>
		</div>
	</div>
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
		font-size: 1.5vh;
		font-weight: bold;
		padding: 12px 45px;
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
		border: 1px solid var(--blank-color);
	}

	form {
		background-color: var(--blank-color);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 0 50px;
		height: 100%;
		text-align: center;
	}

	input {
		background-color: var(--blank-color);
		border: none;
		padding: 12px 15px;
		margin: 8px 0;
		width: 100%;
	}

	.logo {
		height: 30vh;
		background-color: var(--main-color);
		-webkit-app-region: drag;
		-webkit-user-select: none;
	}

	.container {
		user-select: none;
		font-family: "Montserrat", sans-serif;
	}

	.container {
		background-color: #fff;
		position: relative;
		overflow: hidden;
		width: 100%;
		height: 70vh;
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
		padding: 0 40px;
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
</style>
