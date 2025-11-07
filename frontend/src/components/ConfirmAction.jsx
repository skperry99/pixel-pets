export default function ConfirmAction({
  confirmPrompt = "Are you sure?",
  confirmLabel = "Confirm delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  busy = false,
}) {
  return (
    <div>
      <p>{confirmPrompt}</p>
      <button onClick={onConfirm} disabled={busy}>
        {busy ? "Deleting..." : confirmLabel}
      </button>
      <button onClick={onCancel} disabled={busy}>
        {cancelLabel}
      </button>
    </div>
  );
}
