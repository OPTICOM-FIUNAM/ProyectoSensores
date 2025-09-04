'use server'
import { createConnection } from '../../../lib/databaseConnection';
import { NextResponse } from 'next/server';

export async function POST(request) {
    let db;
    try {
        const filters = await request.json();


        db = await createConnection();

        let sqlQuery = `
            SELECT
               username
               password
            FROM
                Userdata
        `

        const conditions = [];
        const queryParams = [];

        if (filters.username !== '') {
            conditions.push('username = ?');
            queryParams.push(filters.username);
        }

        if (conditions.length > 0) {
            sqlQuery += ' WHERE ' + conditions.join(' AND ');
        }else {
            return NextResponse.json({ error: 'no username' }, { status: 500 });
  
        }

        const [posts] = await db.query(sqlQuery, queryParams);
        return NextResponse.json(posts);

    } catch (error) {
        console.error("Error fetching discharges:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (db) {
            try {
                await db.release();
            } catch (closeError) {
                console.error("Error closing database connection:", closeError);
            }
        }
    }
}