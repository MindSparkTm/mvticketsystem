process.on('message', function(data) {
    // Do work  (in this case just up-case the string


    console.log('data',data)

    var values = data.split('|');
    var confirm_link =""
    if (values[4]=='task'){

        confirm_link = "http://23.23.62.117/tickettype/taskinfo?taskid="

    }

    if(values[4]=='ticket'){
        confirm_link = "http://23.23.62.117/tickettype/details?ticketid="

    }



    const mailjet = require ('node-mailjet')
        .connect('','')
    const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
            "Messages":[
                {
                    "From": {
                        "Email": "surajit@mumsvillage.com",
                        "Name": "Surajit"
                    },
                    "To": [
                        {
                            "Email": values[0],
                            "Name": "Test"
                        }
                    ],
                    "TemplateID": 715063,
                    "TemplateLanguage": true,
                    "Subject": values[4]+"updated",
                    "Variables": {
                        "name": values[2],
                        "assignee": values[3],
                        "ticketid": values[1],
                        "confirmation_link":confirm_link+values[1]
                    }
                }
            ]
        })
    request
        .then((result) => {
            console.log(result.body)
        })
        .catch((err) => {
            console.log(err.statusCode)
        })

    // Pass results back to parent process
});

