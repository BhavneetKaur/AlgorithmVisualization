/*This code was referred from git repository: https://github.com/alexanderkatz/BST-Viz */
/*I had difficulty in implementing this code myself completely, hence 
there are very less changes made to the existing code. */

class Node {
    constructor(value) {
        this.value = value;
        this.children = []; // [null,null];
        // left child: children[0], right child: children[1] 
    }
}

/* BinarySearchTree
   The BinarySearchTree constructor sets the tree's root
   to the value passed into the constuctor. 
*/

class BinarySearchTree {
    constructor(value) {

        this.root = new Node(value);
    }

    /* insert */
    insert(value) {
            // create node from value
            var node = new Node(value);
            // if the tree's root is null, set the root to the new node
            if (this.root == null || this.root.value == null) {
                this.root = node;
            }

            var current = this.root;
            while (current) {
                // If tree contains value return
                if (Number(current.value) == Number(value)) {
                    return;
                }
                // value is less than current.value
                else if (Number(value) < Number(current.value)) {

                    if (current.children[0] == null || current.children[0].value == "e") {
                        current.children[0] = node;
                        if (current.children[1] == null) {
                            current.children[1] = new Node("e");
                        }
                        return;
                    }
                    // current = current.left;
                    current = current.children[0];
                }
                // value is greater than current.value
                else {
                    console.log("Right" + value);
                    if (current.children[1] == null || current.children[1].value == "e") {
                        if (!current.children[0]) {
                            current.children[0] = new Node("e");
                        }
                        current.children[1] = node;
                        return;
                    }
                    current = current.children[1];
                }
            }
        }
        /*End of Class*/
}

// Draw Tree
function drawTree(data) {

    /*This is done to re-build the tree everytime a new number is added*/
    d3.select("svg").remove();

    var margin = {
            top: 80,
            bottom: 80
        },
        width = 800,
        height = 400 - margin.top - margin.bottom;

    var svg = d3.select("body").append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", "0 0 800 600")
        .append("g")
        .attr("transform", "translate(0," + margin.top + ")");

    var i = 0,
        duration = 750,
        root;

    // Declares a tree layout and assigns the size
    var treemap = d3.tree().size([width, height]);

    // Assigns parent, children, height, depth
    root = d3.hierarchy(data, function(d) {
        return d.children;
    });

    root.x0 = width / 2;
    root.y0 = 0;

    // Collapse after the second level
    // root.children.forEach(collapse);

    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
        if (d.children) {
            d._children = d.children
            d._children.forEach(collapse)
            d.children = null;
        }
    }

    // Update
    function update(source) {
        // Assigns the x and y position for the nodes
        var treeData = treemap(root);

        // Compute the new tree layout.
        var nodes = treeData.descendants(),
            links = treeData.descendants().slice(1);

        // Normalize for fixed-depth
        nodes.forEach(function(d) {
            d.y = d.depth * 100
        });

        // **************** Nodes Section ****************

        // Update the nodes...
        var node = svg.selectAll('g.node')
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr("transform", function(d) {
                return "translate(" + source.x0 + "," + source.y0 + ")";
            })
            .on('click', click);

        // Add Circle for the nodes

        nodeEnter.append('circle')
            .attr('class', function(d) {
                if (isNaN(d.value)) {
                    return "node hidden";
                }
                return 'node';
            })
            .attr('r', 10)
            .style("fill", function(d) {
                return d._children ? "red" : "lightblue";
            });

        // Add labels for the nodes
        nodeEnter.append('text')
            .attr("dy", ".35em")
            .attr("x", function(d) {
                return d.children || d._children ? 0 : 0;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                if (isNaN(d.value)) {
                    return "";
                }
                return d.data.value;
            });

        // Update
        var nodeUpdate = nodeEnter.merge(node);

        // Transition to the proper position for the nodes
        nodeUpdate.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        // Update the node attributes and style
        nodeUpdate.select('circle.node')
            .attr('r', 20)
            .style("fill", function(d) {
                return d._children ? "red" : "lightblue";
            })
            .attr('cursor', 'pointer');

        // Remove any exiting nodes
        nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.x + "," + source.y + ")";
            })
            .remove();

        // On exit reduce the node circles size to 0
        nodeExit.select('circle')
            .attr('r', 10);

        // On exit reduce the opacity of text lables  
        nodeExit.select('text')
            .style('fill-opacity', 10)

        // **************** Links Section ****************

        // Update the links...
        var link = svg.selectAll('path.link')
            .data(links, function(d) {
                return d.id;
            });

        // Enter any new links at the parent's previous position
        var linkEnter = link.enter().insert('path', "g")
            .attr("class", function(d) {
                if (isNaN(d.value)) {
                    return "link hidden "
                }
                return "link";
            })

        .attr('d', function(d) {
            var o = {
                x: source.x0,
                y: source.y0
            };
            return diagonal(o, o);
        });

        // Update
        var linkUpdate = linkEnter.merge(link);


        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(duration)
            .attr('d', function(d) {
                return diagonal(d, d.parent)
            });

        // Remove any existing links
        var linkExit = link.exit().transition()
            .duration(duration)
            .attr('d', function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
            })
            .remove();

        // Store the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });


        // Create a curved (diagonal) path from parent to the child nodes
        function diagonal(s, d) {
            path = `M ${s.x} ${s.y}
        C ${(s.x + d.x) / 2} ${s.y},
          ${(s.x + d.x) / 2} ${d.y},
          ${d.x} ${d.y}`

            return path;
        }

        // Toggle children on click
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }

    }
}
var r;
var dataset = []
var tree = new BinarySearchTree();

/* Function to take user-defined numbers and insert into the
dataset to create the tree*/

function func1() {

    if (dataset === undefined || dataset.length == 0) {
        dataset.push(document.getElementById('myVal').value);
        tree = new BinarySearchTree(document.getElementById('myVal').value);
    } else {
        dataset.push(document.getElementById('myVal').value);
        tree.insert(document.getElementById('myVal').value);
    }
    drawTree(tree.root);
    document.getElementById("inp").innerHTML = "Insertion Order: " + dataset;
    document.getElementById('myVal').value = "";
    console.log(dataset);
}

/* Function to clear the svg to create a new tree*/
function myfunction() {
    dataset.length = 0;
    document.getElementById("inp").innerHTML = "Insertion Order: " + " ";
    d3.selectAll("svg").remove();
};