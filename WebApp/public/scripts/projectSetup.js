$(document).ready(function(){
	$('#submit-btn').click(async function(e){
		e.preventDefault();
		const name = $('#name');
		const email = $('#email');
		const password = $('#password');
		if(name.hasClass("invalid") || email.hasClass("invalid") || password.hasClass("invalid")){
			return;
		}else{
			const nameVal = name.val();
			const emailVal = email.val();
			const passwordVal = password.val();
			if(nameVal.length>0 && emailVal.length>0 && passwordVal.length>0){

				console.log("Sending ajax");

				$.ajax({
					type: "POST",
					url: "/createSuperAdmin",
					data: {
						"email":emailVal,
						"password":passwordVal,
						"name":nameVal
					},
					success: function (response) {
						const jsonResponse = JSON.parse(response);
						if(jsonResponse.status==200){
							$("body").html(jsonResponse.html);
						}else{
							M.toast({html: 'Some error occured', classes: 'rounded'});
						}
					}
				});
			}
		}

	});
});