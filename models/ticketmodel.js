var mongoose = require('mongoose');

var exports = module.exports = {};

var taskSchema = new mongoose.Schema({
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

_tasks = mongoose.model('tasks', taskSchema)


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

exports.find_task_count = function(callback) {

    var names = ['Evan', 'Surajit', 'Isis', 'Millie', 'Sharon', 'Phoebe', 'Angel', 'Serah']

    var taskcount = []
    var resultsCount = 0;


    for (var i = 0; i < names.length; i++) {
        _tasks.find({'assignee': names[i]}, function (err, tickets) {

            resultsCount++

            if (err) {
                console.log(err)

                return callback(err)
            } else {
                taskcount.push({
                    key: resultsCount,
                    value:tickets.length

                })


                if (resultsCount === names.length) {
                    console.log('Taskkkkkkk',taskcount)

                    return callback(taskcount);


                }


            }

        })

    }

}

exports.task =mongoose.model('tasks', taskSchema)

