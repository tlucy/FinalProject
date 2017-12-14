var NS = {};
NS.w = 1000;
NS.h = 600;

function main() {

  var projection = d3.geoAlbersUsa()
    .scale([NS.w]);

  var path = d3.geoPath()
    .projection(projection);
				 
  var color = d3.scaleQuantize()
    .range(["rgb(300, 0, 0)","rgb(150, 50, 0)","rgb(100,100,0)",
	"rgb(50,150,0)","rgb(50,200,0)"]);

  var svg = d3.select("body")
    .append("svg")
    .attr("width", NS.w)
    .attr("height", NS.h);

  d3.csv("us-positivity.csv", function(data) {
    color.domain([
      d3.min(data, function(d) { return d.value; }), 
      d3.max(data, function(d) { return d.value; })
    ]);

    d3.json("us-states.json", function(json) {

    for (var i = 0; i < data.length; i++) {
      var dataState = data[i].state;

      var dataValue = parseFloat(data[i].value);

      for (var j = 0; j < json.features.length; j++) {

        var jsonState = json.features[j].properties.name;

	if (dataState == jsonState) {

	  json.features[j].properties.value = dataValue;

	  break;

	}
      }		
    }

    svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function(d) {
	var value = d.properties.value;
		
	if (value) {
	  return color(value);
	} else {
	  return "#ccc";
	}
      });

    });
  });
}
main();
