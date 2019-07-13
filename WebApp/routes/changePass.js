var {changeAdminPass} = require('../lib/database/db');
const constants = require('../constants');


function generateRoutes(app){

	app.get('/change',function(req,res){
		if(req.session.admin=="" || req.session.admin==null){
			res.redirect("/403");
		}else{

			res.render('changePassword.pug',{
				title: "Change Password",
				superadmin: req.session.superadmin,
				adminName: req.session.admin,
				adminEmail: req.session.adminEmail
			});
		}
	});


	app.post('/change', async function(req,res){

		var old = req.body.old;
		var newPass = req.body.newPass;
		var email = req.session.adminEmail;

		var status = await changeAdminPass(email,old,newPass);

		if(status)
			res.send("200");
		else
			res.send("401");

	});

}

module.exports = function(app){
	generateRoutes(app);
};