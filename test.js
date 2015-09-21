/**
 * Created by allan on 20/09/15.
 */
var BotanicalDuplication = require("./BotanicalDuplication.js")

var testList = [
    {id:1,v:2, v2: 9, v3: 2},
    {id:2,v:5, v2: 5, v3: 9},
    {id:3,v:7, v2: 9, v3: 9},
    {id:4,v:3, v2: 2, v3: 9},
    {id:5,v:6, v2: 9, v3: 9},
    {id:6,v:4, v2: 1, v3: 9},
    {id:7,v:8, v2: 9, v3: 9},
    {id:8,v:4, v2: 7, v3: 9},
    {id:9,v:3, v2: 9, v3: 9},
    {id:10,v:8, v2: 9, v3: 9},
    {id:11,v:3, v2: 2, v3: 9},
    {id:12,v:2, v2: 9, v3: 3},
    {id:13,v:0, v2: 9, v3: 9}]

var bd = new BotanicalDuplication()

function sim(r,r_){
    return r.v==r_.v || r.v==r_.v+1 || r.v==r_.v-1
}
function sim2(r,r_){
    return r.v2==r_.v2 || r.v2==r_.v2+1 || r.v2==r_.v2-1
}
function sim3(r,r_){
    return r.v3!=r_.v3
}

bd.config = {
    input: testList,
    id: "id",
    clusters: [
        {field:"v", similarity:sim},
        {field:"v2", similarity:sim2},
        {field:"v3", similarity:sim3}
    ]
}

console.log(bd.run())

