const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('The Beatles'));
bands.addBand(new Band('Twenty One Pilots'));
bands.addBand(new Band('Metallica'));


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());
    
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
    
    client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);
        
        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
        
    });
    
    client.on('vote-band', (payload)=>{
        
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());

    });

    client.on('add-band', (payload)=>{
        
       bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());

    });

    client.on('delete-band', (payload)=>{
        
       bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands()); //notifica a todos los clientes 

    });

    // client.on('emitir-mensaje',(payload) =>{
    //    //io.emit('nuevo-mensaje',payload); //esto emite a todos!
    //  //  console.log(payload);
    //     client.broadcast.emit('nuevo-mensaje',payload); //esto emite a todos menos el que lo emitio!
    // });


});
