function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Employee')
    .addItem('Test connection', 'app_TestPing')
    .addItem('Initialize tables', 'app_Init')
    .addToUi();
}

function app_TestPing() {
  SpreadsheetApp.getUi().alert('It works! Local → clasp → Sheet ✅');
}

function app_Init() {
  try {
    ensureSheets_();
    SpreadsheetApp.getUi().alert('Initialized: Employees, PII_Employees, AuditLog.');
  } catch (e) {
    SpreadsheetApp.getUi().alert('Init error: ' + (e && e.message));
  }
}

// idempotent: reuses existing sheets, sets headers & freezes row 1
function ensureSheets_() {
  var ss = SpreadsheetApp.getActive();

  var EMP_HEADERS = [
    'timestamp','jes_id','etunimi','sukunimi','sahkoposti',
    'puhelin','osoite','postinumero','kaupunki','veroprosentti','created_by'
  ];
  var PII_HEADERS = ['timestamp','jes_id','henkilotunnus','iban'];
  var AUDIT_HEADERS = ['timestamp','actor','action','jes_id','details'];

  function ensure(name, headers) {
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    var firstRow = sh.getRange(1,1,1,headers.length).getValues()[0];
    if (firstRow.join('|') !== headers.join('|')) {
      sh.clear();
      sh.getRange(1,1,1,headers.length).setValues([headers]);
      sh.setFrozenRows(1);
    }
    return sh;
  }

  ensure('Employees', EMP_HEADERS);
  ensure('PII_Employees', PII_HEADERS);
  ensure('AuditLog', AUDIT_HEADERS);
}

