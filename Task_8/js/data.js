export function generateData(rows) {
  const firstNames = ["Raj", "Ameet", "Harsh", "Jay", "Anil", "Neha", "Ravi", "Kiran", "Vijay", "Deepak"];
  const lastNames = ["Solanki","mishra", "Patel", "Talaviya", "Mehta", "Verma", "Desai", "Iyer", "Reddy", "Kapoor", "Bose"];
  const data = [];

  for (let i = 1; i <= rows && i <= 100000; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = Math.floor(Math.random() * 42) + 18; // between 18 to 60
    const salary = Math.floor(Math.random() * 90_00_000) + 100_000; // ₹1L to ₹1Cr
    // const avg = Math.floor(Math.random() * 42) + 18; 
    
    data.push({
      id: i,
      firstName: firstName,
      lastName: lastName,
      Age: age,
      Salary: salary,
      // avg: avg
    });
  }

  return data;
}
