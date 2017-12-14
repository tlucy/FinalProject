/*
  Authors: Tom Lucy & Duncan
  Date: 12/15/17

  This is the CSS file for the home page.
  
  The Bar Graph and Chloropleth examples we used were from Murray's D3 
  book.
*/


// namespace
myNS = {};

myNS.svg1;
myNS.svg2;

myNS.wBG = 470;      // of SVG
myNS.hBG = 430;
myNS.wCHL = 750;
myNS.hCHL = 600;     // of SVG
myNS.p= 90;      // padding of graph from svg edges; leave room for labels

myNS.json = "us-states.json";

// both parties
myNS.issuesMonth;
myNS.negMonthState;
myNS.costMonth;
myNS.partyMonth;
myNS.partyMonthState;
myNS.showsMonth;
myNS.totalMonthState;
myNS.totalSpendingMonthState;

// republican
myNS.repubCostMonth;
myNS.repubIssuesMonth;
myNS.repubNegMonthState;
myNS.repubShowsMonth;
myNS.repubSpendingMonthState;
myNS.repubTotalMonthState;
myNS.repubPartyMonth;
myNS.repubPartyMonthState;

// democrat
myNS.demoCostMonth;
myNS.demoIssuesMonth;
myNS.demoNegMonthState;
myNS.demoShowsMonth;
myNS.demoSpendingMonthState;
myNS.demoTotalMonthState;
myNS.demoPartyMonth;
myNS.demoPartyMonthState;

// current settings
myNS.currSetBG;
myNS.currSetCHL;

// make selection only run once
myNS.count = 0;

// scales
myNS.x;
myNS.y;
myNS.color;

// color settings
myNS.lowColor = "#c76706";
myNS.highColor = "white";
myNS.rectColor = "#c76706";

// for chloropleth
myNS.projection;
myNS.path;

// for legend
myNS.legendWidth = 200;
myNS.divisions = 100;

// slider dates
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

// data load counter
myNS.loadCounter = 0;


// which parties are showing
myNS.partyShow = "uninitialized";

myNS.currOptions;

myNS.check = true;

//Keeps track of current key for variable visibility
myNS.currKeyCHL = "Ad Tone";
myNS.currKeyBG = "Total Ads per Issue";

//Keeps track of which party is being shown
myNS.party = {
    "both": "both parties",
    "rep": "the Republican party",
    "dem": "the Democratic party"
};


function main () {
    
    console.log(myNS.currSetBG);
    console.log(myNS.currSetCHL);

    myNS.svg1 = makeSVG("BG");
    myNS.svg2 = makeSVG("CHL");

    animate();
    sliderDisplay();
    selection();
    buttonListener();
}

//This function makes the scales.
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

//Makes the bar graph through helper functions
function makeBG(value) {
    makeScales(value);
    makeAndLabelBars(value);
    makeAxes(value);
}

//Actually makes and labels the bars in the bar graph
function makeAndLabelBars (value) {
    var barPadding = 1;     
    var labelyoffset = 0; 
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
	.attr("fill", myNS.rectColor);
}

//Makes the axis for the bar graph
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

//Makes an svg in the given id space, one for the BG, and one for the
//chloropleth
function makeSVG (id) {

    if (id == "BG") {
	var svg = d3.select("body")
	    .append("svg")
	    .attr("id", id)
	    .attr("width", myNS.wBG)
	    .attr("height", myNS.hBG);
	
	return svg
    }
    else if (id == "CHL") {
	var svg = d3.select("body")
	    .append("svg")
	    .attr("id", id)
	    .attr("width", myNS.wCHL)
	    .attr("height", myNS.hCHL);
	
	return svg;
    } 
}

//Makes the chloropleth with the helper function
function makeCHL(value) {
    makeHelpers(value);

    makeMap(value);

    makeLegend();
}

//Makes the three pillars of the chloropleth, that it needs
function makeHelpers(value) {

    myNS.projection = d3.geoAlbersUsa()
	.scale([myNS.wCHL]);
    
    myNS.path = d3.geoPath()
	.projection(myNS.projection);
    
    myNS.color = d3.scaleLinear()
	.domain([d3.min(myNS.currSetCHL,function(d) {

                    return parseFloat(getMonthVal(d, value))}),
		d3.max(myNS.currSetCHL,function(d) {
                    return parseFloat(getMonthVal(d, value))})
		])
	.range([myNS.lowColor, myNS.highColor]);
}

