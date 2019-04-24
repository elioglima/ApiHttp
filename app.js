var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const bodyParser = require('body-parser');
const mysql = require('mysql');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// rotas
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));
app.use('/bots', require('./routes/bots/bots'));
app.use('/bots/analytictools', require('./routes/bots/analytictools'));

// api do bot
app.use('/bots/api/browser/acesso/auth', require('./routes/bots/api/browser/auth_app'));
app.use('/bots/api/browser/mensagens', require('./routes/bots/api/browser/lista_mensagens'));
app.use('/bots/api/browser/mensagens/enviar', require('./routes/bots/api/browser/recebe_mensagem'));


//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  var retorno = {
    Status: err.status, 
    Response: "", 
    Mensagem:""
  }
  
  if (err.status == 404) {
    retorno = {Status:404, Response:"Pagina não localizada", Mensagem:"Não foi possível localizar o reurso chamado."}
  }

  res.status(err.status || 500);
  res.render('error', { 
    Title: 'MaxBots',
    PathRoot: '',
    Retorno: retorno
      });
});

module.exports = app;

// var postTest = require('./ClientHttp/postTest');
// async function Thread1() {  
//   await delay(1000);     
//   postTest.executa();    
//   Thread1();
// }

// Thread1();

// console.log(path.basename(__filename, path.extname(__filename)))
// console.log(__dirname)
// console.log(__filename)