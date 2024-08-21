import { getSubstringBetween } from '@/lib/utils';
import { NextResponse } from 'next/server';

const { execSync } = require('child_process');

export async function POST(request) {
    
    const {topic} = await request.json();

    try {
        const madLibOutput = execSync(`npm run generate-mad-lib -- ${topic}`).toString();

        const madLibContent = getSubstringBetween(madLibOutput, "BEGIN", "END")
        .replaceAll("\n", "")
        .replaceAll("\r", "");
    
        return NextResponse.json({ madLibContent }, { status: 200 });
    }

    catch (err) {
        return NextResponse.json({ status: "error" }, { status: 500 });
    }

}