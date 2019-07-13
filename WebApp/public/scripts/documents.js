$(document).ready(function () {

	let form = $('form');
	var form_height = form.height();
	var document_height = $(document).height();
	if (document_height > form_height) {
		var top = (document_height - form_height) / 2;
		form.css("position", "relative");
		form.css("top", top);
	}

	if($("#redirect").html()=="1"){

		swal({
			text: "Document Added",
			icon: "success"
		});

	}

	$('#submit-btn').on("click", async function (e) {
		console.log("clicked");
		e.preventDefault();
		const title = $('#title');
		const keywords = $('#keyword');
		const citation = $('#citation');

		const titleVal = title.val();
		const keywordsVal = keywords.val();
		const citationVal = citation.val();
		const fileVal = $('#fileUpload').val();

		if (citationVal.length > 0 && keywordsVal.length > 0 && titleVal.length > 0 && fileVal) {
			try {
				var ci = parseInt(citationVal);
				if (ci.toString() == NaN.toString()) {
					swal({
						title: "Invalid Form details",
						text: "Invalid citation value",
						icon: "error"
					});
					return;
				}

				if (!fileVal.endsWith(".pdf")) {
					swal({
						title: "Invalid Form details",
						text: "Invalid pdf file",
						icon: "error"
					});
					return;
				}
			} catch (e) {
				console.log("Error is " + e);
				swal("Invalid Form details", "Invalid citation value", "error");
				return;
			}
			$('#uploadForm').submit();

		} else {
			swal({
				title: "Invalid Form Details",
				text: "All fields are compulsary",
				icon: "error"
			});
		}
	});
});