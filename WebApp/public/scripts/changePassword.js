$(document).ready(function () {
	let form = $('form');
	var form_height = form.height();
	var document_height = $(document).height();
	if (document_height > form_height) {
		var top = (document_height - form_height) / 2;
		form.css("position", "relative");
		form.css("top",top);
	}

	$("#oldPass").val("");
	$("#newPass").val("");

	$('.btn').on('click',function(e){
		e.preventDefault();

		var oldPass = $("#oldPass").val();
		var newPass = $("#newPass").val();

		if(oldPass == "" || newPass == ""){
			swal({title: "Both foelds are nessecary",
				icon:"error"
			});
		}else{
			console.log(oldPass+newPass);
			$.ajax({
				type: "POST",
				url: "/change",
				data: {
					"old": oldPass,
					"newPass": newPass
				},
				success: function (response) {
					if(response=="200"){
						window.location = "/dashboard";
					}else{
						swal({
							title: "Password Change Failed",
							text: "Invalid password",
							icon: "error"
						});
					}	
				}
			});

		}

	});
});