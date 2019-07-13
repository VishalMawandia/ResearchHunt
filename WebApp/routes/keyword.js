const db = require('../lib/database/db');

function generateRoutes(app){
	
	//Keyword Route
	app.get("/keywords",async function(req,res){

		var keywords = await db.getAllKeywords();

		if(req.session.admin=="" || req.session.admin==null){
			res.redirect("/403");
		}else{
			res.render("keywords.pug",{
				title: "Manage Keywords",
				keywords: keywords,
				superadmin: req.session.superadmin,
				adminName: req.session.admin,
				adminEmail: req.session.adminEmail
			});
		}
	});

	app.delete("/keywords/:name",async function(req,res){

		var result = await db.deleteKeyword(req.params.name);
		console.log(result);
		res.status(200);
		if(result){
			res.send("200");
		}else{
			res.send("400");
		}
	});

	app.post("/keywords/:name",async function(req,res){

		var result = await db.addKeywords([req.params.name]);
		
		if(result){
			res.status(200);
			res.send("200");
		}else{
			res.status(400);
			res.send("400");
		}
	});

}



module.exports = function(app){
	generateRoutes(app);
};