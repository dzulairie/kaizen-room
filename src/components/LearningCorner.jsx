import React, { useState } from "react";
import { Plus, BookOpen, Trash2, Pencil } from "lucide-react";
import { supabase } from "../supabaseUser";

export default function LearningCorner() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Breakout Strategy",
      tags: ["Price Action", "Momentum"],
      summary: "Key points to remember when trading breakout stocks on volume...",
      date: "2025-06-24",
    },
    {
      id: 2,
      title: "Risk Management",
      tags: ["Psychology", "Capital"],
      summary: "Never risk more than 2% of total capital per trade...",
      date: "2025-06-21",
    },
  ]);

  const addNote = async () => {
    const newNote = {
      id: Date.now(),
      title: "New Note",
      tags: [],
      summary: "Write something...",
      date: new Date().toISOString().split("T")[0],
    };
    setNotes([newNote, ...notes]);

    const { error } = await supabase.from("notes").insert(newNote);
    if (error) console.error("Supabase insert error:", error);
  };

  const updateNote = async (id, updatedFields) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, ...updatedFields } : note
    );
    setNotes(updatedNotes);

    const { error } = await supabase
      .from("notes")
      .update(updatedFields)
      .eq("id", id);
    if (error) console.error("Supabase update error:", error);
  };

  const deleteNote = async (id) => {
    setNotes(notes.filter((note) => note.id !== id));

    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) console.error("Supabase delete error:", error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#050435] to-[#004aad] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-400" /> Learning Corner
          </h1>
          <CustomButton onClick={addNote}>
            <Plus className="w-4 h-4" /> Add Note
          </CustomButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map((note) => (
            <EditableCard
              key={note.id}
              note={note}
              onUpdate={updateNote}
              onDelete={deleteNote}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EditableCard({ note, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [summary, setSummary] = useState(note.summary);
  const [tags, setTags] = useState(note.tags.join(", ")); // comma-separated

  const handleSave = () => {
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");
    onUpdate(note.id, { title, summary, tags: tagArray });
    setIsEditing(false);
  };

  const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`;
  };

  return (
    <Card>
      <CardContent>
        {isEditing ? (
          <>
            <input
              className="bg-transparent border border-white/30 rounded p-2 mb-2 w-full text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="bg-transparent border border-white/30 rounded p-2 mb-2 w-full text-white"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
            <input
              className="bg-transparent border border-white/30 rounded p-2 mb-4 w-full text-white"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Comma-separated tags (e.g. Momentum, Breakout)"
            />
            <div className="flex justify-end gap-2">
              <CustomButton onClick={handleSave}>Save</CustomButton>
              <CustomButton onClick={() => setIsEditing(false)}>Cancel</CustomButton>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white mb-2">{note.title}</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-200/20 text-blue-200 px-2 py-1 rounded-full text-xs font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <p className="text-white/80 text-sm mb-4 line-clamp-2">{note.summary}</p>
            <div className="text-right text-xs text-white/50">
              Last updated: {formatDate(note.date)}
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <IconButton onClick={() => setIsEditing(true)}>
                <Pencil className="w-4 h-4" />
              </IconButton>
              <IconButton onClick={() => onDelete(note.id)}>
                <Trash2 className="w-4 h-4" />
              </IconButton>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// UI Components
function Card({ children }) {
  return (
    <div className="bg-white/10 backdrop-blur-md shadow-md rounded-2xl border border-white/20">
      {children}
    </div>
  );
}

function CardContent({ children }) {
  return <div className="p-6">{children}</div>;
}

function CustomButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="!bg-blue-500/30 hover:bg-blue-500/50 text-white px-4 py-2 rounded-xl flex items-center gap-2 border border-blue-300/30 shadow"
    >
      {children}
    </button>
  );
}

function IconButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="!bg-transparent text-white"
    >
      {children}
    </button>
  );
}
