import {createPlugin} from '@extism/extism';

onmessage = async (event) => {
    let endpoint = event.data === "golang" ? "go" : "rust";

    const plugin = await createPlugin("http://localhost:8080/wasm/" + endpoint, {useWasi: true});

    let hasRenderFunc = await plugin.functionExists("render")

    if (!hasRenderFunc) {
        await plugin.close();
        return;
    } else {
        let output = await  plugin.call("render", event.data);

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

        postMessage(rendered);

        await plugin.close();
    };
}