package main

import (
	"embed"
	"hx-gql-extism-example/graph"
	"io/fs"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

const defaultPort = "8080"

//go:embed client/distro/index.html
//go:embed client/distro/assets/js/main.js
//go:embed client/distro/assets/wasm/plugin-go.wasm
//go:embed client/distro/assets/wasm/plugin-rust.wasm
var f embed.FS

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	static, _ := fs.Sub(f, "client/distro")

	http.Handle("/", http.StripPrefix("/", http.FileServer(http.FS(static))))
	http.Handle("/script", func() http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			fb, er := f.ReadFile("client/distro/assets/js/main.js")
			if er != nil {
				http.Error(w, "script not found", 404)
				return
			}

			w.Header().Set("content-type", "application/json")

			_, _ = w.Write(fb)
		}
	}())
	http.Handle("/wasm/go", func() http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			fb, er := f.ReadFile("client/distro/assets/wasm/plugin-go.wasm")
			if er != nil {
				http.Error(w, "wasm module not found", 404)
				return
			}

			w.Header().Set("content-type", "application/wasm")

			_, _ = w.Write(fb)
		}
	}())
	http.Handle("/wasm/rust", func() http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			fb, er := f.ReadFile("client/distro/assets/wasm/plugin-rust.wasm")
			if er != nil {
				http.Error(w, "wasm module not found", 404)
				return
			}

			w.Header().Set("content-type", "application/wasm")

			_, _ = w.Write(fb)
		}
	}())

	http.Handle("/playground", playground.Handler("GraphQL playground", "/gql"))
	http.Handle("/gql", srv)

	log.Printf("connect to http://localhost:%s/playground for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
