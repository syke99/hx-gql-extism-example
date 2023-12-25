import { registerGqlEndpoint, registerQuery, registerHandler } from "hx-gql";
import {handleResponse, setupOverride} from "hx-gql/plugin";

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

    return `<div>done</div>`;
});

registerHandler("rust", (response) => {
    let resJSON = JSON.parse(response);

    return `<div>done</div>`;
});


htmx.defineExtension('hx-gql:override', {
    onEvent : function (name, event) {
        if (name === "htmx:configRequest") {
            setupOverride(event);
        }

        if (name === "htmx:afterRequest") {
            handleResponse(event);
        }
    },

    encodeParameters : function(xhr, parameters, element) {
        xhr.overrideMimeType('text/json');
        return (parameters)
    },

    transformResponse : function(text, xhr, element) {
        element.setAttribute("response", text)

        console.log(element)

        htmx.trigger(element, 'swapWithPlugin', {})

        return text;
    }
})
