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
    var os = oldlink.source;
    var ot = oldlink.target;
    var s = index_tmp[os];
    var t = index_tmp[ot];
    var linksub = linksout.length;
    if(indexEdgeSub[(s,t)])
    {
        var edgesub = indexEdgeSub[(s,t)];
        linksout[edgesub].value += oldlink.value;
    }
    else
    {
        indexEdgeSub[(s,t)] = linksub;
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