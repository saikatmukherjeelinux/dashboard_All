"""Execute every distinct added Python snippet and compare its actual stdout.

Run with normal CPython (not -O). Processes start from saved scripts so source
inspection and spawn-based multiprocessing can be tested on Windows as well.
"""
import concurrent.futures
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

root = Path(__file__).resolve().parents[1]
source = (root / "assets/lessons.js").read_text(encoding="utf-8")
lessons = json.loads(source.split("window.LESSONS = ", 1)[1].rstrip().removesuffix(";"))
examples = {}
placements = 0
for lesson in lessons:
    assert len(lesson["examples"]) >= 3, lesson["id"]
    assert len(lesson["summary"]) > 45, lesson["id"]
    for example in lesson["examples"]:
        placements += 1
        assert len(example["explanation"]) >= 2
        key = (example["code"], example["output"])
        examples.setdefault(key, {**example, "lesson": lesson["id"]})

def verify(item):
    index, example = item
    with tempfile.TemporaryDirectory(prefix="pml-example-") as directory:
        script = Path(directory) / f"example_{index}.py"
        script.write_text(example["code"] + "\n", encoding="utf-8")
        try:
            result = subprocess.run([sys.executable, "-I", str(script)], cwd=directory,
                capture_output=True, text=True, encoding="utf-8", timeout=20,
                env={**os.environ, "PYTHONIOENCODING": "utf-8"})
        except subprocess.TimeoutExpired:
            return f"Lesson {example['lesson']}: {example['title']}: timed out"
        actual = result.stdout.replace("\r\n", "\n").strip()
        expected = example["output"].strip()
        if result.returncode or actual != expected:
            return (f"Lesson {example['lesson']}: {example['title']}\n"
                f"Expected: {expected!r}\nActual: {actual!r}\nStderr: {result.stderr}")
    return None

if __name__ == "__main__":
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        failures = [failure for failure in pool.map(verify, enumerate(examples.values())) if failure]
    if failures:
        print("\n\n".join(failures))
        raise SystemExit(1)
    print(f"PASS: {len(examples)} distinct runnable snippets executed with matching output; "
          f"{placements} example placements and {len(lessons)} closing summaries covered. "
          f"Runtime: CPython {sys.version.split()[0]}.")
