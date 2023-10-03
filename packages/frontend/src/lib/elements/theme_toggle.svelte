<script>
    import Cookies from "js-cookie";
</script>

<button
    class="btn_primary"
    on:click={() => {
        const _theme = Cookies.get("theme");
        switch (_theme) {
            case "dark":
                Cookies.set("theme", "light");
                document.documentElement.classList.remove("dark");
                break;

            case "light":
                Cookies.set("theme", "dark");
                document.documentElement.classList.add("dark");
                break;

            default:
                if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    Cookies.set("theme", "light");
                    document.documentElement.classList.remove("dark");
                } else {
                    Cookies.set("theme", "dark");
                    document.documentElement.classList.add("dark");
                }
                break;
        }
    }}
>
    toggle theme
</button>

<button
    class="btn_primary"
    on:click={() => {
        Cookies.remove("theme");
    }}
>
    clear theme
</button>
