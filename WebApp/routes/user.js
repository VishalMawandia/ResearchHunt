const db = require("../lib/database/db");
const constants = require("../constants");

function generateRoutes(app) {

	app.get("/users/add", function (req, res) {
		if (req.session.admin == "" || req.session.admin == null) {
			res.redirect("/403");
		} else {
			res.render("add_user.pug", {
				superadmin: req.session.superadmin,
				adminName: req.session.admin,
				adminEmail: req.session.adminEmail
			});
		}
	});

	app.post("/user/updateMobile",async function(req,res){
		const id = req.body.id;
		const phone = req.body.phone;
		const result = await db.updatePhone(id,phone);
		if(result){
			res.send("200");
		}else{
			res.send("403");
		}
	});

	app.post("/adduser", async function (req, res) {

		const name = req.body.name;
		const email = req.body.email;
		const mentors_email = req.body.mentors_email;
		const dob = req.body.dob;
		const phone = req.body.mobile;
		const date_of_birth = Date.parse(dob);
		const mentor_name = req.body.mentor_name;
		const fac_name = req.body.research_faculty;

		var result = await db.addStudent(name, email, mentors_email, date_of_birth,phone,mentor_name,fac_name);

		if (result) {
			res.send(JSON.stringify({
				status: 200
			}));
		} else {
			res.send(JSON.stringify({
				status: 400
			}));
		}


	});

	app.get("/users/renew/:id",async function(req,res){
		var userId = req.params.id;
		var status = await db.renew(userId);
		console.log("Status is "+status);
		if(status===true){
			res.status(200);
			res.send(JSON.stringify(
				{
					status: 200
				}
			));
		}else{
			res.status(400);
			res.send(JSON.stringify(
				{
					status: 200
				}
			));
		}
	});

	app.get("/unsubscribe/:id",async function(req,res){
		var userId = req.params.id;
		var status = await db.unsubscribeUser(userId);
		if(status===true){
			res.status(200);
			res.send(JSON.stringify(
				{
					status: 200
				}
			));
		}else{
			res.status(400);
			res.send(JSON.stringify(
				{
					status: 200
				}
			));
		}
	});



	app.get("/sendupdates/:id",async function(req,res){
		var userId = req.params.id;
		var status = await db.sendUpdates(userId);
		if(status===true){
			res.status(200);
			res.send(JSON.stringify(
				{
					status: 200
				}
			));
		}else{
			res.status(400);
			res.send(JSON.stringify(
				{
					status: 200
				}
			));
		}
	});



	app.get("/sendexactupdates/:id",async function(req,res){

		var userId = req.params.id;
		var status = await db.sendExactUpdates(userId);
		if(status===true){
			res.status(200);
			res.send(JSON.stringify(
				{
					status: 200
				}
			));
		}else{
			res.status(400);
			res.send(JSON.stringify(
				{
					status: 200
				}
			));
		}
	});

	app.get("/users/:id", async function (req, res) {
		var userId = req.params.id;
		Promise.all([
			db.getStudentDetails(userId),
			db.userKeywordAssignmentNames(userId),
			db.getAllKeywords(),
		]).then(function (result) {
			var userData = result[0];
			var keywords = result[1];
			var allKeywords = result[2];

			if (req.session.admin == "" || req.session.admin == null) {
				res.redirect("/403");
			} else {
				res.render("userDetails.pug", {
					and_or: userData.is_and,
					title: userData[constants.database.tables.student.columns.name],
					data: userData,
					columns: constants.database.tables.student.columns,
					superadmin: req.session.superadmin,
					adminName: req.session.admin,
					adminEmail: req.session.adminEmail,
					keywords: keywords,
					allKeywords: allKeywords.join(";")
				});
			}
		});
	});


	app.get("/admins/toggleAndOr/:id",async function(req,res){
		const id = req.params.id;
		if(await db.updateAndOr(id)){
			res.send("200");
		}else{
			res.send("403");
		}
	});


	app.get("/users/history/:id", async function (req, res) {
		var userId = req.params.id;
		Promise.all([
			db.getStudentDetails(userId),
			db.userKeywordAssignmentNames(userId),
			db.getAllKeywords()
		]).then(function (result) {
			var userData = result[0];
			var keywords = result[1];
			var allKeywords = result[2];

			if (req.session.admin == "" || req.session.admin == null) {
				res.redirect("/403");
			} else {
				res.render("userDetails.pug", {
					title: userData[constants.database.tables.student.columns.name],
					data: userData,
					columns: constants.database.tables.student.columns,
					superadmin: req.session.superadmin,
					adminName: req.session.admin,
					adminEmail: req.session.adminEmail,
					keywords: keywords,
					allKeywords: allKeywords.join(";")
				});
			}
		});
	});



	app.post('/modifySubscription',async function(req,res){

		var id = req.body.id;
		var to_add = req.body.add.split(';');
		var to_unsubscribe = req.body.unsubscribe.split(';');
		var unseen = req.body.unseen.split(';');

		if(to_add.length+to_unsubscribe.length+unseen.length==0){
			res.status(400);
			res.send("No keywords to update");
		}
		var promiseAddKeyword,addSubscription,removeSubscription;
		if(unseen.length>0 && unseen[0]!=""){
			promiseAddKeyword = new Promise(async function (resolve,reject){
				await db.addKeywords(unseen);
				await db.subscribeUser(id,unseen);
				resolve(true);
			});
			await promiseAddKeyword;
		}
		if(to_unsubscribe.length>0 && to_unsubscribe[0]!=""){
			removeSubscription = new Promise(async function(resolve,reject){
				await db.removeSubscription(id,to_unsubscribe);
				resolve(true);
			});
			await removeSubscription;
		}
		if(to_add.length>0 && to_add[0]!=""){
			console.log("Adding subscription"+ to_add);
			addSubscription = new Promise(async function(resolve,reject){
				await db.subscribeUser(id,to_add);
				resolve(true);
			});
			await addSubscription;
		}
		res.status(200);
		res.send("200");
	});

	app.get("/users", async function (req, res) {
		var data = await db.getAllStudentDetails();
		if (req.session.admin == "" || req.session.admin == null) {
			res.redirect("/403");
		} else {
			res.render("user.pug", {
				title: "Students",
				data: data,
				columns: constants.database.tables.student.columns,
				superadmin: req.session.superadmin,
				adminName: req.session.admin,
				adminEmail: req.session.adminEmail
			});
		}
	});

}



module.exports = function (app) {
	generateRoutes(app);
};