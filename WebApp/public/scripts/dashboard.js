$(document).ready(function () {
	var ctx = document.getElementById("chart").getContext('2d');
	var months = ["January", "February", "March", "April", "May", "June"];
	var subscribedUsers = [12, 19, 33, 45, 22, 33];
	var registeredUsers = [12, 19, 33, 45, 52, 53];

	$.ajax({
		type:"GET",
		url:"/getCount",
		success: function(response){
			$("#registered").html(response.user);
			$("#subscribed").html(response.subscribed);
			$("#documents").html(response.docCount);
		}
	});
	


	$.ajax({
		type: "GET",
		url: "/userStats",
		success: function (response) {

			console.log(response);
			var jsonObject = response;

			subscribedUsers = [];
			registeredUsers = [];
			months = [];

			for(var i=0;i<jsonObject.length;i++){
				months.push(jsonObject[i].datevalue);
				subscribedUsers.push(jsonObject[i].subscribed);
				registeredUsers.push(jsonObject[i].active);
			}
			var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: months,
					datasets: [{
						label: "No of subscribed users",
						data: subscribedUsers,
						borderColor: "#00BFFF",
						backgroundColor: "rgba(192,192,192,0.6)",
						cubicInterpolationMode: "monotone"
					}, {
						label: "No of registered users",
						data: registeredUsers,
						borderColor: "#FF69B4",
						backgroundColor: "rgba(0,0,0,0)",
						cubicInterpolationMode: "monotone"
					}]
				},
				options: {
					title: {
						position: "bottom",
					},
					legend: {
						labels: {
							boxWidth: 20
						}
					},
					aspectRatio: 2 / 1,
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true
							}
						}]
					}
				}
			});
		}
	});



	$.ajax({
		type: "GET",
		url: "/getKeywordStats",
		success: function (response) {
			var data = [];
			var names = [];
			for(var i=0;i<response.length;i++){

				if(i<5){
					var x = "#key"+(i+1).toString();
					console.log($(x));
					$(x).html("<td>"+response[i].keyword_name+"</td><td>"+response[i].count.toString()+"</td>");
				}
				if(i<8){
					data.push(response[i].count);
					names.push(response[i].keyword_name);	
				}
				if(i==8){
					data.push(response[i].count);
					names.push("Others");
				}
				if(i>8){
					data[data.length-1]+=response[i].count;
				}
			}

			var ctx2 = document.getElementById("doughnutchart").getContext('2d');
			var doughnutChart2 = new Chart(ctx2, {
				type: "doughnut",
				data: {
					datasets: [{
						data: data,
						backgroundColor: [
							"blue",
							"green",
							"brown",
							"pink",
							"orange",
							"violet",
							"yellow",
							"purple",
							"red",
						]
					}],
					labels: names,
				},
				options: {
					title: {
						display: true,
						text: "Keywords Request Chart"
					}
				}
			});
		}
	});

});