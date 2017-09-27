/*
Dataprocessing
Name: Morena Bastiaansen
Student number: 10725792
Homework 3: D3

barchart3.js
File with javascript code for the barchart of KNMI average temperatures data
*/

// Read in JSON data
        d3.json("/KNMI_2015_DeBilt.json", function(data) {

            var margin = {top: 20, right: 10, bottom: 10, left: 20},
                width = 3000 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            console.log(width)
            console.log(height)
            console.log(margin)

            var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1);

            console.log(x)

            var y = d3.scale.linear()
                .range([height, 0]);

            console.log(y)


            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            console.log(xAxis)

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            console.log(yAxis)

            var chart = d3.select(".chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                console.log(chart)

                x.domain(data.map(function(d) {return d.date; }));
                y.domain([0, d3.max(data, function(d) { return d.temperature; })]);

                chart.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0, " + height + ")")
                    .call(xAxis);

                chart.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

                chart.selectAll(".bar")
                    .data(data)
                  .enter().append("rect")
                    .attr("class","bar")
                    .attr("x", function(d) { return x(d.date); })
                    .attr("y", function(d) {return y(d.temperature); })
                    .attr("height", function(d) {return height - y(d.date); })
                    .attr("width", x.rangeBand());
            });

            function type(d) {
            d.value = +d.temperature; // coerce to number
            return d;
            }

