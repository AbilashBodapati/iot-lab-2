document.onkeydown = updateKey;
document.onkeyup = resetKey;

var server_port = 65432;
var server_addr = "192.168.1.72";   // the IP address of your Raspberry PI

function send_control(input) {
    const net = require('net');

    const client = net.createConnection({ port: server_port, host: server_addr }, () => {
        // 'connect' listener.
        console.log('connected to server!');
        
    });
    
    // send the message
    client.write(`${input}\r\n`);

    // get the data from the server
    client.on('data', (data) => {
        document.getElementById("direction").innerHTML = data.toString();
        console.log(data.toString());
        client.end();
        client.destroy();
    });
    

    client.on('end', () => {
        console.log('disconnected from server');
    });
}

function update_info(input) {
    const net = require('net');

    const client = net.createConnection({ port: server_port, host: server_addr }, () => {
        // 'connect' listener.
        console.log('connected to server!');
        
    });
    
    // send the message
    client.write(`${input}\r\n`);

    // get the data from the server
    client.on('data', (data) => {
        if (input == '84') {
            console.log(data.toString());
            document.getElementById("temperature").innerHTML = parseFloat(data).toFixed(2).toString() + '°C';
        } else if (input == '83') {
            document.getElementById("power").innerHTML = parseFloat(data).toFixed(2).toString() + ' v';
        }
        console.log(data.toString());
        client.end();
        client.destroy();
    });

    client.on('end', () => {
        console.log('disconnected from server');
    });
}

// for detecting which key is been pressed w,a,s,d
function updateKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up (w)
        document.getElementById("upArrow").style.color = "green";
    }
    else if (e.keyCode == '40') {
        // down (s)
        document.getElementById("downArrow").style.color = "green";
    }
    else if (e.keyCode == '37') {
        // left (a)
        document.getElementById("leftArrow").style.color = "green";
    }
    else if (e.keyCode == '39') {
        // right (d)
        document.getElementById("rightArrow").style.color = "green";
    }
    send_control(e.keyCode);
}

// reset the key to the start state 
function resetKey(e) {

    e = e || window.event;

    document.getElementById("upArrow").style.color = "grey";
    document.getElementById("downArrow").style.color = "grey";
    document.getElementById("leftArrow").style.color = "grey";
    document.getElementById("rightArrow").style.color = "grey";
    send_control('');
    document.getElementById("direction").innerHTML = '';
}


// update data for every 50ms
function update_data(){
    setInterval(function(){
        // get image from python server
        update_info('84');
        update_info('83');
    }, 50);
}