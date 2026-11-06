/* Dictionary of programming words. Words in lesson text get a hover hint and link here.
   term: the headword. match: extra spellings to detect in text. short: hover hint (one line).
   long: full explanation (HTML). like: real-life comparison. example: Python code. related: other term ids. */
window.FP = window.FP || {};
(function (py) {
FP.GLOSSARY = [
  { id: "variable", term: "variable", kind: "noun", match: ["variables"], short: "A name that stores a value so you can use it later.", long: "A variable is a name that points to a value in memory. You create or change one with <code>=</code>. The value can be replaced at any time.", like: "A labelled box. The label is the name and the thing inside is the value.", example: py`age = 21
age = age + 1
print(age)  # 22`, related: ["assignment", "data-type"] },
  { id: "assignment", term: "assignment", kind: "noun", match: ["assign", "assigned", "assigning"], short: "Giving a variable a value with =.", long: "Assignment stores a value in a variable using <code>=</code>. Read <code>x = 5</code> as \"x gets 5\", not \"x equals 5\". Comparing uses <code>==</code>.", like: "Putting a sticker with a name on a box.", example: py`score = 10
score += 5   # same as score = score + 5`, related: ["variable", "operator"] },
  { id: "data-type", term: "data type", kind: "noun", match: ["data types", "type", "types"], short: "The kind of value: int, float, str, bool, list...", long: "Every value has a type that decides what you can do with it. You can add two numbers, but you can't add a number to text without converting it. Check a type with <code>type(x)</code>.", like: "Like units: you can't add 3 kg to 5 metres.", example: py`print(type(5), type(5.0), type("5"), type(True))`, related: ["integer", "float", "string", "boolean", "casting"] },
  { id: "integer", term: "integer (int)", kind: "data type", match: ["integer", "integers", "int"], short: "A whole number with no decimal point, like 7 or -3.", long: "<code>int</code> holds whole numbers of any size. Dividing with <code>/</code> always gives a float. Use <code>//</code> to keep a whole number.", like: "Counting people: you can have 3 people, never 3.5.", example: py`people = 17
print(people // 5, people % 5)`, related: ["float", "data-type"] },
  { id: "float", term: "float", kind: "data type", match: ["floats", "floating point", "floating-point"], short: "A number with a decimal point, like 3.14 or 2.0.", long: "<code>float</code> stores decimal numbers. Floats are approximate, so <code>0.1 + 0.2</code> isn't exactly <code>0.3</code>. Use <code>round()</code> when showing money or marks.", like: "Measuring weight on scales: 2.75 kg.", example: py`price = 12.5
print(round(price * 1.12, 2))`, related: ["integer", "casting"] },
  { id: "string", term: "string (str)", kind: "data type", match: ["string", "strings", "str"], short: "Text inside quotes, like \"hello\".", long: "A string is a sequence of characters in quotes. Strings are <b>immutable</b>: methods like <code>.upper()</code> return a new string instead of changing the original.", like: "A necklace of letter beads, each bead at a numbered position.", example: py`name = "ada"
print(name.upper(), name[0], len(name))`, related: ["f-string", "index", "immutable", "method"] },
  { id: "boolean", term: "boolean (bool)", kind: "data type", match: ["boolean", "booleans", "bool"], short: "True or False. The result of a comparison.", long: "A boolean has only two values: <code>True</code> and <code>False</code>. Comparisons like <code>age >= 18</code> produce booleans, and <code>if</code> statements use them.", like: "A light switch: on or off.", example: py`is_adult = 20 >= 18
print(is_adult)`, related: ["condition", "operator"] },
  { id: "none", term: "None", kind: "value", match: [], short: "Python's value for \"nothing here\".", long: "<code>None</code> means no value. Functions without a <code>return</code> give back <code>None</code>. Check for it with <code>is None</code>.", like: "An empty parking space.", example: py`def hello():
    print("hi")
result = hello()
print(result)  # None`, related: ["return"] },
  { id: "casting", term: "type conversion (casting)", kind: "noun", match: ["casting", "convert", "conversion", "type conversion"], short: "Changing a value's type, e.g. int(\"5\") gives 5.", long: "Use <code>int()</code>, <code>float()</code>, <code>str()</code> and <code>bool()</code> to convert. <code>input()</code> always returns a string, so convert before doing maths.", like: "Changing so'm into dollars: same value, different form.", example: py`age = int("21")
print(age + 1)`, related: ["data-type", "input"] },
  { id: "operator", term: "operator", kind: "noun", match: ["operators"], short: "A symbol that does something to values: + - * / == and...", long: "Operators combine values. Arithmetic: <code>+ - * / // % **</code>. Comparison: <code>== != &lt; &gt;</code>. Logical: <code>and or not</code>. Membership: <code>in</code>.", like: "The buttons on a calculator.", example: py`print(7 // 2, 7 % 2, 2 ** 3, 3 in [1, 2, 3])`, related: ["modulo", "boolean"] },
  { id: "modulo", term: "modulo (%)", kind: "operator", match: ["modulo", "remainder"], short: "% gives the remainder after division.", long: "<code>a % b</code> is what's left after dividing <code>a</code> by <code>b</code>. It's handy for checking even or odd (<code>n % 2 == 0</code>) and for wrapping around.", like: "17 sweets shared among 5 friends: everyone gets 3, and 2 are left over. 17 % 5 is 2.", example: py`print(17 % 5)`, related: ["operator"] },
  { id: "f-string", term: "f-string", kind: "noun", match: ["f-strings"], short: "A string starting with f that fills in {variables}.", long: "Put <code>f</code> before the quotes and anything in <code>{ }</code> is worked out and inserted. You can format numbers too: <code>{price:.2f}</code>.", like: "A form letter with blanks that fill themselves in.", example: py`name, mark = "Ada", 91.456
print(f"{name} scored {mark:.1f}")`, related: ["string"] },
  { id: "index", term: "index", kind: "noun", match: ["indexes", "indices", "indexing"], short: "A position number in a sequence, starting at 0.", long: "Items in strings, lists and tuples are numbered from <b>0</b>. Negative indexes count from the end: <code>-1</code> is the last item. Going past the end raises <code>IndexError</code>.", like: "Seat numbers in a row, except the first seat is seat 0.", example: py`fruits = ["apple", "banana", "cherry"]
print(fruits[0], fruits[-1])`, related: ["list", "slicing"] },
  { id: "slicing", term: "slicing", kind: "noun", match: ["slice", "slices"], short: "Taking part of a sequence with [start:stop].", long: "<code>seq[start:stop]</code> gives items from <code>start</code> up to but <b>not including</b> <code>stop</code>. Leave either side out to go to the beginning or end.", like: "Cutting a few slices from a loaf of bread.", example: py`word = "Python"
print(word[0:3], word[2:], word[::-1])`, related: ["index", "string", "list"] },
  { id: "list", term: "list", kind: "data structure", match: ["lists"], short: "An ordered, changeable collection in [ ].", long: "A list keeps items in order and can grow, shrink and change. Useful methods: <code>append</code>, <code>insert</code>, <code>remove</code>, <code>pop</code>, <code>sort</code>.", like: "A shelf in a shop: items in a row that you can add to or take from.", example: py`shelf = ["milk", "bread"]
shelf.append("eggs")
print(shelf)`, related: ["index", "tuple", "mutable"] },
  { id: "tuple", term: "tuple", kind: "data structure", match: ["tuples"], short: "An ordered collection in ( ) that can't be changed.", long: "A tuple is like a list but <b>immutable</b>. Use it for fixed groups of values like coordinates, and unpack it with <code>x, y = point</code>.", like: "A date of birth: day, month and year that never change.", example: py`point = (3, 4)
x, y = point
print(x, y)`, related: ["list", "immutable"] },
  { id: "set", term: "set", kind: "data structure", match: ["sets"], short: "An unordered collection of unique items in { }.", long: "A set drops duplicates automatically and checks membership very fast. Use <code>&amp;</code> for items in both sets and <code>|</code> for items in either.", like: "A guest list: each person appears once, however many times they RSVP.", example: py`print(set([1, 2, 2, 3]))`, related: ["list", "dictionary"] },
  { id: "dictionary", term: "dictionary (dict)", kind: "data structure", match: ["dictionary", "dictionaries", "dict", "dicts"], short: "Key → value pairs in { }, looked up by key.", long: "A dictionary maps <b>keys</b> to <b>values</b>, and looking up a key is instant. Use <code>d.get(key, default)</code> to avoid a <code>KeyError</code>, and loop with <code>d.items()</code>.", like: "Your phone's contacts: look up a name to get the number.", example: py`phone = {"Ali": "93 555 01 02"}
print(phone["Ali"])`, related: ["key", "list"] },
  { id: "key", term: "key", kind: "noun", match: ["keys"], short: "The label used to look up a value in a dictionary.", long: "Keys must be unique and immutable (strings, numbers, tuples). Each key maps to exactly one value.", like: "A name in a contacts list.", example: py`student = {"name": "Ada"}
print("name" in student)`, related: ["dictionary"] },
  { id: "mutable", term: "mutable", kind: "adjective", match: [], short: "Can be changed in place (lists, dicts, sets).", long: "Mutable objects can be modified after they're created. Two variables pointing to the same list both see the change.", like: "A whiteboard you can rub out and rewrite.", example: py`a = [1, 2]
b = a
b.append(3)
print(a)  # [1, 2, 3]`, related: ["immutable", "list"] },
  { id: "immutable", term: "immutable", kind: "adjective", match: [], short: "Can't be changed after creation (str, int, tuple).", long: "Immutable objects never change. Operations on them create new objects, so <code>s.upper()</code> leaves <code>s</code> untouched.", like: "Something carved in stone: to change it, you carve a new stone.", example: py`s = "hi"
t = s.upper()
print(s, t)`, related: ["mutable", "string", "tuple"] },
  { id: "condition", term: "condition", kind: "noun", match: ["conditions", "conditional"], short: "An expression that's True or False, used by if/while.", long: "A condition decides which code runs. <code>if</code> runs its block once when the condition is True, and <code>while</code> keeps repeating while it's True.", like: "\"If it's raining, take an umbrella.\"", example: py`temp = 30
if temp > 25:
    print("Hot!")`, related: ["boolean", "if-statement", "loop"] },
  { id: "if-statement", term: "if / elif / else", kind: "statement", match: ["if statement", "elif", "if-statement"], short: "Runs code only when a condition is True.", long: "Python checks each condition from the top and runs the <b>first</b> block that's True. <code>else</code> catches everything else. The lines inside each branch must be indented.", like: "A traffic light: green means go, amber means slow, otherwise stop.", example: py`mark = 65
if mark >= 70: print("First")
elif mark >= 60: print("2:1")
else: print("Keep going")`, related: ["condition", "indentation"] },
  { id: "indentation", term: "indentation", kind: "noun", match: ["indent", "indented"], short: "Spaces at the start of a line that group code into blocks.", long: "Python uses indentation (4 spaces is standard) to show which lines belong inside an <code>if</code>, loop, function or class. Inconsistent spacing causes an <code>IndentationError</code>.", like: "Bullet points nested under a heading.", example: py`for i in range(2):
    print("inside")
print("outside")`, related: ["if-statement", "loop"] },
  { id: "loop", term: "loop", kind: "noun", match: ["loops", "looping", "for loop", "while loop"], short: "Repeats a block of code.", long: "<code>for</code> repeats once for each item in a sequence. <code>while</code> repeats as long as a condition is True. <code>break</code> leaves the loop early, and <code>continue</code> skips to the next go.", like: "<code>for i in range(10): sit()</code> is a person doing 10 squats.", example: py`for i in range(3):
    print("rep", i)`, related: ["iteration", "range", "condition"] },
  { id: "iteration", term: "iteration", kind: "noun", match: ["iterate", "iterates", "iterating"], short: "One pass through a loop, or going through items one by one.", long: "Each run of a loop's body is one iteration. You <i>iterate over</i> a list when you visit each item in turn.", like: "One lap of a running track.", example: py`for name in ["Ali", "Madina"]:
    print("Hi", name)`, related: ["loop"] },
  { id: "range", term: "range()", kind: "function", match: ["range"], short: "Produces a sequence of numbers, e.g. range(5) gives 0..4.", long: "<code>range(stop)</code>, <code>range(start, stop)</code> or <code>range(start, stop, step)</code>. The stop number is <b>not</b> included.", like: "A numbered ticket roll: 0, 1, 2, 3, 4.", example: py`print(list(range(1, 10, 2)))`, related: ["loop"] },
  { id: "function", term: "function", kind: "noun", match: ["functions"], short: "A named, reusable block of code you call with ( ).", long: "Define one with <code>def name(parameters):</code> and run it by calling <code>name(arguments)</code>. Functions keep code DRY and can <code>return</code> a result.", like: "A recipe: write it once, cook it whenever you like.", example: py`def greet(name):
    return f"Salom, {name}!"
print(greet("Ali"))`, related: ["parameter", "argument", "return", "method"] },
  { id: "parameter", term: "parameter", kind: "noun", match: ["parameters"], short: "A variable in a function definition that receives a value.", long: "Parameters are the names listed in <code>def f(a, b):</code>. They can have default values: <code>def f(a, b=2):</code>.", like: "The blanks in a recipe: \"add ___ grams of sugar\".", example: py`def area(width, height=1):
    return width * height`, related: ["argument", "function"] },
  { id: "argument", term: "argument", kind: "noun", match: ["arguments"], short: "The actual value you pass when calling a function.", long: "In <code>area(3, 4)</code>, <code>3</code> and <code>4</code> are arguments. They fill the function's parameters in order, or by name: <code>area(height=4, width=3)</code>.", like: "Filling in the recipe's blanks: \"200 grams\".", example: py`print(max(3, 9, 4))`, related: ["parameter", "function"] },
  { id: "return", term: "return", kind: "keyword", match: ["returns", "returned", "return value"], short: "Sends a value back from a function and ends it.", long: "<code>return x</code> gives <code>x</code> back to whoever called the function. <code>print</code> only shows text; it doesn't give anything back. Without a return, a function gives <code>None</code>.", like: "A vending machine handing you the snack, not just showing a picture of it.", example: py`def double(n):
    return n * 2
print(double(4) + 1)`, related: ["function", "none"] },
  { id: "scope", term: "scope", kind: "noun", match: ["local variable", "global variable"], short: "Where a variable can be seen. Variables made in a function stay inside it.", long: "Variables created inside a function are <b>local</b> and disappear when it ends. Variables at the top level are <b>global</b>. Pass values in as parameters and send them out with return.", like: "What happens in the kitchen stays in the kitchen unless you serve it.", example: py`def f():
    x = 5
f()
# print(x) would be a NameError`, related: ["function"] },
  { id: "module", term: "module", kind: "noun", match: ["modules", "package", "packages", "import"], short: "A file of Python code you can import, like math or random.", long: "<code>import math</code> loads a module, and <code>from math import sqrt</code> takes just one name from it. The standard library includes <code>math</code>, <code>random</code>, <code>datetime</code>, <code>csv</code>, <code>json</code> and <code>sqlite3</code>.", like: "Borrowing a tool from a neighbour's toolbox instead of building it yourself.", example: py`import math
print(math.sqrt(16))`, related: ["function"] },
  { id: "input", term: "input()", kind: "function", match: [], short: "Asks the user to type something and returns it as a string.", long: "<code>input(prompt)</code> pauses the program until the user presses Enter. It always returns a <b>string</b>, so convert numbers with <code>int()</code> or <code>float()</code>.", like: "A cashier asking \"anything else?\" and waiting for your answer.", example: py`name = input("Name? ")
print("Hi", name)`, related: ["casting", "string"] },
  { id: "file-handling", term: "file handling", kind: "noun", match: ["file", "files", "open()"], short: "Reading and writing files with open().", long: "<code>open(path, mode)</code> with mode <code>\"r\"</code> (read), <code>\"w\"</code> (overwrite) or <code>\"a\"</code> (append). Use <code>with</code> so the file closes automatically.", like: "Opening a notebook, writing in it, and closing it when you're done.", example: py`with open("notes.txt", "w") as f:
    f.write("hello")`, related: ["persistence", "exception"] },
  { id: "persistence", term: "data persistence", kind: "noun", match: ["persistence", "persist"], short: "Saving data so it survives after the program closes.", long: "Variables vanish when a program ends. Persistence means storing data in files (text, CSV, JSON) or databases (SQLite) so it can be loaded next time. CW2 requires it.", like: "Saving a game so you don't start again from level 1.", example: py`import json
json.dump({"score": 10}, open("save.json", "w"))`, related: ["file-handling", "database"] },
  { id: "exception", term: "exception", kind: "noun", match: ["exceptions", "error", "errors", "try", "except"], short: "An error raised while the program runs. Handle it with try/except.", long: "When something goes wrong (dividing by zero, a missing key, a bad number), Python <i>raises</i> an exception. <code>try/except</code> catches it so the program can recover instead of crashing.", like: "A goalkeeper catching a shot so it doesn't go in.", example: py`try:
    x = int("abc")
except ValueError:
    print("Not a number")`, related: ["traceback", "debugging"] },
  { id: "traceback", term: "traceback", kind: "noun", match: ["tracebacks"], short: "The error report Python prints, showing where it broke.", long: "Read a traceback from the <b>bottom up</b>: the last line names the error type and message, and the lines above show which line of which file caused it.", like: "A delivery-tracking history showing exactly where the parcel got lost.", example: py`# NameError: name 'totl' is not defined
# means a typo: you meant total`, related: ["exception", "debugging"] },
  { id: "debugging", term: "debugging", kind: "noun", match: ["debug", "bug", "bugs"], short: "Finding and fixing mistakes in code.", long: "Read the traceback, print values to check what's happening, test small pieces, and change one thing at a time. A trace table helps you follow a loop by hand.", like: "Being a detective: gather clues, form a theory, test it.", example: py`total = 0
for n in [1, 2, 3]:
    total += n
    print("n:", n, "total:", total)`, related: ["traceback", "testing", "trace-table"] },
  { id: "trace-table", term: "trace table", kind: "noun", match: ["trace tables"], short: "A table tracking variable values line by line.", long: "Write each variable as a column and fill in a row every time a value changes. It's a classic CW1 question for reading code you didn't write.", like: "A scorecard updated after every move.", example: py`x = 1
for i in range(3):
    x = x * 2   # x: 2, 4, 8`, related: ["debugging"] },
  { id: "class", term: "class", kind: "noun", match: ["classes"], short: "A blueprint for creating objects.", long: "A class bundles data (<b>attributes</b>) and behaviour (<b>methods</b>). <code>__init__</code> sets up each new object, and <code>self</code> refers to that object.", like: "A phone's design in the factory. Every phone made from it is an object.", example: py`class Dog:
    def __init__(self, name):
        self.name = name
    def bark(self):
        return self.name + " says woof"`, related: ["object", "attribute", "method", "constructor"] },
  { id: "object", term: "object", kind: "noun", match: ["objects", "instance", "instances"], short: "A thing made from a class, with its own data.", long: "Each object (instance) has its own copy of the attributes. Changing one object doesn't affect another.", like: "Your actual phone, made from the factory design, with its own battery level.", example: py`class Phone:
    def __init__(self, battery):
        self.battery = battery
mine = Phone(80)
yours = Phone(30)`, related: ["class", "attribute"] },
  { id: "attribute", term: "attribute", kind: "noun", match: ["attributes", "property"], short: "A variable that belongs to an object, like self.name.", long: "Attributes store an object's data. Set them in <code>__init__</code> with <code>self.name = name</code> and read them with <code>obj.name</code>.", like: "A car's colour and mileage.", example: py`class Car:
    def __init__(self, colour):
        self.colour = colour
print(Car("red").colour)`, related: ["object", "class", "encapsulation"] },
  { id: "method", term: "method", kind: "noun", match: ["methods"], short: "A function that belongs to an object, called with a dot.", long: "Methods are functions defined inside a class. Their first parameter is <code>self</code>. Built-in types have methods too: <code>name.upper()</code>, <code>items.append(x)</code>.", like: "Things a car can do: <code>car.start()</code>, <code>car.brake()</code>.", example: py`print("hello".upper())`, related: ["function", "class", "self"] },
  { id: "self", term: "self", kind: "keyword", match: [], short: "Inside a class, self means \"this particular object\".", long: "Python passes the object automatically as the first parameter of a method. <code>self.balance</code> means <i>this</i> account's balance.", like: "Saying \"my\" phone: whose phone depends on who's talking.", example: py`class Counter:
    def __init__(self):
        self.n = 0
    def add(self):
        self.n += 1`, related: ["class", "method"] },
  { id: "constructor", term: "constructor (__init__)", kind: "method", match: ["constructor", "__init__"], short: "The method that sets up a new object's attributes.", long: "<code>__init__</code> runs automatically when you create an object, as in <code>Student(\"Ada\")</code>. Use it to give the object its starting attributes.", like: "Unboxing and setting up a new phone.", example: py`class Student:
    def __init__(self, name):
        self.name = name
        self.marks = []`, related: ["class", "attribute"] },
  { id: "inheritance", term: "inheritance", kind: "noun", match: ["inherit", "inherits", "subclass", "parent class", "child class"], short: "A class reusing another class's code (class Child(Parent)).", long: "A child class gets all the attributes and methods of its parent and can add or <b>override</b> them. Use <code>super().__init__(...)</code> to run the parent's setup.", like: "A child inherits eye colour from a parent but has their own hobbies.", example: py`class Animal:
    def speak(self): return "..."
class Cat(Animal):
    def speak(self): return "meow"`, related: ["polymorphism", "class"] },
  { id: "polymorphism", term: "polymorphism", kind: "noun", match: [], short: "Different classes responding to the same method in their own way.", long: "If <code>Cat</code> and <code>Dog</code> both have <code>speak()</code>, you can loop over a mix of animals and call <code>speak()</code> on each without knowing which is which.", like: "\"Make a sound!\" A dog barks and a cat meows: same instruction, different behaviour.", example: py`for pet in [Cat(), Animal()]:
    print(pet.speak())`, related: ["inheritance"] },
  { id: "encapsulation", term: "encapsulation", kind: "noun", match: ["private", "getter", "setter"], short: "Hiding an object's data behind methods so it can't be misused.", long: "Mark internal attributes with a leading underscore (<code>_balance</code>) and control access through methods or <code>@property</code>, so rules like \"balance can't go negative\" are always enforced.", like: "An ATM: you can't reach into the vault, only use the buttons.", example: py`class Account:
    def __init__(self):
        self._balance = 0
    def deposit(self, x):
        if x > 0: self._balance += x`, related: ["abstraction", "class"] },
  { id: "abstraction", term: "abstraction", kind: "noun", match: [], short: "Showing only what matters and hiding the complicated details.", long: "You use <code>list.sort()</code> without knowing its algorithm. Good classes give simple methods and hide the messy parts. It's one of the four OOP pillars, along with encapsulation, inheritance and polymorphism.", like: "Driving a car without knowing how the engine works.", example: py`nums = [3, 1, 2]
nums.sort()   # how? doesn't matter to you`, related: ["encapsulation"] },
  { id: "algorithm", term: "algorithm", kind: "noun", match: ["algorithms"], short: "A step-by-step method for solving a problem.", long: "An algorithm is a precise recipe of steps. CW2 asks for sorting algorithms (bubble, insertion, merge) and searching algorithms (linear, binary).", like: "Directions to a friend's house.", example: py`# linear search
def find(items, target):
    for i, x in enumerate(items):
        if x == target: return i
    return -1`, related: ["sorting", "binary-search", "big-o"] },
  { id: "sorting", term: "sorting", kind: "noun", match: ["sort", "bubble sort", "insertion sort", "selection sort", "merge sort"], short: "Putting items in order. Bubble, insertion and merge sort are classic methods.", long: "Bubble sort swaps neighbouring items that are out of order. Insertion sort builds a sorted part one item at a time. Merge sort splits the list in half and merges the sorted halves. Python's <code>sorted()</code> is fastest in real code.", like: "Lining people up by height.", example: py`print(sorted([5, 2, 8, 1]))`, related: ["algorithm", "big-o"] },
  { id: "binary-search", term: "binary search", kind: "algorithm", match: ["linear search", "searching", "search"], short: "Finding an item in a SORTED list by halving it each step.", long: "Check the middle item. If the target is bigger, throw away the left half, otherwise throw away the right half, and repeat. That's O(log n): about 20 steps for a million items. Linear search checks every item, which is O(n).", like: "Guessing a number from 1 to 100 with \"higher\" or \"lower\" hints.", example: py`# needs a sorted list!
items = [2, 5, 8, 12, 16]`, related: ["algorithm", "big-o"] },
  { id: "big-o", term: "Big-O notation", kind: "noun", match: ["big-o", "big o", "time complexity", "complexity"], short: "How an algorithm's work grows as the input gets bigger.", long: "O(1) is constant time, O(log n) is binary search, O(n) is linear search, and O(n²) is bubble sort. It describes growth, not exact speed.", like: "Finding a word by flipping to the right page (O(log n)) instead of reading every page (O(n)).", example: py`# O(n²): a loop inside a loop over the same list`, related: ["algorithm", "sorting"] },
  { id: "database", term: "database", kind: "noun", match: ["databases", "sqlite", "sqlite3"], short: "An organised store of data, queried with SQL.", long: "A relational database stores data in <b>tables</b> of rows and columns. Python's built-in <code>sqlite3</code> keeps a whole database in one file (or in memory).", like: "A school's filing cabinet with one drawer per table.", example: py`import sqlite3
conn = sqlite3.connect(":memory:")`, related: ["table", "sql", "primary-key"] },
  { id: "table", term: "table", kind: "noun", match: ["tables", "row", "rows", "column", "columns", "record", "records"], short: "A grid of rows (records) and columns (fields) in a database.", long: "Each <b>row</b> is one record, like one student. Each <b>column</b> is one field, like name or mark. Every table should have a primary key.", like: "A class register: one row per student, one column per detail.", example: py`# CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT)`, related: ["database", "primary-key"] },
  { id: "sql", term: "SQL", kind: "language", match: ["query", "queries", "select", "join"], short: "The language for talking to databases: SELECT, INSERT, UPDATE, DELETE.", long: "SQL statements create tables and read or change data. <code>SELECT name FROM students WHERE mark > 70 ORDER BY mark DESC</code>. Always use <code>?</code> placeholders in Python to prevent SQL injection.", like: "Asking a librarian very precise questions.", example: py`conn.execute("SELECT * FROM students WHERE name = ?", ("Ada",))`, related: ["database", "sql-injection"] },
  { id: "primary-key", term: "primary key", kind: "noun", match: ["primary keys", "foreign key", "foreign keys"], short: "A column that uniquely identifies each row (like a student ID).", long: "A <b>primary key</b> is unique for every row. A <b>foreign key</b> is a column that points to another table's primary key, which links the two tables (a relationship).", like: "Your passport number: nobody else has it.", example: py`# orders.student_id REFERENCES students(id)`, related: ["table", "normalisation"] },
  { id: "normalisation", term: "normalisation", kind: "noun", match: ["normalization", "1nf", "2nf", "3nf"], short: "Organising tables to avoid duplicated data.", long: "1NF: one value per cell. 2NF: every field depends on the whole key. 3NF: no field depends on another non-key field. Fewer duplicates means fewer mistakes when updating.", like: "Keeping each friend's address in one place, not copied into every message.", example: py`# students(id, name)  enrolments(student_id, module_id)`, related: ["primary-key", "database"] },
  { id: "sql-injection", term: "SQL injection", kind: "noun", match: [], short: "An attack where user input is run as SQL. Prevent it with ? placeholders.", long: "Never build SQL by joining strings with user input. Use parameterised queries: <code>execute(\"... WHERE name = ?\", (name,))</code>.", like: "Writing \"and also give me the keys\" on a form, and the clerk obeying.", example: py`# BAD:  f"SELECT * FROM users WHERE name = '{name}'"
# GOOD: ("SELECT * FROM users WHERE name = ?", (name,))`, related: ["sql"] },
  { id: "testing", term: "testing", kind: "noun", match: ["test", "tests", "unit test", "unittest", "assert"], short: "Checking code works by running it with known inputs.", long: "Test with <b>normal</b> data (typical values), <b>boundary</b> data (edges like 0, 40, 100) and <b>erroneous</b> data (bad input like -5 or \"abc\"). <code>assert</code> and <code>unittest</code> automate it.", like: "Test-driving a car before buying it.", example: py`def grade(m): return "Pass" if m >= 40 else "Fail"
assert grade(40) == "Pass"
assert grade(39) == "Fail"`, related: ["debugging", "boundary-data"] },
  { id: "boundary-data", term: "boundary data", kind: "noun", match: ["normal data", "erroneous data", "boundary"], short: "Test values at the edges of what's allowed, e.g. 0 and 100.", long: "Bugs hide at the edges. If marks run from 0 to 100 and 40 is a pass, test 39, 40, 0 and 100. Then test -1 and 101 as erroneous data.", like: "Checking that a lift works on the top and bottom floors, not just the middle.", example: py`for m in [0, 39, 40, 100]:
    print(m, grade(m))`, related: ["testing"] },
  { id: "dry", term: "DRY", kind: "principle", match: ["refactor", "refactoring"], short: "Don't Repeat Yourself: put repeated code in a function.", long: "Copy-pasted code means fixing every bug several times. <b>Refactoring</b> means improving code's structure without changing what it does, for example by extracting a function.", like: "Saving a contact once instead of typing the number every time.", example: py`def area(w, h):
    return w * h`, related: ["function"] },
  { id: "comment", term: "comment", kind: "noun", match: ["comments", "docstring", "docstrings"], short: "A note for humans that Python ignores (# or \"\"\"docstring\"\"\").", long: "Comments explain <i>why</i> the code does something. Docstrings (triple-quoted text right after <code>def</code> or <code>class</code>) describe what a function does. Markers look for good commenting in CW2.", like: "Sticky notes in a textbook.", example: py`def average(xs):
    """Return the mean of a non-empty list."""
    return sum(xs) / len(xs)  # / always gives a float`, related: ["function"] },
  { id: "interpreter", term: "interpreter", kind: "noun", match: ["interpreted"], short: "The program that reads and runs Python code line by line.", long: "Python is interpreted: the interpreter reads your file from top to bottom and runs each line in order. FlowPy runs a real Python interpreter (Pyodide) in your browser.", like: "A live translator turning your words into another language as you speak.", example: py`print("runs first")
print("runs second")`, related: [] },
];
})(String.raw);
