$(document).ready(function () {

	var rows = $("table tbody tr");


	function showResults(text) {
		rows.each(function (_, val) {
			var email = $(val).find("td:nth-child(3)").html();
			if (email.includes(text) || text == "") {
				$(val).css("display", "table-row");
			} else {
				$(val).css("display", "none");
			}

		});
	}


	$(".deleteBtn").on('click', function () {
		var id = $(this).attr('aid');


		swal({
			title: "Delete Admin",
			text: "Are you sure you want to remove admin",
			icon: "warning",
			buttons: ["Cancel","Yes, delete it!"],
		}).then((result)=>{
			if(result==true){

				$.ajax({
					type: "DELETE",
					url: "/admins/" + id,
					error: function () {
						swal({
							title: "Error",
							text: "Could not delete admin",
							icon: "error"
						});
					},
					success: function (res) {
						console.log("Result is " + res);
						if (res == "200"){
							location.reload();
						}
					},
					timeout: 5000,
				});
			}
		});

	});


	$("#searchBar").on("change paste keyup", function () {
		var text = $(this).val();
		if (text.length > 0) {
			$("#label").css("display", "none");
		} else {
			$("#label").css("display", "block");
		}
	});

	$("#search").on("click", function () {
		var text = $("#searchBar").val();
		showResults(text);
	});


	var switches = $(".switch").find("input[type=checkbox]");
	switches.each(function () {
		var isChecked = $(this).attr('data');
		var id = $(this).attr('aid');
		$(this).prop("checked", isChecked == "1" ? true : false);

		$(this).on('change', function () {
			$(this).attr("disabled", "true");
			console.log("Heyy");
			var elem = $(this);
			$.ajax({
				type: "GET",
				url: "/admins/toggleSuperadmin/" + id,
				error: function () {
					$(elem).removeAttr("disabled");
					$(elem).attr("checked", !$(this).prop("checked"));
					swal({
						title: "Error",
						text: "Could not update superadmin rights",
						icon: "error"
					});
				},
				success: function (res) {
					console.log("Result is " + res);
					if (res == "200")
						$(elem).removeAttr("disabled");
				},
				timeout: 5000,
			});

		});

	});

});