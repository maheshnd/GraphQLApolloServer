const mongoose = require("mongoose");

module.exports.connection = async () => {
	try {
		await mongoose.connect(process.env.MONGO_DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Database connected sucessfully");
	} catch (error) {
		console.log(error);
		throw error;
	}
};

module.exports.isValidObject = (id) => {
	return mongoose.Types.ObjectId.isValid(id);
};
