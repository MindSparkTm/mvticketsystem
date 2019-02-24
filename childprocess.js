var cp = require('child_process');
var child = cp.fork('./worker');
child.on('message', function(m) {
    // Receive results from child process
    console.log('received: ' + m);
});

// Send child process some work
child.send('Please up-case this string');

console.log('Doing some other work')