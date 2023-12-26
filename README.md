`hx-gql` example using Extism plugins to render the elements with results from configured GraphQL calls

# Requirements

- node installed
- go(lang) installed

# Running example

1. run this command to build the client:
   ```
   cd client && npm install && nmp run build
   ```
2. run this command to start the backing GraphQL server
   (the server will auto-seed itself once you visit `localhost:8080`)
  ```
  cd .. && go run server.go
  ```
3. navigate to `localhost:8080` and follow the on-screen instructions
