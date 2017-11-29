myNS = {};

myNS.svg1;
myNS.svg2;

myNS.wBG = 470;      // of SVG
myNS.hBG = 430;
myNS.wCHL = 750;
myNS.hCHL = 600;     // of SVG
myNS.p= 90;      // padding of graph from svg edges; leave room for labels

myNS.BG = "us-issues.csv";    // the data to work with
myNS.CHL = "us-positivity.csv";
myNS.json = "us-states.json";

myNS.dataBG;
myNS.dataCHL;

myNS.x;
myNS.y;
myNS.color;

myNS.projection;
myNS.path;

myNS.currentSet = "Ad Negativity";

myNS.legendWidth = 200;
myNS.divisions = 100;



function main () {

    console.log(myNS.dataBG);
    console.log(myNS.dataCHL);

    myNS.svg1 = makeSVG("BG");
    myNS.svg2 = makeSVG("CHL");
    
    myNS.x = d3.scaleBand()
	.domain(d3.range(myNS.dataBG.length))
	.range([myNS.p,myNS.wBG-myNS.p])
	.paddingInner(0.05);
    
    myNS.y = d3.scaleLinear()
	.domain([0,d3.max(myNS.dataBG,function(d) {return parseInt(d.value)})])
	.range([myNS.hBG-myNS.p,myNS.p]);

    makeCHL();
    makeBG();
}


function makeBG() {
    
    makeAndLabelBars();
    makeAxes();
}


function makeAndLabelBars () {
    var barPadding = 1;    
    var redScaling = .005; 
    var labelYoffset = 0; 
    
    myNS.svg1.selectAll("rect.issue") 
	.data(myNS.dataBG)
	.enter()
	.append("rect")
	.attr("class", "issue")
	.attr("x", function(d, i) {
	    return myNS.x(i);
	})
	.attr("y", function(d) {
	    return myNS.y(parseInt(d.value));
	})
	.attr("width", (myNS.wBG-2*myNS.p) / myNS.dataBG.length - barPadding)
	.attr("height", function(d) {
	    return myNS.hBG - myNS.p - myNS.y(parseInt(d.value));
	})
    /*
	.attr("fill", function(d) {
	    return "rgb(" + 
		Math.round(parseInt(d.value) * redScaling) + ", 0, 0)";
	});
    */
	.attr("fill", "#e9e7da");
}


function makeAxes () {

    var xAxis = 
	d3.axisBottom(myNS.x)
	.tickFormat(function(d) { return myNS.dataBG[d].issue; });

    myNS.svg1.append('g')
	.attr("class", "x_axis")
	.attr("transform", "translate(0," + (myNS.hBG - myNS.p) + ")")
	.call(xAxis)
	.selectAll("text")
	.attr("transform", function(d) {
	    return "rotate(90), translate(" + 10 + ",-" + 20 + ")" 
	})
	.style("text-anchor", "start");
    
    var yAxis = 
	d3.axisLeft(myNS.y)
	.ticks(5);

    myNS.svg1.append('g')
	.attr("class", "y_axis")
	.attr("transform", "translate(" + myNS.p + "," + 0 + ")")
	.call(yAxis);
}


function makeSVG (id) {

    if (id == "BG") {
	var svg = d3.select("body")
	    .append("svg")
	    .attr("id", id)
	    .attr("width", myNS.wBG)
	    .attr("height", myNS.hBG)
	    .attr("onmouseover", "putAway();");
	
	return svg
    }
    else if (id == "CHL") {
	var svg = d3.select("body")
	    .append("svg")
	    .attr("id", id)
	    .attr("width", myNS.wCHL)
	    .attr("height", myNS.hCHL)
	    .attr("onmouseover", "putAway();");
	
	return svg;
    } 
}


function makeCHL() {

    makeHelpers();

    myNS.color.domain([
	d3.min(myNS.dataCHL, function(d) { return d.value; }),
	d3.max(myNS.dataCHL, function(d) { return d.value; })]);
    
    makeMap();

    makeLegend();
}


