'use server'
import {createConnection} from '../../../lib/databaseConnection';
import { NextResponse } from 'next/server';

export async function GET() {
    let db;
    try{
        db= await createConnection();
        const sqlQuery = `
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
        const [posts]=await db.query(sqlQuery);
        return NextResponse.json(posts);
    }catch(error){
        console.log(error);
        return NextResponse.json({error: error.message});
    }
    finally {
        if (db) {
            try {
                await db.release();
                console.log("Database connection closed.");
            } catch (closeError) {
                console.error("Error closing database connection:", closeError);
            }
        }
    }
}