import {
    useEffect,
    useId,
    useRef
} from "react";

import type {
    ReactNode
} from "react";

interface ModalProps {
    open: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
}

export function Modal({
                          open,
                          title,
                          children,
                          onClose
                      }: ModalProps) {

    const dialogRef =
        useRef<HTMLDialogElement>(null);

    const titleId = useId();

    useEffect(() => {
        const dialog =
            dialogRef.current;

        if (!dialog) {
            return;
        }

        if (
            open &&
            !dialog.open
        ) {
            dialog.showModal();
        }

        if (
            !open &&
            dialog.open
        ) {
            dialog.close();
        }
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            className="ui-modal"
            aria-labelledby={titleId}
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
        >
            <header className="ui-modal__header">
                <h2 id={titleId}>
                    {title}
                </h2>

                <button
                    type="button"
                    className="ui-modal__close"
                    aria-label="Cerrar"
                    onClick={onClose}
                >
                    ×
                </button>
            </header>

            <div className="ui-modal__content">
                {children}
            </div>
        </dialog>
    );
}