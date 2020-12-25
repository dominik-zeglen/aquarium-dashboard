module.exports = {
  client: {
    addTypename: true,
    includes: ["src/**/*.ts", "src/**/*.tsx"],
    name: "aquarium",
    service: {
      localSchemaFile: "schema.graphql",
      name: "aquarium",
    },
  },
};