//Makes the legend for the chloropleth using a color scale, and the 
//rect at the bottom of the map
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
        .range([myNS.lowColor, myNS.highColor]);
    
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

//Converts a month value into the dataset objects value for that month
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

//Makes and colors the chloropleth based on the values in the csv file
//passed in earlier
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

//Changes the month using a timer and an interval to give the appearence
//of a change of time. It uses the slider in the html to determine the 
//current date, and will move the slider appropriately
function animate() {
    d3.select("#animate")
	.on("click", function() {
	    var slider = document.getElementById("myRange");
	    var val = 0;
	    var id = setInterval(frame, 1000);
	    var date = d3.select("#date");
	    function frame() {
		if (val >= 25) {
		    clearInterval(id);
		}
		else
		{
		    val = val + 1;
		    slider.value = val;
		    makeCHL("value" + slider.value);
		    makeBG("value" + slider.value);
		    date.text(myNS.dates[slider.value]);
		}
	    }
	}
    );
}

//Gets the slider, and allows the value to be changed by slider moving
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

//Sets the current colors and datasets based on what party is being
//looked at as well as what variables are being looked at
function setCurrs() {

    if (myNS.partyShow == "rep") {
        myNS.currSetCHL = myNS.optionsRepCHL[myNS.currKeyCHL];
        myNS.currSetBG = myNS.optionsRepBG[myNS.currKeyBG];
	myNS.rectColor = "#e91d0e";
	if (myNS.currKeyCHL == "Ad Tone") {
          myNS.lowColor = "#e91d0e";
          myNS.highColor = "white";
        }
        else {
          myNS.lowColor = "white";
          myNS.highColor = "#e91d0e";
        }
    }
    if (myNS.partyShow == "dem") {
        myNS.currSetCHL = myNS.optionsDemCHL[myNS.currKeyCHL];
        myNS.currSetBG = myNS.optionsDemBG[myNS.currKeyBG];
	myNS.rectColor = "#00a6ef";
	if (myNS.currKeyCHL == "Ad Tone") {
 	  myNS.lowColor = "#00a6ef";
	  myNS.highColor = "white";
        }
        else {
	  myNS.lowColor = "white";
          myNS.highColor = "#00a6ef";
	}
    }
    if (myNS.partyShow == "both") {
	myNS.currSetBG = myNS.optionsBG[myNS.currKeyBG];
	myNS.currSetCHL = myNS.optionsCHL[myNS.currKeyCHL];
	myNS.rectColor = "#c76706";
	if (myNS.currKeyCHL == "Ad Tone") {
            myNS.lowColor = "#c76706";
            myNS.highColor = "white";
        }
        else if (myNS.currKeyCHL == "Distribution by Party") {
	    myNS.rectColor = "purple";
            myNS.lowColor = "#00a6ef";
            myNS.highColor = "#e91d0e";
        }
        else {
            myNS.lowColor = "white";
            myNS.highColor = "#c76706";
        }
    }
}

//This function deals with reading the html select chunk and setting the
//current variables to the right databases. It also determines what party
//is being showed and colors things appropriately. Essentially, this 
//function deals with updates to the interactivity
function selection() {

    myNS.count = 1;

    // selecting by html ids                                                   
    var chlMenu = d3.select("#controlsCHL");
    var bgMenu = d3.select("#controlsBG");

    // set initial drop down items                                             
    document.getElementById("CHLmetric").value = "Ad Tone";
    document.getElementById("BGmetric").value = "Total Ads per Issue";
    

    setCurrs();

    // update plot if new values are chosen                                    
    d3.select("#controlsCHL").on("change", function() {
	myNS.currOptions = myNS.optionsCHL;
	myNS.currKeyCHL = this.value;
        var key = this.value;
	console.log(key);
	myNS.currSetCHL = myNS.currOptions[key];
        myNS.svg2.remove();
	myNS.svg1.remove();
	setCurrs();
	main();
	
 	var descrip = document.getElementById("chlSelect");
	var textNode = this.value;
	descrip.innerHTML = textNode;
    });
    
    // update plot if new values are chosen                                    
    d3.select("#controlsBG").on("change", function() {
	myNS.currOptions = myNS.optionsBG;
	myNS.currKeyBG = this.value;
        var key = this.value;
	console.log(key);
	myNS.currSetBG = myNS.currOptions[key];
	myNS.svg2.remove();
        myNS.svg1.remove();
	setCurrs();
	main();
	
	var descrip = document.getElementById("bgSelect");
	var textNode = this.value;
	descrip.innerHTML = textNode;
    });


}

