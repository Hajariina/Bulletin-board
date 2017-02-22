const 	express = require('express'),

		pg = require('pg'),

		app = express(),

		bodyParser = require('body-parser')


var Sequelize = require('sequelize');

var sequelize = new Sequelize('postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard'); // chnange the name, password
// I can change the username and password in my secret file, which is called .bash-profile
// single quote

app.use(express.static('static'));	//ask melvin why we only select certain middleware in app.use 
									// (we also did this in the previous assignment). We say static because we save it in the static file

app.use(bodyParser.urlencoded({extended: true}));  // do these lines always have to be used

app.use(bodyParser.json()); // when I use node/express ?

app.set('views', './views');   // path can be changed of course

app.set('view engine', 'pug');


//I have also done this in the terminal, so not sure if that is correct? For example see syllabus pre-discussion

// als je dit runt dan maak die automatisch de tabel aan omdat je dit al gelinkt hebt in de var sequelize

var Message = sequelize.define('message', {

	title: Sequelize.STRING,

	body: Sequelize.STRING

});

// linking to '/', because it's the home/main page

app.get ('/', (request, response) => {
	response.render('firstpage');	// this is the first page where the user comes on your webpage. For every url link, a get request is necessary
}) // pugfile is also named 'firstpage', so in the response.render I am linking to it


app.get('/secondpage', (request, response) => { // change the name to for example messages

  Message.findAll().then((allMessages) => {  // allMessages because you can come up with something random. In order to test what's in it, you can just console.log // Message because I called my table 'message'. //parameterCouldBeAnything dus bij de flamingo worden alle messages hier in verzameld. Voorbeeld string in syllabus
  	console.log('this is me testing the parameter allMessages');
  	console.log(allMessages.dataValue); 		// not sure what parameterCouldBeAnything is, so I am console.logging it to check

    response.render('secondpage', { randomKey : allMessages }); // ik denk dat dit Message is omdat in de variable Message alle messages in zitten. // iets mee geven zodat de pug file wet wat ie er mee moet doen

  }); // alleberichten (mag ik gewoon random verzinnen), this is the key: (this is the value)alles bij elkaar/ de big picture/file
}); // response.render is the 'second page', because my pug file is called that way


app.post('/secondpage', (request, response) => { // the url link is called secondpage, so therefore I am using the /secondpage. / means a link

  Message.create({ 	//creating new rows in table (sequelize) 

  	title: request.body.titlename, // object.object.key (tweede object is ook een key van de eerste object)
  	body: request.body.bodyname
  }) // laat alles zien in de database vanaf hier

  .then(() => { 
  
    response.redirect('/secondpage') // hij zoekt de get request that is linked to this route / soort van - lisa // /secondpage because it's a route

  });

});

//let's try this out. This uses .then and sync is a check. It's the new way we learned on friday

sequelize
	.sync({force: true}) // dit is heel belangrijk! zoek het op in de documentatie

	.then(function(){

		app.listen(3000, () => {

			console.log('server has started');

		});

	})