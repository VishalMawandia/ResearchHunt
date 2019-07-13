var fs = require('fs');
var path = require('path');
var {getSuperAdminCount} = require('../lib/database/db');

function requireAllRoutes(dirName,app){
	fs.readdirSync(dirName).forEach(
		function(file){
			if(file == 'routes.js'){
				return;
			}
			const absolutePath = path.join(dirName,file);
			console.log(absolutePath);
			const stats = fs.lstatSync(absolutePath);
			if(stats.isDirectory()){
				requireAllRoutes(absolutePath,app);
			}else{
				console.log("Adding Route file "+path.basename(absolutePath));
				require(absolutePath)(app);
			}
		}
	);
}

function homeRoutes(app){
	app.get("/",async function(req,res){

		let count = await getSuperAdminCount();
		if(count == 0){
			res.redirect("/setup");
		}else{
			res.redirect("/login");
		}
	});

	app.get("/login",function(req,res){
		res.render('login.pug',{
			title: "Login Page"
		});
	});

	app.get("/403",function(req,res){
		res.render('403.pug');
	});
}


module.exports = function(app){
	requireAllRoutes(__dirname,app);
	homeRoutes(app);
};