$(document).ready(function () {

	function toObject(arr) {
		var rv = {};
		for (var i = 0; i < arr.length; i++) {
			rv[arr[i]] = null;
		}
		return rv;
	}


	$("#phoneEdit").on("click",function(){
		swal({
			title: 'Edit phone number',
			content: 'input',
			button: {
				text: "Add a new phone number",
				closeModal: false,
			},
		}).then(async function(name){
			
			if(/^[0-9]{10}$/.test(name)){
				const id = $('#id').html();
				$.ajax({
					type: "POST",
					url: "/user/updateMobile",
					data: {id:id,phone:name},
					success: function (response) {
						if(response=="200"){
							swal({text:"Phone number updated",icon:"success"}).then((_)=>{
								location.reload();
							});
						}else{
							swal({text:"Could not update phone number",icon:"error"});
						}
					}
				});
			}else{
				swal({
					text: "Invalid phone number "+name,
				});
			}
		});
	});

	function getInitialTags(arr) {
		var rv = [];
		for (var i = 0; i < arr.length; i++) {
			rv.push({
				tag: arr[i]
			});
		}
		return rv;
	}




	var allKeywords, userKeywords;
	var allKeywordsObject, userKeywordsObject;
	try {
		allKeywords = $('#allKeywords').attr('data').trim().split(';');
		allKeywords = allKeywords.filter(x => x.trim().length > 1);
		allKeywords = allKeywords.map(x => x.toUpperCase());
		userKeywords = $('#userKeywords').attr('data').trim().split(';');
		userKeywords = userKeywords.filter(x => x.trim().length > 1);
		allKeywords = allKeywords.map(x => x.toUpperCase());
		allKeywordsObject = toObject(allKeywords);
		userKeywordsObject = getInitialTags(userKeywords);
	} catch (error) {
		console.log(error);
	}
	console.log("Length is " + userKeywordsObject.length);
	$('.modal').modal();

	$("#clear-btn").on('click',function(e){

		console.log(e);

		$('.chips-autocomplete').chips({
			placeholder: "Add a keyword",
			secondaryPlaceholder: "+Keyword",
			autocompleteOptions: {
				data: allKeywordsObject,
				limit: Infinity,
				minLength: 1
			}
		});
	});


	if (userKeywordsObject.length > 0) {
		$('.chips-autocomplete').chips({
			data: userKeywordsObject,
			placeholder: "Add a keyword",
			secondaryPlaceholder: "+Keyword",
			autocompleteOptions: {
				data: allKeywordsObject,
				limit: Infinity,
				minLength: 1
			}
		});
	} else {

		$('.chips-autocomplete').chips({
			placeholder: "Add a keyword",
			secondaryPlaceholder: "+Keyword",
			autocompleteOptions: {
				data: allKeywordsObject,
				limit: Infinity,
				minLength: 1
			}
		});
	}

	var val = $("#and_or").attr("data");
	console.log("Value is "+val);

	$("input[type=checkbox]").prop("checked",val=="1"?true:false);

	$("input[type=checkbox]").on('change',function(){
		$(this).attr("disabled", "true");

		var elem = $(this);
		const id = $('#id').html();
		$.ajax({
			type: "GET",
			url: "/admins/toggleAndOr/" + id,
			error: function () {
				$(elem).removeAttr("disabled");
				$(elem).attr("checked", !$(this).prop("checked"));
				swal({
					title: "Error",
					text: "Could not update And Or",
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

	const id = $('#id').html();

	$('#renew').on('click', function (e) {
		e.preventDefault();
		$.ajax({
			type: "GET",
			url: "/users/renew/" + id,
			success: function (response) {
				var JSONObject = JSON.parse(response);
				if (JSONObject.status === 200) {
					location.reload();
				} else {
					swal({
						icon: "error",
						text: "Subscription renew failed"
					});
				}
			}
		});
	});

	$('#modifysubscription').on('click', function (e) {
		e.preventDefault();

		var to_unsubscribe = [];
		var to_add = [];
		var unseen_keywords = [];
		var chipInstance = M.Chips.getInstance($('.chips-autocomplete'));
		var selectedKeywords = $.map(chipInstance.chipsData, function (e, _) {
			return e.tag.toUpperCase();
		});

		for (var i = 0; i < selectedKeywords.length; i++) {
			selectedKeywords[i] = selectedKeywords[i].trim();
			if (selectedKeywords[i] == "")
				continue;
			if (userKeywords.includes(selectedKeywords[i])) {
				continue;
			} else if (allKeywords.includes(selectedKeywords[i])) {
				to_add.push(selectedKeywords[i]);
			} else {
				unseen_keywords.push(selectedKeywords[i]);
			}
		}
		for (i = 0; i < userKeywords.length; i++) {
			if (selectedKeywords.includes(userKeywords[i])) {
				continue;
			} else {
				to_unsubscribe.push(userKeywords[i]);
			}
		}

		function unique(a) {
			return a.sort().filter(function (item, pos, ary) {
				return !pos || item != ary[pos - 1];
			});
		}

		unseen_keywords = unique(unseen_keywords);
		to_unsubscribe = unique(to_unsubscribe);
		to_add = unique(to_add);

		if(to_add.length+to_unsubscribe.length+unseen_keywords.length==0){
			return;
		}

		$.ajax({
			type: "POST",
			url: "/modifySubscription",
			data: {
				id: id,
				unseen: unseen_keywords.join(';'),
				unsubscribe: to_unsubscribe.join(';'),
				add: to_add.join(';'),
			},
			statusCode:{
				200: function(){
					location.reload();
				}
			},
			success: function (response) {
				if (response == "200") {
					swal({
						title: "Keywords Updated",
						icon: "success"
					});
					location.reload();
				} else {
					swal({
						title: "Could not update keywords",
						icon: "error"
					});
				}
			}
		});
	});


	$('#send').on('click', function (e) {
		e.preventDefault();
		$.ajax({
			type: "GET",
			url: "/sendupdates/" + id
		});
		swal({
			text: "Updates will be sent to the user.",
			icon: "success"
		});
	});

	$('#sendExact').on('click', function (e) {

		console.log("Clicked");

		e.preventDefault();
		$.ajax({
			type: "GET",
			url: "/sendexactupdates/" + id,
			success: function(response){
				console.log(response);
			}
		});
		swal({
			text: "Exact matches will be sent to the user.",
			icon: "success"
		});
	});

	$('#unsubscribe').on('click', function (e) {
		e.preventDefault();
		$.ajax({
			type: "GET",
			url: "/unsubscribe/" + id,
			success: function (response) {
				var JSONObject = JSON.parse(response);
				if (JSONObject.status === 200) {
					window.location = "/users";
				} else {
					swal({
						icon: "error",
						text: "Unsubscribe failed"
					});
				}
			}
		});
	});
});