import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const gasUrl = process.env.GAS_URL;
    if (!gasUrl) {
      return NextResponse.json({ error: 'URL do Google Apps Script não configurada.' }, { status: 500 });
    }

    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getDashboard' }),
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ data: data.data });
    } else {
      return NextResponse.json({ error: data.error || 'Erro ao buscar dados' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados do Dashboard.' }, { status: 500 });
  }
}
