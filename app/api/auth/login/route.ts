import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Usuário e senha são obrigatórios.' }, { status: 400 });
    }

    const gasUrl = process.env.GAS_URL;
    if (!gasUrl) {
      return NextResponse.json({ error: 'URL do Google Apps Script não configurada.' }, { status: 500 });
    }

    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username, password }),
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true, user: data.user });
    } else {
      return NextResponse.json({ error: data.error || 'Credenciais inválidas.' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erro ao conectar com a planilha. Verifique a URL do GAS.' }, { status: 500 });
  }
}
