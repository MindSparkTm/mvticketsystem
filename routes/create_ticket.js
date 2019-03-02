var express = require('express');
var tickets = require('../models/ticketmodel')
var User = require('../models/usermodel')

var tasks = require('../models/taskmodel')
var cp = require('child_process');
var sms_worker = cp.fork('./worker');
var update_worker = cp.fork('./update_task_worker');


var uuid = require('uuid');
var dateTime = require('node-datetime');
mid = require('../common/requireslogin')

var router = express.Router();
/* GET users listing. */
router.get('/', mid.requiresLogin,function (req, res, next) {
    var tickettype = req.query.tickettype;

    res.render('test.hbs', {'message':'Create a Ticket','form':'success','tickettype': tickettype})
});




router.post('/create',mid.requiresLogin, function (req, res, next) {
    console.log('imageurls', req.body)

    var name =req.session.username




    var ticketid = uuid.v1();
    tickettype = req.body.tickettype

    title = req.body.title

    description = req.body.description

    createdby = req.body.createdby

    assignee = req.body.assignee

    priority = req.body.priority

    imageurls = req.body.imageurls

    var dt = dateTime.create();
    formatted = dt.format('Y-m-d H:M:S');


    ticketmodel = new tickets.ticket({
        ticketid: ticketid,
        tickettype: tickettype,
        title: title,
        description: description,
        createdby: createdby,
        assignee: assignee,
        priority: priority,
        imageurls: imageurls,
    })


    ticketmodel.save(function (err, response) {
        if (err) {
            console.log('error', err)
            console.log(err)
            res.end('{"response": "Error"}')

        } else {
            console.log(response)

            User.singleuser(assignee,function (user,err) {
                if (err){
                    console.log(err)
                }
                else{

                    email = user.email
                    sms_worker.on('message', function(m) {
                        // Receive results from child process


                    });

                    var data = email+"|"+ticketid+"|"+name+"|"+"ticket"
                    sms_worker.send(data);
                }

            })



            res.end('{"response": "Success"}')
        }
    });
})


router.post('/createtask',mid.requiresLogin, function (req, res, next) {

    var name =req.session.username
    var email = req.session.email

    taskid = uuid.v1();

    title = req.body.title

    description = req.body.description

    createdby = req.body.createdby

    assignee = req.body.assignee



    priority = req.body.priority

    imageurls = req.body.imageurls

    var dt = dateTime.create();
    formatted = dt.format('Y-m-d H:M:S');


    taskmodel = new tasks.task({
        taskid: taskid,
        title: title,
        description: description,
        createdby: createdby,
        assignee: assignee,
        priority: priority,
        imageurls: imageurls,
    })


    taskmodel.save(function (err, response) {
        if (err) {
            console.log('error', err)
            console.log(err)
            res.end('{"response": "Error"}')

        } else {
            console.log(response)
            User.singleuser(assignee,function (user,err) {
                if (err){
                    console.log(err)
                }
                else{

                    email = user.email
                    sms_worker.on('message', function(m) {
                        // Receive results from child process


                    });

                    var data = email+"|"+taskid+"|"+name+"|"+"task"
                    sms_worker.send(data);
                }

            })
            res.end('{"response": "Success"}')
        }
    });
})

router.get('/taskdetails',mid.requiresLogin, function (req, res, next) {
    var username = req.session.username




    tasks.taskobject(username,function (response) {
        console.log('reso',response)

        res.render('test.hbs', {'message':'Current Tickets','tasks': response,'table':'success'})

    })
})


router.get('/test',mid.requiresLogin, function (req, res, next) {
        console.log('testst')
        var tickettype = req.query.tickettype
        var username = req.session.username

    console.log('username',username)



    tickets.ticketobject(tickettype,username,function (response) {
        console.log('reso',response)

        res.render('test.hbs', {'message':'Current Tickets','tickets': response,'table':'success'})

    })
})

router.get('/options', mid.requiresLogin, function (req, res, next) {


        res.render('test.hbs', {'message':'Choose a Ticket','options': 'success'})


})

