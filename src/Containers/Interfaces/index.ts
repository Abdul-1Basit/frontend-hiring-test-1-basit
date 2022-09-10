
export type Note= {
    id: String;
    content: String;
  }
export interface DataType {
    id: string; // "unique ID of call"
    direction: String; // "inbound" or "outbound" call
    from: String; // Caller's number
    to: String; // Callee's number
    duration: number; // Duration of a call (in seconds)
    is_archived: Boolean; // Boolean that indicates if the call is archived or not
    call_type: String; // The type of the call, it can be a missed, answered or voicemail.
    via: String; // Aircall number used for the call.
    created_at: String; // When the call has been made.
    notes: Note[]; // Notes related to a given call
}