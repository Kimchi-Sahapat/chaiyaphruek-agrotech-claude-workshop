/**
 * Lucky Agrotech — Doc Compilation Tracker
 * Adds a new sheet "Doc Tracker" to the current spreadsheet and fills it in.
 *
 * HOW TO RUN (one time):
 *   1. Open the target spreadsheet in Google Sheets.
 *   2. Extensions → Apps Script.
 *   3. Delete anything in the editor, paste this whole file.
 *   4. Press Run (▶). Approve permissions the first time.
 *   5. A new tab "Doc Tracker" appears with all 48 rows + dropdowns.
 */
function buildDocTracker() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var name = 'Doc Tracker';
  var old = ss.getSheetByName(name);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(name, 0);

  var header = ['No','Main Folder','Sub-Folder / Deliverable','Contents / What to include',
                'Owner','Status','Priority','Access Level','Deadline','Drive Link','Notes'];

  var rows = [
    [1,'01_Company Detail + Governance','01_Company Registration Documents','หนังสือรับรองบริษัท; บอจ.5 / รายชื่อผู้ถือหุ้น; ภพ.20; เลขประจำตัวผู้เสียภาษี; หนังสือบริคณห์สนธิ; ข้อบังคับบริษัท (ถ้ามี); ตรายางบริษัท; สำเนาบัตร/ทะเบียนบ้านกรรมการ (เฉพาะกรณีจำเป็น)','','Not Started','High','Restricted','','',''],
    [2,'01_Company Detail + Governance','02_Shareholders + Board','มติกรรมการ – เอกสารประชุมบอร์ด; minutes การประชุม','','Not Started','High','Restricted','','',''],
    [3,'01_Company Detail + Governance','03_Governance + Roles','Organization chart; Role & Responsibility (ปิ่น/พ่อ/อาฮอลล์/อาวิว/พี่พีช); Authority matrix (ใครอนุมัติเรื่องอะไร); KPI ของแต่ละฝ่าย; Meeting cadence (รายสัปดาห์/รายเดือน)','','Not Started','Medium','Restricted','','',''],
    [4,'01_Company Detail + Governance','04_Legal + Contracts','สัญญาซื้อขาย; สัญญาคู่ค้า; สัญญา supplier; สัญญาจ้างพนักงาน; NDA; เอกสารข้อพิพาท; หนังสือทวงหนี้/เตือน; contract template ต่าง ๆ','','Not Started','High','Restricted','','',''],
    [5,'02_Finance','01_Bank + Payment','ข้อมูลบัญชีธนาคารบริษัท; รายการเดินบัญชี; payment proof; เอกสารรับเงิน/จ่ายเงิน','','Not Started','High','Restricted','','',''],
    [6,'02_Finance','02_Accounting','งบการเงิน; ledger/accounting report; เอกสารส่งสำนักงานบัญชี; รายการค่าใช้จ่ายประจำเดือน','','Not Started','High','Restricted','','',''],
    [7,'02_Finance','03_Tax','ภพ.30; ภงด.1; ภงด.3; ภงด.53; ภาษีหัก ณ ที่จ่าย; ใบกำกับภาษีซื้อ/ขาย','','Not Started','High','Restricted','','',''],
    [8,'02_Finance','04_AR (ลูกหนี้)','รายชื่อลูกหนี้; aging report; หลักฐานการวางบิล; หลักฐานการติดตามหนี้; สถานะหนี้ค้างชำระ','','Not Started','High','Restricted','','',''],
    [9,'02_Finance','05_AP (เจ้าหนี้)','รายชื่อเจ้าหนี้; invoice จาก supplier; กำหนดชำระเงิน; payment status','','Not Started','Medium','Restricted','','',''],
    [10,'02_Finance','06_Budget + Cashflow','budget รายเดือน; cashflow forecast; ค่าใช้จ่ายผิดปกติ; report สำหรับ CEO/Board','','Not Started','High','Restricted','','',''],
    [11,'03_Products','01_Product Master List','รายชื่อสินค้าทั้งหมด; กลุ่มสินค้า; สถานะ (พร้อมขาย/รอทะเบียน/รอฉลาก/รอกระสอบ/ยังไม่พร้อมขาย); owner ของแต่ละสินค้า; link ไฟล์ที่เกี่ยวข้อง','','Not Started','High','Internal','','',''],
    [12,'03_Products','02_Public Product Info','ข้อมูลสินค้าที่พูดกับลูกค้าได้; จุดเด่นสินค้า; วิธีใช้; อัตราการใช้; พืชเป้าหมาย; FAQ สำหรับลูกค้า','','Not Started','High','Public','','',''],
    [13,'03_Products','03_Sales Internal Product Notes','ข้อมูลสำหรับทีมขาย; จุดขาย; pain point ที่สินค้าแก้; วิธีตอบข้อโต้แย้งลูกค้า; คู่แข่งหลัก; ข้อควรระวังในการพูด','','Not Started','Medium','Internal','','',''],
    [14,'03_Products','04_Registration Documents','ทะเบียนปุ๋ย/เอกสารกรมวิชาการเกษตร; เอกสารรอขึ้นทะเบียน; ฉลากที่อนุมัติแล้ว; เลขทะเบียน; เอกสารสูตรที่เกี่ยวข้องกับการขึ้นทะเบียน','','Not Started','High','Restricted','','',''],
    [15,'03_Products','05_Labels + Packaging','artwork ฉลาก; ไฟล์ AI/PDF/PNG; กระสอบ; ขวด; กล่อง; sticker; version history ของฉลาก','','Not Started','Medium','Internal','','',''],
    [16,'03_Products','06_Confidential Formula + Trade Secret','สูตรสินค้า; raw material; hormone/active ingredient (ความลับ); formulation note; supplier เฉพาะทาง','','Not Started','High','Confidential','','','เข้าถึงได้เฉพาะ CEO / พ่อ / ผู้ได้รับอนุญาตเท่านั้น'],
    [17,'03_Products','07_Competitor Comparison','คู่แข่งของแต่ละสินค้า; ราคา; จุดแข็ง/จุดอ่อน; positioning; วิธีสู้ในตลาด','','Not Started','Medium','Internal','','',''],
    [18,'04_Sales + Customer','01_Customer Master','รายชื่อลูกค้า; ร้านค้า; dealer; พื้นที่; เบอร์ติดต่อ; ผู้รับผิดชอบ; ประวัติการซื้อ','','Not Started','High','Restricted','','',''],
    [19,'04_Sales + Customer','02_Sales Pipeline','prospect; dealer ที่กำลังคุย; โอกาสปิดการขาย; next step; owner','','Not Started','Medium','Internal','','',''],
    [20,'04_Sales + Customer','03_Sales Reports','ยอดขายรายวัน/สัปดาห์/เดือน; ยอดขายแยกตามสินค้า; แยกตามลูกค้า; แยกตามพื้นที่','','Not Started','High','Restricted','','',''],
    [21,'04_Sales + Customer','04_Sales Team','หน้าที่พี่พีช; target ทีมขาย; sales script; training material; product training','','Not Started','Medium','Internal','','',''],
    [22,'04_Sales + Customer','05_Customer Issues','complaint; claim; การคืนสินค้า; ปัญหาการใช้งาน; วิธีแก้ไข; status ของแต่ละเคส','','Not Started','Medium','Internal','','',''],
    [23,'05_Marketing','01_Brand Assets','logo; สีแบรนด์; font; brand guideline; template','','Not Started','Medium','Public','','',''],
    [24,'05_Marketing','02_Content Calendar','calendar รายเดือน; post plan; campaign plan; owner; status','','Not Started','Medium','Internal','','',''],
    [25,'05_Marketing','03_Social Media','Facebook; TikTok; LINE OA; YouTube; caption; creative brief','','Not Started','Medium','Internal','','',''],
    [26,'05_Marketing','04_Campaigns + Events','งาน event; booth; promotion; lucky draw; world cup campaign; เอกสารกิจกรรม','','Not Started','Medium','Internal','','',''],
    [27,'05_Marketing','05_Photos + Videos','รูปสินค้า; รูปลูกค้า; รูปสวน; video content; testimonial','','Not Started','Low','Public','','',''],
    [28,'05_Marketing','06_Marketing Performance','reach; engagement; lead; conversion; ad spend; report รายเดือน','','Not Started','Medium','Internal','','',''],
    [29,'06_Factory + Production','01_Factory Contacts','รายชื่อโรงงาน; contact person; เบอร์ติดต่อ; เงื่อนไขการผลิต; MOQ; lead time','','Not Started','Medium','Restricted','','',''],
    [30,'06_Factory + Production','02_Production Orders','PO; ใบสั่งผลิต; production schedule; status การผลิต','','Not Started','High','Internal','','',''],
    [31,'06_Factory + Production','03_Raw Materials','รายการวัตถุดิบ; supplier; ราคา; lot number; COA (ถ้ามี)','','Not Started','Medium','Restricted','','',''],
    [32,'06_Factory + Production','04_QC + Lab','ผลตรวจ; COA; sample test; QC checklist; defect report','','Not Started','Medium','Internal','','',''],
    [33,'06_Factory + Production','05_Inventory + Stock','stock สินค้า; stock packaging; stock วัตถุดิบ; minimum stock level; stock movement','','Not Started','High','Internal','','',''],
    [34,'06_Factory + Production','06_Logistics','ขนส่ง; ค่าขนส่ง; tracking; delivery issue; claim ขนส่ง','','Not Started','Medium','Internal','','',''],
    [35,'07_CEO Office','01_Task Tracker','master task tracker; งานแต่ละฝ่าย; owner; deadline; status; blocker','','Not Started','High','Internal','','',''],
    [36,'07_CEO Office','02_Meeting Notes','weekly meeting; monthly board meeting; sales meeting; product meeting; 1-on-1 notes','','Not Started','Medium','Restricted','','',''],
    [37,'07_CEO Office','03_Decision Log','เรื่องที่ตัดสินใจแล้ว; วันที่ตัดสินใจ; ใครอนุมัติ; เหตุผล; next step','','Not Started','Medium','Restricted','','',''],
    [38,'07_CEO Office','04_Strategy + Expansion','แผนธุรกิจ; แผนขยายสินค้า; แผนเข้ารัฐ; แผน dealer; แผนสาขา/พื้นที่ขาย','','Not Started','High','Confidential','','',''],
    [39,'08_Templates','Meeting minutes template','','','Not Started','Medium','Internal','','',''],
    [40,'08_Templates','Board report template','','','Not Started','Medium','Internal','','',''],
    [41,'08_Templates','Product info template','','','Not Started','Medium','Internal','','',''],
    [42,'08_Templates','Sales report template','','','Not Started','Medium','Internal','','',''],
    [43,'08_Templates','Customer complaint template','','','Not Started','Medium','Internal','','',''],
    [44,'08_Templates','Contract review checklist','','','Not Started','Medium','Internal','','',''],
    [45,'08_Templates','New product launch checklist','','','Not Started','Medium','Internal','','',''],
    [46,'08_Templates','Government bid readiness checklist','','','Not Started','Medium','Internal','','',''],
    [47,'08_Templates','Monthly finance report template','','','Not Started','Medium','Internal','','',''],
    [48,'09_Archive','Archive structure (2026 / 2027 / Old Versions / Superseded Documents)','โฟลเดอร์เก็บของเก่าและเวอร์ชันที่ถูกแทนที่','','Set up only','Low','Restricted','','','ที่เก็บถาวร ไม่ต้องรวบรวมเอกสารใหม่']
  ];

  // Write header + data
  sh.getRange(1, 1, 1, header.length).setValues([header]);
  sh.getRange(2, 1, rows.length, header.length).setValues(rows);

  // Header formatting
  sh.getRange(1, 1, 1, header.length)
    .setFontWeight('bold').setFontColor('#ffffff').setBackground('#1e5631');
  sh.setFrozenRows(1);

  // Column widths
  var widths = [40, 210, 250, 460, 120, 110, 90, 120, 110, 160, 260];
  for (var c = 0; c < widths.length; c++) sh.setColumnWidth(c + 1, widths[c]);
  sh.getRange(2, 4, rows.length, 1).setWrap(true); // Contents column wraps

  var lastRow = rows.length + 1;

  // Dropdown: Status (col 6)
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Not Started','In Progress','Done','N/A','Set up only'], true).build();
  sh.getRange(2, 6, rows.length, 1).setDataValidation(statusRule);

  // Dropdown: Priority (col 7)
  var prioRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['High','Medium','Low'], true).build();
  sh.getRange(2, 7, rows.length, 1).setDataValidation(prioRule);

  // Dropdown: Access Level (col 8)
  var accessRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Public','Internal','Restricted','Confidential'], true).build();
  sh.getRange(2, 8, rows.length, 1).setDataValidation(accessRule);

  // Conditional formatting: Status = Done -> green, In Progress -> amber
  var statusRange = sh.getRange(2, 6, rows.length, 1);
  var rules = sh.getConditionalFormatRules();
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Done').setBackground('#c6efce').setRanges([statusRange]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('In Progress').setBackground('#ffeb9c').setRanges([statusRange]).build());
  // Confidential rows -> red access cell
  var accessRange = sh.getRange(2, 8, rows.length, 1);
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Confidential').setBackground('#f4c7c3').setRanges([accessRange]).build());
  sh.setConditionalFormatRules(rules);

  SpreadsheetApp.getUi().alert('Doc Tracker sheet created: ' + rows.length + ' rows.');
}
