package main

import (
	"fmt"
	"github.com/extism/go-pdk"
)

//export render
func render() int32 {
	input := pdk.Input()
	output := fmt.Sprintf(`<div>I was loaded from a WASM plugin written in %s and executed with Extism!!</div>`, string(input))
	pdk.OutputString(output)
	return 0
}

func main() {}
