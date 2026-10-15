import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmDialogProps {
    open: boolean;

    title: string;
    message: string;

    confirmLabel?: string;

    confirming?: boolean;

    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
                                  open,
                                  title,
                                  message,
                                  confirmLabel = "Confirmar",
                                  confirming = false,
                                  onConfirm,
                                  onCancel
                              }: ConfirmDialogProps) {

    return (
        <Modal
            open={open}
            title={title}
            onClose={onCancel}
        >
            <p>{message}</p>

            <div className="ui-modal__actions">

                <Button
                    type="button"
                    variant="secondary"
                    disabled={confirming}
                    onClick={onCancel}
                >
                    Cancelar
                </Button>

                <Button
                    type="button"
                    variant="danger"
                    loading={confirming}
                    onClick={onConfirm}
                >
                    {confirmLabel}
                </Button>

            </div>
        </Modal>
    );
}