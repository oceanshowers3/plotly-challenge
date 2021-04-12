// create function to get data for all plots
function getPlot(id) {

    // get samples JSON data, then:
    d3.json("data/samples.json").then((data)=> {
        
        // get washing freq 
        var wFreq = data.metadata.map(freq => freq.wfreq)

        // filter the samples data by id 
        var samples = data.samples.filter(sample => sample.id.toString() === id)[0];
        
        // get data for top 10 samples; reverse order for Plotly
        var sampleValues = samples.sample_values.slice(0, 10).reverse();
        
        // get otu ids for top 10 samples; reverse order for Plotly
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        
        // format OTU ids
        var OTU_id = OTU_top.map(id => "OTU " + id)

        // get top 10 labels
        var labels = samples.otu_labels.slice(0, 10);

        // BAR CHART

        // create trace 
        var trace = {
            x: sampleValues,
            y: OTU_id,
            text: labels,
            marker: {
            color: 'rgb(3, 223, 252)'},
            type:"bar",
            orientation: "h",
        };

        // create data variable
        var data = [trace];

        // create layout 
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };

        // create bar chart
        Plotly.newPlot("bar", data, layout);
    
        // BUBBLE CHART

        // create trace
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels

        };

        // create layout
        var layout1 = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };

        // creating data variable 
        var data1 = [trace1];

        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout1); 

        // GAUGE CHART

        // create the gauge
        var dataGauge = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: parseFloat(wFreq),
            title: { text: `Weekly Washing Frequency` },
            type: "indicator",
            
            mode: "number+gauge",
            gauge: { axis: { range: [null, 9] },
                    steps: [
                        { range: [0, 2], color: "rgb(100, 247, 87)" },
                        { range: [2, 4], color: "rgb(69, 250, 52)" },
                        { range: [4, 6], color: "rgb(35, 230, 18)" },
                        { range: [6, 8], color: "rgb(19, 204, 2)" },
                        { range: [8, 9], color: "rgb(14, 150, 2)" },
                    ]}
                
        }
        ];
        var layoutGauge = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
        };
        Plotly.newPlot("gauge", dataGauge, layoutGauge);
    });
} 

// create function to get data
function getInfo(id) {
    // get samples JSON data, then:
    d3.json("data/samples.json").then((data)=> {
        
        // get metadata info for demographic box
        var metadata = data.metadata;

        // filter metadata by id
        var metaFilter = metadata.filter(data => data.id.toString() === id)[0];

        // reference the HTML element for metadata
        var demographicInfo = d3.select("#sample-metadata");
        
        // clear HTML (if there is any)
        demographicInfo.html("");

        // get demographic data and append to demographic box
        Object.entries(metaFilter).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// create function for change events
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// create function for initial dataset
function init() {
    // reference dropdown menu 
    var dropdown = d3.select("#selDataset");

    // get samples JSON data, then:
    d3.json("data/samples.json").then((data)=> {

        // get id data for dropdown options and append them
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call getPlot and getInfo and display on page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();