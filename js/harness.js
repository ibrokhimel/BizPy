/* Python harness executed inside Pyodide. Kept as a string so it works from file://.
   tests/check_content.mjs extracts this exact string to verify every challenge locally. */
window.FP = window.FP || {};
FP.HARNESS = String.raw`
import sys, io, json, traceback, re

def _fp_format_error(e):
    if isinstance(e, SyntaxError):
        return "".join(traceback.format_exception_only(type(e), e)).rstrip()
    frames = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == "main.py"]
    text = ""
    if frames:
        text = "Traceback (most recent call last):\n" + "".join(traceback.format_list(frames))
    return (text + "".join(traceback.format_exception_only(type(e), e))).rstrip()

def _fp_exec(code, stdin_text="", extra=None):
    out = io.StringIO()
    feed = iter(stdin_text.split("\n")) if stdin_text else iter(())
    def _input(prompt=""):
        out.write(str(prompt))
        try:
            value = next(feed)
        except StopIteration:
            raise EOFError("input() needs a value - type one into the Input box under the editor") from None
        out.write(value + "\n")
        return value
    ns = {"__name__": "__main__", "input": _input}
    ns.update(_fp_stage_globals())
    globals()["_fp_person"] = _Person()
    if extra:
        ns.update(extra)
    old = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = out
    err = None
    try:
        exec(compile(code, "main.py", "exec"), ns)
    except SystemExit:
        pass
    except BaseException as e:
        err = _fp_format_error(e)
    finally:
        sys.stdout, sys.stderr = old
    return ns, out.getvalue(), err

def _fp_capture(fn, *args, **kwargs):
    buf = io.StringIO()
    old = sys.stdout
    sys.stdout = buf
    try:
        result = fn(*args, **kwargs)
    finally:
        sys.stdout = old
    return result, buf.getvalue()

def __flowpy_run(code, stdin_text="", test=None):
    ns, out, err = _fp_exec(code, stdin_text or "")
    result = {"out": out, "error": err}
    if test is None:
        return json.dumps(result)
    if err:
        result.update(passed=False, message="Your code raised an error, so it could not be checked. Fix the error first.")
        return json.dumps(result)

    def rerun(replacements):
        new = code
        for old_text, new_text in replacements.items():
            if old_text not in new:
                raise AssertionError("Keep the starter line '" + old_text + "' exactly as it is - the checker changes it to test other values.")
            new = new.replace(old_text, new_text, 1)
        return _fp_exec(new)

    def run_input(stdin_lines):
        """Run the learner's code again with different input() values (list or newline text)."""
        text = "\n".join(str(v) for v in stdin_lines) if isinstance(stdin_lines, (list, tuple)) else str(stdin_lines)
        n2, o2, e2 = _fp_exec(code, text)
        if e2:
            raise AssertionError("With inputs " + text.replace("\n", ", ") + " your code raised: " + e2.splitlines()[-1])
        return n2, o2

    def nums(text):
        """Every number that appears in text, as floats (handles $1,200.50 and 71.67)."""
        return [float(x.replace(",", "")) for x in re.findall(r"-?\d[\d,]*\.?\d*", text)]

    def has_num(text, value, tol=0.011):
        return any(abs(v - value) <= tol for v in nums(text))

    lines = [l.strip() for l in out.splitlines() if l.strip()]
    tns = {"ns": ns, "out": out, "lines": lines, "code": code, "rerun": rerun,
           "capture": _fp_capture, "re": re, "run_input": run_input, "nums": nums, "has_num": has_num}
    old = sys.stdout
    sys.stdout = io.StringIO()
    try:
        exec(compile(test, "check.py", "exec"), tns)
        result.update(passed=True, message="")
    except AssertionError as e:
        result.update(passed=False, message=str(e) or "Not quite - check the task again.")
    except KeyError as e:
        result.update(passed=False, message="Couldn't find " + str(e) + " in your code. Check the name is spelled exactly as asked.")
    except Exception as e:
        result.update(passed=False, message="Checking failed with " + type(e).__name__ + ": " + str(e))
    finally:
        sys.stdout = old
    return json.dumps(result)
` + FP_LIVE_AND_STAGE();

/* Live console + "stage" (visualiser) API. The stage functions are real Python so learners can call
   sit(), jump(), bars(...) etc. Each call emits an event that the page animates. */
