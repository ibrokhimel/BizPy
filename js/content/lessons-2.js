/* Lessons 5-10: data structures, logic and algorithmic thinking (handbook weeks 2, 3 and 5). */
window.FP = window.FP || {};
FP.LESSONS = FP.LESSONS || [];
(function (py) {
const D = "$";
FP.LESSONS.push(
{
  id: "py_05_lists", title: "Lists: sum, max, min & counting", track: "Data Structures", xp: 80, minutes: 14,
  summary: "Store many values in one list, then total, average, rank and count them.",
  sections: [
    { h: "Making a list", body: `<p>A <b>list</b> holds many values in order, inside square brackets. Each item has an <b>index</b> starting at 0, and <code>-1</code> is the last item.</p>`, code: py`marks = [85, 70, 90, 45, 80, 60]
print(marks[0])      # 85  first
print(marks[-1])     # 60  last
print(len(marks))    # 6   how many` },
    { h: "Filling a list from input()", body: `<p>Start with an empty list and <code>append</code> each value inside a loop. This is the core of CW1 Task 2: "read the marks of 6 subjects and store them in a list".</p>`, stdin: "85\n70\n90\n45\n80\n60", code: py`marks = []
for i in range(1, 7):                    # 1, 2, 3, 4, 5, 6
    mark = float(input(f"Enter mark {i}: "))
    marks.append(mark)
print(marks)` },
    { h: "Built-in functions do the heavy lifting", body: `<p>You don't need to write loops for these:</p><table><tr><td><code>sum(marks)</code></td><td>total</td></tr><tr><td><code>len(marks)</code></td><td>how many</td></tr><tr><td><code>sum(marks) / len(marks)</code></td><td>average</td></tr><tr><td><code>max(marks)</code> / <code>min(marks)</code></td><td>highest / lowest</td></tr><tr><td><code>sorted(marks)</code></td><td>a new sorted list</td></tr></table>`, code: py`marks = [85, 70, 90, 45, 80, 60]
total = sum(marks)
average = total / len(marks)
print("Total  :", total)              # 430
print(f"Average: {average:.2f}")      # 71.67
print("Highest:", max(marks))         # 90
print("Lowest :", min(marks))         # 45` },
    { h: "Counting items that match", body: `<p>To count how many values pass a test, start a counter at 0 and add 1 each time the condition is true.</p>`, code: py`marks = [85, 70, 90, 45, 80, 60]
count = 0
for m in marks:
    if m >= 75:
        count += 1        # same as count = count + 1
print("Subjects with 75+:", count)    # 3

# One-line version
print(len([m for m in marks if m >= 75]))` },
    { h: "Changing a list", body: `<p>Lists are <b>mutable</b>, so you can change them after you make them.</p>`, code: py`cart = ["burger", "cola"]
cart.append("fries")      # add to the end
cart.insert(0, "soup")    # add at an index
cart.remove("cola")       # remove by value
last = cart.pop()         # remove and return the last item
print(cart, last)
print("burger" in cart)   # True` },
  ],
  challenges: [
    { prompt: "Print the total, highest and lowest of <code>sales</code>, one per line, using built-in functions.", starter: py`sales = [1200, 950, 1800, 700, 1500]
`, hint: "print(sum(sales)) then max(...) then min(...)", solution: py`sales = [1200, 950, 1800, 700, 1500]
print(sum(sales))
print(max(sales))
print(min(sales))`,
      test: py`assert has_num(out, 6150) and has_num(out, 1800) and has_num(out, 700), "Expected 6150, 1800 and 700"
_, o, _e = rerun({"sales = [1200, 950, 1800, 700, 1500]": "sales = [10, 40, 25]"})
assert has_num(o, 75) and has_num(o, 40) and has_num(o, 10), "Use the list: for [10, 40, 25] expected 75, 40 and 10"` },
    { prompt: "Count how many marks are <b>75 or above</b> and store the answer in <code>count</code>. Print it.", starter: py`marks = [85, 70, 90, 45, 80, 60]
count = 0
`, hint: "for m in marks: if m >= 75: count += 1", solution: py`marks = [85, 70, 90, 45, 80, 60]
count = 0
for m in marks:
    if m >= 75:
        count += 1
print(count)`,
      test: py`assert ns.get("count") == 3, "count should be 3 (85, 90 and 80)"
n2, _o, _e = rerun({"marks = [85, 70, 90, 45, 80, 60]": "marks = [75, 74, 100, 75]"})
assert n2.get("count") == 3, "75 counts too (75 or above). For [75, 74, 100, 75] count should be 3"` },
    { prompt: "Read <b>6</b> marks with <code>input()</code>, append each one (as a float) to the list <code>marks</code>, then print the list.", stdin: "85\n70\n90\n45\n80\n60", starter: py`marks = []
`, hint: "for i in range(1, 7): marks.append(float(input(f\"Enter mark {i}: \")))", solution: py`marks = []
for i in range(1, 7):
    mark = float(input(f"Enter mark {i}: "))
    marks.append(mark)
print(marks)`,
      test: py`assert ns.get("marks") == [85, 70, 90, 45, 80, 60], "marks should hold the 6 numbers you read, in order"
assert all(isinstance(m, float) for m in ns["marks"]), "Convert each mark with float()"
n2, _o = run_input(["1", "2", "3", "4", "5", "6"])
assert n2.get("marks") == [1, 2, 3, 4, 5, 6], "Read the values with input() inside a loop"` },
  ],
  quiz: [
    { q: "What is the index of the first item in a list?", options: ["1", "0", "-1", "It depends"], answer: 1, why: "Python counts from 0." },
    { q: "How do you work out the average of a list called marks?", options: ["avg(marks)", "sum(marks) / len(marks)", "max(marks) / 2", "marks / len(marks)"], answer: 1, why: "Python has no avg(). Divide the total by the number of items." },
    { q: "What does marks.append(80) do?", options: ["Adds 80 to every mark", "Adds 80 to the end of the list", "Replaces the list with 80", "Returns a new list"], answer: 1, why: "append adds one item to the end, changing the list in place." },
  ],
},
{
  id: "py_06_dicts", title: "Dictionaries: menus, prices & records", track: "Data Structures", xp: 60, minutes: 10,
  summary: "Look values up by name: price lists, stock levels and customer records.",
  sections: [
    { h: "Key → value", body: `<p>A <b>dictionary</b> stores pairs. You look a value up by its <b>key</b>, the same way you'd find a price on a menu by the item's name.</p>`, code: py`menu = {"burger": 120, "pizza": 150, "cola": 30}
print(menu["pizza"])          # 150
menu["fries"] = 45            # add a new pair
menu["cola"] = 35             # change a value
print(menu)
print("tea" in menu)          # False - checks keys` },
    { h: "Looping over a dictionary", body: `<p><code>.items()</code> gives you each key and value together.</p>`, code: py`stock = {"apples": 40, "bread": 12, "milk": 5}
for item, qty in stock.items():
    status = "LOW" if qty < 10 else "ok"
    print(f"{item:<8} {qty:>3}  {status}")` },
    { h: "Records: a list of dictionaries", body: `<p>A dictionary can hold one record, like an employee or a customer, and a list can hold many of them.</p>`, code: py`staff = [
    {"id": "E205", "name": "Sarah", "basic": 4000.0},
    {"id": "E206", "name": "Ali", "basic": 3500.0},
]
for emp in staff:
    print(emp["id"], emp["name"], emp["basic"] * 1.2)
print(sum(e["basic"] for e in staff))` },
  ],
  challenges: [
    { prompt: "Work out the total cost of <code>order</code> using the prices in <code>menu</code>. Print the total (180 here).", starter: py`menu = {"burger": 120, "pizza": 150, "cola": 30}
order = ["burger", "cola", "cola"]
`, hint: "total = 0, then for item in order: total += menu[item]", solution: py`menu = {"burger": 120, "pizza": 150, "cola": 30}
order = ["burger", "cola", "cola"]
total = 0
for item in order:
    total += menu[item]
print(total)`,
      test: py`assert has_num(out, 180), "Expected 180"
_, o, _e = rerun({'order = ["burger", "cola", "cola"]': 'order = ["pizza", "pizza"]'})
assert has_num(o, 300), "Look prices up in menu: for two pizzas expected 300"` },
    { prompt: "Print the name of every product whose stock is <b>below 10</b>, one per line.", starter: py`stock = {"apples": 40, "bread": 8, "milk": 5, "eggs": 12}
`, hint: "for name, qty in stock.items(): if qty < 10: print(name)", solution: py`stock = {"apples": 40, "bread": 8, "milk": 5, "eggs": 12}
for name, qty in stock.items():
    if qty < 10:
        print(name)`,
      test: py`assert lines == ["bread", "milk"], "Expected bread and milk, one per line"
_, o, _e = rerun({'stock = {"apples": 40, "bread": 8, "milk": 5, "eggs": 12}': 'stock = {"tea": 3, "rice": 10}'})
assert o.split() == ["tea"], "10 is not below 10: for {tea: 3, rice: 10} expected only tea"` },
  ],
  quiz: [
    { q: "menu = {\"cola\": 30}. What does menu[\"cola\"] give?", options: ["\"cola\"", "30", "{\"cola\": 30}", "Error"], answer: 1, why: "The key looks up its value." },
    { q: "What happens with menu[\"tea\"] if \"tea\" isn't a key?", options: ["Returns None", "Returns 0", "KeyError", "Adds tea"], answer: 2, why: "A missing key raises KeyError. Use menu.get(\"tea\") to get None instead." },
  ],
},
{
  id: "py_08_control_flow", title: "Decisions: if / elif / else", track: "Logic", xp: 80, minutes: 14,
  summary: "Discounts, pass/fail and grade bands, plus Boolean logic with and/or/not.",
  sections: [
    { h: "if / else", body: `<p>An <code>if</code> runs its <b>indented</b> block only when the condition is True. The <code>else</code> block runs otherwise. Don't forget the <b>colon</b> at the end of each line.</p>`, code: py`total = 370.0
if total > 300:
    discount = total * 0.15
else:
    discount = 0
print("Discount:", discount)` },
    { h: "elif chains", body: `<p>Python checks the conditions from the top and runs only the <b>first</b> one that's true. Put the highest band first.</p>`, code: py`mark = 65
if mark >= 70:
    grade = "Distinction"
elif mark >= 60:
    grade = "Merit"
elif mark >= 40:
    grade = "Pass"
else:
    grade = "Fail"
print(grade)    # Merit` },
    { h: "Boolean logic (week 5)", body: `<p>Combine conditions with <code>and</code> (both must be true), <code>or</code> (at least one must be true) and <code>not</code> (flips the value).</p><table><tr><td><b>A</b></td><td><b>B</b></td><td><b>A and B</b></td><td><b>A or B</b></td></tr><tr><td>True</td><td>True</td><td>True</td><td>True</td></tr><tr><td>True</td><td>False</td><td>False</td><td>True</td></tr><tr><td>False</td><td>True</td><td>False</td><td>True</td></tr><tr><td>False</td><td>False</td><td>False</td><td>False</td></tr></table>`, code: py`age, income = 25, 3000
eligible = age >= 18 and income > 2000
print(eligible)                    # True
is_member = False
print(not is_member)               # True
print(age < 18 or income > 2500)   # True` },
    { h: "One-line if (conditional expression)", body: `<p>For simple choices you can write the whole <code>if</code> on one line.</p>`, code: py`average = 71.67
result = "PASS" if average >= 50 else "FAIL"
print(result)` },
  ],
  challenges: [
    { prompt: "Read the order total. If it's <b>greater than 300</b>, the discount is 15% of the total; otherwise it's 0. Print the discount.", stdin: "370", starter: py`total = float(input("Enter total: "))
`, hint: "if total > 300: discount = total * 0.15 else: discount = 0", solution: py`total = float(input("Enter total: "))
if total > 300:
    discount = total * 0.15
else:
    discount = 0
print(discount)`,
      test: py`assert has_num(lines[-1], 55.5), "For 370 the discount is 55.5"
for value, want in (("300", 0), ("301", 45.15), ("100", 0), ("1000", 150)):
    _, o = run_input([value])
    assert has_num(o.strip().splitlines()[-1], want), "For a total of " + value + " the discount should be " + str(want) + (" (exactly 300 is NOT greater than 300)" if value == "300" else "")` },
    { prompt: "Read an average and print <code>PASS</code> if it's 50 or above, otherwise <code>FAIL</code>.", stdin: "71.67", starter: py`average = float(input("Enter average: "))
`, hint: "if average >= 50: print(\"PASS\") else: print(\"FAIL\")", solution: py`average = float(input("Enter average: "))
if average >= 50:
    print("PASS")
else:
    print("FAIL")`,
      test: py`assert lines[-1].endswith("PASS"), "71.67 should PASS"
for value, want in (("50", "PASS"), ("49.99", "FAIL"), ("0", "FAIL"), ("100", "PASS")):
    _, o = run_input([value])
    assert o.strip().endswith(want), "For " + value + " expected " + want` },
    { prompt: "Read a mark and print its grade: <code>Distinction</code> (70+), <code>Merit</code> (60-69), <code>Pass</code> (40-59) or <code>Fail</code>.", stdin: "65", starter: py`mark = float(input("Enter mark: "))
`, hint: "Start with the highest band: if mark >= 70 ... elif mark >= 60 ...", solution: py`mark = float(input("Enter mark: "))
if mark >= 70:
    print("Distinction")
elif mark >= 60:
    print("Merit")
elif mark >= 40:
    print("Pass")
else:
    print("Fail")`,
      test: py`for value, want in (("65", "Merit"), ("70", "Distinction"), ("95", "Distinction"), ("60", "Merit"), ("59", "Pass"), ("40", "Pass"), ("39", "Fail")):
    _, o = run_input([value])
    assert o.strip().endswith(want), "For " + value + " expected " + want` },
    { prompt: "A customer gets a loan if they're <b>18 or older and</b> earn <b>more than 2000</b>. Read age then income, and print <code>True</code> or <code>False</code>.", stdin: "25\n3000", starter: py`age = int(input("Age: "))
income = float(input("Income: "))
`, hint: "print(age >= 18 and income > 2000)", solution: py`age = int(input("Age: "))
income = float(input("Income: "))
print(age >= 18 and income > 2000)`,
      test: py`for a, i, want in (("25", "3000", "True"), ("17", "9000", "False"), ("18", "2000", "False"), ("18", "2000.5", "True")):
    _, o = run_input([a, i])
    assert o.strip().endswith(want), "Age " + a + ", income " + i + " should give " + want` },
  ],
  quiz: [
    { q: "mark = 70. Which grade does the elif chain above give?", options: ["Merit", "Distinction", "Pass", "Both Distinction and Merit"], answer: 1, why: "70 >= 70 is True, so the first branch runs and the rest are skipped." },
    { q: "What is True and False?", options: ["True", "False", "None", "Error"], answer: 1, why: "and needs both sides to be True." },
    { q: "What is False or True?", options: ["True", "False", "None", "Error"], answer: 0, why: "or needs at least one side to be True." },
    { q: "What's missing? if total > 300\n    discount = 50", options: ["Brackets", "A colon after 300", "A semicolon", "Nothing"], answer: 1, why: "Every if / elif / else / for / while / def / class line ends with a colon." },
  ],
},
{
  id: "py_09_loops", title: "Loops & Running Totals", track: "Logic", xp: 90, minutes: 15,
  summary: "for, range(), the accumulator pattern, while loops and the off-by-one bug.",
  sections: [
    { h: "for with range()", body: `<p><code>range(stop)</code> counts from 0 up to <b>but not including</b> stop. <code>range(start, stop)</code> starts at start. To number items 1 to n, use <code>range(1, n + 1)</code>.</p>`, code: py`print(list(range(3)))          # [0, 1, 2]
print(list(range(1, 4)))       # [1, 2, 3]
print(list(range(1, 3)))       # [1, 2]  <- only 2 items!
print(list(range(0, 10, 2)))   # [0, 2, 4, 6, 8]` },
    { h: "The off-by-one bug", body: `<p><code>for i in range(1, n)</code> runs only <b>n − 1</b> times. This is one of the planted bugs in the mock test's Task 4. Use <code>range(n)</code> when you just need n turns, or <code>range(1, n + 1)</code> when you want to show 1 to n.</p>`, code: py`n = 3
print(len(range(1, n)))       # 2  - one short
print(len(range(n)))          # 3
print(len(range(1, n + 1)))   # 3` },
    { h: "The accumulator pattern", body: `<p>To total a series of values, start at 0 <b>before</b> the loop and add to it <b>inside</b> the loop. Print the result <b>after</b> the loop, unindented.</p>`, stdin: "3\n120\n100\n150", code: py`n = int(input("Enter number of food items: "))
total = 0                                  # 1. start at zero (before the loop)
for i in range(1, n + 1):
    price = float(input(f"Enter price of item {i}: "))
    total = total + price                  # 2. add each value (inside the loop)
print("Total Amount:", total)              # 3. use it (after the loop)` },
    { h: "Indentation decides what's inside", body: `<p>Python uses indentation (4 spaces) to mark which lines belong to the loop. Moving <code>print</code> into the loop prints a running total every time round.</p>`, code: py`prices = [10, 20, 30]
total = 0
for p in prices:
    total += p
    print("running:", total)   # inside: runs 3 times
print("final:", total)         # outside: runs once` },
    { h: "while loops", body: `<p>A <code>while</code> loop repeats as long as its condition is True. Use it when you don't know in advance how many times to repeat, for example "keep reading until the user types 0". <code>break</code> leaves a loop early.</p>`, stdin: "50\n25\n0", code: py`total = 0
amount = float(input("Expense (0 to stop): "))
while amount != 0:
    total += amount
    amount = float(input("Expense (0 to stop): "))
print("Total:", total)` },
  ],
  challenges: [
    { prompt: "Read how many items were ordered, then read each price and print the total. Inputs <code>3, 120, 100, 150</code> give <code>370.0</code>.", stdin: "3\n120\n100\n150", starter: py`n = int(input("Enter number of food items: "))
`, hint: "total = 0 before the loop; for i in range(n): total += float(input(...)); print after the loop.", solution: py`n = int(input("Enter number of food items: "))
total = 0
for i in range(1, n + 1):
    price = float(input(f"Enter price of item {i}: "))
    total = total + price
print(total)`,
      test: py`assert has_num(lines[-1], 370), "With 3, 120, 100, 150 the last line should be 370.0"
_, o = run_input(["2", "10", "20.5"])
assert has_num(o.strip().splitlines()[-1], 30.5), "With 2 items 10 and 20.5 expected 30.5"
_, o = run_input(["1", "5"])
assert has_num(o.strip().splitlines()[-1], 5), "With 1 item of 5 expected 5.0"` },
    { prompt: "This loop asks for <code>item 0</code>, <code>item 1</code>, <code>item 2</code>. Fix it so the prompts say <code>item 1</code>, <code>item 2</code>, <code>item 3</code> and it still reads exactly n prices.", stdin: "3\n5\n5\n5", starter: py`n = int(input("How many items? "))
total = 0
for i in range(n):
    total += float(input(f"Enter price of item {i}: "))
print(total)
`, hint: "Use range(1, n + 1) so i runs from 1 to n.", solution: py`n = int(input("How many items? "))
total = 0
for i in range(1, n + 1):
    total += float(input(f"Enter price of item {i}: "))
print(total)`,
      test: py`assert "item 0" not in out, "The first prompt should say item 1, not item 0"
assert "item 1" in out and "item 3" in out, "Prompts should go from item 1 to item 3"
assert has_num(lines[-1], 15), "It must still read all 3 prices (total 15.0)"
_, o = run_input(["4", "1", "1", "1", "1"])
assert "item 4" in o and has_num(o.strip().splitlines()[-1], 4), "With 4 items it should ask up to item 4 and total 4.0"` },
    { prompt: "Keep reading expenses until the user types <code>0</code>, then print the total. Inputs <code>50, 25, 0</code> give <code>75.0</code>.", stdin: "50\n25\n0", starter: py`total = 0
`, hint: "Read one amount before the loop; while amount != 0: add it, then read the next.", solution: py`total = 0
amount = float(input("Expense (0 to stop): "))
while amount != 0:
    total += amount
    amount = float(input("Expense (0 to stop): "))
print(total)`,
      test: py`assert has_num(lines[-1], 75), "With 50, 25, 0 expected 75.0"
_, o = run_input(["10", "0"])
assert has_num(o.strip().splitlines()[-1], 10), "With 10, 0 expected 10.0"
_, o = run_input(["0"])
assert has_num(o.strip().splitlines()[-1], 0), "With just 0 expected 0"
assert "while" in code, "Use a while loop"` },
  ],
  quiz: [
    { q: "How many times does for i in range(1, 5) run?", options: ["5", "4", "6", "1"], answer: 1, why: "It gives 1, 2, 3, 4. The stop value is excluded." },
    { q: "Where should total = 0 go when summing in a loop?", options: ["Inside the loop", "Before the loop", "After the loop", "Anywhere"], answer: 1, why: "Inside the loop it would reset to 0 every time round." },
    { q: "The user should enter n values. Which loop reads exactly n?", options: ["for i in range(1, n)", "for i in range(n)", "for i in range(n - 1)", "for i in range(0, n - 1)"], answer: 1, why: "range(n) runs n times. range(1, n) runs n - 1 times." },
    { q: "What does break do?", options: ["Skips one turn", "Leaves the loop immediately", "Stops the program", "Restarts the loop"], answer: 1, why: "break exits the nearest loop. continue skips to the next turn." },
  ],
},
{
  id: "py_10_functions", title: "Functions", track: "Logic", xp: 80, minutes: 14,
  summary: "Name a calculation once and reuse it: parameters, return values and docstrings.",
  sections: [
    { h: "def and return", body: `<p>A <b>function</b> is a named block of code. <b>Parameters</b> are its inputs, and <code>return</code> sends the answer back to whoever called it.</p>`, code: py`def calculate_discount(total):
    """Return a 15% discount for orders over 300, else 0."""
    if total > 300:
        return total * 0.15
    return 0

print(calculate_discount(370))    # 55.5
print(calculate_discount(200))    # 0` },
    { h: "return is not print", body: `<p><code>print</code> only shows a value. <code>return</code> hands it back so you can store it and use it in more maths. A function without <code>return</code> gives back <code>None</code>.</p>`, code: py`def show(x):
    print(x)

def give(x):
    return x

a = show(5)      # prints 5, but a is None
b = give(5)      # prints nothing, b is 5
print(a, b)` },
    { h: "Several parameters and defaults", body: `<p>A parameter can have a default value, which is used when the caller leaves it out.</p>`, code: py`def add_tax(price, rate=0.12):
    return price + price * rate

print(add_tax(100))          # 112.0 (default 12%)
print(add_tax(100, 0.2))     # 120.0` },
    { h: "Organising a test answer with functions", body: `<p>Wrapping each task in its own function keeps a four-task file tidy, and you can run one task at a time while you work.</p>`, code: py`def task1():
    print("Task 1 running")

def task2():
    print("Task 2 running")

task1()
# task2()   # comment a call out while you work on another task` },
  ],
  challenges: [
    { prompt: "Write <code>calculate_discount(total)</code>. It returns 15% of total when total is <b>greater than 300</b>, otherwise 0.", starter: py`def calculate_discount(total):
    pass
`, hint: "if total > 300: return total * 0.15, then return 0", solution: py`def calculate_discount(total):
    if total > 300:
        return total * 0.15
    return 0`,
      test: py`f = ns["calculate_discount"]
assert abs(f(370) - 55.5) < 0.001, "calculate_discount(370) should return 55.5"
assert f(300) == 0, "calculate_discount(300) should return 0 (not greater than 300)"
assert abs(f(1000) - 150) < 0.001, "calculate_discount(1000) should return 150.0"
assert f(10) == 0, "calculate_discount(10) should return 0"` },
    { prompt: "Write <code>average(marks)</code>. It returns the average of a list, rounded to 2 decimal places.", starter: py`def average(marks):
    pass
`, hint: "return round(sum(marks) / len(marks), 2)", solution: py`def average(marks):
    return round(sum(marks) / len(marks), 2)`,
      test: py`f = ns["average"]
assert f([85, 70, 90, 45, 80, 60]) == 71.67, "average([85, 70, 90, 45, 80, 60]) should return 71.67"
assert f([50]) == 50, "average([50]) should return 50"
assert f([1, 2]) == 1.5, "average([1, 2]) should return 1.5"` },
    { prompt: "Write <code>result(avg)</code>. It <b>returns</b> (doesn't print) <code>\"PASS\"</code> when avg is 50 or above, otherwise <code>\"FAIL\"</code>.", starter: py`def result(avg):
    print("PASS")
`, hint: "Use return, not print.", solution: py`def result(avg):
    if avg >= 50:
        return "PASS"
    return "FAIL"`,
      test: py`f = ns["result"]
r, printed = capture(f, 71.67)
assert r == "PASS", "result(71.67) should RETURN \"PASS\" (use return, not print)"
assert f(50) == "PASS", "result(50) should return PASS"
assert f(49.9) == "FAIL", "result(49.9) should return FAIL"` },
  ],
  quiz: [
    { q: "What does a function return if it has no return statement?", options: ["0", "\"\"", "None", "An error"], answer: 2, why: "Python returns None by default." },
    { q: "def area(w, h): ... In area(3, 4), what are 3 and 4?", options: ["Parameters", "Arguments", "Variables", "Returns"], answer: 1, why: "Values passed in a call are arguments; w and h are the parameters." },
    { q: "Why use return instead of print?", options: ["It's faster", "The caller can store and reuse the value", "print doesn't work in functions", "No reason"], answer: 1, why: "return hands the value back so other code can use it." },
  ],
},
{
  id: "py_16_algorithms", title: "Algorithmic Thinking & Recursion", track: "Algorithms", xp: 90, minutes: 16,
  summary: "Plan with input → process → output, find a maximum by hand, search a list and use recursion.",
  sections: [
    { h: "Plan before you type", body: `<p>An <b>algorithm</b> is a step-by-step method. Before coding a test task, write the steps as comments: <b>Input → Process → Output</b>. Then fill in the code under each comment. This also gets you the documentation marks.</p>`, code: py`# Input: number of items and each price
# Process: add the prices, apply 15% discount if total > 300
# Output: total, discount, payable
prices = [120, 100, 150]
total = sum(prices)
discount = total * 0.15 if total > 300 else 0
print(total, discount, total - discount)` },
    { h: "Finding the largest by hand", body: `<p><code>max()</code> does this for you, but you should know the algorithm too. Assume the first item is the biggest, then compare it with every other item.</p>`, code: py`def find_max(values):
    biggest = values[0]
    for v in values[1:]:
        if v > biggest:
            biggest = v
    return biggest

print(find_max([85, 70, 90, 45]))   # 90` },
    { h: "Linear search", body: `<p>Check each item in turn. Return its index as soon as you find a match, or <code>-1</code> if it isn't there.</p>`, code: py`def linear_search(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1

ids = ["E201", "E205", "E209"]
print(linear_search(ids, "E205"))   # 1
print(linear_search(ids, "E999"))   # -1` },
    { h: "Recursion", body: `<p>A <b>recursive</b> function calls itself on a smaller problem. Every recursive function needs a <b>base case</b> that stops it. Without one, it recurses until Python gives up with a <code>RecursionError</code>.</p>`, code: py`def factorial(n):
    if n <= 1:              # base case
        return 1
    return n * factorial(n - 1)   # recursive case

def total(prices):
    if not prices:          # base case: empty list
        return 0
    return prices[0] + total(prices[1:])

print(factorial(5))         # 120
print(total([120, 100, 150]))` },
  ],
  challenges: [
    { prompt: "Write <code>find_max(values)</code> <b>without</b> using <code>max()</code>. It returns the largest number in the list.", starter: py`def find_max(values):
    pass
`, hint: "biggest = values[0]; loop and replace biggest whenever v > biggest.", solution: py`def find_max(values):
    biggest = values[0]
    for v in values:
        if v > biggest:
            biggest = v
    return biggest`,
      test: py`assert not re.search(r"(?<![\w.])max\(", code), "Don't use max() - write the loop yourself"
f = ns["find_max"]
assert f([85, 70, 90, 45]) == 90, "find_max([85, 70, 90, 45]) should be 90"
assert f([-5, -2, -9]) == -2, "find_max([-5, -2, -9]) should be -2"
assert f([7]) == 7, "find_max([7]) should be 7"` },
    { prompt: "Write <code>linear_search(items, target)</code>. It returns the index of target, or <code>-1</code> if target isn't in the list. Don't use <code>.index()</code>.", starter: py`def linear_search(items, target):
    pass
`, hint: "for i in range(len(items)): if items[i] == target: return i. After the loop: return -1", solution: py`def linear_search(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1`,
      test: py`assert ".index(" not in code, "Write the loop yourself instead of using .index()"
f = ns["linear_search"]
assert f(["E201", "E205", "E209"], "E205") == 1, "Should return 1 for E205"
assert f(["E201", "E205"], "E999") == -1, "Should return -1 when not found"
assert f([], 3) == -1, "An empty list should give -1"` },
    { prompt: "Write a <b>recursive</b> <code>factorial(n)</code>, where factorial(5) = 5×4×3×2×1 = 120. It must call itself.", starter: py`def factorial(n):
    pass
`, hint: "Base case: if n <= 1: return 1. Otherwise return n * factorial(n - 1).", solution: py`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
      test: py`f = ns["factorial"]
assert f(5) == 120, "factorial(5) should be 120"
assert f(1) == 1 and f(0) == 1, "factorial(1) and factorial(0) should be 1"
assert f(10) == 3628800, "factorial(10) should be 3628800"
body = code.split("def factorial", 1)[1]
assert body.count("factorial(") >= 1,"factorial should call itself (recursion), not use a loop"` },
  ],
  quiz: [
    { q: "What does every recursive function need?", options: ["A loop", "A base case", "A global variable", "Two parameters"], answer: 1, why: "The base case stops the recursion." },
    { q: "Linear search on 1000 items. How many checks in the worst case?", options: ["1", "10", "500", "1000"], answer: 3, why: "If the item is last or missing, every item is checked." },
    { q: "What are the three parts of a simple program plan?", options: ["Start, middle, end", "Input, process, output", "Class, object, method", "Try, except, finally"], answer: 1, why: "Input → Process → Output is the standard plan." },
  ],
},
);
})(String.raw);
