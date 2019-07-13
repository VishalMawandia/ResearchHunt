const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');


async function sendMail(toEmail, subject, body = "", html = "", pdfs = [], names = [], hasHTML = false) {

	const senderEmail = 'ars.150697@gmail.com';
	const senderPass = "*****";

	var to_send = [];
	var to_send_names = [];
	var data = [];
	var data_names = [];
	var totalSize = 0;
	for (var i = 0; i < pdfs.length; i++) {
		if(!pdfs[i].startsWith('/home'))
			pdfs[i] = "/home/akash/SIH2019/webapp_final/lib/email_modulle/documents/" + pdfs[i].trim();
		const stats = fs.statSync(pdfs[i]);
		const fileSizeInBytes = stats.size;
		if (totalSize + fileSizeInBytes > 20 * 1024 * 1024) {
			data.push(to_send.slice(0));
			data_names.push(to_send_names.slice(0));
			totalSize = 0;
			to_send = [];
			to_send_names = [];
			to_send.push(pdfs[i]);
			to_send_names.push(names[i]);
		} else {
			totalSize += fileSizeInBytes;
			to_send.push(pdfs[i]);
			to_send_names.push(names[i]);
		}
	}
	data.push(to_send);
	data_names.push(to_send_names);


	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: senderEmail,
			pass: senderPass
		}
	});
	if(data.length==0){
		const mailOptions = {
			from: senderEmail,
			to: toEmail,
			subject: subject,
			text: "No keywords matched your subscribed Keywords"
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				throw error;
			} else {
				console.log("Email sent " + info.response);
			}
		});

		return;
	}
	for (var k = 0; k < data.length; k++) {

		var attachments = [];

		for (var i = 0; i < data[k].length; i++) {
			attachments.push({
				filename: data_names[k][i] + ".pdf",
				path: data[k][i],
			});
		}

		const mailOptions = {
			from: senderEmail,
			to: toEmail,
			subject: subject,
			text: body,
			html: html,
			attachments: attachments
		};

		if (!hasHTML) {
			delete mailOptions.html;
		}

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				throw error;
			} else {
				console.log("Email sent " + info.response);
			}
		});
	}
}

module.exports = {
	sendMail: sendMail
};