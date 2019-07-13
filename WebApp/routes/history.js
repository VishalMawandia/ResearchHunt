const db = require("../lib/database/db");

function generateRoutes(app) {

	app.get("/users/history/:id",async function(req,res){

		if(req.session.adminEmail=="" || req.session.adminEmail==null){
			res.redirect("/403");
		}

		var userID = req.params.id;
		var {date,keywords,document_ids} = await db.getUserHistory(userID);
		res.render('history.pug',{date: date,
			keywords: keywords,
			document_ids: document_ids,
			superadmin: req.session.superadmin,
			adminName: req.session.admin,
			adminEmail: req.session.adminEmail});
	});

}


module.exports = function (app) {
	generateRoutes(app);
};