function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Employee')
    .addItem('Test connection', 'app_TestPing')
    .addToUi();
}

function app_TestPing() {
  SpreadsheetApp.getUi().alert('It works! Local → clasp → Sheet ✅');
}
