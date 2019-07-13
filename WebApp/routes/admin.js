const db = require("../lib/database/db");
const constants = require("../constants");
const bcrypt = require("bcrypt");

function generateRoutes(app) {

	app.get("/admins/add", function (req, res) {
		if (req.session.admin == "" || req.session.admin == null) {
			res.redirect("/403");
		} else {
			res.render("add_admin.pug", {
				superadmin: req.session.superadmin,
				adminName: req.session.admin,
				adminEmail: req.session.adminEmail
			});
		}
	});

	app.post("/addAdmin", async function (req, res) {

		const name = req.body.name;
		const email = req.body.email;
		const password = req.body.password;

		console.log("Data is "+name+email+password);

		const promise = new Promise(function(resolve,reject){
			bcrypt.hash(password,constants.saltRounds,function(err,hash){
				if(err){
					reject(err);
				}else{
					resolve(hash);
				}
			});
		});

		const hashedPass = await promise;

		console.log("Hashed pass is "+hashedPass);
		const status = await db.addAdmin(name,email,hashedPass);
		
		let response = "";

		if(status){
			response = JSON.stringify({
				status : 200,
			});
		}else{
			response = JSON.stringify({
				status : 404
			});
		}

		console.log(response);

		res.send(response);
	});

	app.get("/admins", async function (req, res) {
		var data = await db.getAllAdmin();
		if (req.session.admin == "" || req.session.admin == null || req.session.superadmin==false) {
			res.redirect("/403");
		} else {
			res.render("admin.pug", {
				title: "Admins",
				data: data,
				columns: constants.database.tables.admin.columns,
				superadmin: req.session.superadmin,
				adminName: req.session.admin,
				adminEmail: req.session.adminEmail
			});
		}
	});


	app.get("/admins/toggleSuperadmin/:id",async function(req,res){
		var id = req.params.id;
		var status = await db.toggleSuperadminRights(id);
		console.log("Toggle status is "+status);
		if(status){
			res.status(200);
			res.send("200");
		}else{
			res.status(403);
		}
	});

	app.delete("/admins/:id", async function (req, res) {
		var id = req.params.id;
		var status = await db.deleteAdmin(id);
		if(status){
			res.status(200);
			res.send("200");
		}else{
			res.status(403);
		}
	});

}



module.exports = function (app) {
	generateRoutes(app);
};