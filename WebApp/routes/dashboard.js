function generateRoutes(app){
	
	//Add User Route
	app.get("/dashboard",function(req,res){

		if(req.session.admin=="" || req.session.admin==null){
			res.redirect("/403");
		}else{
			res.render("homepage.pug",{
				title: "Dashboard",
				superadmin: req.session.superadmin,
				adminName: req.session.admin,
				adminEmail: req.session.adminEmail
			});
		}
	});
}



module.exports = function(app){
	generateRoutes(app);
};