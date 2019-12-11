const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // sets username
    user: "root",
    // sets password
    password: "",
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