/*
Data Processing
Name: Morena Bastiaansen
Studentnumber: 10725792

multiline.js

This file contains the javascript code for the d3line
*/

// load JSON data
d3.json('data4.json', function(error, data) {
data.forEach(function (d) {
    d.maand= Number(d.maand);
    d.beroepsbevolkingA=Number(d.beroepsbevolkingA);
    d.beroepsbevolkingB=Number(d.beroepsbevolkingB);
    d.beroepsbevolkingC=Number(d.beroepsbevolkingC);
    d.beroepsbevolkingD=Number(d.beroepsbevolkingD);
    });

// create variable for the chart
var chart = create_chart(data, 'maand', {
    '2003 - Mannen': {column: 'beroepsbevolkingA'},
    '2016 - Mannen': {column: 'beroepsbevolkingB'},
    '2003 - Vrouwen': {column: 'beroepsbevolkingC'},
    '2016 - Vrouwen': {column: 'beroepsbevolkingD'}
}, {x_axis: 'Maanden', y_axis: 'Beroepsbevolking'});

chart.join("#chart-line");
chart.show();
});

// function to create the chart
function create_chart(data, name_x, objects_y, axis_lables) {
    // create empty variable for chart attributes and add those attributes
    var chartattr = {};
    var color = d3.scale.category20();
    chartattr.xlabel = axis_lables.x_axis;
    chartattr.ylabel = axis_lables.y_axis;
    chartattr.data = data;
    chartattr.margin = {top: 15, right: 60, bottom: 30, left: 80};
    chartattr.width = 1000 - chartattr.margin.left - chartattr.margin.right;
    chartattr.height = 500 - chartattr.margin.top - chartattr.margin.bottom;

    // create x function and y function to pass x and y as strings 
    chartattr.xfunction = function(d){return d[name_x]};

    function yfunction(column) {
        return function (d) {
            return d[column];
        };
    }

    // make format functions for axes
    chartattr.number = d3.format(".0f");
    chartattr.xformat = chartattr.number;
    chartattr.yformat = chartattr.number;
    chartattr.bisectmonth = d3.bisector(chartattr.xfunction).left;


    // create empty array and fill with y objects
    chartattr.yfunctions = [];
    for (var y  in objects_y) {
        objects_y[y].name = y;
        objects_y[y].yfunction = yfunction(objects_y[y].column);
        chartattr.yfunctions.push(objects_y[y].yfunction);
    }

    // make functions for lines
    function get_y_scale(object_y) {
        return function (d) {
            return chartattr.y_scale(objects_y[object_y].yfunction(d));
        };
    }
    for (var object_y in objects_y) {
        objects_y[object_y].line = d3.svg.line().interpolate("cardinal").x(function (d) {
            return chartattr.x_scale(chartattr.xfunction(d));
        }).y(get_y_scale(object_y));
    }

    // get max of every yfunction
    chartattr.maxy = function (d) {
        return d3.max(chartattr.data, d);
    };

    //make scale functions
    chartattr.x_scale = d3.scale.linear().range([0, chartattr.width]).domain(d3.extent(chartattr.data, chartattr.xfunction)); 
    chartattr.y_scale = d3.scale.linear().range([chartattr.height, 0]).domain([0, d3.max(chartattr.yfunctions.map(chartattr.maxy))]);
    
    // create axes
    chartattr.x_axis = d3.svg.axis().scale(chartattr.x_scale).orient("bottom"); 
    chartattr.y_axis = d3.svg.axis().scale(chartattr.y_scale).orient("left"); 

    // update chart size to window size
    chartattr.sizeupdate = function () {
        chartattr.width = parseInt(chartattr.div.style("width"), 10) - (chartattr.margin.left + chartattr.margin.right);
        chartattr.height = parseInt(chartattr.div.style("height"), 10) - (chartattr.margin.top + chartattr.margin.bottom);

        chartattr.x_scale.range([0, chartattr.width]);
        chartattr.y_scale.range([chartattr.height, 0]);
        
        if (!chartattr.svg) {return false;}

        // else update axes with updated scale
        chartattr.svg.select('.x.axis').attr("transform", "translate(0," + chartattr.height + ")")
        .call(chartattr.x_axis);
        chartattr.svg.select('.x.axis .label').attr("x", chartattr.width/2);
        chartattr.svg.select('.y.axis').call(chartattr.y_axis);
        chartattr.svg.select('.y.axis .label').attr("x", -chartattr.height/2);

       // update line
        for (var y  in objects_y) {
            objects_y[y].path.attr("d", objects_y[y].line);
        }
        
        d3.selectAll(".hover.line").attr("y2", chartattr.height);

        chartattr.div.select('svg').attr("width", chartattr.width + (chartattr.margin.left + chartattr.margin.right)).attr("height", chartattr.height + (chartattr.margin.top + chartattr.margin.bottom));

        chartattr.svg.select(".overlay").attr("width", chartattr.width).attr("height", chartattr.height);
        return chartattr;
    };

    // function to bind the different div elements of the chart
    chartattr.join = function (selector) {
        chartattr.obj = d3.select(selector);
        chartattr.obj.append("div")
            .attr("class", "inner")
            .append("div")
            .attr("class", "outer_plane")
            .append("div")
            .attr("class", "inner_plane");
        
        chart_select = selector + " .inner_plane";
        chartattr.div = d3.select(chart_select);
        d3.select(window).on('resize.' + chart_select, chartattr.sizeupdate);
        chartattr.sizeupdate();
        return chartattr;
    };

    // function to render the chart
    chartattr.show = function () {
        // make svg element
        chartattr.svg = chartattr.div.append("svg")
            .attr("class", "chart-area")
            .attr("width", chartattr.width + (chartattr.margin.left + chartattr.margin.right))
            .attr("height", chartattr.height + (chartattr.margin.top + chartattr.margin.bottom))
            .append("g").attr("transform", "translate(" + chartattr.margin.left + "," + chartattr.margin.top + ")");

        // draw the lines
        for (var y  in objects_y) {
            objects_y[y].path = chartattr.svg.append("path").datum(chartattr.data).attr("class", "line").attr("d", objects_y[y].line).style("stroke", color(y))
                .attr("data-series", y)
                .on("mouseover", function () {
                hover.style("display", null);
                })
                .on("mouseout", function () {
                hover.transition().delay(700).style("display", "none");
                })
                .on("mousemove", mousemove);
        }
        

        // draw axes
        chartattr.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + chartattr.height + ")")
            .call(chartattr.x_axis).append("text").attr("class", "label").attr("x", chartattr.width / 2)
            .attr("y", 30).style("text-anchor", "middle")
            .text(chartattr.xlabel);

        chartattr.svg.append("g")
            .attr("class", "y axis")
            .call(chartattr.y_axis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", -42)
            .attr("x", -chartattr.height / 2)
            .attr("dy", ".71em").style("text-anchor", "middle")
            .text(chartattr.ylabel);

        
        // draw legend
        var legend = chartattr.obj.append('div').attr("class", "legend");
        for (var y  in objects_y) {
            series = legend.append('div');
            series.append('div').attr("class", "series-marker").style("background-color", color(y));
            series.append('p').text(y);
            objects_y[y].legend = series;
        }


        // create tooltips for mouse hovering
        var hover = chartattr.svg.append("g").attr("class", "hover").style("display", "none");

        for (var y  in objects_y) {
            objects_y[y].tooltip = hover.append("g");
            objects_y[y].tooltip.append("circle").attr("r", 5);
            objects_y[y].tooltip.append("rect").attr("x", 8).attr("y","-5").attr("width",22).attr("height",'0.75em');
            objects_y[y].tooltip.append("text").attr("x", 9).attr("dy", ".35em");
        }

        // hover line
        hover.append("line").attr("class", "hover line").attr("y1", 0).attr("y2", chartattr.height);

        // ensure tooltips and hover line move with mouse
        chartattr.svg.append("rect")
            .attr("class", "overlay")
            .attr("width", chartattr.width)
            .attr("height", chartattr.height)
            .on("mouseover", function () {
                hover.style("display", null);
            })
            .on("mouseout", function () {
                hover.style("display", "none");
            }) 
            .on("mousemove", mousemove);

        // add title to graph
        chartattr.svg.append("g")
            .attr("x", (chartattr.width / 2))             
            .attr("y", 5)
            .attr("text-anchor", "middle")  
            .style("font-size", "20px")
            .style("font-family", "verdana") 
            .text("Beroepsbevolking in Nederland");

        return chartattr;

        // function for hovering 
        function mousemove() {
            var x0 = chartattr.x_scale.invert(d3.mouse(this)[0]);
            var n = chartattr.bisectmonth(data, x0, 1),d0 = chartattr.data[n - 1], d1 = chartattr.data[n];
            var d = x0 - chartattr.xfunction(d0) > chartattr.xfunction(d1) - x0 ? d1 : d0;
            
            y_min = chartattr.height;
            for (var y  in objects_y) {
                objects_y[y].tooltip.attr("transform", "translate(" + chartattr.x_scale(chartattr.xfunction(d)) + "," + chartattr.y_scale(objects_y[y].yfunction(d)) + ")");
                objects_y[y].tooltip.select("text").text(objects_y[y].yfunction(d));
                y_min = Math.min(y_min, chartattr.y_scale(objects_y[y].yfunction(d)));
            }

            hover.select(".hover.line").attr("transform", "translate(" + chartattr.x_scale(chartattr.xfunction(d)) + ")").attr("y1", y_min);
            hover.select(".hover.month").text("Maand: " + chartattr.xfunction(d));
        }

    };
    return chartattr;
}