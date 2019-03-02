var mongoose = require('mongoose');
var async = require('async');

var exports = module.exports = {};

var mtaskSchema = new mongoose.Schema({
    taskid:String,
    title:String,
    description:String,
    createdby:String,
    assignee:String,
    priority:String,
    status:{type:String, default: 'created'},
    imageurls:Object,
    time : { type : Date, default: Date.now }
});

_tasks = mongoose.model('mtasks', mtaskSchema)


exports.taskobject = function (username,callback) {

    _tasks.find({'assignee': username}, function (err, tasks) {
        if (err) {
            console.log(err)

            return callback(err)
        } else {

            console.log(tasks.length)

            return callback(tasks);


        }

    })

}



exports.singletask = function (taskid,callback) {

    _tasks.findOne({'taskid': taskid},function (err, task) {
        if (err) {
            console.log(err)

            return callback(err)
        } else {

            console.log(task)


            return callback(task);


        }

    })

}

exports.find_task_count = function (callback) {

    var names = ['Evan', 'Surajit', 'Isis', 'Millie', 'Sharon', 'Phoebe', 'Angel', 'Serah'];

    async.map(names, function (name, iterateeCallback) {
        _tasks.find({ 'assignee': name }, function (err, task) {
            if (err) {
                return iterateeCallback(err);
            }

            console.log('tickets',task.length)

            return iterateeCallback(null, task.length);
        });
    }, function (error, results) {
        if (error) {
            return callback(error);
        }

        console.log('results',results)
        return callback(results);
    });
}
exports.task =mongoose.model('mtasks', mtaskSchema)

