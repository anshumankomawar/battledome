import path from 'path'
import express from 'express'
const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html')
app.use(express.static(DIST_DIR))
app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})
//const express = require('express');
//const app = express();
//const http = require('http');
//const server = http.createServer(app);
//const { Server } = require("socket.io");
//const io = new Server(server);

//app.get('/', (req, res) => {
  //console.log('GET /');
  //res.sendFile(__dirname + '/index.html');
//});

//io.on('connection', (socket) => {
  //console.log('a user connected');
//});

//server.listen(3000, () => {
  //console.log('listening on *:3000');
//});
