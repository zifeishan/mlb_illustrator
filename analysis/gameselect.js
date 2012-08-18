var gameyear = d3.select("#selyear");
var gameindex = d3.select("#selteam");
var gamerank = d3.select("#selrank");

gameyear.append("option")
    .text("Please select a year");

// for(var i = 1940; i < 2012; i++) {
for(var i = 2011; i >= 2000; i--) {
  gameyear
    .append("option")
    .attr("value", i).text(i);      
}
RefreshTeams();

gameyear.on("change", RefreshLayout);
gameyear.on("change", RefreshTeams);
gameindex.on("change", RefreshLayout);
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
  var t = document.getElementById("selteam");
  var team = t.options[t.selectedIndex].value;
  
  svg.remove(); 
  svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);
    
  d3.json("../data/games/"
    +(Div(year, 10)*10)+"seve/"+  //2010 2000 ...
    +year+team+".json", LayoutJson);

}


function RefreshTeams()
{
  // console.log("Here");
  var TeamCodes = d3.json("../data/teamcode.json",function(json){

    // console.log(json);
    if(!json)
      return;

    var y = document.getElementById("selyear");
    var year = y.options[y.selectedIndex].value;

    gameindex.selectAll("option").remove();

    gameindex.append("option")
    .text("Please select a team");


    for(var sub = 0; sub < json.teamcode.length; sub++)
    {
      var pair = json.teamcode[sub];

      for(var key in pair)
        // if(pair[key].end == "0")
      {
        //get some teams out
        if(pair[key].end != 0 && pair[key].end < year)
        {
          // console.log(pair[key].end);
          continue;
        }
        if(pair[key].begin > year)
          continue;
        var v = pair[key];
          gameindex
            .append("option")
            .attr("value", key)
            .text(key+" ("
              + (v.start != "0" ? v.start : "Unkn")
              + "--"
              + (v.end != "0" ? v.end : "Now." )
              + ") "
              + pair[key].name);
       }
    }
  });
}