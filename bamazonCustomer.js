var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "bamazon",
	socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});

// var itemList = read database and give an array of product list 

connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
	readProducts();
}

function readProducts() {
  console.log("Showing all products...\n");
  connection.query("SELECT item_id, product_name, price FROM products",
	function(err, res) {
		for (var i = 0; i < res.length; i++) {
			console.log(
				"Product Id: " +
				res[i].product_id +
				" || Product Name: " +
				res[i].product_name +
				" || Price: " +
				res[i].price
			);
		}
	}

// function buyProducts() {
//   connection.query("SELECT * FROM products", function(err, res) {
//     if (err) throw err;
//     // Log all results of the SELECT statement
//     console.log(res);
//     connection.end();
//   });
// }

// function buyProducts() {
//   inquirer
//     .prompt(
//       {
//       name: "item_id",
//       type: "input",
//       message: "Enter the product ID to buy it: "
//       // choices: [{connection.database.}]
//       },
//     )
//     .then(function(answer) {
//       console.log(item_id.answer);

//       // if (answer.item_id === ) {
//       //   buyProduct();
//       // }
//     });
// }

// connection.end();
