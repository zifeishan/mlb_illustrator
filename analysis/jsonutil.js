// only add something useful
function AddNode(indexIdSub, nodesout, oldnode)
{
    if(indexIdSub[oldnode.id] == undefined)
    {
        var nodesub = nodesout.length;
        //append to last
        indexIdSub[oldnode.id] = nodesub;
        nodesout[nodesub] = oldnode;
        nodesout[nodesub].index = nodesub;
    }

}
function AddEdge(index_tmp, indexEdgeSub, linksout, oldlink)
{
    //aggregate edges?
    //def and att should be distincted!
    var os = oldlink.source;
    var ot = oldlink.target;
    var type = oldlink.type == "att" ? 0 : 1;
    var s = index_tmp[os];
    var t = index_tmp[ot];
    var linksub = linksout.length;
    // var tmp = t * 2 + type;
    var key = [s, [t, type]];
    // {s: {"t":t, "type":type}}
    if(indexEdgeSub[key])
    {
        var edgesub = indexEdgeSub[key];
        linksout[edgesub].value += oldlink.value;
    }
    else
    {
        indexEdgeSub[key] = linksub;
        linksout[linksub] = oldlink;
        linksout[linksub].source = s;
        linksout[linksub].target = t;
    }
    

}

function AggregateNodes(matches, nodesout, linksout)
{
    var indexIdSub = {};
    var indexEdgeSub = {};
    var linksub = 0;
    for(var i = 0; i < matches.length; i++)
    {

        // index in this match -> real index in nodesout
        var index_tmp = {};

        var match = matches[i];

        //nodes
        for(var j = 0; j < match.nodes.length; j++)
        {
            var id = match.nodes[j].id;
            AddNode(indexIdSub, nodesout, match.nodes[j]);
            index_tmp[j] = indexIdSub[id];
        }

        for(var j = 0; j < match.links.length; j++)
        {
            AddEdge(index_tmp, indexEdgeSub, linksout, match.links[j]);
        }
    }
}


function GetInDegrees(nodes, links)
{
    var indegree = new Array();
    for(var i = 0; i < nodes.length; i++) {
        indegree[i] = 0;
    }
    for(var i = 0; i < links.length; i++) {
        indegree[links[i].source.index]++;
    }
    return indegree;
}

