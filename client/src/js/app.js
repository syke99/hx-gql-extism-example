import { registerGqlEndpoint, registerQuery, registerHandler } from "hx-gql";
import { registerPlugin } from "./plugins";
import { createPlugin } from "@extism/extism";

registerGqlEndpoint("http//127.0.0.1:8080/gql");

const languageQuery = `    query Response($language: String!)  {
    responses(language: $language){
        language
    }
}`;

registerQuery("language", languageQuery);

const setupQuery = `    mutation CreateResponse{
  createResponse(input:[{language: "golang"},{language: "rust"},{language: "javascript"}]) {
    language
  }
}`;

registerQuery("setup", setupQuery);

registerHandler("setup", (response) => {
    let resJSON = JSON.parse(response);

    return "";
});

registerHandler("extism", (element, response) => {
    return "";
});

registerPlugin("helloGO", {manifest: "http://localhost:8080/wasm/go", callback: addPlugin});

registerPlugin("helloRust", {manifest: "http://localhost:8080/wasm/rust", callback: addPlugin})

function addPlugin(element, parent, manifest) {
    async function runPlugin(event) {
        let input = event.detail.res.data.responses[0].language;

        let id = event.detail.uuid;

        const plugin = await createPlugin(manifest, {useWasi: true});

        let hasRenderFunc = await plugin.functionExists("render")

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

    element.addEventListener('swapWithPlugin', runPlugin);
}
