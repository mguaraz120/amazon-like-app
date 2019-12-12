const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");

let connection = mysql.createConnection({
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

function chooseMenu() 
{
    inquirer
        .prompt({
            name: "menu",
            type: "list",
            message: "Select a menu option",
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
            switch (answer.menu) 
            {
                case "View Products for Sale":
                    itemsForSale();
                    break;

                case "View Low Inventory":
                    lowInventory();
                    break;

                case "Add to Inventory":
                    itemsForSale(addToInventory);
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
function itemsForSale(func) 
{
    connection.query(
        "SELECT item_id, product_name, price, stock_quantity, department_name " +
        "FROM products " +
        "WHERE price > 0;", function (err, result) 
    {

        if (err) throw err;
        let selection = result[0];
        let header = [];
        for (let product in selection) 
        {
            header.push(product);
        }

        let table = new Table({
            head: header,
            colWidths: [15, 55, 10, 5, 20]
        });

        let item_ids = [];
        for (let i = 0; i < result.length; i++) 
        {
            item_ids.push(result[i].item_id);
            table.push([result[i].item_id, result[i].product_name, result[i].price.toFixed(2),
            result[i].stock_quantity, result[i].department_name]);
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

function lowInventory() 
{
    connection.query(
        "SELECT item_id, stock_quantity " +
        "FROM products " +
        "WHERE stock_quantity <= 5;", function (err, result) 
    {

        let selection = result[0];
        let header = [];
        for (let product in selection) 
        {
            header.push(product);
        }

        let table = new Table({
            head: header,
            colWidths: [15, 10]
        });

        for (let i = 0; i < result.length; i++) 
        {
            table.push([result[i].item_id, result[i].stock_quantity]);
        }
        let output = table.toString();
        console.log(output);
        chooseMenu();
    });
}

function addToInventory(list) 
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
    let query = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE ?"
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
function askQuestions() 
{
    inquirer
        .prompt([
        {
            name: "id",
            message: "Input Item ID: "
        },
        {
            name: "name",
            message: "Input Product Name: "
        },
        {
            name: "department",
            type: "list",
            message: "Select Department",
            choices: ["Electronics", "Books", "Fashion", "Shoes", "Sports & Fitness"]
        },
        {
            name: "price",
            message: "Input Product Cost: "
        },
        {
            name: "stock",
            message: "Input Stock Quantity: "
        }])
        .then(function (answer) {
            // adds new item to database
            addNewItem(answer.id, answer.name, answer.department, answer.price, answer.stock);
        });
}

// adds new item to product table
function addNewItem(id, name, department, price, stock) 
{
    let query = "INSERT INTO products SET ?"
    connection.query(query,
        {
            item_id: id,
            product_name: name,
            department_name: department,
            price: price,
            stock_quantity: stock
        },
        function (err, res) 
        {
            if (err) console.log(err)
            console.log(`New item ${id} is added to DB!`);
            chooseMenu();
        }
    )
}

function exit() 
{
    connection.end();
    process.exit(-1);
}