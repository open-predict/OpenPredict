<script lang="ts">
    export let size = 28;
</script>

<svg
    width={size}
    height={size}
    viewBox="0 0 400 400"
    xmlns="http://www.w3.org/2000/svg"
    class="rotate-45"
>
    <g>
        <rect
            height="100"
            width="40"
            y="275"
            x="180"
            class="fill-indigo-600 dark:fill-indigo-400"
        />
        <rect
            height="100"
            width="40"
            y="25"
            x="180"
            class="fill-indigo-600 dark:fill-indigo-400"
        />
        <rect
            height="40"
            width="100"
            y="180"
            x="275"
            class="fill-indigo-600 dark:fill-indigo-400"
        />
        <ellipse
            ry="175"
            rx="175"
            cy="200"
            cx="200"
            stroke-width={40}
            clip-path="url(#quarter_clip)"
            class="stroke-indigo-600 dark:stroke-indigo-400 fill-transparent"
        />
        <rect
            height="180"
            width="180"
            y="220"
            x="220"
            class="fill-white dark:fill-black"
        />
        <ellipse
            ry="75"
            rx="75"
            cy="200"
            cx="200"
            stroke-width={40}
            class="stroke-indigo-600 dark:stroke-indigo-400 fill-transparent"
        />
    </g>
</svg>