//Reads the rest of the data from the csvs and keeps track of things
function readOtherData() {
   
    d3.csv("Party_Month.csv", function(error,  data) {
	myNS.partyMonth = data;
	if (error) {
	    console.log(error);
	}
	else {
	    console.log("done1");
	    myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });
    
    d3.csv("Party_Month_State.csv", function(error, data) {
	myNS.partyMonthState = data;
	if (error) {
	    console.log(error);
	}
	else {
	    console.log("done2");
	    myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });
    
    d3.csv("Total_Month_State.csv", function(error, data) {
	myNS.totalMonthState = data;
	if (error) {
	    console.log(error);
	}
	else {
	    console.log("done3");
	    myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });
    
    d3.csv("TotalSpending_Month_State.csv", function(error, data) {
	myNS.totalSpendingMonthState = data;
	if (error) {
	    console.log(error);
	}
	else {
	    console.log("done4");
	    myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("Cost_Month.csv", function(error, data) {
	myNS.costMonth = data;
	if (error) {
	    console.log(error);
	}
	else {
	    console.log("done5");
	    myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });
    
    d3.csv("Shows_Month.csv", function(error, data) {
	myNS.showsMonth = data;
	if (error) {
	    console.log(error);
	}
	else {
	    console.log("done6");
	    myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("repubCostMonthState.csv", function(error, data) {
        myNS.repubCostMonth = data;
        if (error) {
            console.log(error);
        }
        else {
            console.log("done7");
            myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("repubIssuesMonth.csv", function(error, data) {
        myNS.repubIssuesMonth = data;
        if (error) {
            console.log(error);
        }
        else {
            console.log("done8");
            myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("repubNegMonth.csv", function(error, data) {
        myNS.repubNegMonthState = data;
        if (error) {
            console.log(error);
        }
        else {
            console.log("done9");
            myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("repubShowsMonth.csv", function(error, data) {
        myNS.repubShowsMonth = data;
        if (error) {
            console.log(error);
        }
        else {
            console.log("done10");
            myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("repubSpendingMonthState.csv", function(error, data) {
        myNS.repubSpendingMonthState = data;
        if (error) {
            console.log(error);
        }
        else {
            console.log("done11");
            myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("repubTotalMonthState.csv", function(error, data) {
        myNS.repubTotalMonthState = data;
        if (error) {
            console.log(error);
        }
        else {
            console.log("done12");
            myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("demoCostMonth.csv", function(error, data) {
        myNS.demoCostMonth = data;
        if (error) {
            console.log(error);
        }
        else {
            console.log("done13");
            myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("demoIssuesMonth.csv", function(error, data) {
        myNS.demoIssuesMonth = data;
        if (error) {
            console.log(error);
        }
        else {
            console.log("done14");
            myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("demoNegMonthState.csv", function(error, data) {
        myNS.demoNegMonthState = data;
        if (error) {
            console.log(error);
        }
        else {
            console.log("done15");
            myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("demoShowsMonth.csv", function(error, data) {
        myNS.demoShowsMonth = data;
        if (error) {
            console.log(error);
        }
        else {
            console.log("done16");
            myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("demoSpendingMonthState.csv", function(error, data) {
        myNS.demoSpendingMonthState = data;
        if (error) {
            console.log(error);
        }
        else {
            console.log("done17");
            myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("demoTotalMonthState.csv", function(error, data) {
        myNS.demoTotalMonthState = data;
        if (error) {
            console.log(error);
        }
        else {
            console.log("done18");
            myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("repubPartyMonth.csv", function(error, data) {
        myNS.repubPartyMonth = data;
        if (error) {
            console.log(error);
        }
        else {
            console.log("done19");
            myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("demoPartyMonth.csv", function(error, data) {
        myNS.demoPartyMonth = data;
        if (error) {
            console.log(error);
        }
        else {
            console.log("done20");
            myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("repubPartyMonthState.csv", function(error, data) {
        myNS.repubPartyMonthState = data;
        if (error) {
            console.log(error);
        }
        else {
            console.log("done21");
            myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

    d3.csv("demoPartyMonthState.csv", function(error, data) {
        myNS.demoPartyMonthState = data;
        if (error) {
            console.log(error);
        }
        else {
            console.log("done22");
            myNS.loadCounter++;
	    if (myNS.loadCounter == 22) {
		loadOptions();
	    }
	}
    });

}

//Loads all of the dataset options. This occurs after the datasets 
//are loaded in, and they need to be partitioned into sections
function loadOptions() {

    myNS.optionsCHL = {
        "Ad Tone": myNS.negMonthState,
        "Distribution by Party": myNS.partyMonthState,
        "Total Ads": myNS.totalMonthState,
        "Total Spending": myNS.totalSpendingMonthState
    };
    
    myNS.optionsBG = {
        "Total Ads per Issue": myNS.issuesMonth,
        "Frequency of Ad Cost": myNS.costMonth,
        "Total Ads per Party": myNS.partyMonth,
        "Total Ads per TV Genre": myNS.showsMonth
    };

    myNS.optionsDemCHL = {
        "Ad Tone": myNS.demoNegMonthState,
        "Distribution by Party": myNS.demoPartyMonthState,
        "Total Ads": myNS.demoTotalMonthState,
        "Total Spending": myNS.demoSpendingMonthState
    };
    
    myNS.optionsDemBG = {
        "Total Ads per Issue": myNS.demoIssuesMonth,
        "Frequency of Ad Cost": myNS.demoCostMonth,
        "Total Ads per Party": myNS.demoPartyMonth,
        "Total Ads per TV Genre": myNS.demoShowsMonth	
    };
    
    myNS.optionsRepCHL = {
        "Ad Tone": myNS.repubNegMonthState,
        "Distribution by Party": myNS.repubPartyMonthState,
        "Total Ads": myNS.repubTotalMonthState,
        "Total Spending": myNS.repubSpendingMonthState
    };
    
    myNS.optionsRepBG = {
        "Total Ads per Issue": myNS.repubIssuesMonth,
        "Frequency of Ad Cost": myNS.repubCostMonth,
        "Total Ads per Party": myNS.repubPartyMonth,
        "Total Ads per TV Genre": myNS.repubShowsMonth
    };

    myNS.check = false;
}

//Listens to the html party buttons to change what is being shown.
function buttonListener() {

    d3.select("#both").on("click", function() {
	myNS.partyShow = "both";
	myNS.svg1.remove();
	myNS.svg2.remove();
	selection();
	main();

	var descrip2 = document.getElementById("party");
	var textNode2 = myNS.party[myNS.partyShow];
	descrip2.innerHTML = textNode2;
	});

     d3.select("#democrat").on("click", function() {
         myNS.partyShow = "dem";
	 myNS.svg1.remove();
	 myNS.svg2.remove();
	 selection();
	 main();
	
	 var descrip2 = document.getElementById("party");
	 var textNode2 = myNS.party[myNS.partyShow];
	 descrip2.innerHTML = textNode2;
     });

     d3.select("#republican").on("click", function() {
         myNS.partyShow = "rep";
	 myNS.svg1.remove();
	 myNS.svg2.remove();
	 selection();
	 main();
	 
	 var descrip2 = document.getElementById("party");
	 var textNode2 = myNS.party[myNS.partyShow];
	 descrip2.innerHTML = textNode2;
     });

}

//Reads the first dataset and then calls the function to read in the rest
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
	      myNS.currSetCHL = myNS.negMonthState;
	      myNS.currSetBG = myNS.issuesMonth;
	      readOtherData();
	      main();
	  }
      });
    }
});
