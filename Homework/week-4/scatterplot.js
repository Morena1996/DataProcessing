/*
Dataprocessing
Name: Morena Bastiaansen
Student number: 10725792
Homework 4: Scatterplot in D3

scatterplot.js
File with javascript code for the scatterplot of life expectancy and unemployment data 
*/
		// set margin, width and height
		var margin = {top: 20, right: 20, bottom: 30, left: 40},
			width = 960 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		//create variables for x, y, colors and axes
		var x = d3.scale.linear()
			.range([0, width]);

		var y = d3.scale.linear()
			.range([height, 0]);

		var color = d3.scale.category20();

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");
		
		//create svg element for the chart
		var svg = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// load json data 
		d3.json("data1.json", function(error, data) {
			if (error) throw error;

			data.forEach(function(d) { 
				console.log(d)
				d.life_expectancy = +Number(d.life_expectancy);
				d.unemployment = +Number(d.unemployment);
			});

			// set domains
			x.domain(d3.extent(data, function(d) { return d.unemployment; })).nice();
			y.domain(d3.extent(data, function(d) { return d.life_expectancy; })).nice();

		  // add x axis
		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis)
		    .append("text")
		      .attr("class", "label")
		      .attr("x", width)
		      .attr("y", -6)
		      .style("text-anchor", "end")
		      .text("Unemployment, total (% of total labor force) (modeled ILO estimate) ");

		  // add y axis
		  svg.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    .append("text")
		      .attr("class", "label")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Life expectancy at birth, total (years)")

 		  // add dots for the data points
		  svg.selectAll(".dot")
		      .data(data)
		    .enter().append("circle")
		      .attr("class", "dot")
		      .attr("r", 3.5)
		      .attr("cx", function(d) { return x(d.unemployment); })
		      .attr("cy", function(d) { return y(d.life_expectancy); })
		      .style("fill", function(d) { return color(d.continent); });

		  // add legend
		  var legend = svg.selectAll(".legend")
		      .data(color.domain())
		    .enter().append("g")
		      .attr("class", "legend")
		      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		  // add squares and text to legend
		  legend.append("rect")
		      .attr("x", width - 18)
		      .attr("width", 18)
		      .attr("height", 18)
		      .style("fill", color);

		  legend.append("text")
		      .attr("x", width - 24)
		      .attr("y", 9)
		      .attr("dy", ".35em")
		      .style("text-anchor", "end")
		      .text(function(d) { return d; });

});
