import 'htmx.org';
import './app';
import {addPluginListeners, registerPlugin} from './plugins';

let plugins = {
    "helloGo": "go",
    "helloRust": "rust"
}

window.onload = addPluginListeners;

window.htmx = require('htmx.org');