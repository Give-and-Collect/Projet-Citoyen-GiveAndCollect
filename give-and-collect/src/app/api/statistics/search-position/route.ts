import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

// Configurez les informations d'authentification
const searchConsole = google.webmasters('v3');
const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/webmasters.readonly']
);

export async function GET() {
    try {
        await jwtClient.authorize();
        const response = await searchConsole.searchanalytics.query({
            auth: jwtClient,
            siteUrl: 'http://localhost:3000/',
            requestBody: {
                startDate: '2023-01-01',
                endDate: '2023-12-31',
                dimensions: ['query'],
            },
        });

        const position = response.data.rows ? response.data.rows[0].position : 0;
        return NextResponse.json({ position });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur lors de la récupération du positionnement de recherche' }, { status: 500 });
    }
}
