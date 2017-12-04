myNS = {};

myNS.svg1;
myNS.svg2;

myNS.wBG = 470;      // of SVG
myNS.hBG = 430;
myNS.wCHL = 750;
myNS.hCHL = 600;     // of SVG
myNS.p= 90;      // padding of graph from svg edges; leave room for labels

myNS.json = "us-states.json";

myNS.issuesMonth;
myNS.negMonthState;
myNS.costMonth;
myNS.partyMonth;
myNS.partyMonthState;
myNS.showsMonth;
myNS.totalMonthState;
myNS.totalSpendingMonthState;

myNS.currSetBG;
myNS.currSetCHL;

myNS.x;
myNS.y;
myNS.color;

myNS.projection;
myNS.path;

myNS.legendWidth = 200;
myNS.divisions = 100;

myNS.dates = [
    "2015-2016",
    "January 2015",
    "February 2015",
    "March 2015",
    "April 2015",
    "May 2015",
    "June 2015",
    "July 2015",
    "August 2015",
    "September 2015",
    "October 2015",
    "November 2015",
    "December 2015",
    "January 2016",
    "February 2016",
    "March 2016",
    "April 2016",
    "May 2016",
    "June 2016",
    "July 2016",
    "August 2016",
    "September 2016",
    "October 2016",
    "November 2016",
    "December 2016",
    "January 2017"
];

myNS.optionsCHL = {
    "Tone": myNS.negMonthState,
    "Party": myNS.partyMonthState,
    "Total Ads": myNS.totalMontState,
    "Total Spending": myNS.totalSpendingMonthState
};

myNS.optionsBG = {
    "Total per Issue": myNS.issueMonth,
    "Cost per Issue": myNS.costMonth,
    "Total per Party": myNS.partyMonth
};



function main () {
 
    if (myNS.currSetBG == undefined && myNS.currSetCHL == undefined) {
	selection();
    }

    console.log(myNS.currSetBG);
    console.log(myNS.currSetCHL);

    myNS.svg1 = makeSVG("BG");
    myNS.svg2 = makeSVG("CHL");

    animate();
    sliderDisplay();
}


