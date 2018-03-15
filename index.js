
var express=require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var session = require('express-session');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(session({secret:'mySecret'}));
const path = require('path');
app.use(express.static(path.join(__dirname,'public')));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

app.get('/', function(req,res,next){
	var context = {};
	res.render('home');
});

app.get('/edit', function(req,res,next){
	var context = {};
	mysql.pool.query('SELECT * FROM workouts WHERE id=?', [req.query.id], function(err,result){
		if(err){
			next(err);
			return;
		}
		context.results = result[0];
		var newDate = dateFormat(context.results['date'], 'yyyy-mm-dd');
		context.results['date'] = newDate;	
		context.results['checkedlbs'] = "";
		context.results['checkedkilos'] = "";
		if (context.results['lbs'] == 1) 
			context.results['checkedlbs'] = "checked";
		else
			context.results['checkedkilos'] = "checked";

		res.render('edit',context.results);
	});
});

app.post('/update', function(req,res,next){
	var context = {};
	mysql.pool.query('UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ',
		[req.body['name'], req.body['reps'], req.body['weight'], req.body['date'], req.body['lbs'], req.body['id']],
		function(err,result){
			if(err){
				next(err);
				return;
			}
			res.render('home');
		});
});
	
app.get('/show', function(req,res,next){
	var context = {};
	mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
		if(err){
			console.log("fail");
			next(err);
			return;
		}

		for(var i=0;i<rows.length;i++){
			var row=rows[i];
			var newDate = dateFormat(row['date'], 'yyyy-mm-dd');
			row['date'] = newDate;	
			var lbs = row['lbs'];
			if(lbs == 0) //calculate pounds from kg as needed
				row['weight'] = (row['weight']*2.2).toFixed(0);
		}  
		context.results = JSON.stringify(rows);
		res.send(context.results);
	});
});

app.get('/insert', function(req,res,next){
	var context = {};
	mysql.pool.query("INSERT INTO workouts (`name`,`reps`,`weight`,`date`,`lbs`) VALUES (?,?,?,?,?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
		if(err){
			next(err);
			return;
		}
		mysql.pool.query('SELECT * FROM workouts WHERE id=?', result.insertId, function(err, rows, fields){
			if(err){
				next(err);
				return;
			}
			var row=rows[0];
			var newDate = dateFormat(row['date'], 'yyyy-mm-dd');
			row['date'] = newDate;	
			var lbs = row['lbs'];
			if(lbs == 0) //calculate pounds from kg as needed
				row['weight'] = (row['weight']*2.2).toFixed(0);
			
			context.results = JSON.stringify(rows);
			res.send(context.results);
		});

	});
});

app.get('/delete', function(req,res,next){
	var context = {};
	mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
		if(err){
			next(err);
			return;
		}
		context.results = "Deleted "+req.query.id;
		res.send(context.results);
	});
});	

app.get('/reset-table',function(req,res,next){
	var context = {};
	mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
		var createString = "CREATE TABLE workouts("+
		"id INT PRIMARY KEY AUTO_INCREMENT,"+
		"name VARCHAR(255) NOT NULL,"+
		"reps INT,"+
		"weight INT,"+
		"date DATE,"+
		"lbs BOOLEAN)";
		mysql.pool.query(createString, function(err){
			context.results = "Table reset";
			res.render('initial',context);
		})
	});
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
