$(document).ready(function () {
	$('#submit-btn').on('click',function(e){
		e.preventDefault();

		let email = $("#email_field").val();
		let password = $("#password_field").val();

		let isInvalid = $("#email_field").hasClass("invalid");

		if(email.length==0 || password.length==0){
			swal("Incomplete Login Details",'Both fields are required',"error");
		}else if(isInvalid){
			swal("Invalid Form Details","Invalid email address","error");
		}else{
			$.ajax({
				type: "POST",
				url: "/adminLogin",
				data: {
					"username": email,
					"password": password
				},
				success: function (response) {
					console.log(response);
					const jsonResponse = JSON.parse(response);
					if(jsonResponse.status==200){
						window.location = "/dashboard";
					}else{
						swal({
							icon: "error",
							content: jsonResponse.error,
							title: "Login Failed"
						});
					}
				}
			});
		}
	});
});