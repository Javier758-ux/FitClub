import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export class AppErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: unknown, info: React.ErrorInfo) {
        console.error('Render error', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return <main role="alert"><h1>La interfaz tuvo un problema.</h1></main>;
        }
        return this.props.children;
    }
}