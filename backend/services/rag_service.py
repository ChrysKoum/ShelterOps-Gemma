from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


class RagService:
    def __init__(self, data_dir: Path = DATA_DIR):
        self.data_dir = data_dir
        self.docs = self._load_docs()

    def _load_docs(self) -> dict[str, str]:
        docs: dict[str, str] = {}
        if not self.data_dir.exists():
            return docs
        for path in self.data_dir.glob("*.md"):
            docs[path.name] = path.read_text(encoding="utf-8")
        return docs

    def retrieve(self, query: str, limit: int = 4) -> list[dict[str, str]]:
        terms = {term.strip(".,:;!?()[]").lower() for term in query.split() if len(term) > 2}
        scored: list[tuple[int, str, str]] = []
        for name, content in self.docs.items():
            lower = content.lower()
            score = sum(1 for term in terms if term in lower)
            if score:
                scored.append((score, name, content[:1200]))
        scored.sort(reverse=True)
        if not scored:
            scored = [(1, name, content[:1200]) for name, content in list(self.docs.items())[:limit]]
        return [{"source": name, "content": content} for _, name, content in scored[:limit]]
