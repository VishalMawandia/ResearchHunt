const accountSid = 'AC6a47fd96807789b013a245bffeed9075';
const authToken = 'e1bb614a3533833ef58283e765a721aa';
const client = require('twilio')(accountSid, authToken);

function sendWhatsappNotification(){
	client.messages
      .create({
        body: 'Updates from ResearchHunt has been sent to your registered email Id.',
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+917044768710'
      })
      .then(message => console.log(message.sid))
      .done();
}

module.exports = sendWhatsappNotification;