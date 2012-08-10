var width = 960,
    height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(50)
    .size([width, height]);

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("../data/testall.json", LayoutJson);
// d3.json("myjson.json", LayoutJson);

function LayoutJson(json) {

  // We have to aggregate the index...
  // var allnodes = new Array();
  // var alllinks = new Array();

  // var counter
  // for(var i = 0; i < match.length; i++)
  //     allnodes.

  var gameindex = d3.select("#gameindex");
  for(var i = 0; i < json.match.length; i++) {
    gameindex
      .append("option")
      .attr("value", i).text(i);
    }
  // console.log(gameindex[0]);
  // var matchID = gameindex.textContent;
  // if(matchID == "") matchID = 0;
  // var thisMatch = json.match[matchID];
  var thisMatch = json.match[0];

  force
      .nodes(thisMatch.nodes)
      .links(thisMatch.links)
      .start();

  var link = svg.selectAll("line.link")
      .data(thisMatch.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  // functions for all nodes
  var node = svg.selectAll("circle.node")
      .data(thisMatch.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.name; });


  // how to bind a OnChange to the select???
  // var lastTickGame = 0;
  force.on("tick", function() {

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

        //TODO
    // var game = gameindex.data;
    //   if(game != lastTickGame)
    //     LayoutJson(json);


  });
  
  //customized functions
  var nodes = thisMatch.nodes;
  var indegrees = new Array();

// console.log("nodes:"+nodes.length);
  for(var i = 0; i < nodes.length; i++) {
    indegrees[i] = 0;
  }
  var links = thisMatch.links;
// console.log(thisMatch.links);
  for(var i = 0; i < links.length; i++) {
    indegrees[links[i].source.index]++; //source is an node OBJECT?!
// console.log(links[i].source);
  }

  for(var i = 0; i < nodes.length; i++) {
    d3.select(node[0][i])
      .attr("r", 5*Math.sqrt(1+indegrees[i]));
      // console.log(indegrees[i]);
  }

}
