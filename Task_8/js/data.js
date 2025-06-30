export function generateData(rows) {
  const firstNames = ["Raj", "Ameet", "Harsh", "Jay", "Anil", "Neha", "Ravi", "Kiran", "Vijay", "Deepak"];
  const lastNames = ["Solanki", "mishra", "Patel", "Talaviya", "Mehta", "Verma", "Desai", "Iyer", "Reddy", "Kapoor", "Bose"];
  const data = [];

  // Add header row
  data.push(["ID", "First Name", "Last Name", "Age", "Salary"]);

  for (let i = 1; i <= rows && i <= 100000; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = Math.floor(Math.random() * 42) + 18; // 18 to 60
    const salary = Math.floor(Math.random() * 9000000) + 100000; // ₹1L to ₹1Cr

    data.push([i, firstName, lastName, age, salary]);
  }

  // console.log(data);
  
  return data;
}
