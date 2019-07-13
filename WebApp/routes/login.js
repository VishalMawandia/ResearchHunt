var {verifyLogin} = require('../lib/database/db');
const constants = require('../constants');


function generateRoutes(app){

	app.post('/adminLogin',async function (req,res) {
		
		const username = req.body.username;
		const password = req.body.password;
		const result = await verifyLogin(username,password);

		let response = "";
		if(result){
			req.session.admin=result[constants.database.tables.admin.columns.name];
			req.session.adminEmail=result[constants.database.tables.admin.columns.email];
			req.session.superadmin=result[constants.database.tables.admin.columns.superadmin];
			res.status(200);
			response = JSON.stringify({
				status: 200
			});
		}else{
			response = JSON.stringify({
				status: 404,
				message: "Invalid Username/Password"
			});
		}
		res.send(response);
	});
}



module.exports = function(app){
	generateRoutes(app);
};