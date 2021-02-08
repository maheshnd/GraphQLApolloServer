const { GraphQLDateTime } = require("graphql-iso-date");
const usersResolver = require("./user");
const taskResolver = require("./task");

const customDateScalarResolver = {
	Date: GraphQLDateTime,
};

module.exports = [usersResolver, taskResolver, customDateScalarResolver];
