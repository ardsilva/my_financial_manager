# 📊 Sistema de Gestão Financeira & RH (MVP)

Um sistema completo, moderno e **100% gratuito** para gestão de finanças e folha de pagamento, construído com **Next.js**, **Tailwind CSS** e utilizando o **Google Sheets** como banco de dados através do **Google Apps Script**.

![Dashboard Preview](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80)

## ✨ Funcionalidades

- **Dashboard Interativo:** Visualização de Entradas, Saídas e Saldo Líquido com gráficos dinâmicos (Recharts).
- **Filtros e Buscas:** Filtre dados por mês específico ou utilize a busca global por texto.
- **Gestão de Funcionários (CRUD completo):**
  - Adicione novos colaboradores.
  - Edite salários, cargos e descontos.
  - Exclua registros.
  - Cálculo automático de salário líquido.
- **Importação Inteligente:** Faça upload de planilhas Excel (`.xlsx`) ou CSV diretamente pelo navegador para popular o banco de dados.
- **Relatórios Automatizados:** Dispare e-mails formatados diretamente para a contabilidade com um único clique.
- **Autenticação Simples:** Login integrado diretamente com os usuários cadastrados na sua planilha.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [Next.js 15](https://nextjs.org/) (App Router) + React
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Processamento de Excel:** [SheetJS (xlsx)](https://sheetjs.com/)
- **Backend / Banco de Dados:** Google Apps Script + Google Sheets

---

## 🚀 Como Configurar o Banco de Dados (Gratuito)

O grande diferencial deste projeto é não depender de bancos de dados pagos (como PostgreSQL ou MongoDB) para o MVP. Usamos o Google Sheets!

Siga o passo a passo detalhado na pasta dedicada:
👉 **[Guia de Configuração do Google Apps Script](./google-apps-script/README.md)**

Resumo dos passos:
1. Crie uma planilha no Google Sheets com as abas: `Usuarios`, `Dashboard` e `Funcionarios`.
2. Cole o código do arquivo `google-apps-script/Code.gs` no editor de Apps Script da planilha.
3. Publique como um "App da Web" (Web App) com acesso para "Qualquer pessoa".
4. Copie a URL gerada.

---

## 💻 Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`
   - Cole a URL do seu Google Apps Script na variável `GAS_URL`:
   ```env
   GAS_URL="https://script.google.com/macros/s/SUA_URL_AQUI/exec"
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:3000` no seu navegador.

---

## ☁️ Como Fazer o Deploy na Vercel

O deploy na Vercel é extremamente simples, pois o projeto já está configurado para o ecossistema Next.js.

**⚠️ Você NÃO precisa de um arquivo `vercel.json`!**
O Next.js é desenvolvido pela própria Vercel. A plataforma detecta automaticamente que é um projeto Next.js e configura as rotas de API (Serverless Functions) e o frontend sem necessidade de arquivos de configuração extras.

### Passos para o Deploy:

1. Suba o seu código para o GitHub.
2. Acesse [Vercel.com](https://vercel.com/) e faça login.
3. Clique em **"Add New..." > "Project"**.
4. Importe o repositório do seu GitHub.
5. Na tela de configuração ("Configure Project"):
   - Abra a seção **Environment Variables**.
   - Adicione a chave: `GAS_URL`
   - Adicione o valor: `https://script.google.com/macros/s/SUA_URL_AQUI/exec`
   - Clique em **Add**.
6. Clique no botão azul **Deploy**.

Aguarde cerca de 1 a 2 minutos e seu sistema estará no ar, acessível globalmente e conectado à sua planilha!

---

## 📝 Estrutura da Planilha (Referência Rápida)

Para que o sistema funcione perfeitamente, os cabeçalhos (Linha 1) da sua planilha devem ser exatamente estes:

- **Aba `Usuarios`:** `Username` | `Password` | `Role`
- **Aba `Dashboard`:** `Mes` | `Entradas` | `Saidas`
- **Aba `Funcionarios`:** `ID` | `Nome` | `Cargo` | `Salario` | `Descontos` | `Liquido`

*(Dica: O ID do funcionário é gerado automaticamente pelo sistema na hora da criação).*

---

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.
