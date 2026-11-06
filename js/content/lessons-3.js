/* Lessons 11-15: robust programs, OOP, quality and CW1 preparation (handbook weeks 4, 6, 7 and 12). */
window.FP = window.FP || {};
FP.LESSONS = FP.LESSONS || [];
(function (py) {
const D = "$";
FP.LESSONS.push(
{
  id: "py_15_exceptions", title: "Error Handling & Robust Input", track: "Robust Programming", xp: 80, minutes: 14,
  summary: "Read tracebacks, catch bad input with try/except, and stop a program crashing.",
  sections: [
    { h: "The errors you'll meet", body: `<table><tr><td><code>SyntaxError</code></td><td>Python can't read the code: missing <code>:</code> or <code>)</code>, bad indentation</td></tr><tr><td><code>IndentationError</code></td><td>a block isn't indented, or the indentation is mixed up</td></tr><tr><td><code>NameError</code></td><td>a variable is misspelt or used before it's created</td></tr><tr><td><code>TypeError</code></td><td>wrong type, e.g. <code>"Total: " + 5</code></td></tr><tr><td><code>ValueError</code></td><td>right type, bad value, e.g. <code>int("abc")</code></td></tr><tr><td><code>ZeroDivisionError</code></td><td>dividing by 0, e.g. an average of 0 items</td></tr><tr><td><code>IndexError</code> / <code>KeyError</code></td><td>a list position or dictionary key that doesn't exist</td></tr></table><p>Read a traceback from the <b>bottom</b>. The last line names the error, and the line above it shows where it happened.</p>` },
    { h: "try / except", body: `<p>Put risky code in <code>try</code>. If it raises the error named in <code>except</code>, Python jumps to that block instead of crashing.</p>`, stdin: "abc", code: py`try:
    qty = int(input("Quantity: "))
    print("Ordered", qty)
except ValueError:
    print("Please type a whole number")` },
    { h: "else and finally", body: `<p><code>else</code> runs only if no error happened. <code>finally</code> always runs, error or not.</p>`, code: py`def safe_average(total, count):
    try:
        avg = total / count
    except ZeroDivisionError:
        return 0
    else:
        return avg
    finally:
        print("checked", total, count)

print(safe_average(600, 3))
print(safe_average(0, 0))` },
    { h: "Keep asking until the input is valid", body: `<p>Combine <code>while True</code>, <code>try</code> and <code>break</code> to keep asking until the user types something valid.</p>`, stdin: "ten\n-5\n10", code: py`while True:
    try:
        qty = int(input("Quantity: "))
        if qty <= 0:
            print("Must be more than 0")
            continue
        break
    except ValueError:
        print("Not a number, try again")
print("OK:", qty)` },
    { h: "raise your own errors", body: `<p><code>raise</code> signals a problem from inside your own function.</p>`, code: py`def set_price(value):
    if value < 0:
        raise ValueError("Price cannot be negative")
    return value

try:
    set_price(-3)
except ValueError as e:
    print("Error:", e)` },
  ],
  challenges: [
    { prompt: "Write <code>safe_divide(a, b)</code>. It returns <code>a / b</code>, but returns the text <code>\"Cannot divide by zero\"</code> when b is 0. Use <code>try/except</code>.", starter: py`def safe_divide(a, b):
    return a / b
`, hint: "try: return a / b  except ZeroDivisionError: return \"Cannot divide by zero\"", solution: py`def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Cannot divide by zero"`,
      test: py`f = ns["safe_divide"]
assert f(600, 3) == 200, "safe_divide(600, 3) should be 200.0"
assert f(5, 0) == "Cannot divide by zero", "safe_divide(5, 0) should return \"Cannot divide by zero\""
assert "try" in code and "except" in code, "Use try/except"` },
    { prompt: "Keep asking for an age until the user types a whole number, then print <code>Age: N</code>. Inputs <code>abc</code> then <code>25</code> should print <code>Age: 25</code>.", stdin: "abc\n25", starter: py`age = int(input("Enter age: "))
print("Age:", age)
`, hint: "while True: try: age = int(input(...)); break  except ValueError: print(...)", solution: py`while True:
    try:
        age = int(input("Enter age: "))
        break
    except ValueError:
        print("Please enter a whole number")
print("Age:", age)`,
      test: py`assert lines[-1].replace(" ", "") == "Age:25", "With abc then 25 the last line should be Age: 25"
_, o = run_input(["x", "1.5", "", "30"])
assert o.strip().splitlines()[-1].replace(" ", "") == "Age:30", "It should keep asking: with x, 1.5, (blank), 30 expected Age: 30"` },
    { prompt: "Write <code>to_price(text)</code>. It converts text to a float and <code>raise</code>s <code>ValueError</code> if the price is negative. Text like <code>\"abc\"</code> should also raise ValueError, which <code>float()</code> already does.", starter: py`def to_price(text):
    return float(text)
`, hint: "price = float(text); if price < 0: raise ValueError(\"negative\"); return price", solution: py`def to_price(text):
    price = float(text)
    if price < 0:
        raise ValueError("Price cannot be negative")
    return price`,
      test: py`f = ns["to_price"]
assert f("12.5") == 12.5, "to_price(\"12.5\") should be 12.5"
assert f("0") == 0, "0 is allowed"
for bad in ("-1", "abc"):
    try:
        f(bad)
    except ValueError:
        pass
    else:
        raise AssertionError("to_price(\"" + bad + "\") should raise ValueError")` },
  ],
  quiz: [
    { q: "int(\"abc\") raises which error?", options: ["TypeError", "ValueError", "NameError", "SyntaxError"], answer: 1, why: "The type (str) is fine, but the value can't be turned into a number." },
    { q: "\"Total: \" + 5 raises which error?", options: ["TypeError", "ValueError", "NameError", "No error"], answer: 0, why: "You can't add a str and an int. Use str(5) or an f-string." },
    { q: "When does a finally block run?", options: ["Only on error", "Only without an error", "Always", "Never"], answer: 2, why: "finally always runs, so it's used for clean-up." },
    { q: "Where do you start reading a traceback?", options: ["The top line", "The bottom line", "The middle", "It doesn't matter"], answer: 1, why: "The last line names the error. The lines above show where it came from." },
  ],
},
{
  id: "py_13_oop_classes", title: "OOP: Classes & Objects", track: "OOP", xp: 110, minutes: 18,
  summary: "class, __init__, self, attributes and methods: the Employee salary pattern from CW1.",
  sections: [
    { h: "Class vs object", body: `<p>A <b>class</b> is a blueprint, such as "Employee". An <b>object</b> is one real thing made from it, such as Sarah, ID E205. Each object has its own <b>attributes</b> (data) and shares the class's <b>methods</b> (functions that belong to the class).</p>` },
    { h: "__init__ and self", body: `<p><code>__init__</code> is the <b>constructor</b>. It runs automatically when you create an object and sets up the attributes. <code>self</code> means "this object". Every method takes <code>self</code> as its first parameter, and you store data as <code>self.name = name</code>.</p>`, code: py`class Employee:
    def __init__(self, emp_id, name, basic):
        self.emp_id = emp_id
        self.name = name
        self.basic = basic

sarah = Employee("E205", "Sarah", 4000.0)   # __init__ runs here
ali = Employee("E206", "Ali", 3500.0)
print(sarah.name, sarah.basic)
print(ali.name, ali.basic)` },
    { h: "Methods", body: `<p>A method is a function inside the class. It reads and changes the object's attributes through <code>self</code>. You call it on an object: <code>sarah.calculateSalary()</code>. You don't pass <code>self</code> yourself.</p>`, code: py`class Employee:
    def __init__(self, emp_id, name, basic):
        self.emp_id = emp_id
        self.name = name
        self.basic = basic

    def calculateSalary(self):
        self.hra = self.basic * 0.15
        self.ta = self.basic * 0.05
        self.gross = self.basic + self.hra + self.ta
        return self.gross

    def displayDetails(self):
        print("----- EMPLOYEE DETAILS -----")
        print(f"Employee ID         : {self.emp_id}")
        print(f"Employee Name       : {self.name}")
        print(f"Basic Salary        : ${D}{self.basic}")
        print(f"House Rent Allowance: ${D}{self.hra}")
        print(f"Transport Allowance : ${D}{self.ta}")
        print(f"Gross Salary        : ${D}{self.gross}")

emp = Employee("E205", "Sarah", 4000.0)
emp.calculateSalary()      # must run before displayDetails uses self.hra
emp.displayDetails()` },
    { h: "Reading the object's data from input()", body: `<p>In the test, the values come from the user. Read them first, then pass them to the class.</p>`, stdin: "E205\nSarah\n4000", code: py`class Employee:
    def __init__(self, emp_id, name, basic):
        self.emp_id = emp_id
        self.name = name
        self.basic = basic

emp_id = input("Enter Employee ID: ")
name = input("Enter Employee Name: ")
basic = float(input("Enter Basic Salary: "))
emp = Employee(emp_id, name, basic)
print(emp.emp_id, emp.name, emp.basic)` },
    { h: "Mistakes that lose marks", body: `<ul><li>Forgetting <code>self</code> as the first parameter, which gives <code>TypeError: takes 0 positional arguments but 1 was given</code>.</li><li>Writing <code>basic</code> instead of <code>self.basic</code> inside a method, which gives <code>NameError</code>.</li><li>Typing <code>__init__</code> with one underscore on each side (<code>_init_</code>). It has two on each side.</li><li>Changing the method names. If the task says <code>calculateSalary()</code>, use exactly that name.</li><li>Defining the class but never creating an object or calling its methods.</li></ul>` },
    { h: "__str__ (nice to know)", body: `<p><code>__str__</code> controls what <code>print(obj)</code> shows.</p>`, code: py`class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def __str__(self):
        return f"{self.name} @ ${D}{self.price}"

print(Product("Pizza", 150.0))` },
  ],
  challenges: [
    { prompt: "Create a class <code>Product</code> whose constructor stores <code>name</code> and <code>price</code>. Add a method <code>display()</code> that prints <code>Product: NAME, Price: $PRICE</code>.", starter: py`class Product:
    pass
`, hint: "def __init__(self, name, price): self.name = name ... def display(self): print(f\"Product: {self.name}, Price: $" + "{self.price}\")", solution: py`class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def display(self):
        print(f"Product: {self.name}, Price: ${D}{self.price}")

p = Product("Pizza", 150.0)
p.display()`,
      test: py`P = ns["Product"]
p = P("Tea", 2.5)
assert p.name == "Tea" and p.price == 2.5, "The constructor should store self.name and self.price"
_, shown = capture(p.display)
assert "Tea" in shown and "$2.5" in shown, "display() should print: Product: Tea, Price: $2.5"` },
    { prompt: "Complete <code>Employee</code>. <code>calculateSalary()</code> sets <code>self.hra</code> (15% of basic), <code>self.ta</code> (5%) and <code>self.gross</code> (basic + hra + ta), and returns gross.", starter: py`class Employee:
    def __init__(self, emp_id, name, basic):
        self.emp_id = emp_id
        self.name = name
        self.basic = basic

    def calculateSalary(self):
        pass
`, hint: "self.hra = self.basic * 0.15 ... return self.gross", solution: py`class Employee:
    def __init__(self, emp_id, name, basic):
        self.emp_id = emp_id
        self.name = name
        self.basic = basic

    def calculateSalary(self):
        self.hra = self.basic * 0.15
        self.ta = self.basic * 0.05
        self.gross = self.basic + self.hra + self.ta
        return self.gross`,
      test: py`E = ns["Employee"]
e = E("E205", "Sarah", 4000.0)
g = e.calculateSalary()
assert g is not None and abs(g - 4800) < 0.01, "calculateSalary() should return 4800.0 for basic 4000"
assert abs(e.hra - 600) < 0.01 and abs(e.ta - 200) < 0.01, "Set self.hra = 600.0 and self.ta = 200.0 for basic 4000"
e2 = E("E1", "Ali", 1000.0)
assert abs(e2.calculateSalary() - 1200) < 0.01, "For basic 1000 gross should be 1200.0"` },
    { prompt: "Build <code>BankAccount(owner, balance)</code> with <code>deposit(amount)</code>, which adds to the balance, and <code>withdraw(amount)</code>, which subtracts but returns <code>\"Insufficient funds\"</code> and leaves the balance unchanged if amount is more than the balance.", starter: py`class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance
`, hint: "def withdraw(self, amount): if amount > self.balance: return \"Insufficient funds\"; self.balance -= amount", solution: py`class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            return "Insufficient funds"
        self.balance -= amount
        return self.balance`,
      test: py`A = ns["BankAccount"]
a = A("Ahmed", 100.0)
a.deposit(50)
assert a.balance == 150, "After deposit(50) on 100 the balance should be 150"
a.withdraw(30)
assert a.balance == 120, "After withdraw(30) the balance should be 120"
assert a.withdraw(500) == "Insufficient funds", "withdraw(500) should return \"Insufficient funds\""
assert a.balance == 120, "A failed withdraw must not change the balance"
b = A("Sara", 0)
assert b.balance == 0, "Each object has its own balance"` },
  ],
  quiz: [
    { q: "What is self?", options: ["The class", "The object the method was called on", "A keyword for global variables", "The constructor"], answer: 1, why: "self refers to the particular object, so each one keeps its own data." },
    { q: "When does __init__ run?", options: ["When the class is defined", "When you create an object", "When you call any method", "Only if you call it"], answer: 1, why: "Employee(...) creates an object and runs __init__ automatically." },
    { q: "How do you call displayDetails on the object emp?", options: ["displayDetails(emp)", "Employee.displayDetails()", "emp.displayDetails()", "emp.displayDetails(self)"], answer: 2, why: "Call methods on the object. Python passes self for you." },
    { q: "Inside a method, how do you use the basic salary?", options: ["basic", "self.basic", "Employee.basic", "this.basic"], answer: 1, why: "Attributes belong to the object, so reach them through self." },
  ],
},
{
  id: "py_18_testing", title: "Debugging, Testing & Documentation", track: "Quality", xp: 110, minutes: 18,
  summary: "Find and fix syntax and logic bugs, write test tables, and comment your code. This is CW1 Task 4.",
  sections: [
    { h: "Three kinds of error", body: `<ul><li><b>Syntax errors</b>: Python won't start. Look for a missing <code>:</code>, a missing <code>)</code>, missing indentation or a misspelt keyword.</li><li><b>Runtime errors</b>: the program crashes partway through, for example with <code>ZeroDivisionError</code> or <code>ValueError</code>.</li><li><b>Logic errors</b>: the program runs but gives the <b>wrong answer</b>. Examples are <code>range(1, n)</code> instead of <code>range(n)</code>, dividing by the wrong count, or <code>total = 0</code> inside the loop.</li></ul>` },
    { h: "A debugging checklist", body: `<p>Work through the broken code from top to bottom and check each line for these:</p><ol><li>Every bracket <code>( )</code> and quote is closed.</li><li>Every <code>if / elif / else / for / while / def / class</code> line ends with <code>:</code>.</li><li>Everything inside a block is indented by 4 spaces.</li><li><code>input()</code> is converted with <code>int()</code> or <code>float()</code> before any maths.</li><li><code>range</code> runs the right number of times.</li><li>The accumulator (<code>total = 0</code>) is <b>before</b> the loop, and the update is <b>inside</b> it.</li><li>The comparison is the right one: <code>&gt;</code> or <code>&gt;=</code>, and <code>==</code> (compare) rather than <code>=</code> (assign).</li><li>Averages divide by the real count, and can't divide by 0.</li></ol><p>Then run the program with the sample input and compare the output with the expected output.</p>` },
    { h: "Spot the bugs", body: `<p>This code has five bugs. Find them using the checklist before you look at the fix below.</p>`, noRun: true, code: py`# BROKEN
count = int(input("How many sales? ")
sales = []
for i in range(1, count)
sales.append(float(input("Sale: ")))
best = 0
for s in sales:
    if s > best
        best == s
print("Best:", best)`, },
    { h: "The fixed version", body: `<p>Each comment names the bug that was fixed. Run it with the given input.</p>`, stdin: "3\n100\n250\n80", code: py`# FIXED
count = int(input("How many sales? "))    # added missing )
sales = []
for i in range(count):                    # range(1, count) ran one time too few; added :
    sales.append(float(input("Sale: ")))  # indented into the loop
best = 0
for s in sales:
    if s > best:                          # added :
        best = s                          # == compares; = assigns
print("Best:", best)` },
    { h: "Test tables", body: `<p>A test case records the <b>input</b>, the <b>expected</b> output (worked out by hand first), the <b>actual</b> output (from running the program) and <b>Pass/Fail</b>. Cover:</p><ul><li><b>Normal</b> cases: typical data, e.g. 3 expenses</li><li><b>Boundary</b> cases: edges such as 1 item, exactly 300 or a mark of exactly 50</li><li><b>Erroneous</b> cases: bad input such as text, negatives or 0 items</li></ul><table><tr><td><b>Test</b></td><td><b>Input</b></td><td><b>Expected total</b></td><td><b>Expected avg</b></td><td><b>Actual</b></td><td><b>Pass/Fail</b></td></tr><tr><td>1</td><td>100, 200, 300</td><td>600</td><td>200.0</td><td>600.0 / 200.0</td><td>Pass</td></tr><tr><td>2</td><td>150</td><td>150</td><td>150.0</td><td>150.0 / 150.0</td><td>Pass</td></tr><tr><td>3</td><td>50, 100, 150, 200</td><td>500</td><td>125.0</td><td>500.0 / 125.0</td><td>Pass</td></tr></table><p>In a <code>.py</code> file you can write the table as comments, or check it automatically with <code>assert</code>.</p>`, code: py`def average(values):
    return sum(values) / len(values)

# Test 1 - normal: 100, 200, 300 -> expected 200.0
assert average([100, 200, 300]) == 200.0
# Test 2 - boundary: one value
assert average([150]) == 150.0
# Test 3 - normal: four values
assert average([50, 100, 150, 200]) == 125.0
print("All tests passed")` },
    { h: "Documentation: comments and docstrings", body: `<p>Label each part of the program, using the words the marker looks for: <b>Input</b>, <b>Storage</b>, <b>Calculation</b> and <b>Output</b>. A <b>docstring</b> (<code>"""..."""</code>) on the first line of a function or class says what it does.</p>`, stdin: "2\n40\n60", code: py`"""Expense tracker: total and average of a customer's shopping expenses."""

# Input: number of expenses
n = int(input("Enter number of expenses: "))

# Storage: keep every expense in a list
expenses = []
for i in range(n):
    # Input: one expense amount
    amount = float(input("Enter expense: "))
    expenses.append(amount)

# Calculation: add the expenses up, then divide by how many there are
total = 0
for amount in expenses:
    total = total + amount
average = total / n

# Output: show the results
print("Total Expenses:", total)
print("Average Expense:", average)` },
  ],
  challenges: [
    { prompt: "Fix the <b>syntax errors</b> so the program prints <code>Total: 60</code>.", starter: py`prices = [10, 20, 30]
total = 0
for p in prices
total = total + p
print("Total:", total
`, hint: "Three bugs: missing : after the for line, missing indentation, missing ) on print.", solution: py`prices = [10, 20, 30]
total = 0
for p in prices:
    total = total + p
print("Total:", total)`,
      test: py`assert "Total: 60" in lines, "Expected: Total: 60"
_, o, _e = rerun({"prices = [10, 20, 30]": "prices = [1, 2]"})
assert "Total: 3" in o, "Keep the loop: for [1, 2] expected Total: 3"` },
    { prompt: "This runs, but the average is wrong because of <b>logic errors</b>. With <code>3</code> then <code>100, 200, 300</code> it should print <code>Average: 200.0</code>. Fix it.", stdin: "3\n100\n200\n300", starter: py`n = int(input("Enter number of expenses: "))
expenses = []
for i in range(1, n):
    expenses.append(float(input("Enter expense: ")))
total = 0
for amount in expenses:
    total = 0
    total = total + amount
average = total / n
print("Average:", average)
`, hint: "range(1, n) reads one value too few, and total = 0 inside the loop resets the total every time.", solution: py`n = int(input("Enter number of expenses: "))
expenses = []
for i in range(n):
    expenses.append(float(input("Enter expense: ")))
total = 0
for amount in expenses:
    total = total + amount
average = total / n
print("Average:", average)`,
      test: py`assert has_num(lines[-1], 200), "With 100, 200, 300 expected Average: 200.0"
_, o = run_input(["1", "150"])
assert has_num(o.strip().splitlines()[-1], 150), "With one expense of 150 expected Average: 150.0"
_, o = run_input(["4", "50", "100", "150", "200"])
assert has_num(o.strip().splitlines()[-1], 125), "With 50, 100, 150, 200 expected Average: 125.0"` },
    { prompt: "Write <b>at least three</b> <code>assert</code> tests for <code>add_vat(price)</code>, which adds 12% VAT. Include a normal case, a boundary case (0) and one more. Then print <code>All tests passed</code>.", starter: py`def add_vat(price):
    return round(price * 1.12, 2)

# Write your tests below
`, hint: "assert add_vat(100) == 112.0, then add_vat(0) == 0, and so on.", solution: py`def add_vat(price):
    return round(price * 1.12, 2)

# Test 1 - normal
assert add_vat(100) == 112.0
# Test 2 - boundary: zero
assert add_vat(0) == 0
# Test 3 - normal decimal
assert add_vat(50) == 56.0
print("All tests passed")`,
      test: py`assert len(re.findall(r"^\s*assert\s", code, re.M)) >= 3, "Write at least 3 assert lines"
assert "add_vat(0)" in code.replace(" ", ""), "Include the boundary case add_vat(0)"
assert "All tests passed" in lines, "Print All tests passed after the asserts"` },
    { prompt: "Document this working program. Add comments that label its <b>Input</b>, <b>Storage</b>, <b>Calculation</b> and <b>Output</b> sections (use those words).", stdin: "2\n40\n60", starter: py`n = int(input("Enter number of expenses: "))
expenses = []
for i in range(n):
    amount = float(input("Enter expense: "))
    expenses.append(amount)
total = sum(expenses)
average = total / n
print("Total Expenses:", total)
print("Average Expense:", average)
`, hint: "Put a line like # Input: read the number of expenses above each part.", solution: py`# Input: read how many expenses there are
n = int(input("Enter number of expenses: "))
# Storage: keep each expense in a list
expenses = []
for i in range(n):
    # Input: read one expense
    amount = float(input("Enter expense: "))
    expenses.append(amount)
# Calculation: total and average of the expenses
total = sum(expenses)
average = total / n
# Output: display the total and average
print("Total Expenses:", total)
print("Average Expense:", average)`,
      test: py`comments = " ".join(l.split("#", 1)[1].lower() for l in code.splitlines() if "#" in l)
for word, label in (("input", "Input"), ("stor", "Storage"), ("calculat", "Calculation"), ("output", "Output")):
    assert word in comments, "Add a comment that labels the " + label + " section"
assert has_num(out, 100) and has_num(out, 50), "The program must still work (total 100.0, average 50.0)"` },
  ],
  quiz: [
    { q: "The program runs but prints the wrong total. What kind of error is that?", options: ["Syntax error", "Runtime error", "Logic error", "No error"], answer: 2, why: "It runs, so it isn't a syntax or runtime error. The wrong answer comes from the logic." },
    { q: "Which test is a boundary case for \"discount if total > 300\"?", options: ["total = 150", "total = 300", "total = \"abc\"", "total = 1000"], answer: 1, why: "300 sits exactly on the edge of the rule." },
    { q: "In a test table, where does the expected output come from?", options: ["Running the program", "Working it out by hand first", "The teacher", "Copying the actual output"], answer: 1, why: "Expected is what should happen; actual is what the program did. Compare the two." },
    { q: "if x = 5: is wrong because...", options: ["5 needs quotes", "= assigns; comparison needs ==", "if can't use numbers", "Missing brackets"], answer: 1, why: "Use == to compare." },
  ],
},
{
  id: "py_19_git", title: "Version Control with Git", track: "Quality", xp: 60, minutes: 10,
  summary: "Repositories, commits and branches: the week 6 concepts and commands.",
  sections: [
    { h: "Why version control?", body: `<p>Git records <b>snapshots</b> (commits) of your project. You can go back to an earlier version, see who changed what, and work on features without breaking the main code.</p><ul><li><b>Repository</b>: the project folder plus its full history</li><li><b>Working directory</b>: the files as you're editing them now</li><li><b>Staging area</b>: the changes you've picked for the next commit</li><li><b>Commit</b>: a saved snapshot with a message</li><li><b>Branch</b>: an independent line of work. <code>main</code> is the default.</li><li><b>Merge</b>: joins one branch's changes into another</li><li><b>Remote</b> (e.g. GitHub): an online copy you <code>push</code> to and <code>pull</code> from</li></ul>` },
    { h: "The everyday commands", body: `<table><tr><td><code>git init</code></td><td>start a repository</td></tr><tr><td><code>git status</code></td><td>see what's changed</td></tr><tr><td><code>git add file.py</code> / <code>git add .</code></td><td>stage changes</td></tr><tr><td><code>git commit -m "message"</code></td><td>save a snapshot</td></tr><tr><td><code>git log</code></td><td>see the history</td></tr><tr><td><code>git branch feature</code></td><td>create a branch</td></tr><tr><td><code>git checkout feature</code> / <code>git switch feature</code></td><td>move to a branch</td></tr><tr><td><code>git merge feature</code></td><td>merge it into the current branch</td></tr><tr><td><code>git push</code> / <code>git pull</code></td><td>send to / fetch from the remote</td></tr><tr><td><code>git clone URL</code></td><td>copy a remote repository</td></tr></table><p>Write commit messages that say what changed, e.g. <code>Add discount calculation to bill</code>, not <code>stuff</code>.</p>` },
  ],
  challenges: [
    { prompt: "Put the commands for \"start a project, save your first version, then share it\" in order in the list <code>steps</code>: <code>git add .</code>, <code>git push</code>, <code>git init</code>, <code>git commit -m \"First version\"</code>.", starter: py`steps = []
`, hint: "You initialise, stage, commit and then push.", solution: py`steps = ["git init", "git add .", 'git commit -m "First version"', "git push"]`,
      test: py`s = [x.strip() for x in ns.get("steps", [])]
assert len(s) == 4, "steps should hold the 4 commands"
order = [next((i for i, x in enumerate(s) if x.startswith(c)), -1) for c in ("git init", "git add", "git commit", "git push")]
assert -1 not in order, "Use all four commands: git init, git add ., git commit -m ..., git push"
assert order == sorted(order), "Order: git init, git add, git commit, git push"` },
  ],
  quiz: [
    { q: "What does git add do?", options: ["Saves a snapshot", "Stages changes for the next commit", "Uploads to GitHub", "Creates a branch"], answer: 1, why: "add puts changes in the staging area; commit saves them." },
    { q: "Which command saves a snapshot with a message?", options: ["git save", "git push -m", "git commit -m \"...\"", "git log"], answer: 2, why: "commit records the staged changes in history." },
    { q: "What is a branch for?", options: ["Deleting old code", "Working on a change without affecting main", "Backing up to the cloud", "Speeding up Python"], answer: 1, why: "Branches keep separate lines of work until you merge them." },
    { q: "Which command sends your commits to GitHub?", options: ["git pull", "git push", "git merge", "git clone"], answer: 1, why: "push uploads; pull downloads." },
  ],
},
{
  id: "py_20_cw1_prep", title: "CW1 Test Strategy", track: "Exam Prep", xp: 80, minutes: 10,
  summary: "60 minutes, 4 tasks, 1 file: how to lay out your answer file, plan your time and avoid losing marks.",
  sections: [
    { h: "The format", body: `<ul><li><b>60 minutes</b>, <b>100 marks</b>, four tasks worth 25 marks each</li><li>Tasks 1 to 3 are programming tasks. In the mock these were a bill with a discount, a mark analysis using a list, and an OOP salary system.</li><li>Task 4 is debugging (15 marks), testing (5) and documentation (5)</li><li>You write in <b>PyCharm</b> and submit <b>one</b> <code>.py</code> file named <code>FunBP_MT_&lt;StudentID&gt;.py</code>, e.g. <code>FunBP_MT_500555.py</code></li></ul>` },
    { h: "A file layout that works", body: `<p>Put each task in a function with a header comment, and call them all at the bottom. While you work on one task, comment out the calls to the others so you aren't typing every input again. Before you submit, make sure all four calls are switched back on.</p>`, noRun: true, code: py`# FunBP_MT_500555.py  -  Fundamentals of Business Programming CW1
# Student ID: 500555

# ================= Task 1: Online Food Order Billing =================
def task1():
    ...

# ================= Task 2: Student Marks Analysis =================
def task2():
    ...

# ================= Task 3: Employee Salary (OOP) =================
class Employee:
    ...

def task3():
    ...

# ================= Task 4: Debugging, Testing, Documentation =================
def task4():
    ...
# Test table (Task 4b)
# Test | Input            | Expected Total | Expected Avg | Actual      | Pass/Fail
# 1    | 100, 200, 300    | 600            | 200.0        | 600.0/200.0 | Pass

task1()
task2()
task3()
task4()` },
    { h: "Time plan", body: `<table><tr><td>0-3 min</td><td>Read all four tasks. Start with the one you're surest about.</td></tr><tr><td>3-15</td><td>Task 4. It's the fastest marks: fix the bugs, copy the test table and add the comments.</td></tr><tr><td>15-28</td><td>Task 1</td></tr><tr><td>28-41</td><td>Task 2</td></tr><tr><td>41-54</td><td>Task 3</td></tr><tr><td>54-60</td><td>Run the whole file with the sample inputs, check the file name, submit.</td></tr></table>` },
    { h: "Checklist before you submit", body: `<ol><li>Run each task with the <b>sample input</b> and compare the output with the sample, value by value.</li><li>Check the boundaries: exactly 300, exactly 50 and a single item.</li><li>Use the exact names the task gives (<code>Employee</code>, <code>calculateSalary()</code>, <code>displayDetails()</code>).</li><li>Read money and marks with <code>float()</code>, and show averages with <code>:.2f</code>.</li><li>Add a comment at the top of each part of the code.</li><li>Make sure the file name is right and that it's a single <code>.py</code> file.</li><li>If a task doesn't fully work, submit what you have. Partial code with comments still earns marks, but code that won't run because of a syntax error can lose them all. Comment out any broken lines.</li></ol>` },
  ],
  challenges: [
    { prompt: "Set up an answer-file skeleton. Define functions <code>task1</code>, <code>task2</code>, <code>task3</code> and <code>task4</code>, each printing <code>Task N</code>, and put a <code># Task N</code> header comment above each. Then call all four.", starter: py`# FunBP_MT_500555.py
`, hint: "Write # Task 1 above def task1(): with print(\"Task 1\") inside, repeat for 2 to 4, then call task1() to task4() at the bottom.", solution: py`# FunBP_MT_500555.py

# Task 1
def task1():
    print("Task 1")

# Task 2
def task2():
    print("Task 2")

# Task 3
def task3():
    print("Task 3")

# Task 4
def task4():
    print("Task 4")

task1()
task2()
task3()
task4()`,
      test: py`for n in (1, 2, 3, 4):
    assert callable(ns.get("task" + str(n))), "Define a function task" + str(n)
    assert re.search(r"#\s*Task\s*" + str(n), code, re.I), "Add a # Task " + str(n) + " header comment"
assert lines == ["Task 1", "Task 2", "Task 3", "Task 4"], "Call all four functions in order"` },
  ],
  quiz: [
    { q: "How should you name the submission file for student ID 500555?", options: ["CW1_500555.py", "FunBP_MT_500555.py", "500555.docx", "main.py"], answer: 1, why: "The brief gives the pattern FunBP_MT_NNNNN.py." },
    { q: "Task 3 doesn't fully work with 3 minutes left. What do you do?", options: ["Delete it", "Comment out the broken lines so the file runs, then submit", "Submit nothing", "Keep typing past the deadline"], answer: 1, why: "A file that runs, with partial work and comments, still earns marks." },
    { q: "Which task gives the quickest marks?", options: ["Task 1", "Task 2", "Task 3", "Task 4, because the bugs are given and the testing and comments are mechanical"], answer: 3, why: "The code is already there. Fix it, fill in the table, and comment it." },
  ],
},
);
})(String.raw);
