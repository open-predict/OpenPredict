<script lang="ts">
    
    export let url: string;
    export let ratio: number = 1;
    export let resolution: number = 200;

    function checkImage(url: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = function () {
                const width = image.width;
                const height = image.height;
                const aspectRatio = width / height;
                const minResolution = resolution; // Minimum resolution threshold
                if (
                    aspectRatio > ratio &&
                    width >= minResolution &&
                    height >= minResolution
                ) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            };
            image.onerror = function (e) {
                console.error("Failed to load the image.", e);
                resolve(false);
            };
            image.src = url;
        });
    }
</script>

{#await checkImage(url)}
    <div />
{:then display}
    {#if display}
        <slot />
    {/if}
{/await}
