let defaultEmployees = {
  "123": {
    pass: "123",
    name: "Ali Ahmadi",
    salary: 2500,
    iban: "DE89 3704 0044 0532",
    cardNumber: "1234-5678-9999",
    accountNumber: "ACC-778899",
    status: "Online",
    expiry: "12/28",
    cvv2: "123"
  },

  "456": {
    pass: "456",
    name: "Sara Khan",
    salary: 3000,
    iban: "DE11 2200 7788 9900",
    cardNumber: "9876-1111-2222",
    accountNumber: "ACC-445566",
    status: "Offline",
    expiry: "10/27",
    cvv2: "456"
  }
};

// ================= SAFE LOAD =================
let employees = {};

let saved = localStorage.getItem("employees");

if (saved) {
  const parsed = JSON.parse(saved);

  // merge old + new fields
  for (const id in defaultEmployees) {
    parsed[id] = {
      ...defaultEmployees[id],
      ...parsed[id]
    };
  }

  employees = parsed;
} else {
  employees = defaultEmployees;
}

// ذخیره نسخه نهایی
localStorage.setItem("employees", JSON.stringify(employees));

// ================= HISTORY =================
let loginHistory = JSON.parse(localStorage.getItem("loginHistory")) || [];

// ================= ADMIN =================
const admin = { id: "admin", pass: "0000" };

// ================= FORMAT SALARY =================
function formatSalary(amount){
  return Number(amount).toLocaleString("de-DE") + " €";
}

