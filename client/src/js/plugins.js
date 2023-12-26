import {createPlugin} from '@extism/extism';

export function addPluginListeners () {
    console.log("adding Extism plugins")

    let element = document.getElementById("helloGO")

    addPlugin(element, "go")

    element = document.getElementById("helloRust");

    addPlugin(element, "rust");

    console.log("plugins added")
}

function addPlugin(element, sourceLanguage) {
    async function runPlugin(event) {
        let input = event.detail.res;

        const plugin = await createPlugin("http://localhost:8080/wasm/" + sourceLanguage, {useWasi: true});

        let hasRenderFunc = await plugin.functionExists("render")

        if (!hasRenderFunc) {
            element.innerHTML = input
        } else {
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

            element.outerHTML = rendered;
        }

        await plugin.close();
    }

    element.addEventListener('swapWithPlugin', runPlugin);
}