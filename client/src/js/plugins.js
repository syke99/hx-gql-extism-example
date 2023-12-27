export function callPlugin(element, language) {
    extismWorker.onmessage = (event) => {
        console.log(`message received from extismWorker: ${event.data}`)

        if (typeof element === 'string' || element instanceof String) {
            let elem = document.getElementById(element);

            elem.outerHTML = event.data;
        } else if (element === null || element === undefined) {
            console.error("no element for plugin to replace");
        } else {
            element.outerHTML = event.data;
        }
    }

    extismWorker.postMessage(language);
}