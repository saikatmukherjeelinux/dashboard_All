"""Create a portable repository ZIP using only the Python standard library."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
destination = root.parent / "python-motion-lab.zip"
excluded = {"node_modules", "test-results", ".git", "__pycache__"}
with ZipFile(destination, "w", ZIP_DEFLATED) as archive:
    for file in sorted(root.rglob("*")):
        if file.is_file() and not excluded.intersection(file.relative_to(root).parts):
            archive.write(file, file.relative_to(root.parent).as_posix())
with ZipFile(destination) as archive:
    assert archive.testzip() is None
    names = archive.namelist()
    for required in ["index.html", "assets/lessons.js", "assets/quizzes-342.js", "content/quiz-342-concepts.txt", ".github/workflows/pages.yml", ".nojekyll", "docs/preview.png"]:
        assert f"python-motion-lab/{required}" in names, required
print(f"Created and verified {destination} ({len(names)} files, {destination.stat().st_size:,} bytes)")
