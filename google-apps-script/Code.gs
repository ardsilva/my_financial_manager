function doPost(e) {
  // Necessário para lidar com requisições preflight (CORS) do navegador
  if (!e || !e.postData || !e.postData.contents) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Payload vazio' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var params = JSON.parse(e.postData.contents);
    var action = params.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var result = {};

    // ==========================================
    // LOGIN
    // ==========================================
    if (action === 'login') {
      var sheet = ss.getSheetByName('Usuarios');
      if (!sheet) throw new Error("Aba 'Usuarios' não encontrada.");
      
      var data = sheet.getDataRange().getValues();
      result = { success: false, error: 'Credenciais inválidas' };
      
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == params.username && data[i][1] == params.password) {
          result = { success: true, user: { username: data[i][0], role: data[i][2] } };
          break;
        }
      }
    } 
    // ==========================================
    // DASHBOARD (Leitura)
    // ==========================================
    else if (action === 'getDashboard') {
      var sheet = ss.getSheetByName('Dashboard');
      if (!sheet) throw new Error("Aba 'Dashboard' não encontrada.");

      var data = sheet.getDataRange().getValues();
      var formattedData = [];
      
      for (var i = 1; i < data.length; i++) {
        formattedData.push({
          name: data[i][0],
          entradas: parseFloat(data[i][1] || 0),
          saidas: parseFloat(data[i][2] || 0)
        });
      }
      result = { success: true, data: formattedData };
    }
    // ==========================================
    // FUNCIONÁRIOS (Leitura)
    // ==========================================
    else if (action === 'getEmployees') {
      var sheet = ss.getSheetByName('Funcionarios');
      if (!sheet) throw new Error("Aba 'Funcionarios' não encontrada.");

      var data = sheet.getDataRange().getValues();
      var formattedData = [];
      
      for (var i = 1; i < data.length; i++) {
        formattedData.push({
          id: data[i][0],
          name: data[i][1],
          role: data[i][2],
          salary: parseFloat(data[i][3] || 0),
          discounts: parseFloat(data[i][4] || 0),
          net: parseFloat(data[i][5] || 0)
        });
      }
      result = { success: true, data: formattedData };
    }
    // ==========================================
    // FUNCIONÁRIOS (Escrita)
    // ==========================================
    else if (action === 'addEmployee') {
      var sheet = ss.getSheetByName('Funcionarios');
      if (!sheet) throw new Error("Aba 'Funcionarios' não encontrada.");

      var net = parseFloat(params.salary) - parseFloat(params.discounts);
      var newId = new Date().getTime().toString();
      
      sheet.appendRow([newId, params.name, params.role, params.salary, params.discounts, net]);
      result = { success: true };
    }
    else if (action === 'updateEmployee') {
      var sheet = ss.getSheetByName('Funcionarios');
      if (!sheet) throw new Error("Aba 'Funcionarios' não encontrada.");

      var data = sheet.getDataRange().getValues();
      var idToUpdate = params.id;
      var rowIndex = -1;
      
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == idToUpdate) {
          rowIndex = i + 1; // +1 porque as planilhas começam no índice 1
          break;
        }
      }
      
      if (rowIndex > -1) {
        var net = parseFloat(params.salary) - parseFloat(params.discounts);
        sheet.getRange(rowIndex, 2, 1, 5).setValues([[params.name, params.role, params.salary, params.discounts, net]]);
        result = { success: true };
      } else {
        result = { success: false, error: 'Funcionário não encontrado' };
      }
    }
    else if (action === 'deleteEmployee') {
      var sheet = ss.getSheetByName('Funcionarios');
      if (!sheet) throw new Error("Aba 'Funcionarios' não encontrada.");

      var data = sheet.getDataRange().getValues();
      var idToDelete = params.id;
      var rowIndex = -1;
      
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == idToDelete) {
          rowIndex = i + 1;
          break;
        }
      }
      
      if (rowIndex > -1) {
        sheet.deleteRow(rowIndex);
        result = { success: true };
      } else {
        result = { success: false, error: 'Funcionário não encontrado' };
      }
    }
    // ==========================================
    // IMPORTAR DADOS (Excel/CSV)
    // ==========================================
    else if (action === 'importData') {
      var targetSheetName = params.targetSheet; // 'Dashboard' ou 'Funcionarios'
      var rows = params.data; // Array de arrays (linhas e colunas)
      
      var sheet = ss.getSheetByName(targetSheetName);
      if (!sheet) throw new Error("Aba '" + targetSheetName + "' não encontrada.");

      if (rows && rows.length > 0) {
        // Adiciona as linhas em lote para melhor performance
        sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
      }
      result = { success: true, message: rows.length + " linhas importadas com sucesso." };
    }
    // ==========================================
    // DISPARO DE EMAIL
    // ==========================================
    else if (action === 'sendEmail') {
      var to = params.to;
      var subject = params.subject;
      var body = params.body; // Pode ser HTML
      
      if (!to || !subject || !body) {
        throw new Error("Destinatário, assunto e corpo do email são obrigatórios.");
      }

      MailApp.sendEmail({
        to: to,
        subject: subject,
        htmlBody: body
      });
      
      result = { success: true, message: "Email enviado com sucesso para " + to };
    }
    else {
      result = { success: false, error: 'Ação desconhecida: ' + action };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
