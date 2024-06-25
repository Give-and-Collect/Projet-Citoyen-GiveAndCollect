import prisma from '../../../utils/db';
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
    const types = await prisma.postType.findMany();
    return NextResponse.json(types);
}