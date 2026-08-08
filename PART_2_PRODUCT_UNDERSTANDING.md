# Part 2 — Product Understanding: AbleSpace "Take Data" (Caseload tab)

## Workflow, in my own words

1. A therapist/teacher opens the **Caseload** tab from the left "Capture" navigation group. This is their roster: 15 students, 12 groups, and 39 unassigned students, switchable via tabs at the top of the table.
2. Each row in the table represents one student, with columns for **Full Name, Last Name, IEP Due date, Eval Due date, Collaborators** (avatar stack of everyone working with that student), **Service Time** (e.g. "OT - 30 mins/Wk"), and **School**.
3. The rightmost **Actions** column has a **"Take Data"** button per student — this is the entry point into a session data-capture screen where the clinician logs progress against that student's goals for the session (attendance, trial results, notes, etc.).
4. A search bar and grid/list toggle sit above the table for quickly finding a student, and an **"Add Student"** button lets staff onboard a new student into the caseload.
5. Because "Caseload" sits under **Capture** (alongside Calendar, Data, Accommodations, Service Time) rather than under **Track** (Report, Billing, Collaborators, History), it's clearly positioned as the pre-session, data-entry side of the product — the "Track" section presumably surfaces the same data after the fact for reporting/billing.

## UX/UI improvement suggestions

- **Bulk "Take Data"**: right now a clinician has to click into each student one at a time. If a session covers several students (common in group therapy), a multi-select + "Take Data for selected" action would save repetitive navigation.
- **Clarify "0" Service Time**: some rows (e.g. Charles Darwin) show "0" for Service Time with no context — unclear if that means unassigned, not yet scheduled, or completed. A short status label or tooltip would remove the ambiguity.
- **Visual urgency on due dates**: IEP Due / Eval Due are plain text even when close to or past due. Color-coding (e.g. amber within 2 weeks, red if overdue) would let staff triage at a glance instead of reading every row.
- **Collaborator overflow on hover**: the "+1 / +3 / +4" badges next to collaborator avatars require a click (presumably) to see who's included — a hover tooltip listing the full names would be faster.
- **Distinguish empty vs. not-applicable**: several IEP/Eval Due cells show a dash ("–"). It's not clear whether that means "not set yet" or "not applicable for this student." An explicit "Not Set" label (vs. leaving it blank) would reduce guesswork.
- **Sticky Actions column on scroll**: on tablet/mobile, if the table scrolls horizontally, the "Take Data" button should stay pinned so users don't have to scroll back to trigger the primary action — this matters a lot given "Take Data" is the main thing this screen exists for.
