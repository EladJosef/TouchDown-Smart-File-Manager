<script>
    import IoIosPower from "svelte-icons/io/IoIosPower.svelte";
    import IoIosContacts from "svelte-icons/io/IoIosContacts.svelte";
    import IoIosCog from "svelte-icons/io/IoIosCog.svelte";
    import IoIosFingerPrint from "svelte-icons/io/IoIosFingerPrint.svelte";
    import IoIosNavigate from "svelte-icons/io/IoIosNavigate.svelte";

    const { ipcRenderer } = require("electron");
    ipcRenderer.send("full_screen");

    let index = 0;
    let rl = true;

    function exit() {
        window.close();
    }
</script>

<main>
    <div class="grid-container {rl ? 'rl' : 'lr'}">
        <div class="sidebar">
            <div class="logo" />
            <div class="label">
                <div class="icon">
                    <IoIosNavigate />
                </div>
                <div class="text">Dashboard</div>
            </div>
            <div class="label">
                <div class="icon">
                    <IoIosContacts />
                </div>
                <div class="text">Clients</div>
            </div>
            <div class="label">
                <div class="icon">
                    <IoIosFingerPrint />
                </div>
                <div class="text">My Account</div>
            </div>
            <div class="label">
                <div class="icon">
                    <IoIosCog />
                </div>
                <div class="text">Settings</div>
            </div>
            <div class="label" on:click={exit}>
                <div class="icon">
                    <IoIosPower />
                </div>
                <div class="text">Close</div>
            </div>
        </div>
        <div class="main-page">2</div>
    </div>
</main>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Secular+One&display=swap");
    .grid-container {
        font-family: "Secular One", sans-serif;
        height: 100vh;
        width: 100vw;
        display: grid;

        grid-template-rows: 1fr;
        gap: 0px 0px;
    }
    .grid-container.rl {
        grid-template-areas: "sidebar main-page";
        grid-template-columns: 0.3fr 1.7fr;
    }
    .grid-container.lr {
        grid-template-areas: "main-page sidebar";
        grid-template-columns: 1.7fr 0.3fr;
    }
    .sidebar {
        grid-area: sidebar;
        background-color: var(--main-color);
    }
    .main-page {
        grid-area: main-page;
        background-color: var(--blank-color);
    }
    .label {
        user-select: none;
        margin: 2vh;
        background-color: var(--blank-color);
        border-radius: 2vh;
    }
    .label:hover {
        cursor: pointer;
    }
    .logo {
        width: 100%;
        padding-top: 60%;
        height: 10vh;
        background-color: rgb(180, 180, 180);
    }
    .label .icon {
        position: absolute;
        display: inline-block;
        width: 3vh;
        height: 3vh;
        float: none;
    }
    .label .text {
        display: inline-block;
        margin-top: 0.1vh;
        font-size: 2vh;
        float: none;
        padding-left: 3.5vh;
    }
</style>
