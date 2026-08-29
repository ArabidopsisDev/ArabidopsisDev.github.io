from __future__ import annotations

import hashlib
import json
import re
from collections import Counter
from pathlib import Path

from docx import Document
from docx.oxml.ns import qn
from docx.table import Table
from docx.text.paragraph import Paragraph


SOURCE = Path(r"D:\Videos\A-dotNetSeries\课程配套练习.docx")
REPO = Path(r"D:\Projects\ArabidopsisDev.github.io")
OUTPUT = REPO / "courses" / "csharp-advanced" / "practice" / "assets" / "exercise-data.js"
MEDIA_DIR = OUTPUT.parent / "media"
COURSE_DATA = REPO / "courses" / "csharp-advanced" / "assets" / "course-data.js"

LESSON_TITLES = [
    "委托概述",
    "多播与预定义委托",
    "策略模式",
    "依赖注入",
    "事件与标准事件模式",
    "观察者模式",
    "具化泛型系统",
    "泛型约束",
    "Liskov代换与泛型变体",
    "适配器模式",
    "运算符重载",
    "静态抽象接口成员",
    "泛型数学",
    "自引用泛型与强类型工厂",
    "泛型 API 的约束设计",
    "索引器",
    "Index 与 Range",
    "集合接口的选择",
    "IEnumerable 与 IEnumerator",
    "foreach 的编译器展开",
    "yield return",
    "迭代器状态机",
    "遍历期间修改集合",
    "集合表达式与自定义构建器",
]

ANSWER_TITLE_ALIASES = {
    "多播与预定义委托": "多播和预定义委托",
}

OPEN_TERMS = re.compile(r"说明|描述|分析|实现|编写|设计|为什么|为何|如何|比较|思考|画出|回答|职责|路径|作用")
OBJECTIVE_TERMS = re.compile(r"补全|填空|输出|结果|值为|填写|选择|运算符|约束是|返回")


def num_id(paragraph: Paragraph) -> str:
    p_pr = paragraph._p.pPr
    if p_pr is None or p_pr.numPr is None or p_pr.numPr.numId is None:
        return ""
    return str(p_pr.numPr.numId.val)


def body_blocks(document: Document) -> list[dict]:
    paragraph_indices = {id(paragraph._p): index for index, paragraph in enumerate(document.paragraphs)}
    blocks: list[dict] = []
    for child in document.element.body.iterchildren():
        if child.tag == qn("w:p"):
            paragraph = Paragraph(child, document)
            blocks.append(
                {
                    "kind": "p",
                    "object": paragraph,
                    "text": paragraph.text.strip(),
                    "num_id": num_id(paragraph),
                    "paragraph_index": paragraph_indices.get(id(child), -1),
                }
            )
        elif child.tag == qn("w:tbl"):
            table = Table(child, document)
            blocks.append({"kind": "table", "object": table, "text": "", "num_id": "", "paragraph_index": -1})
    return blocks


def find_block(blocks: list[dict], text: str, start: int = 0, end: int | None = None) -> int:
    stop = len(blocks) if end is None else end
    for index in range(start, stop):
        if blocks[index]["kind"] == "p" and blocks[index]["text"] == text:
            return index
    raise ValueError(f"Cannot locate paragraph: {text}")


def read_course_lessons() -> list[dict]:
    raw = COURSE_DATA.read_text(encoding="utf-8")
    payload = raw.split("=", 1)[1].strip().rstrip(";")
    course = json.loads(payload)
    lessons = []
    for chapter in course["chapters"]:
        for lesson in chapter["lessons"]:
            lessons.append(
                {
                    "number": lesson["number"],
                    "title": lesson["title"],
                    "chapterNumber": chapter["number"],
                    "chapterTitle": chapter["title"],
                    "duration": lesson["duration"],
                    "status": lesson["status"],
                }
            )
    return lessons