function FP_LIVE_AND_STAGE() {
  return String.raw`

# ---------- stage API (works in every mode; events are dropped when there's no stage) ----------
_fp_stage_sink = None
_fp_stage_delay = 0.0

def _fp_ev(name, **data):
    if _fp_stage_sink is not None:
        _fp_stage_sink(name, json.dumps(data, default=str))
        if _fp_stage_delay:
            _fp_pause(_fp_stage_delay)

def _fp_pause(seconds):
    pass  # replaced in live mode with a real (non-blocking) sleep

def _fp_say(text):
    print(text)

class _Person:
    """A little character on the stage. Every action prints a line and animates."""
    def __init__(self, name="Ada"):
        self.name = name
        self.sits = 0
        self.jumps = 0
        self.steps = 0
    def sit(self):
        self.sits += 1
        _fp_say(self.name + " sits down (" + str(self.sits) + ")")
        _fp_ev("person", action="sit", n=self.sits, who=self.name)
    def stand(self):
        _fp_say(self.name + " stands up")
        _fp_ev("person", action="stand", who=self.name)
    def jump(self):
        self.jumps += 1
        _fp_say(self.name + " jumps (" + str(self.jumps) + ")")
        _fp_ev("person", action="jump", n=self.jumps, who=self.name)
    def walk(self, steps=1):
        for _ in range(steps):
            self.steps += 1
            _fp_ev("person", action="walk", n=self.steps, who=self.name)
        _fp_say(self.name + " walks " + str(steps) + " step" + ("" if steps == 1 else "s"))
    def wave(self):
        _fp_say(self.name + " waves")
        _fp_ev("person", action="wave", who=self.name)
    def say(self, text):
        _fp_say(self.name + ': "' + str(text) + '"')
        _fp_ev("person", action="say", text=str(text), who=self.name)

_fp_person = _Person()
def sit(): _fp_person.sit()
def stand(): _fp_person.stand()
def jump(): _fp_person.jump()
def walk(steps=1): _fp_person.walk(steps)
def wave(): _fp_person.wave()
def say(text): _fp_person.say(text)

def show_list(items, highlight=None, label=""):
    """Draw a list as boxes. highlight = index or list of indexes to colour."""
    hl = [] if highlight is None else ([highlight] if isinstance(highlight, int) else list(highlight))
    _fp_ev("list", items=[str(x) for x in items], highlight=hl, label=str(label))

def bars(values, highlight=None, label=""):
    """Draw numbers as bars, great for watching a sort happen."""
    hl = [] if highlight is None else ([highlight] if isinstance(highlight, int) else list(highlight))
    _fp_ev("bars", values=[float(v) for v in values], highlight=hl, label=str(label))

def show_dict(d, label=""):
    _fp_ev("dict", items=[[str(k), str(v)] for k, v in d.items()], label=str(label))

def show_var(**variables):
    """Show variable values in labelled boxes, e.g. show_var(total=total, i=i)."""
    _fp_ev("vars", items=[[k, repr(v)] for k, v in variables.items()])

def light(colour):
    """Traffic light: 'red', 'amber' or 'green'."""
    _fp_ev("light", colour=str(colour).lower())

def shelf(items, label="Shelf"):
    """Products on a shop shelf (for lists / dicts of stock)."""
    _fp_ev("shelf", items=[str(x) for x in items], label=str(label))

def pause(seconds=0.5):
    _fp_pause(seconds)

_FP_STAGE_NAMES = ["sit", "stand", "jump", "walk", "wave", "say", "show_list", "bars", "show_dict", "show_var", "light", "shelf", "pause"]

def _fp_stage_globals():
    return {n: globals()[n] for n in _FP_STAGE_NAMES}

# ---------- live console mode (JSPI: input() blocks properly, output streams) ----------
def __flowpy_live(code, opts):
    global _fp_stage_sink, _fp_stage_delay, _fp_person, _fp_pause
    import js, builtins, time as _time
    from pyodide.ffi import run_sync

    class _Stream(io.TextIOBase):
        def __init__(self, kind): self.kind = kind
        def writable(self): return True
        def write(self, s):
            if s: js.fpEmit(self.kind, s)
            return len(s)

    def _input(prompt=""):
        sys.stdout.flush()
        value = run_sync(js.fpAsk(str(prompt)))
        if value is None:
            raise KeyboardInterrupt("input cancelled")
        return str(value)

    def _sleep(seconds):
        run_sync(js.fpSleep(max(0, float(seconds)) * 1000))

    real_sleep = _time.sleep
    _fp_pause = _sleep
    _fp_person = _Person()
    _fp_stage_sink = (lambda n, d: js.fpEvent(n, d)) if opts.get("visual") else None
    _fp_stage_delay = 0.45 / float(opts.get("speed") or 1) if opts.get("visual") else 0.0

    ns = {"__name__": "__main__", "input": _input}
    ns.update(_fp_stage_globals())
    old = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = _Stream("out"), _Stream("err")
    _time.sleep = _sleep
    err = None
    try:
        exec(compile(code, "main.py", "exec"), ns)
    except SystemExit:
        pass
    except KeyboardInterrupt:
        err = "KeyboardInterrupt"
    except BaseException as e:
        err = _fp_format_error(e)
    finally:
        sys.stdout, sys.stderr = old
        _time.sleep = real_sleep
        _fp_stage_sink = None
        _fp_stage_delay = 0.0
        _fp_pause = lambda s: None
    return err
`;
}
