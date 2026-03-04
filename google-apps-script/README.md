# Integração Gratuita com Google Sheets via Google Apps Script (GAS)

Este repositório contém o script necessário para transformar uma planilha comum do Google Sheets em um banco de dados e API (Backend) 100% gratuito para o nosso sistema de Gestão Financeira & RH.

## Passo a Passo de Configuração

### 1. Criando a Planilha
1. Acesse [Google Sheets](https://sheets.google.com) e crie uma nova planilha em branco.
2. Renomeie a planilha para algo como **"Banco de Dados - Gestão"**.
3. Crie exatamente **3 abas** na parte inferior e adicione os seguintes cabeçalhos na **Linha 1** de cada uma:

**Aba 1: `Usuarios`**
- Coluna A: `Username`
- Coluna B: `Password`
- Coluna C: `Role`
*(Adicione um usuário na linha 2 para testar. Ex: `admin` | `admin` | `admin`)*

**Aba 2: `Dashboard`**
- Coluna A: `Mes`
- Coluna B: `Entradas`
- Coluna C: `Saidas`
*(Adicione alguns dados de teste. Ex: `Jan` | `45000` | `32000`)*

**Aba 3: `Funcionarios`**
- Coluna A: `ID`
- Coluna B: `Nome`
- Coluna C: `Cargo`
- Coluna D: `Salario`
- Coluna E: `Descontos`
- Coluna F: `Liquido`

---

### 2. Adicionando o Código (Apps Script)
1. Na sua planilha recém-criada, clique no menu superior em **Extensões > Apps Script**.
2. Uma nova aba será aberta. Apague todo o código que estiver lá (geralmente um `function myFunction() {}`).
3. Abra o arquivo `Code.gs` que está nesta pasta do GitHub.
4. **Copie todo o conteúdo de `Code.gs` e cole no editor do Apps Script.**
5. Clique no ícone de disquete (Salvar) ou pressione `Ctrl + S` / `Cmd + S`.

---

### 3. Publicando como Web App (Gerando a API)
Para que o nosso sistema em Next.js consiga conversar com essa planilha, precisamos publicar esse script como um aplicativo da web.

1. No canto superior direito do Apps Script, clique no botão azul **Implantar** (Deploy).
2. Selecione **Nova implantação** (New deployment).
3. Clique no ícone de engrenagem (⚙️) ao lado de "Selecione o tipo" e escolha **App da Web** (Web App).
4. Preencha as configurações exatamente assim:
   - **Descrição:** `API v1` (ou qualquer nome que preferir)
   - **Executar como:** `Eu (seu-email@gmail.com)`
   - **Quem pode acessar:** `Qualquer pessoa` *(Isso é crucial para não dar erro de permissão/CORS no app)*
5. Clique no botão azul **Implantar**.
6. O Google pedirá para você **Autorizar o acesso**. 
   - Clique em "Autorizar acesso".
   - Escolha a sua conta Google.
   - O Google mostrará um aviso de segurança ("O Google não verificou este app"). Clique em **Avançado** (Advanced) e depois em **Acessar Projeto sem título (não seguro)**.
   - Clique em **Permitir**.
7. Após a autorização, uma janela mostrará a **URL do App da Web** (Web App URL). Ela começa com `https://script.google.com/macros/s/.../exec`.
8. **Copie essa URL.**

---

### 4. Conectando ao Sistema
Agora que você tem a URL da sua API gratuita:

1. Vá até o arquivo `.env.example` (ou `.env` se estiver rodando localmente) do seu projeto Next.js.
2. Adicione a URL copiada na variável:
   ```env
   GAS_URL="https://script.google.com/macros/s/SUA_URL_AQUI/exec"
   ```
3. Salve e reinicie o servidor.

Pronto! Seu sistema agora está lendo e gravando dados diretamente na sua planilha do Google de forma 100% gratuita.

---

### ⚠️ Importante: Atualizando o Script
Sempre que você fizer uma modificação no código do Apps Script (por exemplo, quando formos adicionar a função de envio de e-mails), você **precisa criar uma nova implantação**:
1. Clique em **Implantar > Gerenciar implantações**.
2. Selecione a implantação ativa na esquerda.
3. Clique no ícone de lápis (Editar) no topo direito.
4. Em **Versão**, mude de "Versão 1" para **Nova versão**.
5. Clique em **Implantar**.
*(Se você apenas salvar o código e não gerar uma nova versão, a URL continuará rodando o código antigo).*
