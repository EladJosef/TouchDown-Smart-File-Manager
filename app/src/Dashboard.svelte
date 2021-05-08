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
    let disappear = false;

    function exit() {
        window.close();
    }
</script>

<main>
    <div class="sidebar">111</div>
    <div class="main">222</div>
</main>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Secular+One&display=swap");
    .sidebar {
        display: inline-block;
        width: 15vw;
        height: 100vh;
        background-color: brown;
        margin: 0 0 0 0;
        padding: 0;
    }
    .main {
        display: inline-block;
        width: 85vw;
        height: 100vh;
        background-color: blue;
        margin-left: -0.15565vw;
        padding: 0;
    }
</style>
