import { createRequire } from "module";
import dotenv from 'dotenv'

dotenv.config()
const require = createRequire(import.meta.url);
const mysql = require('mysql');

const con = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD
});
con.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + con.state);
});

export async function getDataFromRDS() {
    try {
        const response = await new Promise((resolve, reject) => {
           // const query = "SELECT * FROM IDInformation.Information where id=1;";

            const query = `select id, firstname, lastname, DATE_FORMAT(DOB, '%Y-%m-%d') as dob , id_type, document_number, DATE_FORMAT(expiration_date, '%Y-%m-%d') as expdt, class ,state_name from IDInformation.Information order by id desc limit 1;`;

            con.query(query, (err, results) => {
                if (err) reject(new Error(err.message));
                console.log(query);
                resolve(results);
            })
        });
        // console.log(response);
        return response;
    } catch (error) {
        console.log(error);
    }

}

export async function updateNameById(id, firstname,lname,dob,idType, state, docNum, expDate) {
  
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = `UPDATE IDInformation.Information SET firstname = '${firstname}', lastname = '${lname}', DOB = '${dob}', id_type =  '${idType}', document_number = '${docNum}',expiration_date = '${expDate}', state_name = '${state}' WHERE id = ${id}`;
    
                con.query(query , (err, result) => {
                    if (err) reject(new Error(err.message));
                    console.log(query);
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }

}

export async function deleteRowById(id) {
  
    try {
        id = parseInt(id, 10); 
        const response = await new Promise((resolve, reject) => {
            const query = "DELETE FROM IDInformation.Information WHERE id = ?";

            con.query(query, [id] , (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result.affectedRows);
            })
        });

        return response === 1 ? true : false;
    } catch (error) {
        console.log(error);
        return false;
    }

}