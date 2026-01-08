export function generateUIDNumber(lastUID = null) {
  const now = new Date();

  const datePart =
    String(now.getFullYear()).slice(2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const prefix = "4";

  let sequence = 0;

  if (lastUID) {
    const lastDatePart = lastUIDStr.substring(1, 7);
    const lastSequence = parseInt(lastUIDStr.substring(7));

    if (lastDatePart === datePart) {
      sequence = lastSequence + 1;
    } else {
      sequence = 0;
    }
  }

  const seqPart = String(sequence).padStart(6, "0");

  return Number(`${prefix}${datePart}${seqPart}`);
}
