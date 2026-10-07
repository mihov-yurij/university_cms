"use client";

import { useState, type FormEvent } from "react";

type Row = { entry: string };

type FormState = {
  department: string;
  fullName: string;
  position: string;
  degree: string;
  academicTitle: string;
  orcid: string;
  scopus: string;
  wos: string;
  googleScholar: string;
  email: string;
  bio: string;
  publications: Row[];
  projects: Row[];
};

const EMPTY: FormState = {
  department: "",
  fullName: "",
  position: "",
  degree: "",
  academicTitle: "",
  orcid: "",
  scopus: "",
  wos: "",
  googleScholar: "",
  email: "",
  bio: "",
  publications: [],
  projects: [],
};

const IDENTIFIERS: { key: keyof FormState; label: string; hint: string }[] = [
  { key: "orcid", label: "ORCID ID", hint: "наприклад 0000-0002-6106-2825 або повне посилання" },
  {
    key: "scopus",
    label: "Scopus Author ID",
    hint: "наприклад 57216725227 або повне посилання",
  },
  {
    key: "wos",
    label: "Web of Science ResearcherID",
    hint: "наприклад ABG-3239-2020 або повне посилання",
  },
  {
    key: "googleScholar",
    label: "Google Scholar Profile",
    hint: "профіль або повне посилання",
  },
];

export default function SubmitPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const set = (key: keyof FormState) => (event: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const setRows = (key: "projects" | "publications") => (rows: Row[]) =>
    setForm((current) => ({ ...current, [key]: rows }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setError(null);

    const rows = (list: Row[]) => list.map((row) => ({ entry: row.entry })).filter((row) => row.entry.trim());

    try {
      const response = await fetch("/api/submissions", {
        body: JSON.stringify({
          ...form,
          publications: rows(form.publications),
          projects: rows(form.projects),
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.errors?.[0]?.message ?? data?.message ?? "Сервер не відповів.");
      }

      setDone(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не вдалося надіслати форму.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <main className="page">
        <div className="masthead">
          <h1>Збір профілів кафедр</h1>
        </div>
        <div className="card done">
          <h2>Дякуємо!</h2>
          <p>
            Форму «{form.fullName}» надіслано. Документ згенеровано та передано
            організатору.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="masthead">
        <h1>Збір профілів кафедр</h1>
        <p>
          Заповніть поля — на їх основі буде згенеровано документ (.docx) і
          надіслано організатору збору.
        </p>
      </header>

      <form className="card" onSubmit={submit}>
        <div className="field">
          <label htmlFor="department">Кафедра *</label>
          <input id="department" name="department" required value={form.department} onChange={set("department")} />
        </div>

        <div className="field">
          <label htmlFor="fullName">ПІБ *</label>
          <input id="fullName" name="fullName" required value={form.fullName} onChange={set("fullName")} />
        </div>

        <div className="field">
          <label htmlFor="position">Посада</label>
          <textarea id="position" name="position" value={form.position} onChange={set("position")} />
        </div>

        <div className="field">
          <label htmlFor="degree">Науковий ступінь</label>
          <input id="degree" name="degree" value={form.degree} onChange={set("degree")} />
        </div>

        <div className="field">
          <label htmlFor="academicTitle">Вчене звання</label>
          <input id="academicTitle" name="academicTitle" value={form.academicTitle} onChange={set("academicTitle")} />
        </div>

        {IDENTIFIERS.map(({ key, label, hint }) => (
          <div className="field" key={key}>
            <label htmlFor={key}>
              {label} <span className="hint">— {hint}</span>
            </label>
            <input id={key} name={key} value={form[key] as string} onChange={set(key)} />
          </div>
        ))}

        <div className="field">
          <label htmlFor="email">E-mail *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={set("email")}
          />
        </div>

        <div className="field">
          <label htmlFor="bio">Опис (біографія, наукові напрями)</label>
          <textarea id="bio" name="bio" value={form.bio} onChange={set("bio")} />
        </div>

        <Repeatable
          hint="Кожну публікацію — в окремому рядку."
          legend="Публікації"
          onChange={setRows("publications")}
          rows={form.publications}
          addLabel="+ Додати публікацію"
        />

        <Repeatable
          hint="Кожен проєкт або стажування — в окремому рядку."
          legend="Міжнародні проєкти та стажування"
          onChange={setRows("projects")}
          rows={form.projects}
          addLabel="+ Додати проєкт"
        />

        <button className="submit" disabled={sending} type="submit">
          {sending ? "Надсилаємо…" : "Надіслати форму"}
        </button>

        {error ? (
          <p className="status" data-kind="error">
            {error}
          </p>
        ) : null}
      </form>
    </main>
  );
}

function Repeatable({
  addLabel,
  hint,
  legend,
  onChange,
  rows,
}: {
  addLabel: string;
  hint: string;
  legend: string;
  onChange: (rows: Row[]) => void;
  rows: Row[];
}) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <p className="hint" style={{ marginTop: 0 }}>
        {hint}
      </p>
      {rows.map((row, index) => (
        <div className="array-row" key={index}>
          <textarea
            aria-label={`${legend} №${index + 1}`}
            value={row.entry}
            onChange={(event) => {
              const next = [...rows];
              next[index] = { entry: event.target.value };
              onChange(next);
            }}
          />
          <button
            aria-label={`Видалити рядок ${index + 1}`}
            className="remove"
            onClick={() => onChange(rows.filter((_, position) => position !== index))}
            type="button"
          >
            ×
          </button>
        </div>
      ))}
      <button className="add" onClick={() => onChange([...rows, { entry: "" }])} type="button">
        {addLabel}
      </button>
    </fieldset>
  );
}
