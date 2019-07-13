const connection = require('./db_connection');
const bcrypt = require('bcrypt');
const whatsapp = require('../business_logic/whatsapp');
const constants = require('../../constants');

const {
	database
} = constants;

async function getSuperAdminCount() {

	const query = "SELECT count(*) as sa_count from " +
		database.tables.admin.name + " where " +
		database.tables.admin.columns.superadmin + " = true";


	var promise = new Promise(function (resolve, reject) {
		connection.query(query, function (err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});

	let result = await promise;

	return result[0].sa_count;
}

String.prototype.format = function () {
	a = this;
	for (var k in arguments) {
		a = a.replace("{" + k + "}", arguments[k]);
	}
	return a;
};


async function getUserCount() {

	var promise = new Promise(function (resolve, reject) {
		var query = "SELECT count(*) as count from STUDENT";

		connection.query(query, function (err, result) {
			if (err) {
				resolve(false);
			} else {
				resolve(result[0].count);
			}
		});
	});
	return await promise;
}

async function getSubscribedUserCount() {

	var promise = new Promise(function (resolve, reject) {
		var query = "SELECT count(*) as count from STUDENT where " + constants.database.tables.student.columns.subscribed;

		connection.query(query, function (err, result) {
			if (err) {
				resolve(false);
			} else {
				resolve(result[0].count);
			}
		});
	});
	return await promise;
}


async function getUserStats() {

	var promise = new Promise(function (resolve, reject) {
		var query = "SELECT max(active_users) as active,max(subscribed_users) as subscribed,datevalue from USER_STATS group by datevalue order by datevalue";

		connection.query(query, function (err, result) {
			if (err) {
				resolve(false);
			} else {
				var data = [];
				for (var i = 0; i < result.length; i++) {

					data.push(result[i]);
					var options = {
						year: 'numeric',
						month: 'long'
					};
					var date_data = new Date(data[i].datevalue);
					data[i].datevalue = date_data.toLocaleDateString("indian", options);
					data[i].datevalue = [data[i].datevalue.split(" ")[0].substring(0, 3), data[i].datevalue.split(" ")[1].substring(2, 4)].join(" '");
				}
				resolve(data);
			}
		});
	});
	return await promise;
}

async function _addAdmin(name, email, password, is_superadmin) {

	var promise = new Promise(function (resolve, reject) {
		const query = "INSERT INTO " + database.tables.admin.name + "(" +
			database.tables.admin.columns.name + "," +
			database.tables.admin.columns.email + "," +
			database.tables.admin.columns.digest + "," +
			database.tables.admin.columns.superadmin + ") values " +
			"('{0}','{1}','{2}',{3})".format(name, email, password, is_superadmin);

		connection.query(query, function (err, result) {
			if (err) {
				resolve(err.sqlMessage);
			} else {
				resolve(true);
			}
		});
	});

	return await promise;

}

async function addAdmin(name, email, password) {
	return await _addAdmin(name, email, password, false);
}

async function addSuperAdmin(name, email, password) {
	return await _addAdmin(name, email, password, true);
}


async function getAllStudentDetails() {

	let promise = new Promise(function (resolve, reject) {
		const query = "SELECT * FROM " + database.tables.student.name;

		connection.query(query, function (err, result) {
			if (err) {
				reject(err.sqlMessage);
			} else {
				var data = [];

				for (var i = 0; i < result.length; i++) {
					data.push(result[i]);
					data[i][database.tables.student.columns.id] =
						data[i][database.tables.student.columns.id].
					replace(database.tables.student.primaryKeyPrefix, "");
					data[i][database.tables.student.columns.id] =
						parseInt(data[i][database.tables.student.columns.id]);
				}
				resolve(data);
			}
		});

	});

	return await promise;
}


async function getAllAdmin() {
	let promise = new Promise(function (resolve, reject) {
		const query = "SELECT * FROM " + database.tables.admin.name;
		connection.query(query, function (err, result) {
			if (err) {
				reject(err.sqlMessage);
			} else {
				var data = [];
				for (var i = 0; i < result.length; i++) {
					data.push(result[i]);
					data[i][database.tables.admin.columns.id] =
						data[i][database.tables.admin.columns.id].
					replace(database.tables.admin.primaryKeyPrefix, "");
					data[i][database.tables.admin.columns.id] =
						parseInt(data[i][database.tables.admin.columns.id]);
				}
				resolve(data);
			}
		});
	});
	return await promise;
}


async function addStudent(name, email, mentorEmail, dob, phone,mentor_name,fac_name) {

	Date.prototype.yyyymmdd = function () {
		var mm = this.getMonth() + 1; // getMonth() is zero-based
		var dd = this.getDate();

		return [this.getFullYear(),
			(mm > 9 ? '' : '0') + mm,
			(dd > 9 ? '' : '0') + dd
		].join('-');
	};

	var date_of_birth = new Date(dob);
	let promise = new Promise(function (resolve, reject) {

		const query = "INSERT INTO " + constants.database.tables.student.name +
			" (" + constants.database.tables.student.columns.name + ',' +
			constants.database.tables.student.columns.email + ',' +
			constants.database.tables.student.columns.mentorEmail + ',' +
			constants.database.tables.student.columns.registerDate + ',' +
			constants.database.tables.student.columns.dob + ',' +
			constants.database.tables.student.columns.gender +
			",phone" +",guide_name,research_faculty" +') values (' +
			"'" + name + "'" + "," +
			"'" + email + "'" + "," +
			"'" + mentorEmail + "'" + "," +
			"'" + (new Date()).yyyymmdd() + "'," +
			"'" + date_of_birth.yyyymmdd() + "'" + "," +
			"'" + "Male" + "'," +
			phone + ",'" +mentor_name+ "','" +fac_name+"'"+ 
			")";

		console.log(query);

		connection.query(query, function (err, result) {
			if (err) {
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});

	return await promise;

}

async function getStudentDetails(userId) {

	var userIdAsString = userId.toString();

	for (var i = userIdAsString.length; i < 5; i++) {
		userIdAsString = '0' + userIdAsString;
	}

	let promise = new Promise(function (resolve, reject) {
		const query = "SELECT * FROM " + database.tables.student.name +
			" where " + database.tables.student.columns.id + " like " +
			"'" + database.tables.student.primaryKeyPrefix + userIdAsString + "'";

		connection.query(query, function (err, result) {
			if (err) {
				reject(err.sqlMessage);
			} else {
				var data = [];
				for (var i = 0; i < result.length; i++) {
					data.push(result[i]);
					data[i][database.tables.student.columns.id] =
						data[i][database.tables.student.columns.id].
					replace(database.tables.student.primaryKeyPrefix, "");
					data[i][database.tables.student.columns.id] =
						parseInt(data[i][database.tables.student.columns.id]);
				}
				resolve(result[0]);
			}
		});

	});

	return await promise;
}

async function getKeywordNames(keywordIds) {

	if (keywordIds.length == 0) {
		return [];
	}
	let formattedKeywordIds = [];
	keywordIds.forEach(element => {
		formattedKeywordIds.push("'" + element + "'");
	});
	const keywords = formattedKeywordIds.join();
	const promise2 = new Promise(function (resolve, reject) {
		var query2 = "SELECT " + database.tables.keyword.columns.name + " from " +
			database.tables.keyword.name + " where " +
			database.tables.keyword.columns.id + " in " +
			" ( " + keywords + ")";
		connection.query(query2, function (err, result) {
			if (err) {
				console.log(err.sqlMessage);
				reject(err.sqlMessage);
			} else {
				var data = [];
				for (var i = 0; i < result.length; i++) {
					data.push(result[i][database.tables.keyword.columns.name]);
				}
				resolve(data);
			}
		});
	});
	return await promise2;
}


async function deleteAdmin(adminId) {

	var adminIdAsString = adminId.toString();

	for (var i = adminIdAsString.length; i < 5; i++) {
		adminIdAsString = '0' + adminIdAsString;
	}
	adminIdAsString = database.tables.admin.primaryKeyPrefix + adminIdAsString;

	var query = "DELETE FROM " + database.tables.admin.name + " where " +
		database.tables.admin.columns.id + " like '" +
		adminIdAsString + "'";

	console.log(query);

	var promise = new Promise(function (resolve, _) {
		connection.query(query, function (err, result) {
			if (err) {
				console.log(err.sqlMessage);
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
	return await promise;
}



async function toggleSuperadminRights(adminId) {

	var adminIdAsString = adminId.toString();

	for (var i = adminIdAsString.length; i < 5; i++) {
		adminIdAsString = '0' + adminIdAsString;
	}
	adminIdAsString = database.tables.admin.primaryKeyPrefix + adminIdAsString;

	var query = "UPDATE " + database.tables.admin.name + " set " +
		database.tables.admin.columns.superadmin + " = !" +
		database.tables.admin.columns.superadmin + " where " +
		database.tables.admin.columns.id + " like '" +
		adminIdAsString + "'";

	console.log(query);

	var promise = new Promise(function (resolve, _) {
		connection.query(query, function (err, result) {
			if (err) {
				console.log(err.sqlMessage);
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
	return await promise;
}


async function renew(userId) {

	var userIdAsString = userId.toString();

	for (var i = userIdAsString.length; i < 5; i++) {
		userIdAsString = '0' + userIdAsString;
	}
	userIdAsString = database.tables.student.primaryKeyPrefix + userIdAsString;

	var query = "UPDATE " + database.tables.student.name + " set " +
		database.tables.student.columns.renewalDate + " = current_date() " +
		" where " + database.tables.student.columns.id + " like '" +
		userIdAsString + "'";

	var promise = new Promise(function (resolve, reject) {
		connection.query(query, function (err, result) {
			if (err) {
				console.log(err.sqlMessage);
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});

	return await promise;

}


async function getDocumentNames(documentIds) {

	if (documentIds.length == 0) {
		return [];
	}
	console.log("Id is  " + documentIds);
	let formattedDocumentIds = [];
	documentIds.forEach(element => {
		formattedDocumentIds.push("'" + element + "'");
	});
	const keywords = formattedDocumentIds.join();
	const promise2 = new Promise(function (resolve, reject) {
		var query2 = "SELECT title from DOCUMENT where " +
			" id in " +
			" ( " + keywords + ")";
		console.log(query2);
		connection.query(query2, function (err, result) {
			if (err) {
				console.log(err.sqlMessage);
				reject(err.sqlMessage);
			} else {
				var data = [];
				for (var i = 0; i < result.length; i++) {
					data.push(result[i].title);
				}
				console.log("Data is ");
				console.log(data);
				resolve(data);
			}
		});
	});
	return await promise2;
}



async function userKeywordAssignment(userId) {

	var userIdAsString = userId.toString();

	for (var i = userIdAsString.length; i < 5; i++) {
		userIdAsString = '0' + userIdAsString;
	}

	userIdAsString = database.tables.student.primaryKeyPrefix + userIdAsString;

	var query1 = "SELECT " + database.tables.keywordStudentRequest.columns.keywordId +
		" from " + database.tables.keywordStudentRequest.name + " where " +
		database.tables.keywordStudentRequest.columns.studentId + " like '" +
		userIdAsString + "'";


	const promise = new Promise(function (resolve, reject) {
		connection.query(query1, function (err, result) {
			if (err) {
				console.log(err.sqlMessage);
				reject(err.sqlMessage);
			} else {

				let keywordIds = [];

				for (var i = 0; i < result.length; i++) {
					keywordIds.push(result[i][database.tables.keywordStudentRequest.columns.keywordId]);
				}
				resolve(keywordIds);
			}
		});
	});

	return await promise;
}

async function unsubscribeUser(userId) {

	var userIdAsString = userId.toString();

	for (var i = userIdAsString.length; i < 5; i++) {
		userIdAsString = '0' + userIdAsString;
	}

	userIdAsString = database.tables.student.primaryKeyPrefix + userIdAsString;

	const query = "DELETE FROM " + database.tables.keywordStudentRequest.name +
		" where " + database.tables.keywordStudentRequest.columns.studentId +
		" like '" + userIdAsString + "'";

	console.log(query);

	const promise = new Promise(function (resolve, reject) {
		connection.query(query, function (err, result) {
			if (err) {
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});

	return await promise;
}


async function verifyLogin(email, password) {

	let promise = new Promise(function (resolve, reject) {
		const query = "SELECT DISTINCT * from " + database.tables.admin.name +
			" where " + database.tables.admin.columns.email +
			" like '" + email + "'";

		connection.query(query, function (err, result) {
			if (err) {
				reject(err);
			} else {
				if (result.length == 1) {
					resolve(result[0]);
				} else {
					resolve(false);
				}
			}
		});

	});

	const result = await promise;
	if (result == false) {
		return false;
	}
	const pass = result[database.tables.admin.columns.digest];
	const status = bcrypt.compareSync(password, pass);

	if (status == true) {
		return result;
	} else {
		return false;
	}
}


async function sendEmailWithKeywords(userId) {

	console.log(database.tables.student.columns.email);

	let userData = await getStudentDetails(userId);

	let emailId = userData[database.tables.student.columns.email];

	let keywords = await userKeywordAssignment(userId);
	let text = "Sending Email for registered tags \n " + keywords.join(' ');
	let subject = "vfdjvbdj";
	const email = require('../email_modulle/email');
	email.sendMail(emailId, subject, text, "", false);

}

async function userKeywordAssignmentNames(userId) {

	let keywords = await userKeywordAssignment(userId);

	keywords = await getKeywordNames(keywords);

	return keywords;
}


async function getAllKeywords() {
	let promise = new Promise(function (resolve, reject) {
		const query = "SELECT * FROM " + database.tables.keyword.name;

		connection.query(query, function (err, result) {
			if (err) {
				reject(err.sqlMessage);
			} else {
				var data = [];

				for (var i = 0; i < result.length; i++) {
					data.push(result[i][database.tables.keyword.columns.name]);
				}
				resolve(data);
			}
		});
	});

	return await promise;
}

async function sendUpdates(userId) {

	const buisnessModel = require('../business_logic/logic.js');

	let userData = await getStudentDetails(userId);

	let emailId = userData[database.tables.student.columns.email];
	let mentorsEmailId = userData[database.tables.student.columns.mentorEmail];
	let and_or = userData.is_and;
	const keyword_ids = await userKeywordAssignment(userId);
	const keywords = await getKeywordNames(keyword_ids);
	const model = new buisnessModel("/home/akash/SIH2019/webapp_final/lib/business_logic/python-module/logic.py");
	model.setInput(and_or,keywords);
	console.log("Heyy");
	let linksArray = await model.getRecommendation();
	const email = require('../email_modulle/email');
	var docIds = [];
	var paths = [];
	var names = [];
	var sendDocs = await getSentDocuments(userId);

	function isIn(arr, id) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == id) {
				return true;
			}
		}
		return false;
	}
	linksArray = linksArray.map(x => x.replace("\n", ""));
	console.log(linksArray);
	for (var i = 0; i < linksArray.length; i++) {
		var xyz = linksArray[i].split(',');
		var id = xyz[0];

		if (isIn(sendDocs, id)) {
			continue;
		}
		var path = xyz[xyz.length - 1];
		docIds.push(id);
		paths.push(path.replace('\n', "").trim());
		var names_parts = xyz.slice(1, xyz.length - 1);
		names.push(names_parts.join('').replace('\n', "").trim());
	}

	console.log(names);

	console.log(paths);

	if (names.length == 0) {
		email.sendMail(emailId, "Link updates from ResearchHunt", "No updates for your registered keywords.", "", [], [], false);
		//if(mentorsEmailId!=null && mentorsEmailId!="")
		//	email.sendMail(mentorsEmailId, "Link updates from ResearchHunt", "No updates for your registered keywords.", "", [], [], false);
		whatsapp();
	} else {	
		email.sendMail(emailId, "Link updates from ResearchHunt", "", "", paths, names.slice(0), true);
		//if(mentorsEmailId!=null && mentorsEmailId!="")
		//	email.sendMail(mentorsEmailId, "Link updates from ResearchHunt", "", "",paths, names, false);
		whatsapp();
		addToHistory(userId, keyword_ids, docIds);
	}

	return true;
}





async function sendExactUpdates(userId) {

	const buisnessModel = require('../business_logic/logic.js');

	let userData = await getStudentDetails(userId);

	let emailId = userData[database.tables.student.columns.email];
	let mentorsEmailId = userData[database.tables.student.columns.mentorEmail];
	let and_or = userData.is_and;
	const keyword_ids = await userKeywordAssignment(userId);
	const keywords = await getKeywordNames(keyword_ids);
	console.log(keywords);
	const model = new buisnessModel("/home/akash/SIH2019/webapp/lib/business_logic/python-module/logicexact.py");
	model.setInput(and_or,keywords);
	let linksArray = await model.getRecommendation();
	const email = require('../email_modulle/email');
	var docIds = [];
	var paths = [];
	var names = [];
	var sendDocs = await getSentDocuments(userId);

	function isIn(arr, id) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == id) {
				return true;
			}
		}
		return false;
	}
	linksArray = linksArray.map(x => x.replace("\n", ""));
	console.log(linksArray);
	for (var i = 0; i < linksArray.length; i++) {
		var xyz = linksArray[i].split(' , ');
		var id = xyz[0];

		if (isIn(sendDocs, id)) {
			continue;
		}
		var path = xyz[xyz.length - 1];
		docIds.push(id);
		paths.push(path.replace('\n', "").trim());
		var names_parts = xyz.slice(1, xyz.length - 1);
		names.push(names_parts.join('').replace('\n', "").trim());
	}

	console.log(names);

	console.log(paths);

	if (names.length == 0) {
		email.sendMail(emailId, "Link updates from ResearchHunt", "No updates for your registered keywords.", "", [], [], false);
		if(mentorsEmailId!=null && mentorsEmailId!="")
			email.sendMail(mentorsEmailId, "Link updates from ResearchHunt", "No updates for your registered keywords.", "", [], [], false);
		whatsapp();
	} else {
		email.sendMail(emailId, "Link updates from ResearchHunt", "", "", paths, names.slice(0), true);
		if(mentorsEmailId!=null && mentorsEmailId!="")
			email.sendMail(mentorsEmailId, "Link updates from ResearchHunt", "", "",paths, names, false);
		whatsapp();
		addToHistory(userId, keyword_ids, docIds);
	}

	return true;
}



async function changeAdminPass(email, old, newPass) {

	var status = await verifyLogin(email, old);

	if (status == false) {
		return "Incorrect password";
	}

	const promise1 = new Promise(function (resolve, reject) {
		bcrypt.hash(newPass, constants.saltRounds, function (err, hash) {
			if (err) {
				reject(err);
			} else {
				resolve(hash);
			}
		});
	});

	var digest = await promise1;

	var promise = new Promise(function (resolve, _) {
		let query = "UPDATE " + database.tables.admin.name +
			" set " + database.tables.admin.columns.digest +
			" = '" + digest + "' where " + database.tables.admin.columns.email +
			" like '" + email + "'";

		console.log(query);

		connection.query(query, function (err, _) {
			if (err) {
				console.log(err.sqlMessage);
				resolve(err.sqlMessage);
			} else {
				console.log("success");
				resolve(true);
			}
		});
	});
	return await promise;
}


async function addKeywords(keywords) {

	var promise = new Promise(function (resolve, reject) {

		keywords = keywords.map(x => "('" + x + "')");

		var querySuffix = keywords.join(",");

		var query = "INSERT INTO " + database.tables.keyword.name + " (" +
			database.tables.keyword.columns.name + ") values " +
			querySuffix;

		connection.query(query, function (err, result) {
			if (err) {
				console.log(err.sqlMessage);
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});

	return await promise;
}

async function getKeywordIds(keywords) {
	var promise = new Promise(function (resolve, reject) {

		keywords = keywords.map(x => "'" + x + "'");
		var querySuffix = "(" + keywords.join(",") + ")";

		var query = "SELECT " + database.tables.keyword.columns.id + " from " +
			database.tables.keyword.name + " where " +
			database.tables.keyword.columns.name + " in " + querySuffix;

		console.log(query);

		connection.query(query, function (err, result) {
			if (err) {
				console.log(err.sqlMessage);
				resolve(false);
			} else {
				resolve(result.map(x => x[database.tables.keyword.columns.id]));
				console.log(result.map(x => x[database.tables.keyword.columns.id]));
			}
		});
	});

	return await promise;
}

async function removeSubscription(id, keywords) {
	var keywordIds = await getKeywordIds(keywords);

	var userIdAsString = id.toString();

	for (var i = userIdAsString.length; i < 5; i++) {
		userIdAsString = '0' + userIdAsString;
	}
	userIdAsString = database.tables.student.primaryKeyPrefix + userIdAsString;
	var promise = new Promise(function (resolve, reject) {

		var data = keywordIds.map(x => "'" + x + "'");
		var queryString = data.join(',');
		queryString = "(" + queryString + ")";
		var query = "DELETE FROM " + database.tables.keywordStudentRequest.name +
			" where " + database.tables.keywordStudentRequest.columns.studentId +
			" like '" + userIdAsString + "' and " +
			database.tables.keywordStudentRequest.columns.keywordId + " in " +
			queryString;

		console.log(query);

		connection.query(query, function (err, result) {
			if (err) {
				reject(err.sqlMessage);
			} else {
				resolve(true);
			}
		});
	});

	return await promise;
}

async function subscribeUser(id, keywords) {
	var keywordIds = await getKeywordIds(keywords);

	var userIdAsString = id.toString();

	for (var i = userIdAsString.length; i < 5; i++) {
		userIdAsString = '0' + userIdAsString;
	}
	userIdAsString = database.tables.student.primaryKeyPrefix + userIdAsString;

	var promise = new Promise(function (resolve, reject) {

		var data = keywordIds.map(x => "('" + userIdAsString + "','" + x + "')");
		var queryString = data.join(',');
		var query = "INSERT INTO " + database.tables.keywordStudentRequest.name +
			"(" + database.tables.keywordStudentRequest.columns.studentId + "," +
			database.tables.keywordStudentRequest.columns.keywordId + ") values" +
			queryString;

		console.log(query);

		connection.query(query, function (err, result) {
			if (err) {
				reject(err.sqlMessage);
			} else {
				resolve(true);
			}
		});
	});

	return await promise;
}

async function deleteKeyword(keyword) {

	var promise = new Promise(function (resolve, reject) {
		var query = "DELETE FROM " + database.tables.keyword.name +
			" where " + database.tables.keyword.columns.name +
			" like '" + keyword + "'";

		connection.query(query, function (err, result) {
			if (err) {
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});

	return await promise;
}

async function getTopFiveKeywords() {
	var promise = new Promise(function (resolve, reject) {
		var query = "SELECT keyword_name,count(*) as count from KEYWORD inner join KEYWORD_STUDENT_STATS on KEYWORD_STUDENT_STATS.keyword_id=KEYWORD.keyword_id group by keyword_name order by count desc limit 5";
		connection.query(query, function (err, result) {
			resolve(result);
		});
	});
	return await promise;
}


async function getKeywordStats() {
	var promise = new Promise(function (resolve, reject) {
		var query = "SELECT keyword_name,count(*) as count from KEYWORD inner join KEYWORD_STUDENT_STATS on KEYWORD_STUDENT_STATS.keyword_id=KEYWORD.keyword_id group by keyword_name order by count desc";
		connection.query(query, function (err, result) {
			resolve(result);
		});
	});
	return await promise;
}


async function updateAndOrUser(userId) {
	var promise = new Promise(function (resolve, reject) {
		var userIdAsString = userId.toString();
		for (var i = userIdAsString.length; i < 5; i++) {
			userIdAsString = '0' + userIdAsString;
		}
		userIdAsString = database.tables.student.primaryKeyPrefix + userIdAsString;
		var query = "UPDATE STUDENT SET is_and=not is_and where student_id like '" + userIdAsString + "'";
		connection.query(query, function (err, result) {
			if (err) {
				console.log(err.sqlMessage);
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
	return await promise;
}


async function getUserHistory(userId) {

	var promise = new Promise(function (resolve, reject) {
		var userIdAsString = userId.toString();

		for (var i = userIdAsString.length; i < 5; i++) {
			userIdAsString = '0' + userIdAsString;
		}
		userIdAsString = database.tables.student.primaryKeyPrefix + userIdAsString;


		var query = "SELECT datevalue,document_ids,keyword_ids from HISTORY where HISTORY.student_id like '" + userIdAsString + "'";

		console.log(query);

		connection.query(query, async function (err, result) {
			if (err) {
				console.log(err.sqlMessage);
				resolve(false);
			} else {
				var keywords = [];
				var document_ids = [];
				var dates = [];
				for (var i = 0; i < result.length; i++) {
					dates.push(new Date(result[i].datevalue).toDateString());

					var comsepkeywords = result[i].keyword_ids.split(';');
					comsepkeywords = comsepkeywords.map(x => x.trim());
					keywords.push(await getKeywordNames(comsepkeywords));

					var documentNames = result[i].document_ids.split(';');
					documentNames = documentNames.map(x => x.trim());
					document_ids.push(await getDocumentNames(documentNames));
				}
				resolve({
					date: dates,
					keywords: keywords,
					document_ids: document_ids
				});
			}
		});

	});
	return await promise;
}


async function updatePhone(id, phone) {

	var userIdAsString = id.toString();

	for (var i = userIdAsString.length; i < 5; i++) {
		userIdAsString = '0' + userIdAsString;
	}
	userIdAsString = database.tables.student.primaryKeyPrefix + userIdAsString;

	var query = "UPDATE STUDENT SET PHONE = " + phone + " where student_id like '" + userIdAsString + "'";

	var promise = new Promise(function (resolve, reject) {
		connection.query(query, function (err, result) {
			if (err) {
				console.log(err);
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
	return await promise;
}


async function addToHistory(studentId, keywords, docIds) {

	var userIdAsString = studentId.toString();

	for (var i = userIdAsString.length; i < 5; i++) {
		userIdAsString = '0' + userIdAsString;
	}
	userIdAsString = database.tables.student.primaryKeyPrefix + userIdAsString;


	var keywords = keywords.join(";");
	var docIds = (docIds.map(x => x.toString())).join(";");

	var query = "INSERT INTO HISTORY(datevalue,student_id,document_ids,keyword_ids) values (current_date(),'" +
		userIdAsString + "','" + docIds + "','" + keywords + "')";

	connection.query(query, function (err, _) {
		if (err)
			console.log(err.sqlMessage);
	});
}


async function getDocumentCount() {
	var promise = new Promise(function (resolve, reject) {
		var query = "SELECT count(*) as count from DOCUMENT";
		connection.query(query, function (err, result) {
			if (err)
				resolve(15);
			else
				resolve(result[0].count);
		});
	});
	return await promise;
}

async function getSentDocuments(studentId) {

	var userIdAsString = studentId.toString();

	for (var i = userIdAsString.length; i < 5; i++) {
		userIdAsString = '0' + userIdAsString;
	}
	userIdAsString = database.tables.student.primaryKeyPrefix + userIdAsString;
	var query = "SELECT document_ids as did from HISTORY where HISTORY.student_id like '" + userIdAsString + "'";

	var promise = new Promise(function (resolve, reject) {
		connection.query(query, function (err, result) {
			if (result.length == 0) {
				resolve([]);
			}
			var allKeywords = (result.map(x => x.did)).join(';').split(" ;").map(x => parseInt(x));
			resolve(allKeywords);
		});
	});
	return await promise;
}


async function addDocument(name, keywords, citation, fname) {

	var promise = new Promise(function (resolve, reject) {

		var query = "INSERT INTO DOCUMENT(title,keywords,citation,link) values ('" +
			name + "','" + keywords + "'," + citation + ",'" + fname + "')";

		console.log(query);
		connection.query(query, function (err, result) {
			if (err) {
				console.log(err.sqlMessage);
				resolve(err.sqlMessage);
			} else {
				console.log("Result is ");
				console.log(result);
				console.log("Done");
				resolve(true);
			}
		});
	});
	return await promise;
}

module.exports = {
	getAllAdmin: getAllAdmin,
	deleteKeyword: deleteKeyword,
	subscribeUser: subscribeUser,
	removeSubscription: removeSubscription,
	addKeywords: addKeywords,
	getSuperAdminCount: getSuperAdminCount,
	addAdmin: addAdmin,
	addSuperAdmin: addSuperAdmin,
	getAllStudentDetails: getAllStudentDetails,
	getStudentDetails: getStudentDetails,
	getKeywordNames: getKeywordNames,
	userKeywordAssignment: userKeywordAssignment,
	unsubscribeUser: unsubscribeUser,
	verifyLogin: verifyLogin,
	addStudent: addStudent,
	userKeywordAssignmentNames: userKeywordAssignmentNames,
	renew: renew,
	sendUpdates: sendUpdates,
	changeAdminPass: changeAdminPass,
	getAllKeywords: getAllKeywords,
	toggleSuperadminRights: toggleSuperadminRights,
	deleteAdmin: deleteAdmin,
	getStats: getUserStats,
	getKeywordStats: getKeywordStats,
	getUserCount: getUserCount,
	getSubscribedUserCount: getSubscribedUserCount,
	getUserHistory: getUserHistory,
	updateAndOr: updateAndOrUser,
	updatePhone: updatePhone,
	getDocumentCount: getDocumentCount,
	addDocument: addDocument,
	sendExactUpdates: sendExactUpdates
};



async function addKeywordsFORM() {


	function isIn(arr, id) {
		id = id.toLowerCase();
		if (id == 'infertility' || id == 'anesthesia' || id == 'ketamine') {
			return true;
		}
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].toLowerCase() == id.toLowerCase()) {
				return true;
			}
		}
		return false;
	}

	var query = "SELECT keywords from DOCUMENT";

	var promise = new Promise(function (resolve, reject) {

		connection.query(query, async function (err, result) {

			if (err) {
				console.log(err.sqlMessage);
				reject(err.sqlMessage);
			}
			var ids = [];

			var data = [];
			for (var i = 0; i < result.length; i++) {

				var keywords = result[i].keywords.split(';');
				keywords = keywords.map(x => x.trim());

				var OldkeyWords = await getAllKeywords();

				for (var j = 0; j < keywords.length; j++) {
					if (isIn(OldkeyWords, keywords[j])) {
						continue;
					}
					data.push(keywords[j]);
				}
			}

			console.log(data);
			var names = data;
			var uniqueNames = [];
			for(var i=0;i<names.length;i++){
				if(isIn(uniqueNames,names[i]))
					continue;
				uniqueNames.push(names[i]);
			}
			await addKeywords(uniqueNames);
			resolve(uniqueNames);
		});
	});
}

//addKeywordsFORM();