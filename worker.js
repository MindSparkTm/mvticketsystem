process.on('message', function(data) {
    // Do work  (in this case just up-case the string


    console.log('data',data)

    var values = data.split('|');

    if (data[3]=='task'){

        var confirm = 'http://23.23.62.117/tickettype/taskinfo?taskid='

    }

    if(data[3]=='ticket'){
        var confirm = 'http://23.23.62.117/tickettype/details?ticketid='

    }



    const mailjet = require ('node-mailjet')
        .connect('3f3529f71722a5d6ba3190402608e02b','9f3cd9f6154aca71fc9e7b484ff416e1')
    const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
            "Messages":[
                {
                    "From": {
                        "Email": 'surajit@mumsvillage.com',
                        "Name": "Surajit"
                    },
                    "To": [
                        {
                            "Email": values[0],
                            "Name": "Test"
                        }
                    ],
                    "TemplateID": 712178,
                    "TemplateLanguage": true,
                    "Subject": 'New'+values[3]+'added',
                    "Variables": {
                        "name": values[2],
                        "ticketid": values[1],
                        "confirmation_link":confirm+values[1]
                    }
                }
            ]
        })
    request
        .then((result) => {
            console.log('result',result.body)
        })
        .catch((err) => {
            console.log('err',err)
        })


    // Pass results back to parent process
});

