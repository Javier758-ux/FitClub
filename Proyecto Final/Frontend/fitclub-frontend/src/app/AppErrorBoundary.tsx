import React from "react";

import "./AppErrorBoundary.css";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
}

export class AppErrorBoundary
    extends React.Component<Props, State> {

    state: State = {
        hasError: false
    };

    static getDerivedStateFromError(): State {
        return {
            hasError: true
        };
    }

    componentDidCatch(
        error: unknown,
        info: React.ErrorInfo
    ) {
        console.error(
            "Error de render de FitClub:",
            error,
            info.componentStack
        );
    }

    render() {
        if (this.state.hasError) {
            return (
                <main
                    className="app-error-boundary"
                    role="alert"
                >
                    <section className="app-error-boundary__card">

                        <h1>
                            La interfaz tuvo un problema
                        </h1>

                        <p>
                            FitClub encontró un error al
                            mostrar esta pantalla.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Recargar aplicación
                        </button>

                    </section>
                </main>
            );
        }

        return this.props.children;
    }
}