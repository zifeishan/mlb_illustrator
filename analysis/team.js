var width = 800,
    height = 500;
var color = d3.scale.category20();

var nodes, links, Radius, InDegrees, GR;
var node, link;
var stopped = false;
var force = d3.layout.force()
    .charge(-120)
    .linkDistance(50)
    .size([width, height])
    ;

var svg = d3.select("#chart").append("svg");

width = chart.offsetWidth;
height = chart.offsetHeight;
svg.attr("width", width);
svg.attr("height", height);
force.size([width, height]).start();

svg.remove();

//debug
// d3.json("../data/victory/victory2010.json", LayoutJson);
// d3.json("myjson.json", LayoutJson);

function LayoutJson(json) {

  if(json == undefined) {
    console.log(json);
    svg.remove();
    return;

  }
stopped = false;
  var gameindex = d3.select("#gameindex");
  // for(var i = 0; i < json.match.length; i++) {
  //   gameindex
  //     .append("option")
  //     .attr("value", i).text(i);
  //   }

  var allnodes = [], alllinks = [];
  var SelMatches = {"nodes":[], "links":[]};
  AggregateNodes([json], allnodes, alllinks);
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
    .friction(0.5)
    .gravity(0.15 * Math.sqrt(1+numNodes))
    .charge(-1000 * density)
    ;

  force
      .nodes(thisMatch.nodes)
      .links(thisMatch.links)
      .start();

  link = svg.selectAll("line.link")
      .data(thisMatch.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { 
        //debug: only show attack edges
        //DEBUG
        // if(d.type=="def") return 0;
        return Math.sqrt(d.value); 

      })
      // .style("stroke", function(d) { 
      //   if(d.type=="def") return "rgb(100, 220,255)";
      //   else return "rgb(255,220,100)";

      // })
      ;

  // functions for all nodes
  node = svg.selectAll("circle.node")
      .data(thisMatch.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .attr("x", width / 2 )
      .attr("y", height / 2 )
      // .style("fill", function(d) { return color(d.group); })
      .style("stroke", function(d){
        if(d.FP == 1) return "black";//pitcher
        else return "white";  //batter
      })
      .call(force.drag)
      // .append("text")
      // // .attr("dy", ".35em")
      // .attr("text-anchor", "middle")
      // .text(function(d){
      //   return d.label;
      // })
      ;

  
// node.transition()
//       .ease("bounce")
//       .duration(2000)
//       .style("width", "100%")
//       .style("background-color", "brown");
  
  // var circle = svg.selectAll("circle");

// <text dy=".35em" text-anchor="middle">293</text>
  // circle.data(thisMatch.nodes.name);

  // $('svg circle').tipsy({ 
  //   gravity: 'w', 
  //   html: true, 
  //   title: function() {
  //     var d = this.__data__, c = color(d.i);
  //     return 'Hi there! My color is <span style="color:' + c + '">' + c + '</span>'; 
  //   }
  // });

  //event handlers
  node.on("click", function(d){
    ClickNode(svg, d);
    
  });
  node.on("mouseover", function(d){
    CreateCard(svg, d);

  });
  node.on("mouseout", function(d){
    DeleteCards(svg, d);
  });  
  link.on("mouseover", function(d){
    // console.log(d);
    ShowLinkLabel(svg, d);

  });
  link.on("mouseout", function(d){
    HideLinkLabel(svg, d);
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
        force.stop();
        stopped = true;
    

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
  PR = GetPageRanks(nodes, links, 0.15);
    //one dimention PR!

  // Set Indegrees as Radius
  // for(var i = 0; i < nodes.length; i++)
  //     Radius[i] = InDegrees[i]*InDegrees[i];
  // Normalize(Radius, 0, 30);
  
  Normalize(PR, 0, 30);
  
  //Set PR as Radius
  for(var i = 0; i < nodes.length; i++) 
      Radius[i] = PR[i];
    

  var teamlabels = {};
  
  d3.json("../data/teamcode.json", function(json){
        var codes = json.teamcode;
        for(var i = 0; i < codes.length; i++)
        {
            for(var key in codes[i])
                teamlabels[key] = codes[i][key].name;
            // console.log(labels);
        }
        // node.append("title")
        //   .text(function(d) { 
        //     // console.log(teamlabels);
        //     // console.log(d.id);
        //     d.name = teamlabels[d.id];
        //     // console.log(d.name);
        //     return teamlabels[d.id] + Radius[d.index]; 
        //   });

    });
  // console.log(teamlabels);
  var minR = 99999, maxR = 0;
  for(var i = 0; i < nodes.length; i++) {
    if(Radius[i] < minR) minR = Radius[i];
    if(Radius[i] > maxR) maxR = Radius[i];
  }

  for(var i = 0; i < nodes.length; i++) {
    var p255 = (Radius[i] - minR) * 255 / (maxR - minR);

    d3.select(node[0][i])
      .attr("r", Radius[i])
      .attr("fill", d3.rgb(0, p255, 0));
  }
  // node.selectAll("title")
  //     .text(function(d) { return d.name + "0w0"+Radius[d.index]; 
  //     });

}

