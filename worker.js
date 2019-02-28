process.on('message', function(data) {
    // Do work  (in this case just up-case the string


    console.log('data',data)

    var values = data.split('|');



    const mailjet = require ('node-mailjet')
        .connect('','')
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
                    "Subject": "New task added",
                    "Variables": {
                        "name": values[2],
                        "ticketid": values[1],
                        "confirmation_link": "http://23.23.62.117/tickettype/details?ticketid="+values[1]
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

