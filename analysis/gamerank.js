var width = 800,
    height = 500;
var color = d3.scale.category20();


var force = d3.layout.force()
    .charge(-120)
    .linkDistance(50)
    .size([width, height])
    ;

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);
svg.remove();
// d3.json("../data/2010ANA.EVA.json", LayoutJson);
// d3.json("myjson.json", LayoutJson);

function LayoutJson(json) {

  if(json == undefined) {
    svg.remove();
    return;

  }

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
  var nodes = new Array();
  var links = new Array();
  var SelMatches = {};
  SelMatches.nodes = nodes;
  SelMatches.links = links;
  AggregateNodes(json.match, nodes, links);
  console.log(nodes);
  console.log(links);


  // var thisMatch = json.match[0];
  var thisMatch = SelMatches;

  var numNodes = thisMatch.nodes.length;
  force.linkDistance(300 / Math.sqrt(1+numNodes))
    .friction(0.9)
    .gravity(0.03 * Math.sqrt(1+numNodes));
    ;

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
      .attr("x", width / 2 )
      .attr("y", height / 2 )
      .style("fill", function(d) { return color(d.group); })
      .style("stroke", function(d){
        if(d.FP == 1) return "black";//pitcher
        else return "white";  //batter
      })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.name; });

// node.transition()
//       .ease("bounce")
//       .duration(2000)
//       .style("width", "100%")
//       .style("background-color", "brown");

  //event handlers
  node.on("click", function(d){
    d.fixed = 1 - d.fixed;
  });
  node.on("mouseover", function(){
    // console.log("mouseover: "+this.getAttribute("style.color"));
    // var y = this.getAttribute("r");
    // y+=5;
    // console.log(y);
    // this.setAttribute("r", y);
    // this.setAttribute("style.color", "#green");
  });
  node.on("mouseout", function(){
    //this.
    // var y = this.getAttribute("r");
    // y-=5;
    // // console.log(d);
    // this.setAttribute("r", y);
  });  
  document.onkeyup = function(d){
    console.log(d);
    if(d.keyCode == 187)  // -
      force.gravity(force.gravity()-0.1)
      .start();

    if(d.keyCode == 189)  // =
      force.gravity(force.gravity()+0.1)
      .start();
     
  };  


  // how to bind a OnChange to the select???
  // var lastTickGame = 0;
  force.on("tick", function() {

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // node.attr("cx", function(d) { return d.x; })
    //     .attr("cy", function(d) { return d.y; });

    // have bounds

    node.attr("cx", function(d) { 
          var radius = Radius[d.index];
          // parseInt(d.r) + 1;
          
          return d.x = Math.max(radius, Math.min(width - radius, d.x)); }
          )
        .attr("cy", function(d) { 
          var radius = Radius[d.index];
          // console.log(radius);
          //parseInt(d.r) + 1;
          // console.log(d.r);
          return d.y = Math.max(radius, Math.min(height - radius, d.y)); }
          );

        //TODO
    // var game = gameindex.data;
    //   if(game != lastTickGame)
    //     LayoutJson(json);


  });

  //Calc Radius (using Indegree)
  
  var nodes = thisMatch.nodes;
  var links = thisMatch.links;
  var Radius = GetInDegrees(nodes, links);
  
  for(var i = 0; i < nodes.length; i++)
    Radius[i] = 5*Math.sqrt(1+Radius[i]);

  for(var i = 0; i < nodes.length; i++) {
    d3.select(node[0][i])
      .attr("r", Radius[i]);
      // console.log(Radius[i]);
  }

}
