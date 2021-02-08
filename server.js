const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");
const dotEnv = require("dotenv");
const Dataloader = require("dataloader");

const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
const { connection } = require("./database/util");
const { verifyUser } = require("./helper/context");
const loaders = require("./loaders");

//set env variable
dotEnv.config();

const app = express();

//DB Connectivity
connection();

//cors
app.use(cors());

//body parser middleware
app.use(express.json());

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }) => {
		const contextObj = {};
		if (req) {
			await verifyUser(req, connection);
			contextObj.email = req.email;
			contextObj.loggedInUserId = req.loggedInUserId;
		}
		contextObj.loaders = {
			user: new Dataloader((keys) => loaders.user.batchUSers(keys)),
		};
		return contextObj;
	},
	formatError: (error) => {
		return {
			message: error.message,
		};
	},
});

apolloServer.applyMiddleware({ app, path: "/graphql" });

const PORT = process.env.PORT || 3000;

app.use("/", (req, res, next) => {
	res.send({ message: "Hellow MAhesh" });
});

const httpServer = app.listen(PORT, () => {
	console.log(`Server listing on PORT : ${PORT}`);
	console.log(`Graphql End point : ${apolloServer.graphqlPath}`);
});

apolloServer.installSubscriptionHandlers(httpServer);
