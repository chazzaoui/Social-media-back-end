let io;

module.exports = {
    init: httpServer => {
       io = require('socket.io')(httpServer); //this method handles the server connection through socket io
       return io;
    },
    getIO : () =>{
        if (!io){
            throw new Error('Socket io not initialized!')
        }
        return io; // this method makes the io globally available
    }
}