router.get('/details',mid.requiresLogin, function (req, res, next) {

    var ticketid = req.query.ticketid
    tickets.singleticket(ticketid,function (response) {

        res.render('test.hbs', {'single':'Tickets','ticket': response,'ticketmessage':'Displaying Ticket Details'})


    })

})

router.get('/taskinfo', function (req, res, next) {

    var taskid = req.query.taskid
    console.log('Taskid',taskid)
    tasks.singletask(taskid,function (response) {
        console.log('single task details',response)

        res.render('test.hbs', {'single':'task','task': response,'ticketmessage':'Displaying Task Details'})


    })

})

router.post('/updateticket',mid.requiresLogin,function (req,res,next) {
    title = req.body.title
    description = req.body.description
    ticketid = req.body.ticketid



    assignee = req.body.assignee
    creator = req.body.creator

    console.log('a',assignee)
    priority = req.body.priority

    console.log(priority)

    status = req.body.status

    console.log('creator',creator)



    tickets.singleticket(req.body.ticketid,function (response) {

        response.title = title;
        response.description = description
        response.priority = priority;
        response.assignee = assignee;
        response.status = status;

        // save the user
        response.save(function(err,ticket) {
            if (err) {

                res.end('{"response": "error"}')
            }
            else {
                User.singleuser(creator,function (user,err) {
                    if (err){
                        console.log(err)
                    }
                    else{

                        email = user.email
                        update_worker.on('message', function(m) {
                            // Receive results from child process


                        });

                        var data = email+"|"+ticketid+"|"+creator+"|"+assignee+"|"+"ticket"
                        update_worker.send(data);
                    }

                })
                res.end('{"response": "success"}')


            }

        });

    })





})

router.post('/updatetask',mid.requiresLogin,function (req,res,next) {
    title = req.body.title
    description = req.body.description
    taskid = req.body.taskid



    assignee = req.body.assignee

    priority = req.body.priority

    console.log(priority)

    status = req.body.status

    creator = req.body.creator



    tasks.singletask(req.body.taskid,function (response) {

        response.title = title;
        response.description = description
        response.priority = priority;
        response.assignee = assignee;
        response.status = status;

        // save the user
        response.save(function(err,ticket) {
            if (err) {

                res.end('{"response": "error"}')
            }
            else {
                User.singleuser(creator,function (user,err) {
                    if (err){
                        console.log(err)
                    }
                    else{

                        email = user.email
                        update_worker.on('message', function(m) {
                            // Receive results from child process


                        });

                        var data = email+"|"+taskid+"|"+creator+"|"+assignee+"|"+"task"
                        update_worker.send(data);
                    }

                })

                res.end('{"response": "success"}')
            }

        });

    })





})

router.get('/ticketcount',mid.requiresLogin,function (req,res) {

    tickets.find_ticket_count(function (response) {
        console.log('respo',response)

        names:  ['Evan','Surajit','Isis','Millie','Sharon','Phoebe','Angel','Serah'],

            res.render('test.hbs', {'graph':'Tickets','topheading':'Ticket Summary','summary':'Number of Assigned Tickets','Evan':response[0],'Surajit':response[1],'Isis':response[2],'Millie':response[3],'Sharon':response[4],'Phoebe':response[5],'Angel':response[6],'Serah':response[7]})


    })


})


router.get('/taskcount',mid.requiresLogin,function (req,res) {

    tickets.find_ticket_count(function (response) {
        console.log('respo',response)


        names:  ['Evan','Surajit','Isis','Millie','Sharon','Phoebe','Angel','Serah'],

            res.render('test.hbs', {'graph':'Tasks','summary':'Number of Assigned Tasks','topheading':'Task Summary','Evan':response[0],'Surajit':response[1],'Isis':response[2],'Millie':response[3],'Sharon':response[4],'Phoebe':response[5],'Angel':response[6],'Serah':response[7]})


    })


})

module.exports = router;
