var {addSuperAdmin,getSuperAdminCount} = require('../lib/database/db');
var hashing = require('bcrypt');
const constants = require('../constants');

module.exports = function(app){

	app.get('/setup',async function(req,res){

		const count = await getSuperAdminCount();

		res.render(
			"setup",
			{
				title: "Project Setup",
				count: count
			}
		);
	});


	app.get('/logout',function(req,res){
		delete req.session.admin;
		delete req.session.adminEmail;
		delete req.session.superadmin;
		res.redirect('/');
	});

	app.post('/createSuperAdmin',async function(req,res){

		const name = req.body.name;
		const email = req.body.email;
		const password = req.body.password;

		console.log("Data is "+name+email+password);

		const promise = new Promise(function(resolve,reject){
			hashing.hash(password,constants.saltRounds,function(err,hash){
				if(err){
					reject(err);
				}else{
					resolve(hash);
				}
			});
		});


		const hashedPass = await promise;

		console.log("Hashed pass is "+hashedPass);
		const status = await addSuperAdmin(name,email,hashedPass);
		
		let response = "";

		if(status){
			response = JSON.stringify({
				status : 200,
				html: "<h4 class='center-align'>Project Setup Successful</h4>"
			});
		}else{
			response = JSON.stringify({
				status : 404
			});
		}

		console.log(response);

		res.send(response);
	});
};