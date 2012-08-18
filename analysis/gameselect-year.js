var gameyear = d3.select("#selyear");
//var gameindex = d3.select("#selteam");
var gamerank = d3.select("#selrank");

// for(var i = 1940; i < 2012; i++) {
gameyear.append("option")
    .text("Please select a year");

for(var i = 2011; i >= 1980; i--) {
  gameyear
    .append("option")
    .attr("value", i).text(i);      
}
// RefreshTeams();

gameyear.on("change", RefreshLayout);
// gameyear.on("change", RefreshTeams);
//gameindex.on("change", RefreshLayout);
gamerank.on("change", RefreshSize);

function RefreshSize() {
  if(!nodes)
    return;
  var y = document.getElementById("selrank");
  var rankby = y.options[y.selectedIndex].value;
  if(rankby == "GameRank")
  {
      for(var i = 0; i < nodes.length; i++) 
        if(nodes[i].FP == "1")//pitcher
          Radius[i] = GR[1][i];
        else
          Radius[i] = GR[0][i];
  }
  else
  {
      // Set Indegrees as Radius
      for(var i = 0; i < nodes.length; i++)
          Radius[i] = Math.sqrt(InDegrees[i]);
      Normalize(Radius, 0, 30);
  }
  for(var i = 0; i < nodes.length; i++) {
    var node = svg.selectAll("circle.node");
    d3.select(node[0][i])
      .attr("r", Radius[i]);
    node.selectAll("title")
      .text(function(d) { return d.name + Radius[d.index]; 
      });
  }
  
}
function RefreshLayout() {
  var y = document.getElementById("selyear");
  var year = y.options[y.selectedIndex].value;
  
  svg.remove(); 
  svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);
    
  d3.json("../data/games-year/"
    +year+".json", LayoutJson);

}
