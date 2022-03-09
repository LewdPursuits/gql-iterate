# 📃 GQL-Iterate

A simple CLI utility for running a query repeatedly with different variable values supplied from a JSON file. Ever had to mass-query some object off GQL, but the server only supports fetching what you need one-by-one? That's what this is for!


## 🤓 Usage

Create a `.gql` file containing your query, which can be named anything (make sure there's only a single query specified in the file). Define the variables that you want gql-iterate to read from a CSV with the usual syntax. For example:

```gql
mutation tagCreate($name: String!, $description: String, $aliases: [String!], $category: ID) {
  tagCreate(input: {name: $name, description: $description, aliases: $aliases, category_id: $category}) {
    id
    name
  }
}
```

Next, create your input JSON file, with matching variables. For example:

```json
{"tags": [
		{
			"name": "test1",
			"description": "test1",
			"aliases": ["alias1"],
			"category": "7d00a805-3637-4b2d-a420-1b6a4803a717"
		},
		{
			"name": "test2",
			"description": "test2",
			"aliases": ["alias2"],
			"category": "7d00a805-3637-4b2d-a420-1b6a4803a717"
		}
]}
```

Now, it's time to run the queries! From the directory that contains your query and input JSON, run:

```
gql-iterate --host https://yourserver.com/graphql --input ./input.json --query ./query.gql
```

GQL-Iterate will now run all of your queries (this might take a while depending on the length of your input file and speed of your server) and print the output to console, as one stringified JSON object per line.

## 🗝 Authentication

GQL-iterate currently only supports `ApiKey: Bearer` Header-based auth. To supply a an API key, simply run the CLI with the `--bearer < your key >` option.
