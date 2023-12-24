import { registerGqlEndpoint, registerQuery, registerHandler } from "hx-gql";
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

registerHandler("go", (response) => {
    let resJSON = JSON.parse(response);

    console.log(resJSON)

    return `<div>done</div>`;
});

registerHandler("rust", (response) => {
    let resJSON = JSON.parse(response);

    // TODO: write plugin and load with extism
    return `<div>I was loaded from a WASM plugin written in ${resJSON.data.responses[0].language} and executed with Extism!!</div>`;
});