function makeScales(value) {
    myNS.x = d3.scaleBand()
        .domain(d3.range(myNS.currSetBG.length))
        .range([myNS.p,myNS.wBG-myNS.p])
        .paddingInner(0.05);

    myNS.y = d3.scaleLinear()
        .domain([0,d3.max(myNS.currSetBG,function(d) {
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
    var labelYoffset = 0; 
    myNS.svg1.selectAll("rect.issue").remove();   
    myNS.svg1.selectAll("rect.issue") 
	.data(myNS.currSetBG)
	.enter()
	.append("rect")
	.attr("class", "issue")
	.attr("x", function(d, i) {
	    return myNS.x(i);
	})
	.attr("y", function(d) {
	    return myNS.y(parseInt(getMonthVal(d, value)));
	})
	.attr("width", (myNS.wBG-2*myNS.p) / myNS.currSetBG.length - 
	      barPadding)
	.attr("height", function(d) {
	    return myNS.hBG - myNS.p - myNS.y(parseInt(getMonthVal(d, value)));
	})
	.attr("fill", "maroon");
}


function makeAxes () {

    myNS.svg1.selectAll("g").remove();
    var xAxis = 
	d3.axisBottom(myNS.x)
	.tickFormat(function(d) { return myNS.currSetBG[d].issue; });

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

    makeMap(value);

    makeLegend();
}


function makeHelpers() {

    myNS.projection = d3.geoAlbersUsa()
	.scale([myNS.wCHL]);
    
    myNS.path = d3.geoPath()
	.projection(myNS.projection);
    
    myNS.color = d3.scaleLinear()
	.range(["maroon", "white"]);
}


function makeLegend() {

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
        .range(["maroon", "white"]);
    
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
	    function(){return d3.min(myNS.currSetCHL, 
				     function(d){ return d.value0;});
		      })
	.attr("transform","translate(0,0)")
	.style("font-size", "10px");
    
    legend.append("text")
	.text(
	    function(){return d3.max(myNS.currSetCHL, 
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
	for (var i = 0; i < myNS.currSetCHL.length; i++) {
	    var dataState = myNS.currSetCHL[i].state;	    
	    var dataValue = parseFloat(getMonthVal(myNS.currSetCHL[i], 
						   propertyName));
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
	    .style("stroke", "black");
    });
}


function animate() {
    d3.select("#animate")
	.on("click", function() {
	    var slider = document.getElementById("myRange");
	    var val = 0;
	    var id = setInterval(frame, 1000);
	    var date = d3.select("#date");
	    function frame() {
		if (val >= 24) {
		    clearInterval(id);
		}
		else
		{
		    makeCHL("value" + slider.value);
		    makeBG("value" + slider.value);
		    slider.value = val;
		    date.text(myNS.dates[slider.value]);
		    val = val + 1;
		}
	    }
	}
    );
}


function sliderDisplay() {

    var slider = document.getElementById("myRange");
    var date = d3.select("#date");
    makeBG("value" + slider.value);
    makeCHL("value" + slider.value);
    slider.oninput = function() {
	makeCHL("value" + slider.value);
	makeBG("value" + slider.value);
	date.text(myNS.dates[slider.value]);
  }
}


function selection() {

    // selecting by html ids                                                   
    var chlMenu = d3.select("#controlsCHL");
    var bgMenu = d3.select("#controlsBG");

    // set initial BG and CHL                                                 
    myNS.currSetCHL = myNS.negMonthState;
    myNS.currSetBG = myNS.issuesMonth;

    // set initial drop down items                                             
    document.getElementById("CHLmetric").value = "Tone";
    document.getElementById("BGmetric").value = "Total per Issue";

    // update plot if new values are chosen                                    
    d3.select("#controlsCHL").on("change", function() {
	//document.getElementById("CHLmetric").value = this.value;
        var key = this.value;
	console.log(key);
	myNS.currSetCHL = myNS.optionsCHL[key];
        myNS.svg2.remove();
	main();
    });
    
    // update plot if new values are chosen                                    
    d3.select("#controlsBG").on("change", function() {
	//document.getElementById("CHLmetric").value = this.value;
        var key = this.value;
	console.log(key);
	myNS.currSetBG = myNS.optionsBG[key];
        myNS.svg1.remove();
	main();
    });


}


function readOtherData() {
   
    d3.csv("Party_Month.csv", function(error,  data) {
	myNS.partyMonth = data;
	if (error) {
	    console.log(error);
	}
	else {
	    console.log("done1");
	}
    });
    
    d3.csv("Party_Month_State.csv", function(error, data) {
	myNS.partMonthState = data;
	if (error) {
	    console.log(error);
	}
	else {
	    console.log("done2");
	}
    });
    
    d3.csv("Total_Month_State.csv", function(error, data) {
	myNS.totalMonthState = data;
	if (error) {
	    console.log(error);
	}
	else {
	    console.log("done3");
	}
    });
    
    d3.csv("TotalSpending_Month_State.csv", function(error, data) {
	myNS.totalSpendingMonthState = data;
	if (error) {
	    console.log(error);
	}
	else {
	    console.log("done4");
	}
    });

    d3.csv("Cost_Month.csv", function(error, data) {
	myNS.costMonth = data;
	if (error) {
	    console.log(error);
	}
	else {
	    console.log("done5");
	}
    });
    
    d3.csv("Shows_Month.csv", function(error, data) {
	myNS.showsMonth = data;
	if (error) {
	    console.log(error);
	}
	else {
	    console.log("done6");
	    
	    myNS.optionsCHL = {
		"Tone": myNS.negMonthState,
		"Party": myNS.partyMonthState,
		"Total Ads": myNS.totalMontState,
		"Total Spending": myNS.totalSpendingMonthState
	    };
	    
	    myNS.optionsBG = {
		"Total per Issue": myNS.issueMonth,
		"Cost per Issue": myNS.costMonth,
		"Total per Party": myNS.partyMonth
	    };
	}
    });
    
}

	   
d3.csv("Issues_Month.csv", function(error, data) {
    myNS.issuesMonth = data;
    if (error) {
      console.log(error);
    }
    else {
      d3.csv("Negativity_Month_State.csv", function(error, data) {
	  myNS.negMonthState = data;
	  if (error) {
	      console.log(error);
	  }
	  else {
	      readOtherData();
	      main();
	  }
      });
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
