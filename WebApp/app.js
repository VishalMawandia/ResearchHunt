const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const multer = require('multer');
const db = require('./lib/database/db');

// Constants

const portNumber = 3000;

String.prototype.format = function () {
	a = this;
	for (var k in arguments) {
		a = a.replace("{" + k + "}", arguments[k]);
	}
	return a;
};


//------------------------Initialize Application

const app = express();


//------------------------Set body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));


//------------------------Set express session middleware

app.use(expressSession({
	secret: "vfddvdisbcdsiuvbjcnsdibc",
	resave: false,
	saveUninitialized: true
}));

var Storage = multer.diskStorage({
	destination: "./lib/email_modulle/documents",
	filename: function (req, file, callback) {
		var fileName = Date.now() + "_" + file.originalname;
		callback(null, fileName);
	}
});


const uploads = multer({
	storage: Storage,
}).single('fileUpload');


app.get('/documents', function (req, res) {
	if (req.session.admin == "" || req.session.admin == null) {
		res.redirect("/403");
	} else {
		var data = "0";
		if (req.session.isRedirect == true) {
			data = "1";
			req.session.isRedirect = false;
		}

		res.render('add_documents.pug', {
			superadmin: req.session.superadmin,
			adminName: req.session.admin,
			adminEmail: req.session.adminEmail,
			isRedirect: data,
		});
	}
});


app.post('/documents', async function (req, res) {



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

	uploads(req, res, async (err) => {
		if (err) {
			res.send("Could not upload file\n" + err);
		} else {
			var keywords = req.body.keyword;
			var title = req.body.title;
			var citation = req.body.citation;
			var allKeywords = await db.getAllKeywords();

			var keywordsLink = req.body.keyword.split(";");
			keywordsLink = keywordsLink.map(x => x.trim());

			var newKeywords = [];
			for (var i = 0; i < keywordsLink.length; i++) {

				if (isIn(allKeywords, keywordsLink[i])) {
					continue;
				}
				newKeywords.push(keywordsLink[i]);
			}

			db.addKeywords(newKeywords);

			if (req.file.originalname.endsWith(".pdf")) {
				var result = await db.addDocument(title, keywords, citation, req.file.filename);
				if (result == true) {
					req.session.isRedirect = true;
					res.redirect('/documents');
				} else {
					res.send(result);
				}
			} else {
				res.send('Please upload a valid pdf format');
			}
		}
	});
});


//-----------------------Set views and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//-----------------------Set static middleware to serve static files

app.use(express.static(path.join(__dirname, '/public')));
app.use('/users', express.static(path.join(__dirname, '/public')));
app.use('/users/history', express.static(path.join(__dirname, '/public')));
app.use('/admins', express.static(path.join(__dirname, '/public')));
app.use('/admins/add', express.static(path.join(__dirname, '/public')));

//------------------------Add routes
const routes = require('./routes/routes')(app);


app.listen(portNumber, function () {
	console.log("Server started");
});