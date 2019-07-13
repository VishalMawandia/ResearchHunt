$(document).ready(function(){

	var dob = new Date();

	$('.sidenav').sidenav();
	$('select').formSelect();
	$('.fixed-action-btn').floatingActionButton();


	$('#sidenav-trigger').on('click', function () {
		var element = $("#sidenav").get(0);
		var instance = M.Sidenav.getInstance(element);
		if (instance.isOpen) {
			instance.close();
		} else {
			instance.open();
		}
	});

	$("input").each(function(){
		$(this).focusout(function (e){

			var pattern = $(this).attr("pattern");
			if(pattern!=null){
				const regExp = new RegExp(pattern);
				const val = $(this).val();
				if(regExp.test(val.trim())){
					$(this).removeClass("invalid");
				}
			}

			if($(this).hasClass("invalid")){
				const j = $(this).siblings('.helper-text');
				if(j!=null){
					j.css('display','block');
				}
			}else{
				const j = $(this).siblings('.helper-text');
				if(j!=null){
					j.css('display','none');
				}
			}
		});
	});
});

$(document).on({
	ajaxStart: function(){$("body").addClass("loading");},
	ajaxStop: function(){$("body").removeClass("loading");},
});