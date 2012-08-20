var teamcodes = {};
var cardw = 200;
var cardh = 100;
var linew = 100;
var lineh = 50;
var offset = 5;

//initial: team codes
var TeamCodes = d3.json("../data/teamcode.json",function(json){

    // console.log(json);
    if(!json)
      return;

    for(var sub = 0; sub < json.teamcode.length; sub++)
    {
      var pair = json.teamcode[sub];

      for(var key in pair)
      {
        var v = pair[key];
        teamcodes[key] = v;
       }
    }
  });

function CreateCard(svg, d)
{
    // console.log(car);
    // console.log(svg.attr("width"));
    // console.log(d.y+cardh" vs "+svg.attr("height"));

    var x = d.x + offset + cardw < svg.attr("width") ? d.x + offset: d.x - cardw - offset;
    var y = d.y +offset + cardh < svg.attr("height") ? d.y +offset : d.y - cardh-offset;
    
    // console.log(d);
    svg.append("rect")
        .attr("class", "idcard")
        .attr("id", d.id)
        .attr("x", x)
        .attr("y", y)
        .attr("width", cardw)
        .attr("height", cardh)
        .attr("rx", 5)
        .attr("ry", 5)
        
        .style("fill","#ccffcc")
        .style("stroke","silver")
        .style("stroke-width",3)
        .style("fill-opacity",0.5)
        .style("stroke-opacity",0.7)
        ;

// <text x="10" y="20" style="fill:red;">Several lines:
//     <tspan x="10" y="45">First line</tspan>
//     <tspan x="10" y="70">Second line</tspan>
//   </text>

    var border = 20;
    var linespace = 20;
    var nowy = y + border - linespace;
    var nowx = x + border;

    if(!d.name) // is a TEAM
    {
        d.group = d.league;
        d.name = teamcodes[d.id].name;
    }
    var text = svg.append("text")
        .attr("class", "idcard")
        .attr("id", d.id)
        // .attr("textLength", 180)
        .attr("x", nowx)
        .attr("y", (nowy = nowy + linespace))
        .style("fill","black")
        .text("Name: "+d.name);
    if(teamcodes[d.group])
    {
        text.append("tspan")
            .attr("x", nowx)
            .attr("y", (nowy = nowy + linespace))
            .text("Team: " + teamcodes[d.group].name);
        text.append("tspan")
            .attr("x", nowx)
            .attr("y", (nowy = nowy + linespace))
            .text("League: " + teamcodes[d.group].league);
    }
    else if(d.league)
    {
        text.append("tspan")
            .attr("x", nowx)
            .attr("y", (nowy = nowy + linespace))
            .text("League: " + d.league);
    }

    var rad = Math.round(Radius[d.index]*100)/100;
    text.append("tspan")
        .attr("x", nowx)
        .attr("y", (nowy = nowy + linespace))
        .text("Rank Score(0-30): " + rad); 

        
}    

function DeleteCards(svg, d)
{
    //remove class: idcard ID: d.id
    svg.selectAll(".idcard#"+d.id).remove();   
}


function ShowLinkLabel(svg, d)
{

// label: "Home Run"
// source: Object
// target: Object
// type: "att"
// value: 0.5

// Multiple Edges? Select All!

    var from = d.source.id;
    var to = d.target.id;
    var type = d.type;


    var dx = (d.source.x + d.target.x)/2;
    var dy = (d.source.y + d.target.y)/2;

    var x = dx +offset+ cardw < svg.attr("width") ? dx +offset: dx - cardw-offset;
    var y = dy +offset+ cardh < svg.attr("height") ? dy +offset: dy - cardh-offset;
    var did = from+to+type;
    
    // console.log(d);
    svg.append("rect")
        .attr("class", "linkcard")
        .attr("id", did)
        .attr("x", x)
        .attr("y", y)
        .attr("width", linew)
        .attr("height", lineh)
        .attr("rx", 50)
        .attr("ry", 25)
        
        .style("fill", function(){
            if(d.type=="def") return "rgb(100, 220,255)";
            else return "rgb(255,220,100)";
            })
        .style("stroke","silver")
        .style("stroke-width",2)
        .style("fill-opacity",0.1)
        .style("stroke-opacity",0.7)
        ;

    var border = 15;
    var linespace = 15;
    var nowy = y + border - linespace;
    var nowx = x + border;

    var text = svg.append("text")
        .attr("class", "linkcard")
        .attr("id", did)
        // .attr("textLength", 180)
        .attr("x", nowx)
        .attr("y", (nowy = nowy + linespace))
        .style("fill", "black")
        .text(d.label);
    text.append("tspan")
        .attr("x", nowx)
        .attr("y", (nowy = nowy + linespace))
        .text("From: "+d.source.name);
    text.append("tspan")
        .attr("x", nowx)
        .attr("y", (nowy = nowy + linespace))
        .text("To: "+d.target.name);

}
function HideLinkLabel(svg, d)
{
    var from = d.source.id;
    var to = d.target.id;
    var type = d.type;
    var id = from+to+type
    svg.selectAll(".linkcard#"+id).remove();
}

