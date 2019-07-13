$(document).ready(function(){

	$(".fixed-action-btn").on('click',addKeyword);


	$(".deletebtn").on('click',function(element){
		var name = $(this).siblings(".collection-item span").text();
		console.log("Name is "+name);
		swal({
			title: "Delete keyword",
			text: "Are you sure you want to delete "+name,
			icon: "warning",
			buttons: ["Cancel","Yes, delete it!"],
		}).then((result)=>{
			if(result==true){
				$.ajax({
					type: "DELETE",
					url: "/keywords/"+name,
					success: function (response) {
						if(response=="200"){
							swal({
								title: "Keyword deleted",
								text: "Keyword "+name+" deleted",
								icon: "success",
							}).then(()=>location.reload());
						}else{
							swal({
								title: "Failed",
								text: "Keyword "+name+" deletion failed",
								icon: "error",
							});
						}
					},
					error: function(){
						swal({
							text: "Failed",
							icon: "error",
						});
					},
					timeout: 3000,
				});
			}
		});
	});

	async function addKeyword(){

		
		swal({
			title: 'Enter Keyword',
			content: 'input',
			button: {
				text: "Add keyword",
				closeModal: false,
			},
		}).then(name=>{
			console.log(name);
			if(name==null){
				swal.close();
				return;
			}
			if(name.trim()==""){
				swal.stopLoading();
				swal({
					text:"Invalid keyword",
				});
			}else{
				swal.stopLoading();
				$.ajax({
					type: "POST",
					url: "/keywords/"+name.toUpperCase(),
					success: function (response) {
						if(response=="200"){
							swal({
								text: "Keyword "+name+" added",
								icon: "success",
							}).then(()=>location.reload());
						}else{
							swal({
								text: "Keyword "+name+" insertion failed",
								icon: "error",
							});
						}
					},
					error: function(){
						swal({
							text: "Failed",
							icon: "error",
						});
					},
					timeout: 3000,
				});
			}
		});
	}

});