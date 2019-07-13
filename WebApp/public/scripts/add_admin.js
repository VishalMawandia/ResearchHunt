$(document).ready(function(){

	let form = $('form');
	var form_height = form.height();
	var document_height = $(document).height();
	if (document_height > form_height) {
		var top = (document_height - form_height) / 2;
		form.css("position", "relative");
		form.css("top",top);
	}

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

				$.ajax({
					type: "POST",
					url: "/addAdmin",
					data: {
						"email":emailVal,
						"password":passwordVal,
						"name":nameVal
					},
					success: function (response) {
						const jsonResponse = JSON.parse(response);
						if(jsonResponse.status==200){
							swal({
								title: "Success",
								text: "Admins added Successfully",
								icon: "success"
							}).then(x=>{window.location = "/admins";});
						}else{

							swal({
								title: "Error",
								text: "Admins could not be added",
								icon: "error"
							});
						}
					}
				});
			}
		}

	});
});