function CreateSmallCard(svg, d)
{
    var x = d.x +offset;
    var y = d.y +offset;
    
    var border = -20;
    var linespace = 10;
    var nowy = y + border - linespace;
    var nowx = x + border;

    var text = svg.append("text")
        .attr("class", "smallcard")
        .attr("id", d.id)
        // .attr("textLength", 180)
        .attr("x", nowx)
        .attr("y", (nowy = nowy + linespace))
        .style("fill","black")
        .text(d.name);
    if(teamcodes[d.group])
    {
        text.append("tspan")
            .attr("x", nowx)
            .attr("y", (nowy = nowy + linespace))
            .text("Team: " + d.group);
    }
    var rad = Math.round(Radius[d.index]*100)/100;
    text.append("tspan")
        .attr("x", nowx)
        .attr("y", (nowy = nowy + linespace))
        .text("* " + rad); 

}


function DeleteSmallCards(svg, d)
{
    //remove class: idcard ID: d.id
    svg.selectAll(".smallcard#"+d.id).remove();   
}


var globalCoreCounter = 0;

// show all edges and neighbors of him
function ClickNode(svg, d)
{
    CancleSearch();
    myMap = linkMap;
    if(myMap == undefined || myMap.length == 0)
        myMap = [edgeMap];
    if(myMap == undefined || myMap.length == 0)
        return;
    
    if(globalCoreCounter > 0)
    {
        var wascore = d.core;
        CancleSelectNode(svg);
        if(wascore)
           return; 
    }

    // !core + !fixed: new core
    // core + !fixed: impossible
    // !core + fixed: associated
    // core + fixed: already core
    // if(!d.fixed && !d.core && globalCoreCounter == 0) //
    // {
    d.core = true;
    d.fixed = 1;
    globalCoreCounter++;
    console.log("++:"+globalCoreCounter);
    // CreateSmallCard(svg, d);

    for(var type = 0; type < myMap.length; type++)
        for(var subt in myMap[type][d.index])
        {
            var dt = nodes[subt];
            if(!dt.fixed)
            {
                dt.fixed = 1;
                // CreateSmallCard(svg, dt);
            }
        }

    for(var i = 0; i < nodes.length; i++)
        if(!nodes[i].fixed)
            nodes[i].opacity = 0.1;
        else
            nodes[i].opacity = 1;

    svg.selectAll("circle.node").style("fill-opacity", function(d){
      if(!d.opacity)
        return 1;
      return d.opacity;
    });
    svg.selectAll("line.link").style("opacity", function(d){
        var s = d.source;
        var t = d.target;
        if((!s.opacity || s.opacity == 1)
            &&  (!t.opacity || t.opacity == 1))
            return 1;
        else
            return 0.1;
    });


    // }
    // else if(d.fixed && d.core)
    // {
    //     CancleSelectNode(svg);
    // }
    
}

function CancleSelectNode(svg)
{
    globalCoreCounter--;
    console.log("--:"+globalCoreCounter);

    for(var i = 0; i < nodes.length; i++)
    {
            nodes[i].opacity = 1;
            nodes[i].core = false;
            nodes[i].fixed = 0;
    }

    svg.selectAll("circle.node").style("fill-opacity", 1);
    svg.selectAll("line.link").style("opacity", 1);


    // d.core = false;
    // d.fixed = 0;
    // // DeleteSmallCards(svg, d);

    // for(var type = 0; type < 2; type++)
    //     for(var subt in myMap[type][d.index])
    //     {
    //         var dt = nodes[subt];
    //         if(dt.fixed && !dt.core)
    //         {
    //             dt.fixed = 0;
    //             // DeleteSmallCards(svg, dt);
    //         }
    //     }

    // if(globalCoreCounter == 0)
    // {
    //     for(var i = 0; i < nodes.length; i++)
    //         nodes[i].opacity = 1;

    //     svg.selectAll("circle.node").style("fill-opacity", 1);
    //     svg.selectAll("line.link").style("opacity", 1);
    //   }
}
function Search(form)
{
    var text = form.searchname.value;
    console.log(text);
    if(!nodes)
        return;
    for(var i = 0; i < nodes.length; i++)
    {
        //contains
        if(nodes[i].name
             .toLowerCase()
             .indexOf(text.toLowerCase()) != -1) {
            // console.log(nodes[i].name
            //  .toLowerCase()
            //  .indexOf(text.toLowerCase()));
            CreateSmallCard(svg, nodes[i]);
        }
    }
}
function CancleSearch()
{
    svg.selectAll(".smallcard").remove();
}
function handleInput(d)
{
    console.log(d);
}
function checkEnter(e)
 {
     var key;      
     if(window.event)
          key = window.event.keyCode; //IE
     else
          key = e.which; //firefox      

     return (key != 13);
}
