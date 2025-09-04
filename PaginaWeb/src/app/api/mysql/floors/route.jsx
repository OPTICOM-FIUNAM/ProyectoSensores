import {createConnection} from '../../../lib/databaseConnection';
import { NextResponse } from 'next/server';

export async function GET(request) {
	try {
		const db = await createConnection();
		const school = request.nextUrl.searchParams.get('school');
		const building = request.nextUrl.searchParams.get('building');

		const sqlQuery = `SELECT DISTINCT floor FROM School JOIN Restroom ON School.schoolID = Restroom.schoolID WHERE building = ? AND name = ?`;
		const [posts] = await db.query(sqlQuery, [building, school]);

		return NextResponse.json(posts);
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error.message });
	}
}