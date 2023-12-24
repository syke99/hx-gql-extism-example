import {createPlugin} from "@extism/extism";

async function getPlugin(path) {
    return await createPlugin("127.0.0.1:8080" + path, {useWasi: true})
}

async function callPluginFunc(plugin, fn, input) {
    return await plugin.call(fn, input)
}

async function closePlugin(plugin) {
    await plugin.close()
}

export function callPluginWithInput(pluginPath, input) {
    let out;

    getPlugin(pluginPath).
    then((plugin) => {
        callPluginFunc(plugin, "language", input).
        then((res) => {
            out = res;
        }).catch((error) => {
            throw error
        })
    }).catch((error) => {
        console.log(error)
    }).finally((plugin) => {
        closePlugin(plugin).then((res) => {
            console.log("plugin closed")
        })
    });

    return out;
}
