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
//go:embed client/distro/assets/*
var f embed.FS

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	static, _ := fs.Sub(f, "client/distro")

	mainJS, err := f.ReadFile("client/distro/assets/src/js/index.js")
	if err != nil {
		log.Fatal(err)
	}

	goWasm, err := f.ReadFile("client/distro/assets/wasm/plugin-go.wasm")
	if err != nil {
		log.Fatal(err)
	}

	rustWasm, err := f.ReadFile("client/distro/assets/wasm/plugin-rust.wasm")
	if err != nil {
		log.Fatal(err)
	}

	http.Handle("/", http.StripPrefix("/", http.FileServer(http.FS(static))))
	http.Handle("/script", func() http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("content-type", "application/json")

			_, _ = w.Write(mainJS)
		}
	}())
	http.Handle("/wasm/go", func() http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("content-type", "application/wasm")

			_, _ = w.Write(goWasm)
		}
	}())
	http.Handle("/wasm/rust", func() http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("content-type", "application/wasm")

			_, _ = w.Write(rustWasm)
		}
	}())

	http.Handle("/playground", playground.Handler("GraphQL playground", "/gql"))
	http.Handle("/gql", srv)

	log.Printf("connect to http://localhost:%s/playground for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
