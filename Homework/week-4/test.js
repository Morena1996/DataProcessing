// Name: Morena Bastiaansen
// Student number: 10725792
// DataProcessing, Homework 4: Test.js

var colours = ['#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#005824'];

loadsvg("test.svg");

function loadsvg(filename) {
	d3.xml(filename, function(error, xml) {
        if (error) throw error;
        document.body.appendChild(xml.documentElement);
        fill_legend();
    });
}

function fill_legend() {
	len = colours.length;
	for(var n = 1; n <= len; n++) {
		d3.select("#kleur" + n)
		.style("fill", colours[n-1]);
	}
}

