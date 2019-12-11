const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "admin",
    database: "bamazon_db"
});

connection.connect(function(err)
{
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    itemsForSale();
});

function itemsForSale()
{
    connection.query("SELECT item_id, product_name, price, department_name FROM products WHERE price > 0;", function(err, result)
    {
        let selection = result[0];
        let header = [];
        for (let product in selection)
        {
           header.push(product);
        } 
        let table = new Table({
            head: header,
            colWidths: [20, 55, 10, 20]
        });
        let item_ids = [];
        for (let i = 0; i < result.length; i++) 
        {
            item_ids.push(result[i].item_id);
            table.push([result[i].item_id, result[i].product_name, result[i].price.toFixed(2), result[i].department_name]);
        }
        let output = table.toString();
        console.log(output);
        purchaseItem(item_ids);

    });
}

function purchaseItem(list)
{
    inquirer
        .prompt([
        {
            name: "buy",
            type: "list",
            message: "Which item would you like to purchase?",
            choices: list
        },
        {
            name: "quantity",
            type: "input",
            message: "Enter quantity"
        }
    ])
    .then(function(answer)
    {
        let query = "SELECT item_id, stock_quantity, price FROM products WHERE ?";
        connection.query(query, {item_id: answer.buy}, function(err, res)
        {
            let inputQuantity = answer.quantity;
            checkStock(res[0].stock_quantity, inputQuantity, res[0].price.toFixed(2), res[0].item_id)
        });
    })
}

function checkStock(on_stock, buy_quantity, price, item_id) 
{
    if (on_stock >= buy_quantity) 
    {
        let total_price = buy_quantity * price;
        console.log(`Your total amount is $${total_price}.\nThank you for your purchase on BAMAZON!`);
        // updates database
        updateStock(buy_quantity, item_id);
    } 
    else 
    {
        console.log(`Insufficient quantity on stock!\nOnly ${on_stock} items on stock!`);
        connection.end();
    }
}

function updateStock(quantity, item_id) 
{
    var query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE ?";
    connection.query(
        query,
        [
            quantity,
            {
                item_id: item_id
            }
        ],
        function (error) 
        {
            if (error) throw error;
            console.log("DB was succefully updated!");
            connection.end();
        });
}
