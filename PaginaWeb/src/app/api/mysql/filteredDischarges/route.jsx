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
                Discharges.dischargeID,
                School.name,
                Restroom.building,
                CASE WHEN Restroom.floor = 0 THEN 'PB' ELSE Restroom.floor END AS floor,
                Restroom.gender,
                DATE_FORMAT(dischargeTime, '%d/%m/%Y') AS formatedDate,
                DATE_FORMAT(dischargeTime, '%Y/%m/%d') AS heatmapFormatedDate,
                DATE_FORMAT(dischargeTime, '%H:%i:%s') AS formatedTime,
                Sensor.mlPerUse,
                Sensor.type
            FROM
                Discharges
            JOIN Sensor ON Discharges.sensorID = Sensor.sensorID
            JOIN Restroom ON Sensor.restroomID = Restroom.restroomID
            JOIN School ON Restroom.schoolID = School.schoolID
        `;

        const conditions = [];
        const queryParams = [];

        if (filters.school !== '') {
            conditions.push('School.name = ?');
            queryParams.push(filters.school);
        }
        if (filters.building !== '') {
            conditions.push('Restroom.building = ?');
            queryParams.push(filters.building);
        }
        if (filters.floor !== '') {
            const floorValue = filters.floor === 'PB' ? '0' : filters.floor;
            conditions.push('Restroom.floor = ?');
            queryParams.push(floorValue);
        }
        if (filters.type !== '') {
            conditions.push('Sensor.type = ?');
            queryParams.push(filters.type);
        }
        if (filters.gender !== '') {
            conditions.push('Restroom.gender = ?');
            queryParams.push(filters.gender);
        }
        
        if (filters.startDate) {
            conditions.push('Discharges.dischargeTime >= ?');
            queryParams.push(filters.startDate);
        }

        if (filters.endDate) {
            conditions.push('Discharges.dischargeTime <= ?');
            queryParams.push(filters.endDate + ' 23:59:59');
        }

        if (conditions.length > 0) {
            sqlQuery += ' WHERE ' + conditions.join(' AND ');
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