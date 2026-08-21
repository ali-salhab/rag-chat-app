import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export const GET = async () => {
  const result = await db.query("select now() as database_time");

  return NextResponse.json({
    connected: true,
    databaseTime: result.rows[0].database_time,
  });
};
