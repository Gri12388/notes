import type { Note, NoteDb, Session, SessionDb } from "../types.js";
export declare const mapSession: (data?: SessionDb) => Session | undefined;
export declare const mapNote: (data?: NoteDb) => Note | undefined;
