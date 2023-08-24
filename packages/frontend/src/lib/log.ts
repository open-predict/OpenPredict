export default function log(
    level: "debug" | "info" | "warn" | "error",
    component: string,
    ...args: any
){
    switch (level) {
        case "debug":
            console.debug(`[${component}]`, ...args)
            break;
        case "info":
            console.info(`[${component}]`, ...args)
            break;
        case "warn":
            console.warn(`[${component}]`, ...args)
        case "error":
            console.error(`[${component}]`, ...args)
        default:
            break;
    }
}