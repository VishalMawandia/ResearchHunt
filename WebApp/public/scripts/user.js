$(document).ready(function(){

	var rows = $("table tbody tr");


	function showResults(text){
		rows.each(function (_, val) { 
			var email = $(val).find("td:nth-child(3)").html();
			if(email.includes(text) || text==""){
				$(val).css("display","table-row");
			}else{
				$(val).css("display","none");
			}

		});
	}

	$("#searchBar").on("change paste keyup",function(){
		var text = $(this).val();
		if(text.length>0){
			$("#label").css("display","none");
		}else{
			$("#label").css("display","block");
		}
	});

	$("#search").on("click",function(){
		var text = $("#searchBar").val();
		showResults(text);
	});

});