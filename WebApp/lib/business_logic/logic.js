let {
	PythonShell
} = require('python-shell');
const path = require('path');

class PaperRecommendation {
	constructor(filePath) {
		console.log(filePath);
		this.filePath = filePath;
	}

	setInput(and_or,inputArgs) {
		this.and_or = and_or;
		console.log("And_Or is "+this.and_or);
		this.inputArgs = inputArgs.join('; ');
	}

	async getRecommendation() {

		var data = [];
		const pythonShell = new PythonShell(this.filePath);
		console.log("Sending Inputs");
		pythonShell.send(this.and_or);
		pythonShell.send(this.inputArgs);
		console.log("Inputs Passed");
		
		const promise = new Promise(function(resolve,reject){
			try {

				console.log(pythonShell.terminated);
				pythonShell.on('message', function (message) {
					console.log("Got message "+ message);
					data.push(message);
				});

				pythonShell.on('close', function () {
					console.log(pythonShell.exitCode);
					resolve(data);
				});
			}catch(e){
				reject("Error : " + e.toString() );
			}
		});
		return await promise;
	}

}

module.exports = PaperRecommendation;