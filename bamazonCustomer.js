var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var chalk = require('chalk');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "bamazon",
	socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
	var table = "";
	readProducts();
}

function readProducts() {

  var table = new Table({
    head: ['ID', 'Name', 'Price'],
    colWidths: [5, 40, 10]
	});	

  console.log(chalk.red("---------------------------------------------"));
  console.log(chalk.red("Welcome to BAMAZON!\n"));
  console.log(chalk.red("---------------------------------------------"));
  console.log("Here are the current products...\n");
  connection.query("SELECT * FROM products",
	function(err, res) {
		if (err) {
          throw err;
      	} else {
      		for (var i = 0; i < res.length; i++) {
                table.push([res[i].item_id, res[i].product_name, res[i].price]);
      		}
        }
        console.log(table.toString());
        buyProducts();
	})
}

function buyProducts() {
  inquirer
    .prompt([
      {
      name: "item",
      type: "input",
      message: "To purchase an item, enter the ID: "
      },
      {
      name: "stock",
      type: "input",
      message: "How many would you like to purchase?"
      }
    ])
    .then(function(answer){
    console.log("Item ID: " + answer.item);
    console.log("QTY: " + answer.stock);

        connection.query("SELECT stock_quantity FROM products WHERE item_id = ?",[answer.item], function(err, res){
            // console.log("All results: " + res);
            console.log("Items left in Inventory: " + res[0].stock_quantity);
       
            if(res[0].stock_quantity > answer.stock){
               connection.query("UPDATE products SET ? WHERE ?",
               [
                {
                   stock_quantity: (res[0].stock_quantity-answer.stock)
                },
                {
                   item_id: answer.item
                }
               ]); 
               console.log("---------------------------------------------");
               console.log("*****Order received! Thank you!*****");
               console.log("---------------------------------------------");
               whatNext();
                
            } else {
                console.log("******Sorry, Insufficiant Inventory******");
                whatNext();
            }
		});
	});
}; 

function whatNext(){
    inquirer.prompt([
        {
            type: "list",
            name: "whatNext",
            message: "What would you like to do?",
            choices: ["Shop", "Exit Bamazon"]
        }
    ]).then(function(answer){
        if(answer.whatNext === "Shop"){
            readProducts();
        }else if(answer.whatNext === "Exit Bamazon"){
            connection.end();
        }
    });
}
