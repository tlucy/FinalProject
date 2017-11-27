
var Width = 1000;      // of SVG
var Height = 600;     // of SVG
var Padding= 90;      // padding of graph from svg edges; leave room for labels
var Data = "us-issues.csv"    // the data to work with



function main (data) {

  // make the SVG
  var svg = makeSVG();


  var xScale = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([0+Padding,Width-Padding])
    .paddingInner(0.05);
  var yScale = d3.scaleLinear()
    .domain([0, 
	     d3.max(data, 
		    function(d) {return parseInt(d.value)})
	    ])
    .range([Height-Padding,Padding]);


  makeAndLabelBars(svg,data,xScale,yScale);

  makeAxes(svg,data,xScale,yScale);
}

function makeAndLabelBars (svg,dataset,xScale,yScale) {
  var barPadding = 1;    
  var redScaling = .005; 
  var labelYoffset = 0; 


svg.selectAll("rect.issue") 
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "issue")
    .attr("x", function(d, i) {
      return xScale(i);
    })
    .attr("y", function(d) {
      return yScale(parseInt(d.value));
    })
    .attr("width", (Width-2*Padding) / dataset.length - barPadding)
    .attr("height", function(d) {
      return Height - Padding - yScale(parseInt(d.value));
    })
    .attr("fill", function(d) {
      return "rgb(" + 
	Math.round(parseInt(d.value) * redScaling) + ", 0, 0)";
    });

}

function makeAxes (svg, dataset, xScale, yScale) {

  console.log("make axes");

  var xAxis = 
    d3.axisBottom(xScale)
    .tickFormat(function(d) { return dataset[d].issue; });

  svg.append('g')
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (Height - Padding) + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("transform", function(d) {
      return "rotate(90), translate(" + 10 + ",-" + 20 + ")" 
    })
    .style("text-anchor", "start");

  var yAxis = 
    d3.axisLeft(yScale)
    .ticks(5);

  svg.append('g')
    .attr("class", "y axis")
    .attr("transform", "translate(" + Padding + "," + 0 + ")")
    .call(yAxis);
}

function makeSVG () {

  var svg = d3.select("body")
    .append("svg")
    .attr("width", Width)
    .attr("height", Height);
  
  
  return svg
} 


d3.csv(Data, function(error, data) {
    if (error) {
      console.log(error)
    }
    else {
      main(data)
    }
});
