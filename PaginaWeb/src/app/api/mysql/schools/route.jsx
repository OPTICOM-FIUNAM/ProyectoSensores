import {createConnection} from '../../../lib/databaseConnection';
import { NextResponse } from 'next/server';

export async function GET() {
	try{
		const db= await createConnection();
		const sqlQuery= "SELECT DISTINCT name FROM School"
		const [posts] = await db.query(sqlQuery);
		console.log(posts)
		return NextResponse.json(posts);
	}catch(error){
		console.log(error);
		return NextResponse.json({error: error.message})
	}
}