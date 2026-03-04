import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { to, subject, body } = await req.json();

    const gasUrl = process.env.GAS_URL;
    if (!gasUrl) {
      return NextResponse.json({ error: 'URL do Google Apps Script não configurada.' }, { status: 500 });
    }

    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'sendEmail', to, subject, body }),
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true, message: data.message });
    } else {
      return NextResponse.json({ error: data.error || 'Erro ao enviar email' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Erro ao conectar com o servidor de email.' }, { status: 500 });
  }
}
