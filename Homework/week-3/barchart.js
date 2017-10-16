/*
Dataprocessing
Name: Morena Bastiaansen
Student number: 10725792
Homework 3: D3

barchart3.js
File with javascript code for the barchart of KNMI average temperatures data
*/


var margin = 40;
var width = 900 - 2*margin;
var height = 500 - 2*margin;

// get the right data and compose the chart
function get_data(file_name, chart, x, y) {
	d3.json(file_name, function(data) {
		var len = data.length;
		for (var n = 0; n < len; n++) {
			data[n]["date"] = Number(data[n]["date"].substring(6,8));
			data[n]["temperature"] = Number(data[n]["temperature"]);
		}
	// define domains
	x.domain(data.map(function(d) {return d.date; }));
	y.domain([d3.min(data, function(d) { return d.temperature; })-1, 
			  d3.max(data, function(d) {return d.temperature})+1]);

	// create variable for bars
	var bar = chart.selectAll(".bar")
		.data(data)
	.enter().append("g")
		.attr("id", function(d) { return "g" + d.date});

	// create rectangles for bars
	bar.append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.date); })
		.attr("y", function(d) { return y(d.temperature); })
		.attr("width", x.bandwidth())
      	.attr("height", function(d) { return height - y(d.temperature); })
		.on("mouseover", mouse_hover)
		.on("mouseout", mouse_off);

	// functions to control hovering
	function mouse_hover(d) {
		d3.select(this)
			.style("fill", "#FF5733");
		chart.select("#g"+d.date)
			.append("text")
				.attr("id", "t" + d.date)
				.attr("class", "tooltip")
				.attr("x", function(d){ return x(d.date) + x.bandwidth()/2; })
				.attr("y", function(d) {
					if(d.temperature>=0) {
						return y(d.temperature) - 4;
					} else {
						return y(d.temperature) + 12;
					}
				})
				.text(function(d) { return d.temperature; });
	}

	function mouse_off(d) {
		d3.select(this)
			.style("fill", "#B8B8B8");
		d3.select("#t" + d.date)
			.remove();
	}
		
	// make axes
	chart.append("g")
		.attr("class", "title")
	.append("text")
		.attr("x", width/2)
		.text("Average temperature (°C) De Bilt, October 2003");
		
  	chart.append("g")
      	.attr("transform", "translate(0," + height + ")")
      	.call(d3.axisBottom(x))
   	.append("text")
        .attr("x", width)
        .attr("y", 30)
        .text("Day");

    chart.append("g")
    	.call(d3.axisLeft(y))
    .append(text)
    	.attr("transform", "rotate(-90)")
    	.text("Temperature (°C)")

	});

}

// create function to make the chart 
function make_chart(file_name) {
	var chart = d3.select(".chart")
	.attr("width", width + 2*margin)
	.attr("height", height+ 2*margin)
.append("g")
	.attr("transform", "translate("+margin+","+margin+ ")");

	var x = d3.scaleBand()
		.range([0, width])
		.paddingInner(0.1)
		.paddingOuter(0.2);
	var y = d3.scaleLinear()
		.range([height,0]);

	get_data(file_name, chart, x, y);
}


// call function to make barchart
make_chart("KNMI_Oktober_2003_DeBilt.json");