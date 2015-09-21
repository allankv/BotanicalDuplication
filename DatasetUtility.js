/**
 * Created by allan on 21/09/15.
 */
var csv = require('fast-csv')
var fs = require('fs')
function DatasetUtility(){
    this.dataset = []
    this.rawData = []
    this.inputFile
    this.outputFile
    this.map
    this.eligible
    this.count = 0
    this.limit = 10000
    this.getDatasetFromDwCA = function(callback){
        console.time("Load")
        return run (this, callback)
    }
    this.writeGroups = function(groups){
        return writeGroups(groups,this.outputFile)
    }
    this.writeDuplicated= function(groups){
        return writeDuplicated(groups,this.rawData,this.outputFile)
    }
}

function run(config, callback){
    config.count
    fs.createReadStream(config.inputFile).pipe(csv(
        {delimiter:'\t',quote:null}
    )).on("data", function (line) {
        config.rawData.push(line)
        var record = config.map(line,config.rawData[0])
        if (config.eligible(record)){
            config.dataset.push(record)
            if(config.limit < config.count+1){
                this.emit("end")
            }
            config.count++
        }
    })
        .on("end", function () {
            console.timeEnd("Load")
            callback(config.dataset)
            this.emit("close")
        })
}
function writeGroups(groups,output,callback){
    var ws = fs.createWriteStream(output)
    var data = []
    var headers = Object.create(groups[0][0])
    for(var key in headers){
        headers[key] = "-";
    }
    headers.id = "Possible duplications:"

    groups.forEach(function(group){
        data.push(headers)
        group.forEach(function(record){
            data.push(record)
        })
    })
    csv.write(data, {headers: true}).pipe(ws)
    callback
}
function writeDuplicated(groups,raw,output){
    var ws = fs.createWriteStream(output)
    var data = []
    var headers = Object.create(raw[0])
    headers[0] = "Possible duplications:"

    groups.forEach(function(group){
        data.push(headers)
        group.forEach(function(record){
            raw.forEach(function(line){
                if(line[0]==record.id){
                    data.push(line)
                    return
                }

            })
        })
    })
    csv.write(data, {headers: true}).pipe(ws)
}
module.exports = DatasetUtility