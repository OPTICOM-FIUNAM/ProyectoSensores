import {createConnection} from '../../../lib/databaseConnection';
import { NextResponse } from 'next/server';

export async function GET(request) {
	try {
		const db = await createConnection();
		const school = request.nextUrl.searchParams.get('school');

		const sqlQuery = `SELECT DISTINCT building FROM School JOIN Restroom ON School.schoolID = Restroom.schoolID WHERE name = ?`;
		const [posts] = await db.query(sqlQuery, [school]);

		return NextResponse.json(posts);
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error.message });
	}
}