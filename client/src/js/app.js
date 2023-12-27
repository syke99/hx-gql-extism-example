import { registerGqlEndpoint, registerQuery, registerHandler } from "hx-gql";
import {handleResponse, setupOverride} from "hx-gql/plugin";

import { callPlugin } from './plugins'

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
    let resJSON = JSON.parse(response);

    let language = resJSON.data.responses[0].language;

    console.log("calling extismWorker");

    callPlugin(element, language, response);

    return "";
});
