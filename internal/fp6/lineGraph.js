/*
  borrowed code from: https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0

  Author: Tom Lucy
  Date: 11/13/17

*/

myNS = {};

myNS.data = "adsLine.csv";
myNS.width = 1000;
myNS.height = 400;

// set the dimensions and margins of the graph
var margin = {top: 50, right: 50, bottom: 50, left: 75};
    var width = myNS.width - margin.left - margin.right;
    var height = myNS.height - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%m/%d/%y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { 
	return x(d.date); })
    .y(function(d) {
	return y(d.cost); });

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv(myNS.data, function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.cost = +d.cost;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.cost; })]);

  // Add the valueline path.
  svg
	.append("path")
	.data([data])
	.attr("fill", "blue")
	.attr("class", "line")
	.attr("d", valueline);

  // Add the X Axis
  svg
	.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x));
    
  // Add the Y Axis
  svg
	.append("g")
	.call(d3.axisLeft(y));

});
