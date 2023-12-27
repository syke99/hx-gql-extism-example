import { addExtismSwapEventCallback } from "./plugins";
import { createPlugin } from "@extism/extism";

export function addPlugin(element, manifest) {
    async function runPlugin(event) {
        let input = JSON.parse(event.detail.res.responseText).data.responses[0].language;

        let id = event.detail.extismUUID;

        let parent = element.parentElement;

        const plugin = await createPlugin(manifest, {useWasi: true});

        let hasRenderFunc = await plugin.functionExists("render");

        if (hasRenderFunc) {
            let output = await plugin.call("render", input);

            let rendered = output.text();

            // for some reason, despite recompiling the rust plugin,
            // it's prepending and appending the string with backticks,
            // so just removing those here instead of trying to fix with
            // recompiling again
            if (rendered.startsWith("`")) {
                rendered = rendered.slice(1);
            }

            if (rendered.endsWith("`")) {
                rendered = rendered.slice(0, -1);
            }

            let replacement = document.createElement('div');

            replacement.innerHTML = rendered;

            replacement.id = id;

            parent.replaceChild(replacement, element);
        }

        await plugin.close();
    }

    addExtismSwapEventCallback(element, runPlugin);
}
