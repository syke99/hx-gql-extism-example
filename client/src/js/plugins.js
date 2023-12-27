import { v4 as uuidv4 } from "uuid";

let plugins = new Map;

export function registerPlugin(id, config) {
    plugins.set(id, config)
}

export function addPluginListeners () {
    console.log("adding Extism plugins");

    for (const [key, value] of plugins) {
        let element = document.getElementById(key);

        let parentElem = element.parentElement;

        let cb = value.callback;

        cb(element, parentElem, value.manifest);
    }

    console.log("plugins added");
}

htmx.defineExtension("extism", {
    onEvent : function (name, event) {
        if (name === "htmx:afterSettle") {
            let res = JSON.parse(event.detail.xhr.responseText);

            htmx.trigger(event.detail.elt, "swapWithPlugin", {uuid: `extism-${uuidv4()}`, res: res})
        }
    }
})
