const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");

// sets connection param for database connection
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

// makes connection with the server
connection.connect(function (err) 
{
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    chooseMenu();
});

// manager chooses a from a menu list
function chooseMenu() 
{
    inquirer
        .prompt({
            name: "menu",
            type: "list",
            message: "Please select a menu option?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit Manager View"
            ]
        })
        .then(function (answer) 
        {
            // console.log(answer);
            switch (answer.menu) 
            {
                case "View Products for Sale":
                    itemsForSale();
                    break;

                case "View Low Inventory":
                    lowInventory();
                    break;

                case "Add to Inventory":
                    itemsForSale(addToInvetory);
                    break;

                case "Add New Product":
                    askQuestions();
                    break;

                case "Exit Manager View":
                    exit();
                    break;
            }
        })
}
// displays low invetory when requested
function itemsForSale(func) 
{
    connection.query(
        "SELECT item_id, product_name, price, stock_quantity, department_name " +
        "FROM products " +
        "WHERE price > 0;", function (err, result) 
    {

        if (err) throw err;
        // gets and builds the table header
        var selection = result[0];
        var header = [];
        for (var product in selection) 
        {
            header.push(product);
        }

        // instantiate 
        var table = new Table({
            head: header,
            colWidths: [15, 55, 10, 5, 20]
        });

        // gets and sets the data in the table
        var item_ids = [];
        for (var i = 0; i < result.length; i++) 
        {
            item_ids.push(result[i].item_id);
            table.push([result[i].item_id, result[i].product_name, result[i].price.toFixed(2),
            result[i].stock_quantity, result[i].department_name]);
        }
        var output = table.toString();
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

// displays low inventory (stock lower or equal than 5) when requested 
function lowInventory() 
{
    connection.query(
        "SELECT item_id, stock_quantity " +
        "FROM products " +
        "WHERE stock_quantity <= 5;", function (err, result) 
    {

        // console.log(err)
        var obj = result[0];
        var header = [];
        for (var prop in obj) 
        {
            header.push(prop);
        }

        // instantiate 
        var table = new Table({
            head: header,
            colWidths: [15, 10]
        });

        for (var i = 0; i < result.length; i++) 
        {
            table.push([result[i].item_id, result[i].stock_quantity]);
        }
        var output = table.toString();
        console.log(output);
        chooseMenu();
    });
}

// funtion adds to inventory
function addToInvetory(list) 
{
    inquirer
        .prompt([
        {
            name: "action",
            type: "list",
            message: "Select item:",
            choices: list
        },
        {
            name: "quantity",
            type: "input",
            message: "Update quantity with:",
        }])
        .then(function (answer) 
        {
            updateQuantity(answer.action, answer.quantity);
        })
}

function updateQuantity(item, quant) 
{
    var query = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE ?"
    connection.query(
        query,
        [quant,{item_id: item}],
        function (err, res) 
        {
            if (err) throw err;
            console.log("DB has been updated!");
            chooseMenu();
        }
    );
}

// prompts for adding new item
