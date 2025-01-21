import express from 'express';
import logger from './logger.js';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );

let gamesData = [];
let nextId = 1;



app.post('/games', (req, res) => {
    logger.info('A post request was made')
    const {name, price} = req.body
    const newGame = {id: nextId++, name, price}
    gamesData.push(newGame)
    res.status(201).send(newGame)
});

app.get("/games", (req, res) => {
    res.status(200).send(gamesData);
});

app.get('/games/:id', (req, res) => {
    const game = gamesData.find(u => u.id === parseInt(req.params.id))
    if(!game){
        return res.status(404).send('Game Not found');
    }
    res.status(200).send(game);
});

app.put('/games/:id', (req, res) => {
    const game = gamesData.find(u => u.id === parseInt(req.params.id))
    if(!game){
        return res.status(404).send('Game Not found');
    }
    const {name, price} = req.body;
    game.name = name
    game.price = price
    res.send(200).send(game)
});

app.delete('/games/:id', (req, res) => {
    const gamesIndex = gamesData.findIndex(u => u.id === parseInt(req.params.id))
    if(gamesIndex === -1){
        return res.status(404).send('Game not found')
    }
    gamesData.splice(gamesIndex, 1)
    res.json({message: "Game deleted"})
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});