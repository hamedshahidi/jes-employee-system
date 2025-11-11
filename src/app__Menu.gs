
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

function app_TestSubmit() {
  try {
    const jesId = generateJesId_();
    const user = Session.getActiveUser().getEmail() || 'unknown';
    const now = new Date();

    // sample payload
    const emp = {
      etunimi: 'Matti',
      sukunimi: 'Meikäläinen',
      sahkoposti: 'matti.meikalainen@example.com',
      puhelin: '+358401234567',
      osoite: 'Esimerkkikatu 1',
      postinumero: '00100',
      kaupunki: 'Helsinki',
      veroprosentti: 22,
      created_by: user,
      henkilotunnus: '131052-308T',
      iban: 'FI4950009420001234'
    };

    appendEmployee_(jesId, emp);
    SpreadsheetApp.getUi().alert('Test employee added: ' + jesId);
  } catch (e) {
    SpreadsheetApp.getUi().alert('Submit error: ' + (e && e.message));
  }
}

function generateJesId_() {
  const ss = SpreadsheetApp.getActive().getSheetByName('Employees');
  const month = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMM');
  const prefix = 'JES-' + month + '-';
  const data = ss.getDataRange().getValues();
  let seq = 0;
  for (let i = 1; i < data.length; i++) {
    const id = String(data[i][1] || '');
    if (id.startsWith(prefix)) {
      const n = parseInt(id.substring(prefix.length), 10);
      if (!isNaN(n) && n > seq) seq = n;
    }
  }
  return prefix + String(seq + 1).padStart(4, '0');
}

function appendEmployee_(jesId, emp) {
  const ss = SpreadsheetApp.getActive();
  const sEmp = ss.getSheetByName('Employees');
  const sPii = ss.getSheetByName('PII_Employees');
  const sAudit = ss.getSheetByName('AuditLog');
  const now = new Date();

  sEmp.appendRow([
    now, jesId, emp.etunimi, emp.sukunimi, emp.sahkoposti,
    emp.puhelin, emp.osoite, emp.postinumero, emp.kaupunki,
    emp.veroprosentti, emp.created_by
  ]);
  sPii.appendRow([now, jesId, emp.henkilotunnus, emp.iban]);
  sAudit.appendRow([now, emp.created_by, 'CREATE_EMPLOYEE', jesId, 'test submit']);
}

// update menu
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Employee')
    .addItem('Test connection', 'app_TestPing')
    .addItem('Initialize tables', 'app_Init')
    .addItem('Test submit', 'app_TestSubmit')
    .addToUi();
}


