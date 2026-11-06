/* Flashcards and the reference cheat sheet. Python is String.raw (py``) so backslashes survive. */
window.FP = window.FP || {};
(function (py) {

FP.FLASHCARDS = [
  { front: "What is a variable?", back: "A name that refers to a value stored in memory, created with = (assignment).", tag: "Basics" },
  { front: "Name Python's basic data types", back: "int, float, str, bool, and NoneType (None).", tag: "Basics" },
  { front: "What is casting?", back: "Converting a value from one type to another, e.g. int(\"5\") or str(42).", tag: "Basics" },
  { front: "Difference between = and ==", back: "= assigns a value; == compares two values and gives True or False.", tag: "Basics" },
  { front: "What do // and % do?", back: "// is floor (whole-number) division; % gives the remainder (modulus). 7 // 2 = 3, 7 % 2 = 1.", tag: "Basics" },
  { front: "Definite vs indefinite iteration", back: "A for loop repeats a known number of times (definite); a while loop repeats until a condition is False (indefinite).", tag: "Control flow" },
  { front: "What is selection?", back: "Choosing which code runs based on a condition: if / elif / else.", tag: "Control flow" },
  { front: "Parameter vs argument", back: "A parameter is the variable in the function definition; an argument is the actual value passed when calling it.", tag: "Functions" },
  { front: "Local vs global scope", back: "A local variable exists only inside its function; a global is defined at the top level and visible everywhere.", tag: "Functions" },
  { front: "return vs print", back: "return sends a value back to the caller so it can be used; print only displays text.", tag: "Functions" },
  { front: "List vs tuple", back: "Both are ordered sequences; a list is mutable (can change), a tuple is immutable.", tag: "Data structures" },
  { front: "What is a dictionary?", back: "A mutable collection of key: value pairs; look up values by unique key, e.g. d[\"name\"].", tag: "Data structures" },
  { front: "What is a set?", back: "An unordered collection of unique items; good for removing duplicates and membership tests.", tag: "Data structures" },
  { front: "What does mutable mean?", back: "The object can be changed in place after it is created (lists, dicts, sets).", tag: "Data structures" },
  { front: "Class vs object", back: "A class is a blueprint; an object (instance) is a thing built from that blueprint.", tag: "OOP" },
  { front: "What does __init__ do?", back: "The constructor: it runs when an object is created and sets up its attributes.", tag: "OOP" },
  { front: "What is self?", back: "The first parameter of a method; it refers to the specific object the method was called on.", tag: "OOP" },
  { front: "Encapsulation", back: "Bundling data and the methods that use it inside a class, and hiding internal details (e.g. _private attributes).", tag: "OOP" },
  { front: "Inheritance", back: "A subclass reuses the attributes and methods of a parent class (an 'is-a' relationship): class Dog(Animal).", tag: "OOP" },
  { front: "Polymorphism", back: "Different classes respond to the same method call in their own way, e.g. each subclass overrides speak().", tag: "OOP" },
  { front: "Abstraction", back: "Showing only the essential features and hiding the complex detail of how they work.", tag: "OOP" },
  { front: "Method overriding", back: "A subclass defines a method with the same name as its parent's to replace its behaviour; super() calls the parent version.", tag: "OOP" },
  { front: "Linear search", back: "Check each item in turn until found. Works on unsorted data. O(n).", tag: "Algorithms" },
  { front: "Binary search", back: "Repeatedly halve a SORTED list by comparing with the middle item. O(log n).", tag: "Algorithms" },
  { front: "Bubble sort", back: "Repeatedly swap adjacent items that are out of order. O(n^2). Simple but slow.", tag: "Algorithms" },
  { front: "Insertion sort", back: "Take each item and insert it into its place in the sorted part on the left. O(n^2), fast on nearly-sorted data.", tag: "Algorithms" },
  { front: "Merge sort", back: "Divide and conquer: split in half, sort each half recursively, merge them. O(n log n), uses extra memory.", tag: "Algorithms" },
  { front: "What does Big-O describe?", back: "How an algorithm's time (or memory) grows as the input size n grows, in the worst case.", tag: "Algorithms" },
  { front: "Normal test data", back: "Typical, valid input the program should accept, e.g. a mark of 65.", tag: "Testing" },
  { front: "Boundary test data", back: "Values at the edges of the valid range, e.g. 0 and 100 (and just outside: -1, 101).", tag: "Testing" },
  { front: "Erroneous test data", back: "Invalid input that should be rejected, e.g. \"abc\" or -50 for a mark.", tag: "Testing" },
  { front: "Syntax vs runtime vs logic error", back: "Syntax: breaks language rules, won't run. Runtime: crashes while running. Logic: runs but gives the wrong result.", tag: "Testing" },
  { front: "What is a unit test?", back: "An automated test that checks one small piece of code (a function or method) in isolation, e.g. with unittest.", tag: "Testing" },
  { front: "What does input() return?", back: "Always a str. Convert with int() for counts or float() for money and marks before doing maths.", tag: "Exam" },
  { front: "Why does the sample show $370.0 and not $370?", back: "The prices were read with float(), and floats print with a decimal point.", tag: "Exam" },
  { front: "How do you show 71.67 instead of 71.6666?", back: "f\"{average:.2f}\" or round(average, 2).", tag: "Exam" },
  { front: "\"Discount if total is greater than 300\": which operator?", back: "> (not >=). Exactly 300 gets no discount.", tag: "Exam" },
  { front: "\"PASS if average is 50 or above\": which operator?", back: ">= 50. Exactly 50 passes.", tag: "Exam" },
  { front: "How many times does range(1, n) run?", back: "n - 1 times. Use range(n), or range(1, n + 1) to number items 1 to n.", tag: "Exam" },
  { front: "Accumulator pattern", back: "total = 0 BEFORE the loop, total += value INSIDE it, print AFTER it.", tag: "Exam" },
  { front: "15% of x in Python", back: "x * 0.15 (the same as x * 15 / 100).", tag: "Exam" },
  { front: "HRA, TA and gross salary (mock Task 3)", back: "HRA = basic * 0.15, TA = basic * 0.05, gross = basic + HRA + TA.", tag: "Exam" },
  { front: "Four comment labels for Task 4 documentation", back: "Input, Storage, Calculation, Output.", tag: "Exam" },
  { front: "Columns of a test table", back: "Test no., input, expected output, actual output, Pass/Fail.", tag: "Exam" },
  { front: "Normal vs boundary vs erroneous test", back: "Normal: typical data. Boundary: on the edge (1 item, exactly 50). Erroneous: invalid (text, negative, 0 items).", tag: "Testing" },
  { front: "Syntax vs runtime vs logic error", back: "Syntax: won't start (missing : or ). Runtime: crashes partway (ZeroDivisionError). Logic: runs but gives the wrong answer.", tag: "Testing" },
  { front: "CW1 file name", back: "FunBP_MT_<StudentID>.py, e.g. FunBP_MT_500555.py. One file with all four tasks.", tag: "Exam" },
  { front: "What is __init__?", back: "The constructor. It runs automatically when an object is created and sets self.attributes.", tag: "OOP" },
  { front: "git add vs git commit", back: "add stages changes; commit saves the staged changes as a snapshot with a message.", tag: "Git" },
  { front: "What is a branch in Git?", back: "An independent line of work. Merge it back into main when it's done.", tag: "Git" },
  { front: "What is recursion?", back: "A function calling itself on a smaller problem. It needs a base case to stop.", tag: "Algorithms" },
];

FP.REFERENCE = {
  "Built-in functions": [
    { term: "print(*values, sep=' ', end='\\n')", definition: "Display values as text.", example: py`print("Total:", 42, sep=" ")` },
    { term: "input(prompt)", definition: "Read a line typed by the user; always returns a str.", example: py`name = input("Name: ")` },
    { term: "len(x)", definition: "Number of items in a string, list, dict, etc.", example: py`len([4, 5, 6])   # 3` },
    { term: "int() / float() / str()", definition: "Convert (cast) a value to another type.", example: py`age = int("21")` },
    { term: "type(x)", definition: "Return the type of a value.", example: py`type(3.5)   # <class 'float'>` },
    { term: "range(start, stop, step)", definition: "A sequence of integers up to (not including) stop.", example: py`list(range(1, 10, 3))   # [1, 4, 7]` },
    { term: "sum() / min() / max()", definition: "Total, smallest and largest of an iterable.", example: py`sum([1, 2, 3])   # 6` },
    { term: "sorted(iterable, key=, reverse=)", definition: "Return a NEW sorted list.", example: py`sorted(["b", "a"])   # ['a', 'b']` },
    { term: "round(x, n)", definition: "Round to n decimal places.", example: py`round(3.14159, 2)   # 3.14` },
    { term: "enumerate(iterable)", definition: "Loop with an index and a value together.", example: py`for i, v in enumerate(["a", "b"]):
    print(i, v)` },
    { term: "isinstance(obj, cls)", definition: "True if obj is an instance of cls (or a subclass).", example: py`isinstance(5, int)   # True` },
  ],
  "String methods": [
    { term: "s.upper() / s.lower()", definition: "Return the string in upper or lower case.", example: py`"Hi".upper()   # 'HI'` },
    { term: "s.strip()", definition: "Remove whitespace from both ends.", example: py`"  hi  ".strip()   # 'hi'` },
    { term: "s.split(sep)", definition: "Break into a list of strings.", example: py`"a,b,c".split(",")   # ['a', 'b', 'c']` },
    { term: "sep.join(list)", definition: "Glue a list of strings together.", example: py`"-".join(["a", "b"])   # 'a-b'` },
    { term: "s.replace(old, new)", definition: "Return a copy with old replaced by new.", example: py`"cat".replace("c", "h")   # 'hat'` },
    { term: "s.find(sub)", definition: "Index of the first match, or -1.", example: py`"hello".find("l")   # 2` },
    { term: "s.startswith() / s.endswith()", definition: "Check the start or end of a string.", example: py`"data.csv".endswith(".csv")   # True` },
    { term: "s.isdigit()", definition: "True if every character is a digit (useful for validation).", example: py`"123".isdigit()   # True` },
    { term: "f-string", definition: "Embed expressions inside a string.", example: py`price = 2.5
print(f"Cost: {price:.2f}")` },
    { term: "Slicing s[start:stop:step]", definition: "Get part of a string (or list).", example: py`"Python"[0:3]   # 'Pyt'` },
  ],
  "List methods": [
    { term: "lst.append(x)", definition: "Add x to the end.", example: py`nums = [1]
nums.append(2)` },
    { term: "lst.insert(i, x)", definition: "Insert x at index i.", example: py`nums = [1, 3]
nums.insert(1, 2)` },
    { term: "lst.remove(x)", definition: "Remove the first x (ValueError if missing).", example: py`nums = [1, 2]
nums.remove(2)` },
    { term: "lst.pop(i)", definition: "Remove and return the item at i (last by default).", example: py`last = [1, 2, 3].pop()   # 3` },
    { term: "lst.sort() / lst.reverse()", definition: "Sort or reverse the list in place (returns None).", example: py`nums = [3, 1, 2]
nums.sort()` },
    { term: "lst.index(x)", definition: "Index of the first x.", example: py`["a", "b"].index("b")   # 1` },
    { term: "lst.count(x)", definition: "How many times x appears.", example: py`[1, 1, 2].count(1)   # 2` },
    { term: "x in lst", definition: "Membership test (linear search).", example: py`3 in [1, 2, 3]   # True` },
    { term: "List comprehension", definition: "Build a list in one line.", example: py`squares = [n * n for n in range(5)]` },
  ],
  "Dictionary methods": [
    { term: "d[key] / d[key] = value", definition: "Read or set the value for a key (KeyError if reading a missing key).", example: py`d = {"a": 1}
d["b"] = 2` },
    { term: "d.get(key, default)", definition: "Read a value safely, returning default if missing.", example: py`{"a": 1}.get("z", 0)   # 0` },
    { term: "d.keys() / d.values()", definition: "Views of the keys or the values.", example: py`list({"a": 1}.keys())   # ['a']` },
    { term: "d.items()", definition: "(key, value) pairs, ideal for looping.", example: py`for k, v in {"a": 1}.items():
    print(k, v)` },
    { term: "d.pop(key)", definition: "Remove a key and return its value.", example: py`d = {"a": 1}
d.pop("a")` },
    { term: "d.update(other)", definition: "Merge another dict in, overwriting matching keys.", example: py`d = {"a": 1}
d.update({"b": 2})` },
    { term: "key in d", definition: "True if the key exists (fast, O(1) on average).", example: py`"a" in {"a": 1}   # True` },
  ],
  "Control flow": [
    { term: "if / elif / else", definition: "Selection: run the first block whose condition is True.", example: py`mark = 65
if mark >= 70:
    print("First")
elif mark >= 60:
    print("2:1")
else:
    print("Lower")` },
    { term: "for loop", definition: "Repeat for each item in a sequence (definite iteration).", example: py`for n in range(3):
    print(n)` },
    { term: "while loop", definition: "Repeat while a condition is True (indefinite iteration).", example: py`count = 3
while count > 0:
    count -= 1` },
    { term: "break", definition: "Leave the loop immediately.", example: py`for n in range(10):
    if n == 3:
        break` },
    { term: "continue", definition: "Skip to the next iteration.", example: py`for n in range(5):
    if n % 2:
        continue
    print(n)` },
    { term: "and / or / not", definition: "Combine or negate conditions.", example: py`age = 20
print(age >= 18 and age < 65)` },
    { term: "Comparison operators", definition: "== != < > <= >= give True or False.", example: py`print(5 != 3)   # True` },
    { term: "Menu loop pattern", definition: "Keep showing options until the user quits.", example: py`while True:
    choice = "q"   # normally input("Choice: ")
    if choice == "q":
        break` },
  ],
  "OOP": [
    { term: "class", definition: "Define a blueprint for objects.", example: py`class Dog:
    pass` },
    { term: "__init__ (constructor)", definition: "Runs on creation and sets up attributes.", example: py`class Dog:
    def __init__(self, name):
        self.name = name` },
    { term: "self", definition: "Refers to the current object inside its methods.", example: py`class Dog:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return self.name + " says woof"` },
    { term: "Object / instance", definition: "A thing created from a class.", example: py`class Dog:
    pass
rex = Dog()` },
    { term: "Inheritance", definition: "A subclass gets the parent's attributes and methods.", example: py`class Animal:
    pass
class Dog(Animal):
    pass` },
    { term: "super()", definition: "Call the parent class's version of a method.", example: py`class Animal:
    def __init__(self, name):
        self.name = name
class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed` },
    { term: "Overriding / polymorphism", definition: "A subclass redefines a method; the same call behaves differently per class.", example: py`class Animal:
    def speak(self):
        return "..."
class Cat(Animal):
    def speak(self):
        return "Meow"` },
    { term: "Encapsulation", definition: "Keep data inside the class; a leading _ marks it internal.", example: py`class Account:
    def __init__(self):
        self._balance = 0
    def deposit(self, amount):
        if amount > 0:
            self._balance += amount` },
    { term: "__str__", definition: "Controls what print(obj) shows.", example: py`class Dog:
    def __str__(self):
        return "A dog"
print(Dog())` },
    { term: "Class attribute", definition: "Shared by every instance of the class.", example: py`class Student:
    PASS_MARK = 40` },
  ],
  "Exceptions": [
    { term: "try / except", definition: "Run risky code and handle errors instead of crashing.", example: py`try:
    n = int("abc")
except ValueError:
    print("Not a number")` },
    { term: "else / finally", definition: "else runs if no error; finally always runs (cleanup).", example: py`try:
    x = 1 / 1
except ZeroDivisionError:
    print("bad")
else:
    print("ok")
finally:
    print("done")` },
    { term: "raise", definition: "Signal an error yourself, e.g. for invalid data.", example: py`def set_age(age):
    if age < 0:
        raise ValueError("Age can't be negative")` },
    { term: "ValueError", definition: "Right type, wrong value, e.g. int(\"abc\").", example: py`try:
    int("abc")
except ValueError as e:
    print(e)` },
    { term: "TypeError", definition: "An operation on the wrong type, e.g. \"a\" + 1.", example: py`try:
    "a" + 1
except TypeError:
    print("Can't add str and int")` },
    { term: "KeyError / IndexError", definition: "Missing dictionary key / list index out of range.", example: py`try:
    [1, 2][5]
except IndexError:
    print("No such index")` },
    { term: "ZeroDivisionError", definition: "Dividing by zero.", example: py`try:
    1 / 0
except ZeroDivisionError:
    print("Can't divide by zero")` },
    { term: "FileNotFoundError", definition: "Opening a file that doesn't exist for reading.", example: py`try:
    open("missing.txt")
except FileNotFoundError:
    print("No file yet")` },
  ],
  "Algorithms": [
    { term: "Linear search - O(n)", definition: "Check each item in turn; works on unsorted data.", example: py`def linear_search(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1` },
    { term: "Binary search - O(log n)", definition: "Halve a sorted list each step.", example: py`def binary_search(items, target):
    low, high = 0, len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1` },
    { term: "Bubble sort - O(n^2)", definition: "Swap neighbours that are out of order, repeatedly.", example: py`def bubble_sort(items):
    for i in range(len(items) - 1):
        for j in range(len(items) - 1 - i):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
    return items` },
    { term: "Insertion sort - O(n^2)", definition: "Insert each item into the sorted part on its left.", example: py`def insertion_sort(items):
    for i in range(1, len(items)):
        current = items[i]
        j = i - 1
        while j >= 0 and items[j] > current:
            items[j + 1] = items[j]
            j -= 1
        items[j + 1] = current
    return items` },
    { term: "Merge sort - O(n log n)", definition: "Split, sort halves recursively, merge.", example: py`def merge_sort(items):
    if len(items) <= 1:
        return items
    mid = len(items) // 2
    left, right = merge_sort(items[:mid]), merge_sort(items[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:]` },
    { term: "Recursion", definition: "A function that calls itself, with a base case to stop.", example: py`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)` },
    { term: "Big-O cheat sheet", definition: "O(1) constant < O(log n) < O(n) < O(n log n) < O(n^2).", example: py`# dict lookup O(1), binary search O(log n), linear search O(n)
# merge sort O(n log n), bubble/insertion sort O(n^2)` },
  ],
  "Testing": [
    { term: "Normal data", definition: "Typical valid input that should be accepted.", example: py`# mark = 65  -> accepted` },
    { term: "Boundary data", definition: "Values on the edge of the valid range (and just beyond).", example: py`# 0 and 100 accepted; -1 and 101 rejected` },
    { term: "Erroneous data", definition: "Invalid input that must be rejected gracefully.", example: py`# "abc" or -50 -> error message, no crash` },
    { term: "assert", definition: "Crash with a message if a condition is False; a quick test.", example: py`def add(a, b):
    return a + b
assert add(2, 3) == 5, "add is broken"` },
    { term: "unittest.TestCase", definition: "Group test methods (names start with test_) in a class.", example: py`import unittest
class TestAdd(unittest.TestCase):
    def test_normal(self):
        self.assertEqual(1 + 1, 2)` },
    { term: "assertEqual / assertTrue / assertRaises", definition: "Common unittest checks.", example: py`import unittest
class T(unittest.TestCase):
    def test_error(self):
        with self.assertRaises(ValueError):
            int("abc")` },
    { term: "Running unittest", definition: "Run all tests in the file.", example: py`import unittest
unittest.main(argv=["ignored"], exit=False)` },
    { term: "Test table", definition: "Document each test: input, type (normal/boundary/erroneous), expected, actual, pass/fail.", example: py`# | Input | Type     | Expected | Actual | Pass? |
# | 100   | Boundary | Accepted | ...    | ...   |` },
    { term: "Validation", definition: "Checking input is sensible before using it (range, type, presence, length).", example: py`def valid_mark(text):
    return text.isdigit() and 0 <= int(text) <= 100` },
  ],
};
})(String.raw);
