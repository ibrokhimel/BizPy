/* "See it in real life" visualisations, shown in lessons with a live stage.
   Stage functions available in any code: sit() stand() jump() walk(n) wave() say(text)
   show_list(items, highlight, label) bars(values, highlight, label) show_dict(d, label)
   show_var(name=value, ...) light("red"|"amber"|"green") shelf(items, label) pause(seconds) */
window.FP = window.FP || {};
(function (py) {
FP.VISUALS = {
  py_02_variables: [
    { title: "A variable is a labelled box", story: "Think of a variable as a box with a name written on it. <code>=</code> puts something in the box. Putting in something new throws the old value away, just like swapping what's in a box.",
      code: py`money = 50000          # 50,000 so'm in the box called money
show_var(money=money)
pause(1)
money = money - 12000  # buy a Snickers
show_var(money=money)
pause(1)
money = money + 20000  # get paid back by a friend
show_var(money=money)
print("Money left:", money)` },
  ],
  py_03_operators: [
    { title: "Sharing sweets with // and %", story: "You've got 17 sweets and 5 friends. <code>//</code> is how many each friend gets, and <code>%</code> is how many are left over for you.",
      code: py`sweets = 17
friends = 5
each = sweets // friends
left = sweets % friends
show_var(sweets=sweets, friends=friends, each=each, left_for_me=left)
print(f"Each friend gets {each}, and you keep {left}.")` },
  ],
  py_05_lists: [
    { title: "A list is a shop shelf", story: "A list is like a shelf in Korzinka: items sit in order, each in its own spot (index 0, 1, 2...). <code>append</code> puts a new item at the end and <code>pop</code> takes the last one off.",
      code: py`shelf_items = ["milk", "bread", "eggs"]
shelf(shelf_items, "Korzinka shelf")
pause(1)
shelf_items.append("juice")      # restock
shelf(shelf_items, "after append('juice')")
pause(1)
shelf_items.remove("bread")      # someone bought the bread
shelf(shelf_items, "after remove('bread')")
pause(1)
show_list(shelf_items, highlight=0, label="index 0 is the first item")
print(shelf_items)` },
  ],
  py_06_dicts: [
    { title: "A dictionary is a phone's contact list", story: "You don't scroll through every contact to find someone. You look them up by name. In a dictionary the name is the <b>key</b> and the number is the <b>value</b>.",
      code: py`contacts = {"Mum": "90 123 45 67", "Ali": "93 555 01 02"}
show_dict(contacts, "Phone contacts")
pause(1)
contacts["Madina"] = "97 777 88 99"   # add a new contact
show_dict(contacts, "after adding Madina")
pause(1)
print("Ali's number is", contacts["Ali"])` },
  ],
  py_08_control_flow: [
    { title: "if/elif/else is a traffic light", story: "A driver checks the light and does <b>one</b> thing. Python checks each condition from the top and runs only the first branch that's true.",
      code: py`for colour in ["green", "amber", "red", "green"]:
    light(colour)
    if colour == "green":
        print("green -> go")
    elif colour == "amber":
        print("amber -> slow down")
    else:
        print("red -> stop")
    pause(0.8)` },
  ],
  py_09_loops: [
    { title: "for i in range(10): sit() is sitting down ten times", story: "A <code>for</code> loop is a coach shouting <i>\"ten squats!\"</i>. The body (the indented part) runs once per number, and <code>i</code> counts which go you're on, starting at 0.",
      code: py`for i in range(10):
    sit()
    stand()
print("Done! That was 10 squats.")` },
    { title: "while is 'keep going until...'", story: "A <code>while</code> loop has no fixed count. It's like jumping until you're tired: it checks the condition before every go.",
      code: py`energy = 5
while energy > 0:
    jump()
    energy = energy - 1
    show_var(energy=energy)
say("I'm tired!")` },
    { title: "Nested loops: rounds and reps", story: "A loop inside a loop is a workout with 3 rounds of 2 jumps each. The inner loop finishes completely on every pass of the outer loop.",
      code: py`for round_number in range(1, 4):
    say(f"Round {round_number}")
    for rep in range(2):
        jump()
wave()` },
  ],
  py_10_functions: [
    { title: "A function is a recipe you name once", story: "Teach someone the steps for <i>\"greet\"</i> once, then just say <i>\"greet!\"</i> whenever you need it. <code>def</code> writes the recipe, and calling the function cooks it.",
      code: py`def greet(name):
    wave()
    say(f"Salom, {name}!")

greet("Ali")
greet("Madina")
greet("Ibo")` },
  ],
  py_13_oop_classes: [
    { title: "A class is a blueprint, an object is the real thing", story: "<code>class Phone</code> is the design in the factory. Each <code>Phone(...)</code> is a real phone with its <b>own</b> battery level. Charging one doesn't charge the other.",
      code: py`class Phone:
    def __init__(self, owner, battery):
        self.owner = owner
        self.battery = battery

    def use(self, minutes):
        self.battery = max(0, self.battery - minutes // 2)

a = Phone("Ali", 80)
m = Phone("Madina", 40)
show_var(ali_battery=a.battery, madina_battery=m.battery)
pause(1)
a.use(60)          # Ali scrolls for an hour
show_var(ali_battery=a.battery, madina_battery=m.battery)
print("Each object keeps its own data.")` },
  ],
  py_16_algorithms: [
    { title: "Bubble sort is lining people up by height", story: "Walk down the line comparing neighbours, and swap any two in the wrong order. After each pass the tallest person has 'bubbled' to the end.",
      code: py`heights = [160, 145, 180, 150, 170, 155]
bars(heights, label="start")
n = len(heights)
for i in range(n):
    for j in range(n - i - 1):
        bars(heights, highlight=[j, j + 1], label=f"compare {heights[j]} and {heights[j+1]}")
        if heights[j] > heights[j + 1]:
            heights[j], heights[j + 1] = heights[j + 1], heights[j]
bars(heights, label="sorted!")
print(heights)` },
    { title: "Binary search is guessing a number with 'higher/lower'", story: "Looking for a word in a dictionary? You open it in the middle and throw away the half it can't be in. Every guess halves what's left.",
      code: py`pages = list(range(1, 33))
target = 23
lo, hi = 0, len(pages) - 1
guesses = 0
while lo <= hi:
    mid = (lo + hi) // 2
    guesses += 1
    show_list(pages[lo:hi + 1], highlight=mid - lo, label=f"guess {guesses}: page {pages[mid]}?")
    pause(0.6)
    if pages[mid] == target:
        break
    if pages[mid] < target:
        lo = mid + 1
    else:
        hi = mid - 1
print(f"Found page {target} in {guesses} guesses (out of {len(pages)} pages)")` },
  ],
};
})(String.raw);