// ================= LOGIN =================
function login(){

  const empId = document.getElementById("empId").value.trim();
  const pass = document.getElementById("password").value.trim();

  if(!empId || !pass){
    alert("Fill all fields");
    return;
  }

  // ADMIN
  if(empId === admin.id && pass === admin.pass){
    openAdminPanel();
    return;
  }

  const user = employees[empId];

  if(!user){
    alert("Employee not found");
    return;
  }

  if(user.pass !== pass){
    alert("Wrong password");
    return;
  }

  loginHistory.push({
    type: "employee",
    id: empId,
    name: user.name,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("loginHistory", JSON.stringify(loginHistory));

 document.body.innerHTML = `
  <div style="padding:20px;color:white;font-family:tahoma;background:#0f172a;min-height:100vh">

    <h2 style="margin:0;text-align:center">🏦 Commerzbank</h2>

    <p style="opacity:0.6;text-align:center;margin-top:5px;font-size:14px">
      Arian Urban Development Company
    </p>

    <div style="background:#1e293b;padding:12px;margin:10px 0;border-radius:10px">
      🆔 ID: ${empId}
    </div>

    <div style="background:#1e293b;padding:12px;margin:10px 0;border-radius:10px">
      👤 Name: ${user.name}
    </div>

    <div style="background:#1e293b;padding:12px;margin:10px 0;border-radius:10px">
      💰 Salary: ${formatSalary(user.salary)}
    </div>

    <div style="background:#1e293b;padding:12px;margin:10px 0;border-radius:10px">
      🏦 IBAN: ${user.iban}
    </div>

    <div style="background:#1e293b;padding:12px;margin:10px 0;border-radius:10px">
      💳 Card: ${user.cardNumber}
    </div>

    <div style="background:#1e293b;padding:12px;margin:10px 0;border-radius:10px">
      📁 Account: ${user.accountNumber}
    </div>

    <div style="background:#1e293b;padding:12px;margin:10px 0;border-radius:10px">
      📶 Status: 
      <b style="color:${user.status==="Online"?"lightgreen":"orange"}">
        ${user.status}
      </b>
    </div>

    <!-- ✨ NEW FIELDS ADDED -->
    <div style="background:#1e293b;padding:12px;margin:10px 0;border-radius:10px">
      📅 Expiry Date: ${user.expiry || "12/28"}
    </div>

    <div style="background:#1e293b;padding:12px;margin:10px 0;border-radius:10px">
      🔐 CVV2: ${user.cvv2 || "***"}
    </div>

    <button onclick="location.reload()" style="
      width:100%;
      padding:12px;
      background:red;
      color:white;
      border:none;
      border-radius:10px;
      margin-top:20px;
    ">
      Logout
    </button>

  </div>
`; 
}

// ================= ADMIN PANEL =================
function openAdminPanel(){

  let list = "";
  let totalSalary = 0;
  let count = 0;

  for(const id in employees){

    const e = employees[id];
    if(!e) continue;

    const salary = Number(e.salary) || 0;

    count++;
    totalSalary += salary;

    list += `
      <div style="background:#222;padding:12px;margin:10px 0;border-radius:10px;color:white">

        <b>${e.name}</b><br>
        ID: ${id}<br>
        Salary: ${formatSalary(salary)}<br>
        Status: ${e.status}<br><br>

        <button onclick="editEmployee('${id}')"
          style="background:orange;color:white;padding:6px;border:none;border-radius:6px">
          ✏️ Edit
        </button>

        <button onclick="deleteEmployee('${id}')"
          style="background:red;color:white;padding:6px;border:none;border-radius:6px">
          ❌ Delete
        </button>

      </div>
    `;
  }

  document.body.innerHTML = `
  <div style="padding:20px;color:white;font-family:tahoma;background:#0f172a;min-height:100vh">

    <h2 style="margin:0">🏦 Commerzbank</h2>
    <p style="opacity:0.6;margin-top:5px;font-size:14px">
      Arian Urban Development Company
    </p>

    <div style="background:#111;padding:12px;border-radius:10px;margin-top:10px">
      👥 Employees: ${count}<br>
      💰 Total Salary: ${formatSalary(totalSalary)}
    </div>

    <button onclick="showAddForm()" style="background:green;color:white;padding:10px;border:none;border-radius:6px;margin-top:10px;width:100%">
      ➕ Add Employee
    </button>

    <button onclick="showLoginHistory()" style="background:#2196F3;color:white;padding:10px;border:none;border-radius:6px;margin-top:10px;width:100%">
      📜 History
    </button>

    <button onclick="location.reload()" style="background:#444;color:white;padding:10px;border:none;border-radius:6px;margin-top:10px;width:100%">
      🔄 Refresh
    </button>

    <!-- 🔥 RESET BUTTON ADDED -->
    <button onclick="
      localStorage.removeItem('employees');
      localStorage.removeItem('loginHistory');
      location.reload();
    " 
    style="background:#ff3b30;color:white;padding:10px;border:none;border-radius:6px;margin-top:10px;width:100%">
      🔄 Reset Data
    </button>

    <hr>

    ${list}

  </div>
  `;
}

// ================= DELETE =================
function deleteEmployee(id){
  delete employees[id];
  localStorage.setItem("employees", JSON.stringify(employees));
  openAdminPanel();
}

// ================= ADD FORM =================
function showAddForm(){

  document.body.innerHTML = `
  <div style="padding:20px;color:white;font-family:tahoma;background:#0f172a;min-height:100vh">

    <h2 style="margin:0;text-align:center">🏦 Commerzbank</h2>
    <p style="opacity:0.6;text-align:center;margin-top:5px;font-size:14px">
      Arian Urban Development Company
    </p>

    <input id="newId" placeholder="ID" style="width:100%;padding:10px;margin:5px 0"><br>
    <input id="newPass" placeholder="Password" style="width:100%;padding:10px;margin:5px 0"><br>
    <input id="newName" placeholder="Name" style="width:100%;padding:10px;margin:5px 0"><br>
    <input id="newSalary" placeholder="Salary" style="width:100%;padding:10px;margin:5px 0"><br>

    <input id="newIban" placeholder="IBAN" style="width:100%;padding:10px;margin:5px 0"><br>
    <input id="newCard" placeholder="Card Number" style="width:100%;padding:10px;margin:5px 0"><br>
    <input id="newAccount" placeholder="Account Number" style="width:100%;padding:10px;margin:5px 0"><br>

    <!-- 🔥 NEW FIELDS -->
    <input id="newExpiry" placeholder="Expiry Date (12/28)" style="width:100%;padding:10px;margin:5px 0"><br>
    <input id="newCvv2" placeholder="CVV2" style="width:100%;padding:10px;margin:5px 0"><br>

    <select id="newStatus" style="width:100%;padding:10px;margin:5px 0">
      <option>Online</option>
      <option>Offline</option>
    </select>

    <button onclick="addEmployee()" style="
      width:100%;
      padding:12px;
      background:green;
      color:white;
      border:none;
      border-radius:8px;
      margin-top:10px;
    ">
      Save
    </button>

    <button onclick="openAdminPanel()" style="
      width:100%;
      padding:12px;
      background:#444;
      color:white;
      border:none;
      border-radius:8px;
      margin-top:10px;
    ">
      Back
    </button>

  </div>
  `;
}
// ================= ADD =================
function addEmployee(){

  const id = document.getElementById("newId").value.trim();
  const pass = document.getElementById("newPass").value.trim();
  const name = document.getElementById("newName").value.trim();
  const salary = Number(document.getElementById("newSalary").value.trim());
  const iban = document.getElementById("newIban").value.trim();

  const cardNumber = document.getElementById("newCard").value.trim();
  const accountNumber = document.getElementById("newAccount").value.trim();
  const status = document.getElementById("newStatus").value;

  // 🔥 NEW FIELDS
  const expiry = document.getElementById("newExpiry")?.value || "";
  const cvv2 = document.getElementById("newCvv2")?.value || "";

  if(!id || !pass || !name){
    alert("Fill required fields");
    return;
  }

  if(isNaN(salary)){
    alert("Salary must be number");
    return;
  }

  if(employees[id]){
    alert("Employee already exists");
    return;
  }

  employees[id] = {
    pass,
    name,
    salary,
    iban,
    cardNumber,
    accountNumber,
    status,
    expiry,
    cvv2
  };

  localStorage.setItem("employees", JSON.stringify(employees));

  alert("Employee added!");
  openAdminPanel();
}
// ================= EDIT =================
function editEmployee(id){

  const e = employees[id];
  if(!e) return;

  document.body.innerHTML = `
  <div style="padding:20px;color:white;font-family:tahoma;background:#0f172a;min-height:100vh">

    <h2 style="text-align:center">✏️ Edit Employee</h2>

    <input id="editName" value="${e.name}" style="width:100%;padding:10px;margin:5px 0"><br>
    <input id="editSalary" value="${e.salary}" style="width:100%;padding:10px;margin:5px 0"><br>

    <input id="editIban" value="${e.iban}" style="width:100%;padding:10px;margin:5px 0"><br>
    <input id="editCard" value="${e.cardNumber}" style="width:100%;padding:10px;margin:5px 0"><br>
    <input id="editAccount" value="${e.accountNumber}" style="width:100%;padding:10px;margin:5px 0"><br>

    <!-- 🔥 NEW FIELDS -->
    <input id="editExpiry" value="${e.expiry || ''}" placeholder="Expiry Date" style="width:100%;padding:10px;margin:5px 0"><br>
    <input id="editCvv2" value="${e.cvv2 || ''}" placeholder="CVV2" style="width:100%;padding:10px;margin:5px 0"><br>

    <select id="editStatus" style="width:100%;padding:10px;margin:5px 0">
      <option ${e.status==="Online"?"selected":""}>Online</option>
      <option ${e.status==="Offline"?"selected":""}>Offline</option>
    </select>

    <button onclick="saveEdit('${id}')" style="
      width:100%;
      padding:12px;
      background:green;
      color:white;
      border:none;
      border-radius:8px;
      margin-top:10px
    ">
      Save
    </button>

    <button onclick="openAdminPanel()" style="
      width:100%;
      padding:12px;
      background:#444;
      color:white;
      border:none;
      border-radius:8px;
      margin-top:10px
    ">
      Back
    </button>

  </div>
  `;
}
// ================= SAVE EDIT =================
function saveEdit(id){

  const e = employees[id];
  if(!e) return;

  e.name = editName.value.trim();
  e.salary = Number(editSalary.value.trim());
  e.iban = editIban.value.trim();
  e.cardNumber = editCard.value.trim();
  e.accountNumber = editAccount.value.trim();
  e.status = editStatus.value;

  // 🔥 NEW FIELDS
  e.expiry = editExpiry.value.trim();
  e.cvv2 = editCvv2.value.trim();

  // 💾 save to storage
  localStorage.setItem("employees", JSON.stringify(employees));

  alert("Updated!");
  openAdminPanel();
}