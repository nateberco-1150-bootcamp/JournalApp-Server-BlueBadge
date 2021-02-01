require("dotenv").config();
let express = require('express');
let app = express();
const sequelize = require("./db")

let journal = require("./controllers/journalcontroller")
let user = require("./controllers/usercontroller")
let calc = require("./controllers/calculatorcontroller");

sequelize.sync();

app.use(require('./middleware/headers'))

app.use(express.json()); //accepts json into our server


app.use("/user", user);
app.use("/calculator", calc);
app.use("/journal", journal);

app.listen(3000,function(){
    console.log("App is listening on port 3000");
});




// localhost:3000

//localhost:3000/test