import 'htmx.org';
import './app';
import { setupAppRegistrations } from "./setup";
import { addPluginListeners } from './plugins';

setupAppRegistrations();

window.onload = addPluginListeners;

window.htmx = require('htmx.org');