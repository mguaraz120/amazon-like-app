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

connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    itemsForSale();
});

function itemsForSale(){
    connection.query("SELECT item_id, product_name, price, department_name FROM products WHERE price > 0;", function(err, result){
       let selection = result[0];
       let header = [];
       for (let product in selection){
           header.push(product);
       } 
        let table = new Table({
        head: header,
        colWidths: [20, 55, 10, 20]
    });
        var item_ids = [];
    for (var i = 0; i < result.length; i++) {
        item_ids.push(result[i].item_id);
        table.push([result[i].item_id, result[i].price.toFixed(2), result[i].department_name]);
    }
        var output = table.toString();
        console.log(output);
        purchaseItem(item_ids);

    });
}