const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // sets username
    user: "root",
    // sets password
    password: "admin",
    // sets current database
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    chooseMenu();
});

function chooseMenu()
{
    inquirer
        .prompt(
        {
            name: "menu",
            type: "list",
            message: "Select a menu option",
            choice: 
            [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit Manager View"
            ]
        })
        .then(function(answer)
        {
            switch (answer.menu)
            {
                case "View Products for Sale":
                    itemsForSale();
                    break;
                case "View Low Inventory":
                    break;  
                case "Add to Inventory":
                    break;
                case "Add New Product":
                    break;
                case "Exit Manager View":
                    break;
            }
        })
}
function itemsForSale(func)
{
    connection.query(
        "SELECT item_id, products_name, price, stock_quantity, department_name " +
        "FROM products " +
        "WHERE price > 0;", function(err, result)
        {
            if (err) throw err;
            let selection = result[0];
            let header = [];
            for (let product in selection)
            {
               header.push(product);
            } 
            let table = new Table(
            {
                head: header,
                colWidths: [15, 55, 10, 5, 20]
            });
            let item_ids = [];
            for (let i = 0; i < result.length; i++) 
            {
                item_ids.push(result[i].item_id);
                table.push([result[i].item_id, result[i].product_name, result[i].price.toFixed(2), result[i].stock_quantity, 
                result[i].department_name]);
            }
            let output = table.toString();
            console.log(output);
            if (func)
            {
                func(item_ids);
            }
            else
            {
                chooseMenu();
            }
        });
}
