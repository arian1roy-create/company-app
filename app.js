// ================= EMPLOYEES =================
const defaultEmployees = {
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

// ================= FORCE RESET FIX (IMPORTANT) =================
// اگر میخوای همیشه رمز جدید اعمال بشه
if (!localStorage.getItem("employees")) {
  localStorage.setItem("employees", JSON.stringify(defaultEmployees));
}

let employees = JSON.parse(localStorage.getItem("employees"));

// ================= HISTORY =================
let loginHistory = JSON.parse(localStorage.getItem("loginHistory")) || [];

// ================= ADMIN =================
const admin = JSON.parse(localStorage.getItem("admin")) || {
  id: "1111",
  pass: "1111"
};

localStorage.setItem("admin", JSON.stringify(admin));

// ================= FORMAT =================
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
    id: empId,
    name: user.name,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("loginHistory", JSON.stringify(loginHistory));

  openUserPanel(empId, user);
}

// ================= USER PANEL =================
function openUserPanel(empId, user){

  document.body.innerHTML = `
    <div style="padding:20px;color:white;background:#0f172a;min-height:100vh">

      <h2>${user.name}</h2>

      <p>ID: ${empId}</p>
      <p>Salary: ${formatSalary(user.salary)}</p>
      <p>IBAN: ${user.iban}</p>
      <p>Card: ${user.cardNumber}</p>
      <p>Account: ${user.accountNumber}</p>

      <button onclick="location.reload()"
        style="padding:10px;width:100%;background:red;color:white;border:none;border-radius:8px;margin-top:20px">
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
    const salary = Number(e.salary) || 0;

    count++;
    totalSalary += salary;

    list += `
      <div style="background:#222;padding:10px;margin:10px 0;border-radius:10px;color:white">
        <b>${e.name}</b><br>
        ID: ${id}<br>
        Salary: ${formatSalary(salary)}
      </div>
    `;
  }

  document.body.innerHTML = `
    <div style="padding:20px;color:white;background:#0f172a;min-height:100vh">

      <h2>ADMIN PANEL</h2>

      <div style="background:#111;padding:10px;border-radius:10px;margin:10px 0">
        👥 ${count} | 💰 ${formatSalary(totalSalary)}
      </div>

      <button onclick="
        localStorage.removeItem('employees');
        location.reload();
      " style="width:100%;padding:12px;background:red;color:white;border:none;border-radius:10px;margin:10px 0">
        RESET (Fix Login Bug)
      </button>

      <button onclick="location.reload()" style="width:100%;padding:12px;background:#444;color:white;border:none;border-radius:10px">
        Logout
      </button>

      ${list}

    </div>
  `;
}

// ================= RESET =================
function resetData(){
  localStorage.clear();
  location.reload();
}
