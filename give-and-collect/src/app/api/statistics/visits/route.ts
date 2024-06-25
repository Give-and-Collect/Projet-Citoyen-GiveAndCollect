import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

// Configurez les informations d'authentification
const analytics = google.analytics('v3');
const viewId = 'YOUR_VIEW_ID'; // Remplacez par votre ID de vue Google Analytics
const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/analytics.readonly']
);

export async function GET() {
    try {
        await jwtClient.authorize();
        const response = await analytics.data.ga.get({
            auth: jwtClient,
            ids: `ga:${viewId}`,
            'start-date': '30daysAgo',
            'end-date': 'today',
            metrics: 'ga:pageviews',
        });

        const visitCount = response.data.totalsForAllResults['ga:pageviews'];
        return NextResponse.json({ count: visitCount });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erreur lors de la récupération du nombre de visites' }, { status: 500 });
    }
}
