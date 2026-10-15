import {
    useCallback,
    useEffect,
    useState
} from "react";

import { isAbortError } from "../utils/isAbortError";

type Loader<T> =
    (signal: AbortSignal) => Promise<T[]>;

export function useAsyncList<T>(
    loader: Loader<T>
) {
    const [data, setData] =
        useState<T[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [
        reloadToken,
        setReloadToken
    ] = useState(0);

    const reload = useCallback(() => {
        setReloadToken(
            (valor) => valor + 1
        );
    }, []);

    useEffect(() => {
        const controller =
            new AbortController();

        let ignore = false;

        async function cargar() {
            try {
                setLoading(true);
                setError("");

                const resultado =
                    await loader(
                        controller.signal
                    );

                if (!ignore) {
                    setData(resultado);
                }

            } catch (err) {
                if (
                    !ignore &&
                    !isAbortError(err)
                ) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Error al cargar los datos."
                    );
                }
            } finally {
                if (
                    !ignore &&
                    !controller.signal.aborted
                ) {
                    setLoading(false);
                }
            }
        }

        void cargar();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [
        loader,
        reloadToken
    ]);

    return {
        data,
        setData,
        loading,
        error,
        setError,
        reload
    };
}