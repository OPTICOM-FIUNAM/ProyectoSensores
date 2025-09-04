'use server'
import mysql from 'mysql2/promise'

let pool;
export const createConnection = async() => {
    if(!pool){
        pool=mysql.createPool({
            host: "mysql",
            user: "user",
            port: 3306,
            password: "userpassword",
            database: "sensoresBanos",
            waitForConnections: true,
            connectionLimit: 20,
            queueLimit: 0
        })
    }
    return pool.getConnection();
}