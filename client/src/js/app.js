import { registerGqlEndpoint, registerQuery, registerHandler } from "hx-gql";
import { callPluginWithInput } from './plugin'

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

registerHandler("go", (response) => {
    let resJSON = JSON.parse(response);

    let out = callPluginWithInput("/wasm/go", `${resJSON.data.responses[0].language}`);

    console.log(out)

    return `<div>done</div>`;
});

registerHandler("rust", (response) => {
    let resJSON = JSON.parse(response);

    let out = callPluginWithInput("/wasm/rust", `${resJSON.data.responses[0].language}`);

    console.log(out)

    return `<div>done</div>`;
});