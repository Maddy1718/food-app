import Button from "./Button";
import Modal from "./Modal";

export default function ConfirmDialog({ open, onClose, onConfirm, title = "Confirm action", description, confirmLabel = "Confirm", cancelLabel = "Cancel" }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="space-y-5">
        {description ? <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p> : null}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>{cancelLabel}</Button>
          <Button variant="primary" onClick={() => { onConfirm?.(); onClose?.(); }}>{confirmLabel}</Button>
        </div>
      </div>
    </Modal>
  );
}
