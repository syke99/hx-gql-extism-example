import { v4 as uuidv4 } from "uuid";

let plugins = new Map;

export function registerPlugin(id, config) {
    plugins.set(id, config);
}

export function addPluginListeners() {
    console.log("adding Extism plugins");

    for (const [key, value] of plugins) {
        let element = document.getElementById(key);

        let cb = value.callback;

        cb(element, value.manifest);
    }

    console.log("plugins added");
}

export function addExtismSwapEventCallback(element, callback) {
    element.addEventListener('extismSwap', callback);
}

htmx.defineExtension("hx-extism", {
    onEvent : function (name, event) {
        if (name === "htmx:afterSettle") {
            htmx.trigger(event.detail.elt, "extismSwap", {extismUUID: `extism-${uuidv4()}`, res: event.detail.xhr});
        }
    }
})
