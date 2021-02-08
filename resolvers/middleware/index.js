const { skip } = require("graphql-resolvers");
const Task = require("../../database/models/task");
const { isValidObject } = require("../../database/util");
module.exports.isAuthenticated = (_, __, { email }) => {
	if (!email) {
		throw new Error("Access Denied! Please login to continue");
	}
	return skip;
};

module.exports.isTaskOwner = async (_, { id }, { loggedInUserId }) => {
	try {
		if (!isValidObject(id)) {
			throw new Error("Invalid task ID");
		}
		const task = await Task.findById(id);
		if (!task) {
			throw new Error("Task not found");
		} else if (task.user.toString() !== loggedInUserId) {
			throw new Error("Not authorised as task owner");
		}
		return skip;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
