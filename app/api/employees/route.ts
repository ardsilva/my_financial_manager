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
      body: JSON.stringify({ action: 'getEmployees' }),
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ data: data.data });
    } else {
      return NextResponse.json({ error: data.error || 'Erro ao buscar dados' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Employees error:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados de Funcionários.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, role, salary, discounts } = await req.json();

    const gasUrl = process.env.GAS_URL;
    if (!gasUrl) {
      return NextResponse.json({ error: 'URL do Google Apps Script não configurada.' }, { status: 500 });
    }

    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'updateEmployee', id, name, role, salary, discounts }),
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true, message: 'Funcionário atualizado com sucesso.' });
    } else {
      return NextResponse.json({ error: data.error || 'Erro ao atualizar' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Update employee error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar funcionário.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const gasUrl = process.env.GAS_URL;
    if (!gasUrl) {
      return NextResponse.json({ error: 'URL do Google Apps Script não configurada.' }, { status: 500 });
    }

    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteEmployee', id }),
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true, message: 'Funcionário excluído com sucesso.' });
    } else {
      return NextResponse.json({ error: data.error || 'Erro ao excluir' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Delete employee error:', error);
    return NextResponse.json({ error: 'Erro ao excluir funcionário.' }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const { name, role, salary, discounts } = await req.json();

    const gasUrl = process.env.GAS_URL;
    if (!gasUrl) {
      return NextResponse.json({ error: 'URL do Google Apps Script não configurada.' }, { status: 500 });
    }

    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addEmployee', name, role, salary, discounts }),
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true, message: 'Funcionário adicionado com sucesso.' });
    } else {
      return NextResponse.json({ error: data.error || 'Erro ao adicionar' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Add employee error:', error);
    return NextResponse.json({ error: 'Erro ao adicionar funcionário.' }, { status: 500 });
  }
}
