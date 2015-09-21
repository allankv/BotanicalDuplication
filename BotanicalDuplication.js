/**
 * Created by allan on 20/09/15.
 */
var events = require('events')

var id_
function BotanicalDuplication(){
    this.config = {}
    this.config.id = "id"
    this.clusters = []
    this.run = function(){
        id_ = this.config.id || this.id
        return runClusters(this.config)
    }
}
function runClusters(config){
    var clusterOutputs = []
    var currentInput
    config.clusters.forEach(function(cluster){
        console.time("Process "+cluster.field)
        if(clusterOutputs.length==0){
            currentInput = config.input
        }
        var currentOutput = []
        clusterOutputs.push(currentOutput)
        groupingBySimilarity(
            currentInput,
            cluster.similarity,
            cluster.field,
            config.id,
            function(output){
                clusterOutputs[clusterOutputs.length-1] = clusterOutputs[clusterOutputs.length-1].concat(output)
                currentInput = clusterOutputs[clusterOutputs.length-1]
            })
        console.timeEnd("Process " + cluster.field)
    })
    return clusterOutputs[clusterOutputs.length-1].reduce(removeDuplicatedGroups,[])
}
var count = 0
function groupingBySimilarity(input,similarity,field,id,callback){
    var isGroup = Array.isArray(input[0])
    if(isGroup == false) {
        var output = []
        input.forEach(function (record) {

            var existentGroup = false
            output.forEach(function (g) {
                if (g[0][field]== record[field]) {
                    existentGroup = true
                    return
                }
            })
            if (existentGroup == false) {
                addInASimilarGroup(record, input, output, similarity,id)
            }
        })
        callback(output.filter(filterGroupsWithNoDuplication))

    } else{
        input.forEach(function(group){
            groupingBySimilarity(group, similarity, field,id, callback)
        })
    }
}

function addInASimilarGroup(record,list,result,similarity,id){
    var group = []
    group.push(record)
    var add = false
    list.forEach(function(record_){
        if(record_[id] != record[id] && similarity(record,record_)){
            add = true
        }
        if(add){
            add = false
            group.push(record_)
        }
    })
    result.push(group)
}
function removeDuplicatedGroups(history, current){
    var equalsCountig = 0
    history.forEach(function(item){
        item.forEach(function(record){
            current.forEach(function(record_){
                if(record_[id_]==record[id_]){
                    equalsCountig++
                    return
                }
            })
        })
    })
    if(equalsCountig!=current.length)
        history.push(current)
    return history
}
function filterGroupsWithNoDuplication(group){
    return group.length>1
}

module.exports = BotanicalDuplication;