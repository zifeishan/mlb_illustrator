var gameyear = d3.select("#selyear");
var gameindex = d3.select("#selteam");

// for(var i = 1940; i < 2012; i++) {
for(var i = 2010; i < 2012; i++) {
  gameyear
    .append("option")
    .attr("value", i).text(i);      
}
RefreshTeams();

gameyear.on("change", RefreshLayout);
gameyear.on("change", RefreshTeams);
gameindex.on("change", RefreshLayout);

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
  var TeamCodes = d3.json("../data/teamcode.json",function(json){

    var y = document.getElementById("selyear");
    var year = y.options[y.selectedIndex].value;

    for(var sub in json.teamcode)
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
        if(pair[key].begin != 0 && pair[key].begin < year)
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