use extism_pdk::*;

#[plugin_fn]
pub fn render(language: String) -> FnResult<String> {
    Ok(format!("<div>I was loaded from a WASM plugin written in {} and executed with Extism!!</div>", language))
}
