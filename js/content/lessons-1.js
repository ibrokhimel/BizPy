/* Lessons 1-4: foundations (handbook week 1). Code is String.raw (py``) so Python backslashes survive.
   Inside py`` a "$" followed by "{" would be read by JavaScript, so money signs before f-string braces
   are written as ${D} (D = "$"). Everywhere else a plain $ is fine. */
window.FP = window.FP || {};
FP.LESSONS = FP.LESSONS || [];
(function (py) {
const D = "$";
FP.LESSONS.push(
{
  id: "py_01_setup", title: "Your First Business Program", track: "Foundations", xp: 50, minutes: 8,
  summary: "How a Python program runs, print(), comments, and how the CW1 test is set up.",
  sections: [
    { h: "Python in this module", body: `<p>Python is a <b>high-level, interpreted</b> language. The interpreter reads your <code>.py</code> file from top to bottom and runs one line at a time. Fundamentals of Business Programming uses it to solve small business problems: bills, payroll, mark sheets and sales reports.</p><p>In the CW1 test you write your answers in <b>PyCharm</b> and submit <b>one</b> <code>.py</code> file. In BizPy the same Python runs in your browser, so you can practise anywhere.</p>` },
    { h: "Making output with print()", body: `<p><code>print()</code> shows a value in the output. Text goes inside quotes, and numbers and sums don't need them. Separate several values with commas, and <code>print</code> puts a space between them.</p>`, code: py`print("----- FOOD ORDER BILL -----")
print("Items ordered:", 3)
print(120 + 100 + 150)      # Python does the maths
print("120 + 100")          # in quotes it's just text` },
    { h: "Comments", body: `<p>Anything after <code>#</code> is a <b>comment</b>. Python ignores it, but markers read it. CW1 Task 4 gives <b>5 marks</b> for comments that explain the Input, Storage, Calculation and Output parts of your program.</p>`, code: py`# ---- Task 1: Food order bill ----
# Input: read the customer's name
name = "Ahmed"
# Output: show a greeting
print("Customer:", name)` },
  ],
  challenges: [
    { prompt: "Print exactly <code>Welcome to BizPy Store</code>", starter: py`# Write your code below
`, hint: "Text goes inside quotes, inside print( ).", solution: py`print("Welcome to BizPy Store")`,
      test: py`assert "Welcome to BizPy Store" in lines, "Output should be exactly: Welcome to BizPy Store"` },
    { prompt: "Print the bill header exactly as the test shows it: <code>----- FOOD ORDER BILL -----</code> (5 dashes each side).", starter: py`
`, hint: "Copy the header into quotes: print(\"----- FOOD ORDER BILL -----\")", solution: py`print("----- FOOD ORDER BILL -----")`,
      test: py`assert "----- FOOD ORDER BILL -----" in lines, "Expected the line ----- FOOD ORDER BILL ----- (check the number of dashes and spaces)"` },
    { prompt: "Print the total of three item prices <code>120</code>, <code>100</code> and <code>150</code>. Let Python add them up.", starter: py`
`, hint: "print(120 + 100 + 150)", solution: py`print(120 + 100 + 150)`,
      test: py`assert "370" in lines, "Expected 370"
assert "+" in code, "Let Python calculate it using +"` },
  ],
  quiz: [
    { q: "What does the interpreter do?", options: ["Runs your code line by line from the top", "Checks your spelling", "Turns Python into a website", "Stores your files"], answer: 0, why: "Python is interpreted: it reads and runs one line after another." },
    { q: "What does print(\"2 + 2\") output?", options: ["4", "2 + 2", "\"2 + 2\"", "Error"], answer: 1, why: "Inside quotes it's text, so Python prints it exactly as written." },
    { q: "How many files do you submit for the CW1 test?", options: ["One .py file per task", "One .py file with all four tasks", "A Word document", "A zipped PyCharm project"], answer: 1, why: "All four solutions go in a single file named FunBP_MT_<StudentID>.py." },
  ],
},
{
  id: "py_02_variables", title: "Variables, Types & input()", track: "Foundations", xp: 70, minutes: 12,
  summary: "Store values, read them from the keyboard, and convert text to numbers.",
  sections: [
    { h: "Variables", body: `<p>A <b>variable</b> is a name that points to a value. You create one with <code>=</code>, the <i>assignment</i> operator. Read it as "gets": <code>total = 0</code> means "total gets 0".</p>`, code: py`customer = "Ahmed"
items = 3
total = 370.0
total = total - 55.5     # a variable can be updated
print(customer, items, total)` },
    { h: "Data types", body: `<p>Every value has a <b>type</b>.</p><table><tr><td><code>int</code></td><td>whole numbers</td><td><code>3</code></td></tr><tr><td><code>float</code></td><td>decimals (money!)</td><td><code>314.5</code></td></tr><tr><td><code>str</code></td><td>text</td><td><code>"E205"</code></td></tr><tr><td><code>bool</code></td><td>True / False</td><td><code>True</code></td></tr></table>`, code: py`print(type(3))
print(type(314.5))
print(type("E205"))
print(type(370 > 300))` },
    { h: "input() always gives you text", body: `<p><code>input("prompt")</code> shows the prompt, waits for the user, and returns what they typed <b>as a string</b>. To do maths with it you must convert it. Use <code>int()</code> for counts and <code>float()</code> for money, marks and salaries.</p><p>Type the values for <code>input()</code> in the <b>Input</b> box under the editor, separated by <code>|</code>.</p>`, stdin: "Ahmed\n3\n120", code: py`name = input("Enter customer name: ")           # str
count = int(input("Enter number of food items: "))   # int
price = float(input("Enter price of item 1: "))       # float
print(name, count, price)
print(price * 2)` },
    { h: "Why the sample output shows $370.0", body: `<p>A <code>float</code> always prints with a decimal point: <code>float("370")</code> is <code>370.0</code>. The CW1 sample outputs show <code>$370.0</code> and <code>$4000.0</code> because the inputs were read with <code>float()</code>. If you used <code>int()</code> you'd print <code>370</code>, which doesn't match the sample.</p><p>Without conversion, <code>"120" + "100"</code> is <code>"120100"</code>. The strings get glued together instead of added.</p>`, code: py`print("120" + "100")              # glued: 120100
print(int("120") + int("100"))    # added: 220
print(float("4000"))              # 4000.0` },
  ],
  challenges: [
    { prompt: "Read the customer's name with <code>input()</code> and print <code>Hello, NAME</code>, for example <code>Hello, Ahmed</code>.", stdin: "Ahmed", starter: py`# Input: read the customer's name
`, hint: "name = input(\"Enter customer name: \") then print(\"Hello, \" + name) or an f-string.", solution: py`name = input("Enter customer name: ")
print(f"Hello, {name}")`,
      test: py`assert "Hello, Ahmed" in out, "With input Ahmed the output should contain: Hello, Ahmed"
_, o = run_input(["Sarah"])
assert "Hello, Sarah" in o, "Use the value from input(), don't type the name. With input Sarah expected: Hello, Sarah"` },
    { prompt: "Read a basic salary with <code>input()</code>, store it as a <b>float</b> in <code>basic</code>, and print it. With input <code>4000</code> it should print <code>4000.0</code>.", stdin: "4000", starter: py`basic = input("Enter Basic Salary: ")
print(basic)
`, hint: "Wrap input(...) in float( ).", solution: py`basic = float(input("Enter Basic Salary: "))
print(basic)`,
      test: py`assert isinstance(ns.get("basic"), float), "basic should be a float - convert with float()"
assert "4000.0" in lines, "Expected 4000.0"
_, o = run_input(["2500"])
assert "2500.0" in o, "With input 2500 expected 2500.0"` },
    { prompt: "Read two whole numbers (number of items in two orders) and print their sum. Inputs <code>3</code> and <code>7</code> should print <code>10</code>.", stdin: "3\n7", starter: py`a = input("Order 1 items: ")
b = input("Order 2 items: ")
print(a + b)
`, hint: "Convert both with int() before adding, or the strings get glued into 37.", solution: py`a = int(input("Order 1 items: "))
b = int(input("Order 2 items: "))
print(a + b)`,
      test: py`assert lines and lines[-1].endswith("10") and not lines[-1].endswith("37"), "With 3 and 7 the last line should be 10 (not 37 - convert with int())"
_, o = run_input(["5", "8"])
assert o.strip().endswith("13"), "With 5 and 8 the last line should be 13"` },
  ],
  quiz: [
    { q: "What type does input() return?", options: ["int", "float", "str", "It depends what the user types"], answer: 2, why: "input() always returns a str, even if the user types digits." },
    { q: "What does print(float(\"370\")) show?", options: ["370", "370.0", "\"370\"", "Error"], answer: 1, why: "float() gives a decimal number, and floats print with .0." },
    { q: "What is \"5\" + \"3\"?", options: ["8", "53", "\"5 + 3\"", "Error"], answer: 1, why: "+ joins strings together. Convert with int() first to add them." },
    { q: "Which is a valid variable name?", options: ["2nd_salary", "basic-salary", "basic_salary", "class"], answer: 2, why: "Names can't start with a digit, contain -, or be keywords like class." },
  ],
},
{
  id: "py_03_operators", title: "Operators & Business Maths", track: "Foundations", xp: 70, minutes: 12,
  summary: "Arithmetic, percentages, discounts, allowances and comparisons.",
  sections: [
    { h: "Arithmetic", body: `<p><code>+ - * /</code> work as you'd expect, and <code>/</code> always gives a float. Three more come up a lot:</p><ul><li><code>//</code> floor division drops the decimal</li><li><code>%</code> modulo gives the remainder</li><li><code>**</code> is power</li></ul>`, code: py`print(430 / 6)     # 71.666...
print(135 // 60)   # 2  full hours
print(135 % 60)    # 15 minutes left over
print(2 ** 3)      # 8` },
    { h: "Percentages", body: `<p>"15% of X" is <code>X * 15 / 100</code>, which is the same as <code>X * 0.15</code>. This is how every discount, tax and allowance in the test is calculated.</p>`, code: py`total = 370.0
discount = total * 0.15          # 15% discount
payable = total - discount
print(discount, payable)         # 55.5 314.5

basic = 4000.0
hra = basic * 0.15               # House Rent Allowance 15%
ta = basic * 0.05                # Transport Allowance 5%
gross = basic + hra + ta
print(hra, ta, gross)            # 600.0 200.0 4800.0` },
    { h: "Order of operations", body: `<p>Python follows BODMAS: brackets, then <code>**</code>, then <code>* / // %</code>, then <code>+ -</code>. When in doubt, add brackets.</p>`, code: py`price = 100
print(price + price * 0.12)      # 112.0  (tax added)
print((price + 20) * 0.5)        # 60.0` },
    { h: "Comparisons give True or False", body: `<p><code>== != &gt; &lt; &gt;= &lt;=</code> compare two values and give a <code>bool</code>. Watch the edges: "greater than 300" is <code>&gt; 300</code>, so a bill of exactly 300 gets <b>no</b> discount. "50 or above" is <code>&gt;= 50</code>.</p>`, code: py`print(300 > 300)     # False - not greater
print(300 >= 300)    # True
print(50 >= 50)      # True
print(370 > 300 and 370 < 500)` },
  ],
  challenges: [
    { prompt: "Apply a 15% discount to <code>price</code> and print the final price. For 250 it should print <code>212.5</code>.", starter: py`price = 250
`, hint: "final = price - price * 0.15", solution: py`price = 250
final = price - price * 0.15
print(final)`,
      test: py`assert has_num(out, 212.5), "For price 250 expected 212.5"
_, o, _e = rerun({"price = 250": "price = 400"})
assert has_num(o, 340), "Use the variable: for price 400 expected 340.0"` },
    { prompt: "Work out the gross salary: basic + HRA (15% of basic) + TA (5% of basic). Print <code>gross</code>. For 4000 it should be <code>4800.0</code>.", starter: py`basic = 4000.0
`, hint: "hra = basic * 0.15, ta = basic * 0.05, gross = basic + hra + ta", solution: py`basic = 4000.0
hra = basic * 0.15
ta = basic * 0.05
gross = basic + hra + ta
print(gross)`,
      test: py`assert abs(ns.get("gross", 0) - 4800) < 0.01, "gross should be 4800.0"
assert "4800.0" in lines, "Print gross"
n2, _o, _e = rerun({"basic = 4000.0": "basic = 5000.0"})
assert abs(n2.get("gross", 0) - 6000) < 0.01, "Use basic: for 5000 gross should be 6000.0"` },
    { prompt: "A delivery took <code>minutes</code> minutes. Use <code>//</code> and <code>%</code> to print <code>2 hours 15 minutes</code> for 135.", starter: py`minutes = 135
`, hint: "hours = minutes // 60, rest = minutes % 60", solution: py`minutes = 135
hours = minutes // 60
rest = minutes % 60
print(hours, "hours", rest, "minutes")`,
      test: py`assert lines and nums(lines[-1]) == [2, 15], "For 135 expected: 2 hours 15 minutes"
_, o, _e = rerun({"minutes = 135": "minutes = 61"})
assert nums(o.strip().splitlines()[-1]) == [1, 1], "For 61 expected: 1 hours 1 minutes"` },
  ],
  quiz: [
    { q: "What is 15% of 370?", options: ["370 * 15", "370 * 0.15", "370 / 15", "370 - 15"], answer: 1, why: "15% means 15/100 = 0.15, so multiply by 0.15 (55.5)." },
    { q: "A discount applies when the total is \"greater than $300\". Which condition is right?", options: ["total >= 300", "total > 300", "total == 300", "total < 300"], answer: 1, why: "\"Greater than\" excludes 300 itself, so use >." },
    { q: "What is 10 % 3?", options: ["3", "1", "3.33", "0"], answer: 1, why: "10 = 3×3 + 1, so the remainder is 1." },
    { q: "What is type(430 / 6)?", options: ["int", "float", "str", "bool"], answer: 1, why: "/ always gives a float." },
  ],
},
{
  id: "py_04_strings", title: "Strings & Formatted Output", track: "Foundations", xp: 70, minutes: 12,
  summary: "f-strings, 2 decimal places, lining up labels, and matching the sample output.",
  sections: [
    { h: "f-strings", body: `<p>Put <code>f</code> before the quotes and drop variables into the text with <code>{ }</code>. This is the easiest way to print a labelled result.</p>`, code: py`name = "Ahmed"
total = 370.0
print(f"Customer Name : {name}")
print(f"Total Amount  : ${D}{total}")` },
    { h: "Two decimal places", body: `<p><code>{value:.2f}</code> shows exactly 2 decimal places. <code>round(value, 2)</code> also works, but it drops trailing zeros (<code>round(5.0, 2)</code> is <code>5.0</code>). The marks sample shows <code>71.67</code>, which is <code>430 / 6</code> to 2 decimal places.</p>`, code: py`average = 430 / 6
print(average)                 # 71.66666666666667
print(f"{average:.2f}")        # 71.67
print(round(average, 2))       # 71.67
print(f"{55.5:.2f}")           # 55.50` },
    { h: "Matching the sample output", body: `<p>Copy the labels from the question, including the spaces that line the colons up. You can also pad with <code>{label:&lt;14}</code>, which fills the text to 14 characters wide.</p><p>Don't lose time on spacing, though. Correct values and clear labels matter far more than an extra space.</p>`, code: py`print("----- STUDENT RESULT -----")
print(f"{'Total Marks':<18}: {430}")
print(f"{'Average Marks':<18}: {430 / 6:.2f}")
print(f"{'Result':<18}: PASS")` },
    { h: "Useful string methods", body: `<p>Strings are <b>immutable</b>: methods return a <i>new</i> string.</p>`, code: py`name = "  sarah khan "
print(name.strip().title())     # Sarah Khan
print(name.upper())
print("E205".startswith("E"))
print(len("Ahmed"))` },
  ],
  challenges: [
    { prompt: "Print the average with exactly 2 decimal places: <code>Average Marks : 71.67</code>.", starter: py`total = 430
average = total / 6
print("Average Marks :", average)
`, hint: "print(f\"Average Marks : {average:.2f}\")", solution: py`total = 430
average = total / 6
print(f"Average Marks : {average:.2f}")`,
      test: py`assert "71.67" in out and "71.666" not in out, "Show 2 decimal places: 71.67"
_, o, _e = rerun({"total = 430": "total = 500"})
assert "83.33" in o, "Use the variables: for total 500 expected 83.33"` },
    { prompt: "Print these two lines using the variables:<br><code>Customer Name : Ahmed</code><br><code>Total Amount  : $370.0</code>", starter: py`name = "Ahmed"
total = 370.0
`, hint: "f-strings: print(f\"Total Amount  : $" + "{total}\")", solution: py`name = "Ahmed"
total = 370.0
print(f"Customer Name : {name}")
print(f"Total Amount  : ${D}{total}")`,
      test: py`assert any("Customer Name" in l and "Ahmed" in l for l in lines), "Print the line Customer Name : Ahmed"
assert any("Total Amount" in l and "$370.0" in l for l in lines), "Print the line Total Amount  : $370.0 (with the $ sign)"
_, o, _e = rerun({'name = "Ahmed"': 'name = "Bob"', "total = 370.0": "total = 99.5"})
assert "Bob" in o and "$99.5" in o, "Use the variables, don't type the values"` },
    { prompt: "Clean up the employee name: remove the extra spaces and print it in Title Case (<code>Sarah Khan</code>).", starter: py`name = "   sarah KHAN  "
`, hint: "name.strip().title()", solution: py`name = "   sarah KHAN  "
print(name.strip().title())`,
      test: py`assert "Sarah Khan" in lines, "Expected Sarah Khan"
_, o, _e = rerun({'name = "   sarah KHAN  "': 'name = " ali VALIEV "'})
assert "Ali Valiev" in o, "Use string methods on name, don't type the answer"` },
  ],
  quiz: [
    { q: "What does f\"{71.666:.2f}\" give?", options: ["71.666", "71.67", "71.6", "72"], answer: 1, why: ".2f rounds to exactly 2 decimal places." },
    { q: "Which line prints Total: $5.0 when total = 5.0?", options: ["print(\"Total: $total\")", "print(f\"Total: ${total}\")", "print(\"Total: \" + total)", "print(f\"Total: $\" + {total})"], answer: 1, why: "In an f-string {total} is replaced with the value; the $ is ordinary text. \"Total: \" + total fails because you can't add str and float." },
    { q: "What does \"  hi \".strip() return?", options: ["\"hi\"", "\"  hi\"", "\"hi \"", "\" hi \""], answer: 0, why: "strip() removes whitespace from both ends." },
  ],
},
);
})(String.raw);
