const formId = document.getElementById("form");
formId.addEventListener("submit", function formSubmit(e) {
    e.preventDefault();
    let n = document.getElementById("fa").value;
    let moduler = 1;
    if (n <= 100) {
        moduler = 10;
    } else if (n <= 1000) {
        moduler = 100;
    } else if (n <= 10000) {
        moduler = 1000;
    } else {
        moduler = 10000;
    }
    console.log("mod: ", moduler);
    ans = factorial(n);
    function factorial(n) {
        let ansArry = [1];
        if (n < 0) {
            return "Enter valid number";
        }
        if (n == 0 || n == 1) {
            return 1;
        }
        for (let i = 2; i < n; i++) {
            ansArry = multi(ansArry, i);
        }
        for (let i = 0; i < ansArry.length - 1; i++) {
            let flag = ansArry[i];
            while (flag < moduler / 10 && ansArry[i] > 0) {
                flag *= 10;
                ansArry[i + 1] *= 10;
            }
            console.log(ansArry[i]);
        }
        return ansArry.reverse().join("");
    }

    function multi(res, num) {
        let carry = 0;
        for (let i = 0; i < res.length; i++) {
            let value = res[i] * num + carry;
            res[i] = value % moduler;
            carry = Math.floor(value / moduler);
        }
        while (carry > 0) {
            res.push(carry % moduler);
            carry = Math.floor(carry / moduler);
        }
        return res;
    }

    document.getElementById("awnser").innerText = `Awnser of ${n} factorial is: ${ans}`

})