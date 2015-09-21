/**
 * Created by allan on 21/09/15.
 */
var csv = require('fast-csv')
var fs = require('fs')
var dataset = []
function DatasetUtility(){

    this.inputFile
    this.outputFile
    this.map
    this.eligible
    this.count = 0
    this.limit = 2000000
    this.getDatasetFromDwCA = function(callback){
        console.time("Load")
        return run (this.map,this.eligible, this.limit, callback)
    }
}

function run(map, eligible, limit, callback){
    var count = 0
    fs.createReadStream("nybg.csv").pipe(csv(
        {delimiter:'\t',quote:null}
    )).on("data", function (line) {
        this.count++
        var record = map(line)
        if (eligible(record)){
            dataset.push(record)
            if(limit < count){
                this.emit("end")
            }
            count++
        }
    })
        .on("end", function () {
            console.timeEnd("Load")
            callback(dataset)
            this.emit("close")
        })
}
module.exports = DatasetUtility