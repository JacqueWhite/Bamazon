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

connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
	readProducts();

}

var table = new Table({
    head: ['ID', 'Name', 'Price'],
    colWidths: [5, 40, 10]
});

function readProducts() {
  console.log("Showing all products...\n");
  connection.query("SELECT * FROM products",
	function(err, res) {
		if (err) {
          throw err;
      	} else {
      		for (var i = 0; i < res.length; i++) {
                table.push([res[i].item_id, res[i].product_name, res[i].price]);
      		}
      		console.log(table.toString());
        }
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
	    .then(function(answer) {
	        console.log('Order received!');
	        
	        connection.query("SELECT * FROM products WHERE ?", { item_id: answer.item}, function(err, res) {
					console.log("ID # " + res[0].item_id + " Product: " + res[0].product_name + " Price: " + res[0].price);

				if (answer.stock > res[0].stock_quantity) {
				console.log("Please chose fewer items, or select another product.");

				} else {

					console.log('Order on its way!');
					connection.query('UPDATE products SET ? WHERE ?', 
					[
						{ 
							stock_quantity: (res[0].stock_quantity - answer.stock) 
						}, 
						{ 
							item_id: res[0].id 
						}
					],

					function(err, result) {
					console.log("You bought " + stock + " " + res[0].product_name + "(s) today! That leaves " + (res[0].stock_quantity - answer.stock) + " in stock!");
					});
				}
			}
		});
	}); 


// I had to move the function inside the answer function due to scope...

// function checkingInventory(stock, res) {
// 	console.log("ID # " + res[0].item_id + " Product: " + res[0].product_name + " Price: " + res[0].price);
// 	if (answer.stock > res[0].stock_quantity) {
// 		console.log("Please chose fewer items, or select another product.");
// 	} else {
//         console.log('Order on its way!');
//         connection.query(
//             'UPDATE products SET ? WHERE ?', 
//             [
// 	            { 
// 	            	stock_quantity: (res[0].stock_quantity - answer.stock) 
// 	            }, 
// 	            { 
// 	            	item_id: res[0].id 
// 	            }
//             ],
//             function(err, result) {
//                 console.log("You bought " + stock + " " + res[0].product_name + "(s) today! That leaves " + (res[0].stock_quantity - answer.stock) + " in stock!");
//             })
//     }
// }

// changing users...
// connection.changeUser({user : 'user2'}, function(err) {
//   if (err) throw err;
// });

// connection.end();
