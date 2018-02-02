
    var element = function(id){
        return document.getElementById(id);
    }

    // Get elements
    var status = element('status');
    var messages = element('messages');
    var textarea = element('textarea');
    var username = element('username');
    var clearBtn = element('clear');

    // Set default status
    var statusDefault = status.textContent;

    var setStatus = function(s) {
        // Set status
        status.textContent = s;

        if (s !== statusDefault) {
            var delay = setTimeout(function() {
                setStatus(statusDefault);
            }, 4000);
        }
    }

    // Connect to socket.io
    var socket = io.connect('http://127.0.0.1:4000');

    // Check for connection
    if (socket !== undefined) {
        console.log('Connected to socket...');

        // Handle Output
        socket.on('output', function(data) {
            //console.log(data);
            if (data.length) {
                for (var x = 0; x < data.length; x++) {
                    // Build out message div
                    var user = document.createElement('div');
                    var message = document.createElement('span');
                    message.setAttribute('class', 'chat--message');
                    user.setAttribute('class', 'chat--message-user');
                    user.textContent = data[x].name+": ";
                    message.textContent = data[x].message;
                    user.appendChild(message);
                    messages.appendChild(user);
                    messages.insertBefore(user, messages.firstChild);
                }
            }
        });

        // Get status form server
        socket.on('status', function(data) {
            // Get message status
            setStatus((typeof data === 'object')? data.message : data);

            // If status is clear, clear text
            if (data.clear) {
                textarea.value = '';
            }
        });

        // Handle input
        textarea.addEventListener('keydown', function(event) {
            if (event.which === 13 && event.shiftKey == false) {
                // Emit to server input
                socket.emit('input', {
                    name:username.value,
                    message:textarea.value
                });

                event.preventDefault();
            }
        });

        // Handle chat clear
        clearBtn.addEventListener('click', function() {
            socket.emit('clear');
        });

        //Clear message
        socket.on('cleared', function() {
            messages.textContent = '';
        });
    }
