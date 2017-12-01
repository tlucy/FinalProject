myNS = {};

myNS.svg1;
myNS.svg2;

myNS.wBG = 470;      // of SVG
myNS.hBG = 430;
myNS.wCHL = 750;
myNS.hCHL = 600;     // of SVG
myNS.p= 90;      // padding of graph from svg edges; leave room for labels

myNS.BG = "Issues_Month.csv";    // the data to work with
myNS.CHL = "Negativity_Month_State.csv";
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

    animate();
    sliderDisplay();
}

function makeScales(value) {
    myNS.x = d3.scaleBand()
        .domain(d3.range(myNS.dataBG.length))
        .range([myNS.p,myNS.wBG-myNS.p])
        .paddingInner(0.05);

    myNS.y = d3.scaleLinear()
        .domain([0,d3.max(myNS.dataBG,function(d) {
		return parseInt(getMonthVal(d, value))})])
        .range([myNS.hBG-myNS.p,myNS.p]);
}

function makeBG(value) {
    makeScales(value);
    makeAndLabelBars(value);
    makeAxes(value);
}


function makeAndLabelBars (value) {
    var barPadding = 1;    
    var redScaling = .005; 
    var labelYoffset = 0; 
    myNS.svg1.selectAll("rect.issue").remove();   
    myNS.svg1.selectAll("rect.issue") 
	.data(myNS.dataBG)
	.enter()
	.append("rect")
	.attr("class", "issue")
	.attr("x", function(d, i) {
	    return myNS.x(i);
	})
	.attr("y", function(d) {
	    return myNS.y(parseInt(getMonthVal(d, value)));
	})
	.attr("width", (myNS.wBG-2*myNS.p) / myNS.dataBG.length - barPadding)
	.attr("height", function(d) {
	    return myNS.hBG - myNS.p - myNS.y(parseInt(getMonthVal(d, value)));
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
    myNS.svg1.selectAll("g").remove();
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


function makeCHL(value) {

    makeHelpers();

    myNS.color.domain([0, 1])/*
	d3.min(myNS.dataCHL, function(d) { return d.value0; }),
	d3.max(myNS.dataCHL, function(d) { return d.value0; })]);
*/
    makeMap(value);

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
				     function(d){ return d.value0;});
		      })
	.attr("transform","translate(0,0)")
	.style("font-size", "10px");
    
    legend.append("text")
	.text(
	    function(){return d3.max(myNS.dataCHL, 
				     function(d){ return d.value0;});
		      })
	.attr("transform","translate("+(myNS.legendWidth-20)+",0)")
	.style("font-size", "10px");
}
function getMonthVal(dataobject, month) {
  if (month == "value0") {return dataobject.value0;}
  if (month == "value1") {return dataobject.value1;}
  if (month == "value2") {return dataobject.value2;}
  if (month == "value3") {return dataobject.value3;}
  if (month == "value4") {return dataobject.value4;}
  if (month == "value5") {return dataobject.value5;}
  if (month == "value6") {return dataobject.value6;}
  if (month == "value7") {return dataobject.value7;}
  if (month == "value8") {return dataobject.value8;}
  if (month == "value9") {return dataobject.value9;}
  if (month == "value10") {return dataobject.value10;}
  if (month == "value11") {return dataobject.value11;}
  if (month == "value12") {return dataobject.value12;}
  if (month == "value13") {return dataobject.value13;}
  if (month == "value14") {return dataobject.value14;}
  if (month == "value15") {return dataobject.value15;}
  if (month == "value16") {return dataobject.value16;}
  if (month == "value17") {return dataobject.value17;}
  if (month == "value18") {return dataobject.value18;}
  if (month == "value19") {return dataobject.value19;}
  if (month == "value20") {return dataobject.value20;}
  if (month == "value21") {return dataobject.value21;}
  if (month == "value22") {return dataobject.value22;}
  if (month == "value23") {return dataobject.value23;}
  if (month == "value24") {return dataobject.value24;}
}
    
function makeMap(propertyName) {
    myNS.svg2.selectAll("path").remove();
    d3.json(myNS.json, function(json) {
	for (var i = 0; i < myNS.dataCHL.length; i++) {
	    var dataState = myNS.dataCHL[i].state;	    
	    var dataValue = parseFloat(getMonthVal(myNS.dataCHL[i], propertyName));
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
function animate() {
    d3.select("#animate")
	.on("click", function() {
	    var slider = document.getElementById("myRange");
	    var val = 0;
	    var id = setInterval(frame, 1000);
	    function frame() {
		if (val >= 24) {
		    clearInterval(id);
		}
		else
		{
		    makeCHL("value" + slider.value);
		    makeBG("value" + slider.value);
		    slider.value = val;
		    val = val + 1;
		}
	    }
	}
    );
}

function sliderDisplay() {
  var slider = document.getElementById("myRange");
    makeBG("value" + slider.value);
    makeCHL("value" + slider.value);
  slider.oninput = function() {
    makeCHL("value" + slider.value);
    makeBG("value" + slider.value);
  }
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
