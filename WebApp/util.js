function validateEmail(email) {
    var re = /^[a-zA-Z0-9][+a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]*\\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
}

module.exports = {
	validateEmail
};