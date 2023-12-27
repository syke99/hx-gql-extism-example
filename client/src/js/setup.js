import { registerGqlEndpoint, registerHandler, registerQuery } from "hx-gql";
import { registerPlugin } from "./plugins";
import { addPlugin } from "./app";

registerGqlEndpoint("http//127.0.0.1:8080/gql");

function registerQueries(queries) {
    for (let [key, value] of Object.entries(queries)) {
        registerQuery(key, value)
    }
}

let queries = {
    language: `    query Response($language: String!)  {
        responses(language: $language){
            language
        }
    }`,
    setup: `    mutation CreateResponse{
      createResponse(input:[{language: "golang"},{language: "rust"},{language: "javascript"}]) {
        language
      }
    }`
};

function registerHandlers(handlers) {
    for (let [key, value] of Object.entries(handlers)) {
        registerHandler(key, value)
    }
}

let dudHandler = (element, response) => {
    return ""
};

let handlers = {
    setup: dudHandler,
    extism: dudHandler,
};

let config = {
    helloGO: {manifest: "http://localhost:8080/wasm/go", callback: addPlugin},
    helloRust: {manifest: "http://localhost:8080/wasm/rust", callback: addPlugin}
};

function registerPlugins(config) {
    for (let [key, value] of Object.entries(config)) {
        registerPlugin(key, value)
    }
}

export function setupAppRegistrations() {
    registerQueries(queries);
    registerHandlers(handlers);
    registerPlugins(config);
}