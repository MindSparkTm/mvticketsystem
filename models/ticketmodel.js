var mongoose = require('mongoose');

var exports = module.exports = {};

var ticketSchema = new mongoose.Schema({
    ticketid:String,
    tickettype: String,
    title:String,
    description:String,
    createdby:String,
    assignee:String,
    priority:String,
    status:{type:String, default: 'created'},
    imageurls:Object,
    time : { type : Date, default: Date.now }
});

     _tickets = mongoose.model('tickets', ticketSchema)


     exports.ticketobject = function (tickettype,username,callback) {


         if (tickettype == 'mytask') {

             console.log('mytaskhas bee called',username)

             // search by username
             _tickets.find({'assignee': username,"tickettype":"task"},function (err, tickets) {
                 if (err) {
                     console.log(err)

                     return callback(err)
                 } else {

                     console.log(tickets.length)

                     return callback(tickets);


                 }

             })

         }


         if (tickettype == 'myticket') {


             _tickets.find({"assignee": username ,"tickettype": ['UI','UX','Support','Functionality','Newfeature']},function (err, tickets) {
                 if (err) {
                     console.log(err)

                     return callback(err)
                 } else {

                     console.log(tickets.length)

                     return callback(tickets);


                 }

             })

         }


         else {

             _tickets.find({'tickettype': tickettype}, function (err, tickets) {
                 if (err) {
                     console.log(err)

                     return callback(err)
                 } else {

                     console.log(tickets.length)

                     return callback(tickets);


                 }

             })
         }
     }



exports.singleticket = function (ticketid,callback) {

    _tickets.findOne({'ticketid': ticketid},function (err, ticket) {
        if (err) {
            console.log(err)

            return callback(err)
        } else {

            console.log(ticket)


            return callback(ticket);


        }

    })

}

exports.find_ticket_count = function(callback){

         var names = ['Evan','Surajit','Isis','Millie','Sharon','Phoebe','Angel','Serah']

         var ticketcount =[]

         var resultsCount = 0;


 for (var i=0;i<names.length;i++){
     _tickets.find({'assignee': names[i]},function (err, tickets) {

         resultsCount++

         if (err) {
             console.log(err)

             return callback(err)
         } else {

             ticketcount.push(tickets.length)


             if (resultsCount === names.length) {
                 return callback(ticketcount);


             }











         }

     })

 }


}



    exports.ticket =mongoose.model('tickets', ticketSchema)

