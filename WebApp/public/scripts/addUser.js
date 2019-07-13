$(document).ready(function () {
	let form = $('form');
	var form_height = form.height();
	var document_height = $(document).height();
	if (document_height > form_height) {
		var top = (document_height - form_height) / 2;
		form.css("position", "relative");
		form.css("top", top);
	}

	var startDate = new Date();
	startDate.setYear(startDate.getFullYear() - 70);

	var instanceDate = M.Datepicker.init($('.datepicker').get(0), {
		yearRange: [1950, (new Date().getFullYear())],
		defaultDate: (new Date()),
	});

	instanceDate.setDate(new Date());

	$("#email").val("");
	$("#mentors_email").val("");
	var selectElement = $("#genderSelect");
	var instance = M.FormSelect.getInstance(selectElement);

	$('.btn').on('click', function (e) {
		e.preventDefault();

		var gender = instance.getSelectedValues()[0];

		console.log(instance.getSelectedValues());

		var dob = instanceDate.toString();

		var name = $('#first_name').val();
		var phone = $('#phone').val();
		var tenure = $('#tenure').val();
		var email = $("#email").val();
		var mentors_email = $("#mentors_email").val();
		var mentors_name = $("#guide_name").val();
		var research_email = $("#research_email").val();

		console.log([name, email, mentors_email]);

		if (name == "" || email == "" || dob == "" || tenure == "" || phone == "") {
			swal({
				title: "Invalid Form Details",
				icon: "error",
				text: "Name,Email,Phone,tenure,dob are required",
			});
			return;
		} else {

			let isEmailInvalid = $("#email").hasClass("invalid");
			if (isEmailInvalid) {
				swal({
					title: "Invalid Form Details",
					icon: "error",
					text: "Invalid email address in registered email"
				});
				return;
			}
			if (mentors_email.length > 0) {
				let isMentorEmailInvalid = $("#mentors_email").hasClass("invalid");
				if (isMentorEmailInvalid) {
					swal({
						title: "Invalid Form Details",
						icon: "error",
						text: "Invalid Guide Email address"
					});
					return;
				}
			}
			let phoneInvalid = $("#phone").hasClass("invalid");
			if (phoneInvalid) {
				swal({
					title: "Invalid Form Details",
					icon: "error",
					text: "Invalid Mobile Number"
				});
				return;
			}
			let tenureInvalid = $("#tenure").hasClass("invalid");
			if (tenureInvalid) {
				swal({
					title: "Invalid Form Details",
					icon: "error",
					text: "Invalid Tenure"
				});
				return;
			} else {
				if (parseInt(tenure) <= 0 || parseInt(tenure) > 72) {
					swal({
						title: "Invalid Form Details",
						icon: "error",
						text: "Tenure can be in range 1 to 72 months"
					});
					return;
				}
			}
		}

		$.ajax({
			type: "POST",
			url: "/adduser",
			data: {
				"name": name,
				"email": email,
				"mentors_email": mentors_email,
				"dob": dob,
				"mobile": phone,
				"mentor_name":mentors_name,
				"research_faculty":research_email
			},
			success: function (response) {
				console.log(response);

				const JSONObject = JSON.parse(response);

				if (JSONObject.status == 200) {
					swal({
						title: "Success",
						icon: "success",
						text: "User successfully added"
					}).then((_) => {
						window.location = "/users";
					});
				} else {
					swal({
						title: "Error",
						icon: "error",
						text: "User with email already exists",
					});
				}

			}
		});


	});




});