var gameyear = d3.select("#selyear");

// for(var i = 1940; i < 2012; i++) {
for(var i = 2010; i < 2012; i++) {
  gameyear
    .append("option")
    .attr("value", i).text(i);      
}

var gameindex = d3.select("#selteam");

d3.json("../data/teamcode.json",function(json){

  for(var sub in json.teamcode)
  {
    // console.log(json.teamcode[sub]);
    var pair = json.teamcode[sub];
    for(var key in pair)
      // if(pair[key].end == "0")
    {
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

gameyear.on("change", RefreshLayout);
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