function GetGameRanks(nodes, orilinks, beta)
{
    console.log(nodes);
    var n = nodes.length;
    // B, P
    var GR = [[], []];
    var links = [{}, {}];  //links[type][f][t] = w
        // links[0]: att edges
        // links[1]: def edges
    var nodenum = [0, 0];
    var danglings = [[], []];//sub of dang. node
    var totw = [{}, {}];  // total weighted indegree. totw[type][t] = w;
    

    //init links & danglings
    for(var i = 0; i < orilinks.length; i++)
    {
        // source is OBJECT modified by d3!!
        var f = orilinks[i].source.index;
        var t = orilinks[i].target.index;
        var w = orilinks[i].value;
        var type = (orilinks[i].type == "att") ? 0 : 1;
        // insert a link
        if(!links[type][f])
            links[type][f] = {};
        if(!links[type][f][t])
            links[type][f][t] = 0;
        links[type][f][t] += w;
        if(!totw[type][t])
            totw[type][t] = 0;
        totw[type][t] += w;
    }

    //guarantee: same!
    // for(var type = 0; type < 2; type++)
    // {
        
    //     for(var j = 0; j < n; j++)
    //     {
    //         var sum = 0;

    //         for(var i = 0; i < n; i++)

    //             if(links[type][i] && links[type][i][j])
    //             {
    //                 sum += links[type][i][j];
    //             }
    //         if(sum == 0)
    //             continue;
    //         console.log(sum - totw[type][j]);
    //     }
    // }

    //find danglings and totw
    for(var i = 0; i < n; i++) {
        for(var type = 0; type < 2; type++)
        {
            if(!links[type][i]) // no link
            {
                danglings[type].push(i);
            }
            else
            {
                nodenum[type]++;
            }
        }
    }
    // console.log(nodenum);

    for(var i = 0; i < n; i++) 
        for(var type = 0; type < 2; type++)
            GR[type][i] = 1.0 / n;

    // //init GR
    // for(var i = 0; i < n; i++) 
    //     for(var type = 0; type < 2; type++)
    //         GR[type][i] = 1.0 / nodenum[type];
    // // console.log(danglings);
    // for(var type = 0; type < 2; type++)
    //     for(var i = 0; i < danglings[type].length; i++)//sub
    //     {

    //         GR[type][danglings[type][i]] = 0.0;
    //     }
    //sum up to 1
    for(var type = 0; type < 2; type++)
    {
        var sum = 0.0;
        for(var i = 0; i < n; i++) 
            sum += GR[type][i];
        // console.log(sum);
    }
    // console.log(GR);

    //ITERATIONS
    var NewGR = [[],[]];
    for(var iternum = 0; iternum < 20; iternum++)
    {
        var maxdiff = [0.0, 0.0];   //maxdiff

        for(var type = 0; type < 2; type++)
        {
            //danglings
            //TODO: try only last time!
            var danGR = 0.0; //total dan GR
            for(var i = 0; i < danglings[type].length; i++)
            {
                var d = danglings[type][i];
                danGR += GR[1-type][d];
                // to all nodes!
            }
            console.log(danGR);

            for(var i = 0; i < n; i++) 
            {
                //TODO!!!!!!
                // NewGR[type][i] = danGR / n +
                //  beta* (1-danGR) / n; 
                NewGR[type][i] = 
                 beta / n; //
                 //dangling nodes!
                var tmpGR = 0.0;
                for(var j in links[type][i])
                {
                    var w = links[type][i][j];
                    if(!totw[type][j] || w > totw[type][j] || totw[type][j] == 0)
                    {
                        console.log("Err! "+w+" "+totw[type[j]]);
                        continue;
                    }
                    //according to weight
                    tmpGR += GR[1-type][j] * w / totw[type][j];
                    // console.log(NewGR[type][i]);
                }
                NewGR[type][i] += (1-beta) * tmpGR;
            }

        }

        for(var type = 0; type < 2; type++)
            //calc diff
            for(var i = 0; i < n; i++)
            {
                var diff = NewGR[type][i] - GR[type][i];
                if(diff < 0) diff = -diff;
                if(maxdiff[type] < diff)
                    maxdiff[type] = diff;

                //rolling
                GR[type][i] = NewGR[type][i];
                NewGR[type][i] = 0.0;
            }


        console.log("Iter "+iternum+", Diff: "+maxdiff[0]+", "+maxdiff[1]);
        console.log(GR);


        for(var t = 0; t < 2; t++)
        {var sum = 0;
        for(var i = 0; i < GR[t].length; i++)
            sum += GR[t][i];
        console.log("GRSUM: "+sum);
        }
        if(maxdiff[0] < 0.001 / n && maxdiff[1] < 0.001 / n)
            break;



    }
    return GR;
    
    
}

function Div(exp1, exp2)
{
    var n1 = Math.round(exp1); //四舍五入
    var n2 = Math.round(exp2); //四舍五入
    
    var rslt = n1 / n2; //除
    
    if (rslt >= 0)
    {
        rslt = Math.floor(rslt); //返回值为小于等于其数值参数的最大整数值。
    }
    else
    {
        rslt = Math.ceil(rslt); //返回值为大于等于其数字参数的最小整数。
    }
    
    return rslt;
}

function Normalize(array, minR, maxR)
{
  var max = 0;
  for(var i = 0; i < array.length; i++) 
    if(max < array[i])
        max = array[i];
    if(max == 0)
        return;

  for(var i = 0; i < array.length; i++) 
    array[i] = minR + (maxR - minR) * array[i] / max;
    
}