def extract_images(document: Document, element, lesson_number: int, question_number: int) -> list[str]:
    urls: list[str] = []
    seen: set[str] = set()
    for blip in element.xpath(".//a:blip"):
        relation_id = blip.get(qn("r:embed"))
        if not relation_id or relation_id not in document.part.related_parts:
            continue
        part = document.part.related_parts[relation_id]
        suffix = Path(str(part.partname)).suffix.lower()
        if suffix not in {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"}:
            continue
        digest = hashlib.sha1(part.blob).hexdigest()[:12]
        filename = f"lesson-{lesson_number:02d}-q-{question_number:02d}-{digest}{suffix}"
        if filename in seen:
            continue
        seen.add(filename)
        MEDIA_DIR.mkdir(parents=True, exist_ok=True)
        (MEDIA_DIR / filename).write_bytes(part.blob)
        urls.append(f"./assets/media/{filename}")
    return urls


def table_payload(table: Table) -> tuple[list[str], str]:
    rows = []
    cells = []
    for row in table.rows:
        row_cells = [cell.text.strip() for cell in row.cells]
        rows.append(row_cells)
        cells.extend(value for value in row_cells if value)
    if len(cells) == 4 and all("\n" not in value and len(value) < 140 for value in cells):
        return cells, ""
    if rows and all(len(row) >= 2 for row in rows):
        code = "\n".join(row[1] for row in rows if row[1]).strip()
        if code:
            return [], code
    return [], "\n".join(cells).strip()


def split_answer(text: str, continuation: list[str]) -> dict:
    match = re.search(r"【(解析|提示)】", text)
    if match:
        reference = text[: match.start()].strip()
        explanation = text[match.end() :].strip()
        label = match.group(1)
    else:
        reference = text.strip()
        explanation = ""
        label = "解析"
    if continuation:
        suffix = "\n".join(value for value in continuation if value).strip()
        explanation = "\n".join(value for value in [explanation, suffix] if value).strip()
    if explanation.endswith("。S"):
        explanation = explanation[:-1]
    return {"reference": reference, "explanation": explanation, "label": label}


def parse_answer_sets(blocks: list[dict], appendix: int) -> dict[str, list[dict]]:
    positions = [
        find_block(blocks, ANSWER_TITLE_ALIASES.get(title, title), appendix + 1)
        for title in LESSON_TITLES
    ]
    result: dict[str, list[dict]] = {}
    for lesson_index, (title, start) in enumerate(zip(LESSON_TITLES, positions)):
        end = positions[lesson_index + 1] if lesson_index + 1 < len(positions) else len(blocks)
        answer_id = ""
        for block in blocks[start + 1 : end]:
            if block["kind"] == "p" and block["num_id"]:
                answer_id = block["num_id"]
                break
        if not answer_id:
            raise ValueError(f"No answer numbering found for {title}")
        entries: list[tuple[dict, list[str]]] = []
        current: tuple[dict, list[str]] | None = None
        for block in blocks[start + 1 : end]:
            if block["kind"] != "p" or not block["text"]:
                continue
            if block["num_id"] == answer_id:
                current = (block, [])
                entries.append(current)
            elif current is not None:
                current[1].append(block["text"])
        result[title] = [split_answer(entry[0]["text"], entry[1]) for entry in entries]
    return result


def normalize(value: str) -> str:
    return re.sub(r"[\s,，;；、。()（）`'\"]+", "", value).lower()


def question_mode(prompt: str, answer: dict, options: list[str]) -> str:
    reference = answer["reference"].strip()
    if options and re.fullmatch(r"[A-D]+", reference.replace(" ", ""), re.I):
        return "multiple" if len(reference.replace(" ", "")) > 1 else "single"
    if not reference or reference.startswith("答案过长") or answer["label"] == "提示":
        return "subjective"
    if OPEN_TERMS.search(prompt) and not OBJECTIVE_TERMS.search(prompt):
        return "subjective"
    return "text"


def question_group(blocks: list[dict], start: int, lesson_start: int) -> str:
    group = "A"
    for block in blocks[lesson_start:start]:
        if block["kind"] == "p" and "B组" in block["text"]:
            group = "B"
        elif block["kind"] == "p" and "A组" in block["text"]:
            group = "A"
    return group


def parse_question_set(
    document: Document,
    blocks: list[dict],
    title: str,
    lesson_number: int,
    start: int,
    end: int,
    answers: list[dict],
) -> list[dict]:
    question_id = ""
    for block in blocks[start + 1 : end]:
        if block["kind"] == "p" and "A组" in block["text"]:
            continue
        if block["kind"] == "p" and block["num_id"]:
            question_id = block["num_id"]
            break
    if not question_id:
        raise ValueError(f"No question numbering found for {title}")

    starts = [
        index
        for index in range(start + 1, end)
        if blocks[index]["kind"] == "p" and blocks[index]["num_id"] == question_id
    ]
    if title == "观察者模式":
        extra = find_block(blocks, "请编写代码实现类图对应的功能。请观察使用事件实现的观察者模式与普通观察者模式之前的异同，并思考：事件实现的观察者中，依托于多播委托机制实现的事件的+=和-=运算符，起着普通观察者模式中的什么作用？", start, end)
        starts.append(extra)
        starts.sort()
    if len(starts) != len(answers):
        raise ValueError(f"{title}: {len(starts)} questions but {len(answers)} answers")

    questions: list[dict] = []
    for q_index, (q_start, answer) in enumerate(zip(starts, answers), start=1):
        q_end = starts[q_index] if q_index < len(starts) else end
        chunk = blocks[q_start:q_end]
        prompt_parts = [chunk[0]["text"]]
        options: list[str] = []
        code_parts: list[str] = []
        images: list[str] = []
        is_choice_answer = bool(re.fullmatch(r"[A-D]+", answer["reference"].replace(" ", ""), re.I))

        for block in chunk:
            images.extend(extract_images(document, block["object"]._element, lesson_number, q_index))
        for block in chunk[1:]:
            if block["kind"] == "p":
                text = block["text"]
                if not text or "A组" in text or "B组" in text:
                    continue
                if is_choice_answer and block["num_id"] and block["num_id"] != question_id and len(options) < 4:
                    options.append(text)
                else:
                    prompt_parts.append(text)
            else:
                table_options, code = table_payload(block["object"])
                if is_choice_answer and table_options and not options:
                    options = table_options
                elif code:
                    code_parts.append(code)

        prompt = "\n".join(part for part in prompt_parts if part).strip()
        mode = question_mode(prompt, answer, options)
        questions.append(
            {
                "id": f"lesson-{lesson_number:02d}-q-{q_index:02d}",
                "number": q_index,
                "group": question_group(blocks, q_start, start),
                "mode": mode,
                "prompt": prompt,
                "options": options,
                "code": "\n\n".join(code_parts),
                "images": list(dict.fromkeys(images)),
                "answer": answer["reference"],
                "answerNormalized": normalize(answer["reference"]),
                "explanation": answer["explanation"],
                "explanationLabel": answer["label"],
            }
        )
    if title == "观察者模式" and len(questions) >= 5 and len(questions[3]["images"]) > 1 and not questions[4]["images"]:
        questions[4]["images"] = [questions[3]["images"].pop()]
    return questions


def main() -> None:
    document = Document(SOURCE)
    blocks = body_blocks(document)
    appendix = find_block(blocks, "附录 参考答案和解析")
    answer_sets = parse_answer_sets(blocks, appendix)
    course_lessons = read_course_lessons()
    question_positions = [find_block(blocks, title, 0, appendix) for title in LESSON_TITLES]

    lessons = []
    for index, title in enumerate(LESSON_TITLES):
        number = index + 1
        start = question_positions[index]
        end = question_positions[index + 1] if index + 1 < len(question_positions) else appendix
        metadata = course_lessons[index]
        questions = parse_question_set(document, blocks, title, number, start, end, answer_sets[title])
        lessons.append(
            {
                **metadata,
                "documentTitle": title,
                "questionCount": len(questions),
                "questions": questions,
            }
        )

    payload = {
        "title": "C# 高级动画课程配套练习",
        "source": SOURCE.name,
        "coverage": "01–24",
        "lessonCount": len(lessons),
        "questionCount": sum(lesson["questionCount"] for lesson in lessons),
        "lessons": lessons,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        "globalThis.EXERCISE_DATA = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    mode_counts = Counter(question["mode"] for lesson in lessons for question in lesson["questions"])
    print(f"Wrote {OUTPUT}")
    print(f"Lessons: {len(lessons)}")
    print(f"Questions: {payload['questionCount']}")
    print(f"Modes: {dict(mode_counts)}")
    print(f"Images: {len(list(MEDIA_DIR.glob('*'))) if MEDIA_DIR.exists() else 0}")


if __name__ == "__main__":
    main()
