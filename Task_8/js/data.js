// import { Row } from "./structure/row.js";
// import { Cell } from "./structure/cell.js";  // Import your Cell class

// export function generateData(rowCount = 10) {
//   const firstNames = ["Raj", "Ameet", "Harsh", "Jay", "Anil", "Neha", "Ravi", "Kiran", "Vijay", "Deepak"];
//   const lastNames = ["Solanki", "Mishra", "Patel", "Talaviya", "Mehta", "Verma", "Desai", "Iyer", "Reddy", "Kapoor", "Bose"];
//   const data = [];
//   const rows = [];

//   // Create header row
//   const headerLabels = ["ID", "First Name", "Last Name", "Age", "Salary"];
//   if (rowCount > 0) {
//     const headerRow = new Row(0);
//     headerLabels.forEach((label, colIndex) => {
//       const cell = new Cell(0, colIndex, label);
//       headerRow.addCell(cell);
//     });
//     rows.push(headerRow);
//   }

//   // Add header row
//   data.push(["ID", "First Name", "Last Name", "Age", "Salary"]);

//   // Create data rows
//   for (let i = 1; i <= rowCount; i++) {
//     const row = new Row(i);
//     // console.log(row); 

//     // Add cells to row
//     const id = i;
//     const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
//     const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
//     const age = Math.floor(Math.random() * 42) + 18; // 18 to 60
//     const salary = Math.floor(Math.random() * 9000000) + 100000; // ₹1L to ₹1Cr

//     const values = [id, firstName, lastName, age, salary];

//     values.forEach((value, colIndex) => {
//       const cell = new Cell(i, colIndex, value);
//       row.addCell(cell);
//     });

//     data.push([i, firstName, lastName, age, salary]);
//     rows.push(row);
//   }
//   console.log("Rows:", rows);
//   return rows;
// }


export function generateData(rowCount = 10) {
  const firstNames = ["Raj", "Ameet", "Harsh", "Jay", "Anil", "Neha", "Ravi", "Kiran", "Vijay", "Deepak"];
  const lastNames = ["Solanki", "Mishra", "Patel", "Talaviya", "Mehta", "Verma", "Desai", "Iyer", "Reddy", "Kapoor", "Bose"];

  const dataMap = new Map();

  // Header
  const headerLabels = ["ID", "First Name", "Last Name", "Age", "Salary"];
  const headerRowMap = new Map();
  headerLabels.forEach((label, colIndex) => {
    headerRowMap.set(colIndex, label);
  });
  dataMap.set(0, headerRowMap);

  // Data rows
  for (let i = 1; i <= rowCount; i++) {
    const rowMap = new Map();
    const id = i;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = Math.floor(Math.random() * 42) + 18;
    const salary = Math.floor(Math.random() * 9000000) + 100000;
    const values = [id, firstName, lastName, age, salary];

    values.forEach((value, colIndex) => {
      rowMap.set(colIndex, value);
    });

    dataMap.set(i, rowMap);
  }

  // console.log("Data Map:", dataMap);
  return dataMap;
}
