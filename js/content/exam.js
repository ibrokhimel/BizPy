/* Exam-style projects ("boss fights") modelled on the UDE4070CM CW1 mock test.
   Each one reads input(), so the checker re-runs the learner's code with several input sets
   (run_input) and reads the values off labelled output lines. Money signs before f-string braces
   are written ${D} because "$" + "{" inside py`` would be read by JavaScript. */
window.FP = window.FP || {};
(function (py) {
const D = "$";
/* Shared Python helpers for the tests: find a labelled output line and read its last number. */
const H = py`
def line_with(o, word):
    # Prefer "Label : value" lines, so a header such as "--- BILL ---" isn't mistaken for the value line.
    for need_colon in (True, False):
        for l in o.splitlines():
            low = l.lower().strip()
            if word.lower() in low and not low.startswith("enter") and (":" in low or not need_colon):
                return l
    raise AssertionError("Couldn't find an output line labelled '" + word + "'. Use the labels from the sample output.")

def val(o, word):
    found = nums(line_with(o, word).split(":", 1)[-1])
    assert found, "The line labelled '" + word + "' has no number"
    return found[-1]

def near(a, b):
    return abs(a - b) <= 0.011

def doc_comments(code):
    return " ".join(l.split("#", 1)[1].lower() for l in code.splitlines() if "#" in l)
`;
FP.BOSSES = [
{
  id: "boss_01", title: "Mock Task 1: Food Order Bill", tagline: "Read, total, discount, display. 25 marks.", xp: 250, unlockAfter: "py_09_loops",
  stdin: "Ahmed\n3\n120\n100\n150",
  brief: `<p>This is <b>Task 1 from the CW1 mock</b>. Write a program that works out the total bill for a customer's food order.</p><p><b>Sample input:</b> Ahmed, 3 items, prices 120, 100, 150</p><pre>----- FOOD ORDER BILL -----
Customer Name : Ahmed
Total Amount  : $370.0
Discount      : $55.5
Amount Payable: $314.5</pre><p>The checker also tries other customers, including a bill of exactly $300, which gets <b>no</b> discount.</p>`,
  requirements: [
    "Read the customer's name and the number of food items",
    "Read the price of each item in a loop (Enter price of item 1, 2, ...)",
    "If the total is greater than $300, apply a 15% discount; otherwise the discount is 0",
    "Display the customer's name, Total Amount, Discount and Amount Payable using those labels",
  ],
  starter: py`# Task 1: Online Food Order Billing System

# Input: customer name and number of items

# Input + Calculation: read each price and add it to the total

# Calculation: 15% discount if total > 300

# Output: print the bill
`,
  solution: py`# Task 1: Online Food Order Billing System

# Input: customer name and number of items
name = input("Enter customer name: ")
n = int(input("Enter number of food items: "))

# Input + Calculation: read each price and add it to the total
total = 0.0
for i in range(1, n + 1):
    price = float(input(f"Enter price of item {i}: "))
    total = total + price

# Calculation: 15% discount if total > 300
if total > 300:
    discount = total * 0.15
else:
    discount = 0.0
payable = total - discount

# Output: print the bill
print("----- FOOD ORDER BILL -----")
print(f"Customer Name : {name}")
print(f"Total Amount  : ${D}{total}")
print(f"Discount      : ${D}{discount}")
print(f"Amount Payable: ${D}{payable}")
`,
  test: H + py`
assert "Ahmed" in line_with(out, "Name"), "Show the customer's name"
assert near(val(out, "Total"), 370), "Sample: Total Amount should be 370.0"
assert near(val(out, "Discount"), 55.5), "Sample: Discount should be 55.5"
assert near(val(out, "Payable"), 314.5), "Sample: Amount Payable should be 314.5"
for inputs, t, d, p in ((["Bob", "2", "100", "100"], 200, 0, 200),
                        (["Cara", "1", "300"], 300, 0, 300),
                        (["Dan", "2", "200", "200.5"], 400.5, 60.075, 340.425),
                        (["Eve", "4", "50", "50", "50", "200"], 350, 52.5, 297.5)):
    _, o = run_input(inputs)
    label = "With prices " + ", ".join(inputs[2:])
    assert inputs[0] in o, label + " the name " + inputs[0] + " should be shown"
    assert near(val(o, "Total"), t), label + " Total Amount should be " + str(t)
    assert near(val(o, "Discount"), d), label + " Discount should be " + str(d) + (" (300 is not greater than 300)" if t == 300 else "")
    assert near(val(o, "Payable"), p), label + " Amount Payable should be " + str(p)
`,
},
{
  id: "boss_02", title: "Mock Task 2: Student Marks Analysis", tagline: "A list, five statistics and a verdict. 25 marks.", xp: 250, unlockAfter: "py_09_loops",
  stdin: "85\n70\n90\n45\n80\n60",
  brief: `<p>This is <b>Task 2 from the CW1 mock</b>. Read 6 subject marks into a <b>list</b> and analyse them.</p><p><b>Sample input:</b> 85, 70, 90, 45, 80, 60</p><pre>----- STUDENT RESULT -----
Total Marks       : 430
Average Marks     : 71.67
Highest Mark      : 90
Lowest Mark       : 45
Subjects with 75+ : 3
Result            : PASS</pre>`,
  requirements: [
    "Read the marks of 6 subjects and store them in a list",
    "Calculate the total and the average (shown to 2 decimal places)",
    "Display the highest and lowest marks",
    "Count the subjects scored 75 or above",
    "Display PASS if the average is 50 or above, otherwise FAIL",
  ],
  starter: py`# Task 2: Student Marks Analysis System

# Input + Storage: read 6 marks into a list

# Calculation: total, average, highest, lowest, count of 75+

# Output: print the result
`,
  solution: py`# Task 2: Student Marks Analysis System

# Input + Storage: read 6 marks into a list
marks = []
for i in range(1, 7):
    mark = float(input(f"Enter mark {i}: "))
    marks.append(mark)

# Calculation: total, average, highest, lowest, count of 75+
total = sum(marks)
average = total / len(marks)
highest = max(marks)
lowest = min(marks)
count = 0
for m in marks:
    if m >= 75:
        count += 1
result = "PASS" if average >= 50 else "FAIL"

# Output: print the result
print("----- STUDENT RESULT -----")
print(f"Total Marks       : {total:g}")
print(f"Average Marks     : {average:.2f}")
print(f"Highest Mark      : {highest:g}")
print(f"Lowest Mark       : {lowest:g}")
print(f"Subjects with 75+ : {count}")
print(f"Result            : {result}")
`,
  test: H + py`
assert "append" in code or "[" in code, "Store the marks in a list"
def check(o, label, t, a, hi, lo, c, r):
    assert near(val(o, "Total"), t), label + ": Total should be " + str(t)
    assert near(val(o, "Average"), a), label + ": Average should be " + str(a) + " (2 decimal places)"
    assert near(val(o, "Highest"), hi), label + ": Highest should be " + str(hi)
    assert near(val(o, "Lowest"), lo), label + ": Lowest should be " + str(lo)
    assert near(val(o, "Subjects"), c),label + ": Subjects with 75+ should be " + str(c)
    res = line_with(o, "Result").upper()
    assert r in res and not (r == "PASS" and "FAIL" in res), label + ": Result should be " + r
check(out, "Sample", 430, 71.67, 90, 45, 3, "PASS")
for marks, exp in ((["40", "30", "50", "20", "60", "45"], (245, 40.83, 60, 20, 0, "FAIL")),
                   (["50"] * 6, (300, 50, 50, 50, 0, "PASS")),
                   (["75", "75", "75", "75", "75", "74"], (449, 74.83, 75, 74, 5, "PASS"))):
    _, o = run_input(marks)
    check(o, "With marks " + ", ".join(marks), *exp)
`,
},
{
  id: "boss_03", title: "Mock Task 3: Employee Salary (OOP)", tagline: "Class, constructor, two methods, one object. 25 marks.", xp: 300, unlockAfter: "py_13_oop_classes",
  stdin: "E205\nSarah\n4000",
  brief: `<p>This is <b>Task 3 from the CW1 mock</b>. Build an Employee Salary Management System using a class.</p><ul><li>HRA (House Rent Allowance) = 15% of the basic salary</li><li>TA (Transport Allowance) = 5% of the basic salary</li><li>Gross salary = Basic + HRA + TA</li></ul><p><b>Sample input:</b> E205, Sarah, 4000</p><pre>----- EMPLOYEE DETAILS -----
Employee ID         : E205
Employee Name       : Sarah
Basic Salary        : $4000.0
House Rent Allowance: $600.0
Transport Allowance : $200.0
Gross Salary        : $4800.0</pre><p>The checker also creates its own <code>Employee("E1", "Ali", 1000.0)</code>, so keep the parameters in that order: ID, name, basic salary.</p>`,
  requirements: [
    "A class named Employee whose constructor (__init__) takes the employee ID, name and basic salary",
    "A method calculateSalary() that works out HRA, TA and gross salary",
    "A method displayDetails() that prints all the details, including basic, HRA, TA and gross",
    "Read the details with input(), create an Employee object and call both methods",
  ],
  starter: py`# Task 3: Employee Salary Management System Using OOP

class Employee:
    # Constructor: store the employee details
    def __init__(self, emp_id, name, basic):
        pass

    # Calculation: HRA 15%, TA 5%, gross = basic + HRA + TA
    def calculateSalary(self):
        pass

    # Output: print every detail
    def displayDetails(self):
        pass

# Input: read the details, then create the object and call the methods
`,
  solution: py`# Task 3: Employee Salary Management System Using OOP

class Employee:
    # Constructor: store the employee details
    def __init__(self, emp_id, name, basic):
        self.emp_id = emp_id
        self.name = name
        self.basic = basic

    # Calculation: HRA 15%, TA 5%, gross = basic + HRA + TA
    def calculateSalary(self):
        self.hra = self.basic * 0.15
        self.ta = self.basic * 0.05
        self.gross = self.basic + self.hra + self.ta
        return self.gross

    # Output: print every detail
    def displayDetails(self):
        print("----- EMPLOYEE DETAILS -----")
        print(f"Employee ID         : {self.emp_id}")
        print(f"Employee Name       : {self.name}")
        print(f"Basic Salary        : ${D}{self.basic}")
        print(f"House Rent Allowance: ${D}{self.hra}")
        print(f"Transport Allowance : ${D}{self.ta}")
        print(f"Gross Salary        : ${D}{self.gross}")

# Input: read the details, then create the object and call the methods
emp_id = input("Enter Employee ID: ")
name = input("Enter Employee Name: ")
basic = float(input("Enter Basic Salary: "))
emp = Employee(emp_id, name, basic)
emp.calculateSalary()
emp.displayDetails()
`,
  test: H + py`
E = ns.get("Employee")
assert isinstance(E, type), "Create a class named Employee"
for m in ("calculateSalary", "displayDetails"):
    assert callable(getattr(E, m, None)), "Employee needs a method named " + m + "()"
assert "E205" in out and "Sarah" in out, "Display the employee ID and name"
assert near(val(out, "Basic"), 4000) and near(val(out, "Rent"), 600) and near(val(out, "Transport"), 200) and near(val(out, "Gross"), 4800), "Sample: Basic 4000.0, HRA 600.0, TA 200.0, Gross 4800.0"
e = E("E1", "Ali", 1000.0)
e.calculateSalary()
_, shown = capture(e.displayDetails)
assert "Ali" in shown and "E1" in shown, "displayDetails() should print the object's own ID and name"
assert near(val(shown, "Rent"), 150) and near(val(shown, "Transport"), 50) and near(val(shown, "Gross"), 1200), "For Employee('E1', 'Ali', 1000.0): HRA 150.0, TA 50.0, Gross 1200.0"
_, o = run_input(["E9", "Zed", "2500"])
assert "Zed" in o and near(val(o, "Gross"), 3000), "With basic 2500 the gross salary should be 3000.0"
`,
},
{
  id: "boss_04", title: "Mock Task 4: Debug the Expense Tracker", tagline: "Fix it, test it, document it. 25 marks.", xp: 250, unlockAfter: "py_18_testing",
  stdin: "3\n100\n200\n300",
  brief: `<p>This is <b>Task 4 from the CW1 mock</b>. The program below should work out the total and average of a customer's shopping expenses, but it has several syntax and logic errors.</p><ol type="a"><li><b>Debugging (15 marks):</b> fix every error.</li><li><b>Testing (5 marks):</b> record these test cases as comments, with expected and actual output and Pass/Fail:<br>1: 100, 200, 300 → total 600, average 200.0<br>2: 150 → total 150, average 150.0<br>3: 50, 100, 150, 200 → total 500, average 125.0</li><li><b>Documentation (5 marks):</b> add comments that label the <b>Input</b>, <b>Storage</b>, <b>Calculation</b> and <b>Output</b> sections.</li></ol>`,
  requirements: [
    "The program runs and reads exactly n expenses",
    "It prints the correct Total Expenses and Average Expense for all three test cases",
    "A test table in comments showing each test's input, expected values and Pass/Fail",
    "Comments label the Input, Storage, Calculation and Output sections",
  ],
  starter: py`n = int(input("Enter number of expenses: ")
expenses = []
for i in range(1, n):
amount = float(input("Enter expense: "))
expenses.append(amount)
total = 0
for amount in expenses
total = total + amount
average = total / n
print("Total Expenses:", total)
print("Average Expense:", average)
`,
  solution: py`# Expense tracker: total and average of a customer's shopping expenses.

# Input: the number of expenses
n = int(input("Enter number of expenses: "))      # fixed: missing )

# Storage: keep each expense in a list
expenses = []
for i in range(n):                                  # fixed: range(1, n) read one too few
    # Input: one expense amount
    amount = float(input("Enter expense: "))        # fixed: indented into the loop
    expenses.append(amount)

# Calculation: total and average
total = 0
for amount in expenses:                             # fixed: missing :
    total = total + amount                          # fixed: indented into the loop
average = total / n

# Output: display the total and average
print("Total Expenses:", total)
print("Average Expense:", average)

# ---------------- Test table ----------------
# Test | Input Expenses      | Expected Total | Expected Average | Actual        | Pass/Fail
# 1    | 100, 200, 300       | 600            | 200.0            | 600.0 / 200.0 | Pass
# 2    | 150                 | 150            | 150.0            | 150.0 / 150.0 | Pass
# 3    | 50, 100, 150, 200   | 500            | 125.0            | 500.0 / 125.0 | Pass
`,
  test: H + py`
for inputs, t, a in ((["3", "100", "200", "300"], 600, 200), (["1", "150"], 150, 150), (["4", "50", "100", "150", "200"], 500, 125)):
    _, o = run_input(inputs)
    label = "With expenses " + ", ".join(inputs[1:])
    assert near(val(o, "Total"), t), label + " the total should be " + str(t)
    assert near(val(o, "Average"), a), label + " the average should be " + str(a)
c = doc_comments(code)
for word, label in (("input", "Input"), ("stor", "Storage"), ("calculat", "Calculation"), ("output", "Output")):
    assert word in c, "Documentation: add a comment labelling the " + label + " section"
for n in ("600", "150", "125"):
    assert n in c, "Testing: put the test table in comments, including the expected value " + n
assert "pass" in c, "Testing: record Pass/Fail for each test case in the comment table"
`,
},
{
  id: "boss_05", title: "Practice: Electricity Bill", tagline: "Tiered rates and a surcharge.", xp: 250, unlockAfter: "py_09_loops",
  stdin: "Ahmed\n250",
  brief: `<p>A new task in the same style as the test. A power company charges by the unit, in tiers:</p><table><tr><td>First 100 units</td><td>$0.50 per unit</td></tr><tr><td>Units 101 to 200</td><td>$0.75 per unit</td></tr><tr><td>Above 200 units</td><td>$1.20 per unit</td></tr></table><p>If the bill is <b>more than $150</b>, add a 10% surcharge.</p><p><b>Sample input:</b> Ahmed, 250 units</p><pre>----- ELECTRICITY BILL -----
Customer Name : Ahmed
Units Used    : 250
Bill Amount   : $185.0
Surcharge     : $18.5
Total Payable : $203.5</pre>`,
  requirements: [
    "Read the customer's name and the units used (a whole number)",
    "Work out the tiered bill amount",
    "Add a 10% surcharge only when the bill is greater than $150",
    "Display the Name, Units, Bill Amount, Surcharge and Total Payable",
  ],
  starter: py`# Electricity Bill

# Input

# Calculation: tiered rates

# Calculation: surcharge

# Output
`,
  solution: py`# Electricity Bill

# Input
name = input("Enter customer name: ")
units = int(input("Enter units used: "))

# Calculation: tiered rates
if units <= 100:
    bill = units * 0.50
elif units <= 200:
    bill = 100 * 0.50 + (units - 100) * 0.75
else:
    bill = 100 * 0.50 + 100 * 0.75 + (units - 200) * 1.20

# Calculation: surcharge
surcharge = bill * 0.10 if bill > 150 else 0.0
total = bill + surcharge

# Output
print("----- ELECTRICITY BILL -----")
print(f"Customer Name : {name}")
print(f"Units Used    : {units}")
print(f"Bill Amount   : ${D}{round(bill, 2)}")
print(f"Surcharge     : ${D}{round(surcharge, 2)}")
print(f"Total Payable : ${D}{round(total, 2)}")
`,
  test: H + py`
assert "Ahmed" in out, "Show the customer's name"
for units, b, s, t in (("250", 185, 18.5, 203.5), ("80", 40, 0, 40), ("100", 50, 0, 50), ("200", 125, 0, 125), ("230", 161, 16.1, 177.1), ("150", 87.5, 0, 87.5)):
    _, o = run_input(["Test", units])
    assert near(val(o, "Bill"), b), "For " + units + " units the Bill Amount should be " + str(b)
    assert near(val(o, "Surcharge"), s), "For " + units + " units the Surcharge should be " + str(s)
    assert near(val(o, "Payable"), t), "For " + units + " units the Total Payable should be " + str(t)
`,
},
{
  id: "boss_06", title: "Practice: Monthly Sales Report", tagline: "Six months, one list, a bonus decision.", xp: 250, unlockAfter: "py_09_loops",
  stdin: "5200\n4800\n6100\n3900\n5000\n7000",
  brief: `<p>A sales rep's results for 6 months. Read them into a list and report on them.</p><ul><li>The monthly target is <b>$5000</b>. Count the months where sales <b>reached</b> it (5000 or more).</li><li>The rep earns a <b>BONUS</b> if total sales are <b>more than $30000</b>. Otherwise print <b>NO BONUS</b>.</li></ul><p><b>Sample input:</b> 5200, 4800, 6100, 3900, 5000, 7000</p><pre>----- SALES REPORT -----
Total Sales      : $32000.0
Average Sales    : $5333.33
Best Month       : $7000.0
Worst Month      : $3900.0
Months on Target : 4
Bonus            : BONUS</pre>`,
  requirements: [
    "Read 6 monthly sales figures into a list",
    "Show the total, the average (2 decimal places), the best month and the worst month",
    "Count the months with sales of 5000 or more",
    "Show BONUS if the total is greater than 30000, otherwise NO BONUS",
  ],
  starter: py`# Monthly Sales Report

# Input + Storage

# Calculation

# Output
`,
  solution: py`# Monthly Sales Report

# Input + Storage
sales = []
for month in range(1, 7):
    sales.append(float(input(f"Enter sales for month {month}: ")))

# Calculation
total = sum(sales)
average = total / len(sales)
on_target = 0
for s in sales:
    if s >= 5000:
        on_target += 1
bonus = "BONUS" if total > 30000 else "NO BONUS"

# Output
print("----- SALES REPORT -----")
print(f"Total Sales      : ${D}{total}")
print(f"Average Sales    : ${D}{average:.2f}")
print(f"Best Month       : ${D}{max(sales)}")
print(f"Worst Month      : ${D}{min(sales)}")
print(f"Months on Target : {on_target}")
print(f"Bonus            : {bonus}")
`,
  test: H + py`
def check(o, label, t, a, best, worst, c, bonus):
    assert near(val(o, "Total"), t), label + ": Total should be " + str(t)
    assert near(val(o, "Average"), a), label + ": Average should be " + str(a)
    assert near(val(o, "Best"), best), label + ": Best Month should be " + str(best)
    assert near(val(o, "Worst"), worst), label + ": Worst Month should be " + str(worst)
    assert near(val(o, "Target"), c), label + ": Months on Target should be " + str(c)
    line = line_with(o, "Bonus").upper().split(":", 1)[-1]
    assert ("NO BONUS" in line) == (bonus == "NO BONUS") and "BONUS" in line, label + ": expected " + bonus
check(out, "Sample", 32000, 5333.33, 7000, 3900, 4, "BONUS")
for s, exp in ((["1000"] * 6, (6000, 1000, 1000, 1000, 0, "NO BONUS")),
               (["5000"] * 6, (30000, 5000, 5000, 5000, 6, "NO BONUS")),
               (["9000", "1", "1", "1", "1", "21000"], (30004, 5000.67, 21000, 1, 2, "BONUS"))):
    _, o = run_input(s)
    check(o, "With sales " + ", ".join(s), *exp)
`,
},
{
  id: "boss_07", title: "Practice: Product Inventory (OOP)", tagline: "A Product class with stock value and VAT.", xp: 300, unlockAfter: "py_13_oop_classes",
  stdin: "P101\nLaptop\n500\n4",
  brief: `<p>An OOP task in the style of Task 3. Create a class <code>Product</code> whose constructor takes <code>product_id, name, price, quantity</code>, in that order.</p><ul><li><code>calculateValue()</code> works out the stock value (price × quantity), VAT (12% of the stock value) and the total (value + VAT), and returns the total</li><li><code>displayDetails()</code> prints everything</li></ul><p><b>Sample input:</b> P101, Laptop, 500, 4</p><pre>----- PRODUCT DETAILS -----
Product ID   : P101
Product Name : Laptop
Unit Price   : $500.0
Quantity     : 4
Stock Value  : $2000.0
VAT          : $240.0
Total Value  : $2240.0</pre>`,
  requirements: [
    "Class Product with __init__(self, product_id, name, price, quantity)",
    "calculateValue() works out the stock value, VAT (12%) and total, and returns the total",
    "displayDetails() prints all the details",
    "Read the details with input() (price as a float, quantity as an int), create the object and call both methods",
  ],
  starter: py`# Product Inventory (OOP)

class Product:
    pass

# Input, then create the object and call its methods
`,
  solution: py`# Product Inventory (OOP)

class Product:
    # Constructor: store the product details
    def __init__(self, product_id, name, price, quantity):
        self.product_id = product_id
        self.name = name
        self.price = price
        self.quantity = quantity

    # Calculation: stock value, 12% VAT and total
    def calculateValue(self):
        self.value = self.price * self.quantity
        self.vat = self.value * 0.12
        self.total = self.value + self.vat
        return self.total

    # Output: print every detail
    def displayDetails(self):
        print("----- PRODUCT DETAILS -----")
        print(f"Product ID   : {self.product_id}")
        print(f"Product Name : {self.name}")
        print(f"Unit Price   : ${D}{self.price}")
        print(f"Quantity     : {self.quantity}")
        print(f"Stock Value  : ${D}{self.value}")
        print(f"VAT          : ${D}{round(self.vat, 2)}")
        print(f"Total Value  : ${D}{round(self.total, 2)}")

# Input, then create the object and call its methods
pid = input("Enter Product ID: ")
name = input("Enter Product Name: ")
price = float(input("Enter Unit Price: "))
qty = int(input("Enter Quantity: "))
product = Product(pid, name, price, qty)
product.calculateValue()
product.displayDetails()
`,
  test: H + py`
P = ns.get("Product")
assert isinstance(P, type), "Create a class named Product"
for m in ("calculateValue", "displayDetails"):
    assert callable(getattr(P, m, None)), "Product needs a method named " + m + "()"
assert "P101" in out and "Laptop" in out, "Display the product ID and name"
assert near(val(out, "Stock"), 2000) and near(val(out, "VAT"), 240) and near(val(out, "Total"), 2240), "Sample: Stock Value 2000.0, VAT 240.0, Total 2240.0"
p = P("P1", "Pen", 2.5, 10)
r = p.calculateValue()
assert r is not None and near(r, 28), "calculateValue() should return the total: 28.0 for 10 pens at 2.5"
_, shown = capture(p.displayDetails)
assert "Pen" in shown and near(val(shown, "VAT"), 3), "displayDetails() for 10 pens at 2.5 should show VAT 3.0"
`,
},
{
  id: "boss_08", title: "Practice: Debug the Grade Calculator", tagline: "Seven bugs, a test table and comments.", xp: 250, unlockAfter: "py_18_testing",
  stdin: "Ali\n60\n70\n80\n90",
  brief: `<p>A new Task 4-style problem. The program should read a student's name and <b>4</b> marks, work out the total and average, and print <code>PASS</code> if the average is <b>50 or above</b>, otherwise <code>FAIL</code>.</p><p>It has syntax <b>and</b> logic errors. Fix them all, record a test table in comments covering a normal case, a boundary case (average exactly 50) and a fail case, with Pass/Fail for each, and label the Input, Storage, Calculation and Output sections.</p>`,
  requirements: [
    "The program runs, reads 4 marks and prints the correct Total and Average",
    "It prints PASS when the average is 50 or above (exactly 50 passes), otherwise FAIL",
    "A test table in comments with at least 3 cases and Pass/Fail",
    "Comments label the Input, Storage, Calculation and Output sections",
  ],
  starter: py`name = input("Enter student name: ")
marks = []
for i in range(1, 4)
    mark = int(input("Enter mark: "))
marks.append(mark)
total = 0
for m in marks:
    total == total + m
average = total / 4
print("Total:", total)
print("Average:", average)
if average > 50:
    print(name, "PASS")
else
    print(name, "FAIL")
`,
  solution: py`# Grade calculator: total, average and PASS/FAIL for 4 marks.

# Input: the student's name
name = input("Enter student name: ")

# Storage: the 4 marks go in a list
marks = []
for i in range(4):                       # fixed: range(1, 4) read only 3 marks; added :
    # Input: one mark (float so 55.5 works)
    mark = float(input("Enter mark: "))
    marks.append(mark)                   # fixed: append was outside the loop

# Calculation: total and average
total = 0
for m in marks:
    total = total + m                    # fixed: == compared instead of assigning
average = total / 4

# Output: results
print("Total:", total)
print("Average:", average)
if average >= 50:                        # fixed: exactly 50 should pass
    print(name, "PASS")
else:                                    # fixed: missing :
    print(name, "FAIL")

# ---------------- Test table ----------------
# Test | Input marks      | Expected total | Expected avg | Expected result | Pass/Fail
# 1    | 60, 70, 80, 90   | 300            | 75.0         | PASS            | Pass
# 2    | 50, 50, 50, 50   | 200            | 50.0         | PASS (boundary) | Pass
# 3    | 10, 20, 30, 40   | 100            | 25.0         | FAIL            | Pass
`,
  test: H + py`
for marks, t, a, r in ((["60", "70", "80", "90"], 300, 75, "PASS"), (["50", "50", "50", "50"], 200, 50, "PASS"),
                       (["10", "20", "30", "40"], 100, 25, "FAIL"), (["49", "50", "50", "50"], 199, 49.75, "FAIL"),
                       (["55.5", "44.5", "60", "40"], 200, 50, "PASS")):
    _, o = run_input(["Sam"] + marks)
    label = "With marks " + ", ".join(marks)
    assert near(val(o, "Total"), t), label + " the total should be " + str(t)
    assert near(val(o, "Average"), a), label + " the average should be " + str(a)
    res = [l for l in o.splitlines() if "Sam" in l and ("PASS" in l or "FAIL" in l)]
    assert res and r in res[-1] and not (r == "PASS" and "FAIL" in res[-1]), label + " expected " + r
c = doc_comments(code)
for word, label in (("input", "Input"), ("stor", "Storage"), ("calculat", "Calculation"), ("output", "Output")):
    assert word in c, "Documentation: add a comment labelling the " + label + " section"
rows = [l for l in code.splitlines() if l.strip().startswith("#") and "pass" in l.lower() and re.search(r"\d", l)]
assert len(rows) >= 3, "Testing: write at least 3 test-table rows in comments, each with numbers and Pass/Fail"
`,
},
{
  id: "boss_09", title: "Practice: Hotel Booking", tagline: "Room types, long-stay discount, tax.", xp: 250, unlockAfter: "py_09_loops",
  stdin: "Ahmed\ndouble\n7",
  brief: `<p>Work out a hotel bill. Room rates per night are <b>single $80</b>, <b>double $120</b> and <b>suite $200</b>. Accept the room type in any capitals (<code>Double</code>, <code>SUITE</code>).</p><ul><li>Stays of <b>7 nights or more</b> get a 10% discount on the room charge</li><li>Add 12% tax on the amount after the discount</li><li>For any other room type, print <code>Invalid room type</code> and nothing else</li></ul><p><b>Sample input:</b> Ahmed, double, 7</p><pre>----- HOTEL BILL -----
Guest Name    : Ahmed
Room Charge   : $840.0
Discount      : $84.0
Tax           : $90.72
Total Payable : $846.72</pre>`,
  requirements: [
    "Read the guest name, the room type and the number of nights",
    "Use if/elif/else to pick the rate, accepting any capitalisation",
    "Apply a 10% discount for 7 or more nights, then 12% tax",
    "Print Invalid room type for an unknown room",
  ],
  starter: py`# Hotel Booking

# Input

# Calculation

# Output
`,
  solution: py`# Hotel Booking

# Input
name = input("Enter guest name: ")
room = input("Enter room type (single/double/suite): ").strip().lower()
nights = int(input("Enter number of nights: "))

# Calculation
if room == "single":
    rate = 80
elif room == "double":
    rate = 120
elif room == "suite":
    rate = 200
else:
    rate = 0

if rate == 0:
    print("Invalid room type")
else:
    charge = float(rate * nights)
    discount = charge * 0.10 if nights >= 7 else 0.0
    tax = (charge - discount) * 0.12
    total = charge - discount + tax
    # Output
    print("----- HOTEL BILL -----")
    print(f"Guest Name    : {name}")
    print(f"Room Charge   : ${D}{charge}")
    print(f"Discount      : ${D}{round(discount, 2)}")
    print(f"Tax           : ${D}{round(tax, 2)}")
    print(f"Total Payable : ${D}{round(total, 2)}")
`,
  test: H + py`
for room, nights, c, d, t, total in (("double", "7", 840, 84, 90.72, 846.72), ("single", "2", 160, 0, 19.2, 179.2),
                                      ("SUITE", "6", 1200, 0, 144, 1344), ("Single", "10", 800, 80, 86.4, 806.4)):
    _, o = run_input(["Guest", room, nights])
    label = room + " for " + nights + " nights"
    assert near(val(o, "Charge"), c), label + ": Room Charge should be " + str(c)
    assert near(val(o, "Discount"), d), label + ": Discount should be " + str(d)
    assert near(val(o, "Tax"), t), label + ": Tax should be " + str(t)
    assert near(val(o, "Payable"), total), label + ": Total Payable should be " + str(total)
_, o = run_input(["Guest", "penthouse", "3"])
assert "invalid room type" in o.lower(), "An unknown room should print Invalid room type"
assert "payable" not in o.lower(), "Don't print a bill for an invalid room"
`,
},
{
  id: "boss_10", title: "Practice: Bank Account (OOP)", tagline: "Deposit, withdraw, refuse overdrafts.", xp: 300, unlockAfter: "py_13_oop_classes",
  stdin: "AC1001\nSara\n1000\n500\n2000",
  brief: `<p>Create a class <code>BankAccount</code> whose constructor takes <code>account_no, owner, balance</code>.</p><ul><li><code>deposit(amount)</code> adds to the balance</li><li><code>withdraw(amount)</code> subtracts from it. If the amount is more than the balance, print <code>Insufficient balance</code> and leave the balance unchanged</li><li><code>displayDetails()</code> prints the account number, owner and balance</li></ul><p>The program reads the account number, owner, opening balance, a deposit amount and a withdrawal amount. It deposits, then withdraws, then displays the details.</p><p><b>Sample input:</b> AC1001, Sara, 1000, 500, 2000. The withdrawal of 2000 is more than the balance of 1500, so it's refused.</p><pre>Insufficient balance
----- ACCOUNT DETAILS -----
Account No : AC1001
Owner      : Sara
Balance    : $1500.0</pre>`,
  requirements: [
    "Class BankAccount with __init__(self, account_no, owner, balance)",
    "deposit(amount) and withdraw(amount); withdraw refuses amounts over the balance and prints Insufficient balance",
    "displayDetails() prints the Account No, Owner and Balance",
    "Read the five inputs, then call deposit, withdraw and displayDetails in that order",
  ],
  starter: py`# Bank Account (OOP)

class BankAccount:
    pass
`,
  solution: py`# Bank Account (OOP)

class BankAccount:
    # Constructor: store the account details
    def __init__(self, account_no, owner, balance):
        self.account_no = account_no
        self.owner = owner
        self.balance = balance

    # Calculation: add money
    def deposit(self, amount):
        self.balance += amount

    # Calculation: take money out if there is enough
    def withdraw(self, amount):
        if amount > self.balance:
            print("Insufficient balance")
        else:
            self.balance -= amount

    # Output
    def displayDetails(self):
        print("----- ACCOUNT DETAILS -----")
        print(f"Account No : {self.account_no}")
        print(f"Owner      : {self.owner}")
        print(f"Balance    : ${D}{self.balance}")

# Input
acc_no = input("Enter account number: ")
owner = input("Enter owner name: ")
opening = float(input("Enter opening balance: "))
dep = float(input("Enter deposit amount: "))
wd = float(input("Enter withdrawal amount: "))

account = BankAccount(acc_no, owner, opening)
account.deposit(dep)
account.withdraw(wd)
account.displayDetails()
`,
  test: H + py`
A = ns.get("BankAccount")
assert isinstance(A, type), "Create a class named BankAccount"
a = A("X1", "Test", 100.0)
a.deposit(50)
assert near(a.balance, 150), "deposit(50) on 100 should make the balance 150"
_, said = capture(a.withdraw, 500)
assert near(a.balance, 150) and "insufficient" in said.lower(), "withdraw(500) on 150 should print Insufficient balance and leave the balance at 150"
a.withdraw(30)
assert near(a.balance, 120), "withdraw(30) should leave 120"
assert "insufficient" in out.lower() and near(val(out, "Balance"), 1500), "Sample: the withdrawal is refused and the balance is 1500.0"
_, o = run_input(["AC2", "Ali", "200", "100", "50"])
assert "insufficient" not in o.lower() and near(val(o, "Balance"), 250), "With 200 + 100 - 50 the balance should be 250.0"
`,
},
];
})(String.raw);
