const db = require("../lib/database/db");

async function getStats(app){
	app.get('/userStats',async function(req,res){
		var data = await db.getStats();
		res.send(data);
	});

	app.get('/getKeywordStats',async function(req,res){
		var data = await db.getKeywordStats();
		res.send(data);
	});


	app.get('/getCount',async function(req,res){
		Promise.all([
			db.getUserCount(),
			db.getSubscribedUserCount(),
			db.getDocumentCount()
		]).then(function(data){
			var userCount = data[0];
			var subUserCount = data[1];
			var docCount = data[2];
			res.send({subscribed:subUserCount,user:userCount,docCount:docCount});
		});
	});

}

module.exports = function(app){
	getStats(app);
};