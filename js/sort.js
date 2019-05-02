/*This code was referred from
 https://bl.ocks.org/alexmacy/770f14e11594623320db1270361331dc
 for implementation purpose*/

/*Variable declaration*/
var dataset = []
var data = []
var rects, labels;
var durationTime = 2000,
    unsortedArray = [],
    sortedArray = [],
    stop = false,
    steps = 0,
    bogoShuffles = 0,
    x, y;


/*Function to take user-defined numbers and create the dataset*/
function func1() {
    var z = document.getElementById('myVal').value;
    dataset.push(z);
    document.getElementById('myVal').value = "";
    document.getElementById("un-output").innerHTML = "Unsorted Array: " + dataset;
    data = dataset;

}

/*Function to create the bar chart according to the dataset entered*/
function createBarChart() {

    d3.select("svg").remove();
    unsortedArray = [...dataset];

    var margin = { top: 40, right: 40, bottom: 180, left: 250 },
        width = 960 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var barWidth = 40;

    y = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([0, 400]);

    var svg = d3.select("body").append("div").style("text-align", "center").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left * 1.5 + "," + margin.top * 1.5 + ")")

    /*Create the bars according to the dataset*/
    rects = svg.selectAll("rect")
        .data(unsortedArray)
        .enter().append("rect")
        .attr("id", function(d) { return "rect" + d })
        .attr("transform", function(d, i) { return "translate(" + (y(i) - barWidth) + ",0)" })
        .attr("height", function(d, i) { return (d * 10) })
        .attr("width", 40)
        .attr("y", function(d, i) { return 150 - (d * 10) });

    /*Assign labels to the dataset*/
    labels = svg.selectAll("text")
        .data(unsortedArray)
        .enter().append("text")
        .attr("id", function(d) { return "text" + d })
        .attr("transform", function(d, i) { return "translate(" + (y(i) - 40) + ",0)" })
        .text(function(d) { return d; })
        .attr("y", function(d, i) { return 145 - (d * 10) });


}

/*Function to reset the bars to their original unsorted array*/
function reset() {
    document.getElementById("sort-output").innerHTML = "Sorted Array: ";
    unsortedArray = [...data];
    sortedArray = [];
    stop = false;

    d3.select("#counter").html(steps = 0)

    labels.attr("class", "")
        .transition().duration(200)
        .attr("transform", function(d, i) { return "translate(" + (y(i - 1)) + ", 0)" })

    rects.attr("class", "")
        .transition().duration(200)
        .attr("transform", function(d, i) { return "translate(" + (y(i - 1)) + ", 0)" })
}

/*Function to sort the data according to the bubble sort logic 
in ascending order*/
function bubbleSort() {
    document.getElementById("sort-output").innerHTML = "Sorted Array: " + dataset.sort((a, b) => a - b);

    function sortPass(i) {
        if (!unsortedArray.length || stop) return;

        if (i <= unsortedArray.length) {
            if (Number(unsortedArray[i]) <= Number(unsortedArray[i - 1])) {

                d3.select("#rect" + unsortedArray[i]).attr("class", "testing")
                d3.select("#rect" + unsortedArray[i - 1]).attr("class", "testing")

                d3.timeout(function() {
                    d3.select("#rect" + unsortedArray[i]).attr("class", "")
                    d3.select("#rect" + unsortedArray[i - 1]).attr("class", "")
                }, durationTime);

                var temp = unsortedArray[i - 1];
                unsortedArray[i - 1] = unsortedArray[i];
                unsortedArray[i] = temp;

                slide(unsortedArray[i], i + sortedArray);
                slide(unsortedArray[i - 1], i - 1 + sortedArray);

                d3.select("#counter").html(++steps);

                d3.timeout(function() { return sortPass(++i) }, durationTime);

            } else if (i == unsortedArray.length) {

                for (n = i; n == unsortedArray[n - 1]; n--) {
                    d3.select("#text" + n).attr("class", "sorted")
                    unsortedArray.pop();
                }

                sortPass(++i);
            } else {
                sortPass(++i);
            }

        } else {
            bubbleSort();
        }
    }
    sortPass(1);
}

/*Function to sort the data according to the bubble sort logic 
in descending order*/
function descSort() {
    document.getElementById("sort-output").innerHTML = "Sorted Array: " + dataset.sort((a, b) => -(a - b));

    function sortPass(i) {
        if (!unsortedArray.length || stop) return;

        if (i <= unsortedArray.length) {
            if (Number(unsortedArray[i]) > Number(unsortedArray[i - 1])) {

                d3.select("#rect" + unsortedArray[i]).attr("class", "testing")
                d3.select("#rect" + unsortedArray[i - 1]).attr("class", "testing")

                d3.timeout(function() {
                    d3.select("#rect" + unsortedArray[i]).attr("class", "")
                    d3.select("#rect" + unsortedArray[i - 1]).attr("class", "")
                }, durationTime);

                var temp = unsortedArray[i - 1];
                unsortedArray[i - 1] = unsortedArray[i];
                unsortedArray[i] = temp;

                slide(unsortedArray[i], i + sortedArray);
                slide(unsortedArray[i - 1], i - 1 + sortedArray);

                d3.select("#counter").html(++steps);

                d3.timeout(function() { return sortPass(++i) }, durationTime);

            } else if (i == unsortedArray.length) {

                for (n = i; n == unsortedArray[n - 1]; n--) {
                    d3.select("#text" + n).attr("class", "sorted")
                    unsortedArray.pop();
                }

                sortPass(++i);
            } else {
                sortPass(++i);
            }

        } else {
            descSort();
        }
    }
    sortPass(1);
}

/*Function to move the bars around for swapping*/
function slide(d, i) {
    d3.select("#text" + d)
        .transition().duration(durationTime)
        .attr("transform", function(d) { return "translate(" + (y(i - 1)) + ", 0)" })

    d3.select("#rect" + d)
        .transition().duration(durationTime)
        .attr("transform", function(d) { return "translate(" + (y(i - 1)) + ", 0)" })
}