#!/usr/bin/env node

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { GraphQLClient, gql } = require('graphql-request')
const yargs = require('yargs')
const fspromises = require('fs/promises')

const options = yargs
    .usage("Usage: -host < host URL > -input < input.json > -query < query.gql >")
    .option("host", { alias: "host", describe: "Your GraphQL server.", type: "string", demandOption: true })
    .option("input", { alias: "input", describe: "Path to a JSON file containing values for matching variables in query.", type: "string", demandOption: true })
    .option("query", { alias: "query", describe: "Path to the GraphQL query with variables that will be substituted for values from the JSON.", type: "string", demandOption: true })
    .option("bearer", { alias: "bearer", describe: "Optional Key to be set as Api Key header.", type: "string", demandOption: false })
    .argv;

const graphQLClient = new GraphQLClient(options.host, {
    headers: options.bearer ? {
	    ApiKey: `${options.bearer}`,
    } : {},
})


main()

async function main() {
    const varsjson = JSON.parse(await fspromises.readFile(options.input, { encoding: 'utf8' }))
    const query = await fspromises.readFile(options.query, { encoding: 'utf8' })

    const promises = [];
    Object.values(varsjson)[0].forEach((obj) => {
        promises.push(graphQLClient.request(query, obj));
    })

    try {
        const result = await Promise.all(promises);

        result.forEach((res) => {
            console.log(JSON.stringify(res));
        });
    } catch (e) {
        console.log('Something went wrong while running your queries.\n');
        console.error(e);
    }
}
