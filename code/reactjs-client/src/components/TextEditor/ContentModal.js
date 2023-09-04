import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

function ContentModal({ open, onClose, quillHtml, modalContent,either }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent>
      {either=='1' ? (
          <div>{quillHtml}</div>
        ) : (
          <pre>{modalContent}</pre>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ContentModal;