function makeHelpers() {

    myNS.projection = d3.geoAlbersUsa()
	.scale([myNS.wCHL]);
    
    myNS.path = d3.geoPath()
	.projection(myNS.projection);
    
    myNS.color = d3.scaleLinear()
	.range(["#373f27", "#e9e7da"]);
}


function makeLegend() {

    /*
    myNS.svg2.append("text")
	.attr("class", "caption")
	.attr("x", myNS.x.range()[0])
	.attr("y", -6)
	.attr("fill", "#000")
	.attr("text-anchor", "start")
	.attr("font-weight", "bold")
	.text(myNS.currentSet);
    
    myNS.svg2.call(d3.axisBottom(myNS.x)
		   .tickSize(13)
		   .tickValues(myNS.color.domain()));
*/
    var newData = [];

    var sectionWidth = Math.floor(myNS.legendWidth / myNS.divisions);

    for (var i=0; i < myNS.legendWidth; i+= sectionWidth ) {
        newData.push(i);
    }

    var legend = myNS.svg2.append("g")
	.attr("class", "legend")
	.attr("transform", "translate(450,450)");
    
    var colorScaleLin = d3.scaleLinear()
        .domain([0, newData.length-1])
        .interpolate(d3.interpolateLab)
        .range(["#373f27", "#e9e7da"]);
    
    legend.selectAll('rect')
        .data(newData)
        .enter()
        .append('rect')
            .attr("x", function(d) { return d; })
            .attr("y", 10)
            .attr("height", 10)
            .attr("width", sectionWidth)
            .attr('fill', function(d, i) { return colorScaleLin(i)});

    legend.append("text")
	.text(
	    function(){return d3.min(myNS.dataCHL, 
				     function(d){ return d.value;});
		      })
	.attr("transform","translate(0,0)")
	.style("font-size", "10px");
    
    legend.append("text")
	.text(
	    function(){return d3.max(myNS.dataCHL, 
				     function(d){ return d.value;});
		      })
	.attr("transform","translate("+(myNS.legendWidth-20)+",0)")
	.style("font-size", "10px");
}
    
    
function makeMap() {

    d3.json(myNS.json, function(json) {
	    
	for (var i = 0; i < myNS.dataCHL.length; i++) {
	    var dataState = myNS.dataCHL[i].state;	    
	    var dataValue = parseFloat(myNS.dataCHL[i].value);
	    
	    for (var j = 0; j < json.features.length; j++) {
		var jsonState = json.features[j].properties.name;
		if (dataState == jsonState) {
		    json.features[j].properties.value = dataValue;
		    break;
		}
	    }
	}
	
	myNS.svg2.selectAll("path")
	    .data(json.features)
	
	myNS.svg2.selectAll("path")
	    .data(json.features)
	    .enter()
	    .append("path")
	    .attr("d", myNS.path)
	    .style("fill", function(d) {
		var value = d.properties.value;
		if (value) {
		    return myNS.color(value);
		} 
		else {
		    return "#ccc";
		}
	    })
	    .style("stroke", "#cda34f");
    });
}


d3.csv(myNS.BG, function(error, data) {
    myNS.dataBG = data;
    if (error) {
      console.log(error);
    }
    else {
      d3.csv(myNS.CHL, function(error, data) {
	  myNS.dataCHL = data;
	  if (error) {
	      console.log(error);
	  }
	  else {
	      main();
	  }
      })
    }
});


// allows for drop down menu

function dropDown() {
    
    var info = document.getElementById("dropDown");

    if (info.style.visibility == "hidden") {
	info.style.visibility = "visible";
    }
}

function putAway() {
 
    var info = document.getElementById("dropDown");
    
    if (info.style.visibility == "visible") {
	info.style.visibility = "hidden";
    }
}
