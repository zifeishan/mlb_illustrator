var width = 800,
    height = 500;
var color = d3.scale.category20();

var nodes, links, Radius, InDegrees, GR;
var stopped = false;
var force = d3.layout.force()
    .charge(-120)
    .linkDistance(50)
    .size([width, height])
    ;

var svg = d3.select("#chart").append("svg")
width = chart.offsetWidth;
height = chart.offsetHeight;
svg.attr("width", width);
svg.attr("height", height);
force.size([width, height]).start();

svg.remove();

//debug
// d3.json("../data/games/2010seve/2010ANA.json", LayoutJson);
// d3.json("myjson.json", LayoutJson);
// d3.json("../data/games-year/2010.json", LayoutJson);

function LayoutJson(json) {

  if(json == undefined) {
    svg.remove();
    return;

  }

  var gameindex = d3.select("#gameindex");
  var match = [json];
  for(var i = 0; i < match.length; i++) {
    gameindex
      .append("option")
      .attr("value", i).text(i);
    }
  // console.log(gameindex[0]);
  // var matchID = gameindex.textContent;
  // if(matchID == "") matchID = 0;
  // var thisMatch = json.match[matchID];
  var allnodes = [], alllinks = [];
  var SelMatches = {"nodes":[], "links":[]};
  AggregateNodes(match, allnodes, alllinks);
  SelMatches.nodes = allnodes;
  SelMatches.links = alllinks;
  console.log(allnodes);
  console.log(alllinks);


  // var thisMatch = json.match[0];
  var thisMatch = SelMatches;

  var numNodes = thisMatch.nodes.length;
  var numEdges = thisMatch.links.length;
  var density = numEdges / (numNodes * numNodes + 1);
  force.linkDistance(3000 / Math.sqrt(1+numNodes) * density)
    .friction(0.7)
    .gravity(0.15 * Math.sqrt(1+numNodes))
    .charge(-70000 * density)
    ;

  force
      .nodes(thisMatch.nodes)
      .links(thisMatch.links)
      .start();

  var link = svg.selectAll("line.link")
      .data(thisMatch.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { 
        //debug: only show attack edges
        //DEBUG
        // if(d.type=="def") return 0;
        return Math.sqrt(d.value); 

      })
      .style("stroke", function(d) { 
        if(d.type=="def") return "rgb(100, 220,255)";
        else return "rgb(255,220,100)";

      });

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
  //TODO mite be reversed
  var running = true;
  document.onkeyup = function(d){
    console.log(d);
    if(d.keyCode == 187)  // -
      force.gravity(force.gravity()-0.1)
      .start();
      stopped = false;

    if(d.keyCode == 189)  // =
      force.gravity(force.gravity()+0.1)
      .start();
      stopped = false;

    if(d.keyCode == 13) // ENTER
      if(running) {
        force.stop();
        stopped = true;
        running = false;
      } else {
        // force.start();
        running = true;
      }
    //  if(d.keyCode == 188)  // ,
    //   force.linkDistance(force.linkDistance()-5 > 5? force.linkDistance()-5 : 5)
    //   ;

    // if(d.keyCode == 190)  // .
    //   force.linkDistance(force.linkDistance()+5)
    //   ;
     
  };  

  window.onresize = function(d) {
    width = chart.offsetWidth;
    height = chart.offsetHeight;
    svg.attr("width", width);
    svg.attr("height", height);
    force.size([width, height]).start();
    stopped = false;
  }

  // how to bind a OnChange to the select???
  // var lastTickGame = 0;
  force.on("tick", function() {
    if(stopped)
      force.stop();
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
  
  nodes = thisMatch.nodes;
  links = thisMatch.links;
  
  Radius = [];
  InDegrees = GetInDegrees(nodes, links);
  GR = GetGameRanks(nodes, links, 0.15);

  // //collect max GR
  // var max = [0, 0];
  // for(var i = 0; i < nodes.length; i++) 
  //   for(var t = 0; t < 2; t++)
  //     if(max[t] < GR[t][i]) 
  //       max[t] = GR[t][i];

  // console.log("MAX: ", max[0], max[1]);
  
  Normalize(GR[0], 0, 30);
  Normalize(GR[1], 0, 30);
  //Set GR as Radius
  for(var i = 0; i < nodes.length; i++) 
    if(nodes[i].FP == "1")//pitcher
      Radius[i] = GR[1][i];
    else
      Radius[i] = GR[0][i];
  // AdjustToY(Radius, 30);


  for(var i = 0; i < nodes.length; i++) {
    d3.select(node[0][i])
      .attr("r", Radius[i]);
    node.selectAll("title")
      .text(function(d) { return d.name + Radius[d.index]; 
      });
  }

}


//TODO STOPPED??