import 'htmx.org';
import './app';
// import { addPluginListeners } from './plugins';
//
// window.onload = addPluginListeners;

window.htmx = require('htmx.org');

if (window.Worker) {
    window.extismWorker = new Worker("./assets/src/js/plugin.js")
}
