
var fs = require('fs');
var async = require('async');

/* non blocking code */

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

function foo() {
    fs.readFile('hello.txt', 'utf8', function (err, contents) {

        if (err) {
            return err

        } else {
            return contents
        }
    })
}
function fruitloop(){

    return new Promise(function (resolve,reject){
        fs.readFile('hello.txt', 'utf8', function(err, contents) {

            if (err){
                reject(err)
            }

            else{
                resolve(contents)
            }
        });


    })

}




async function nfruitloop(callback) {

   response= await foo()

    console.log('done')





}


for(var i =0;i<5;i++) {



    nfruitloop()
        .then((message) => {
            console.log(message);
        }).catch((error) => {
        console.log(error.message);
    });

    fruitloop().then(function (result) {

        console.log('s', result)

    })

}
