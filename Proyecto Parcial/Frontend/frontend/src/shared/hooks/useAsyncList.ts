import { useCallback, useEffect, useState } from 'react';
import { isAbortError } from '../utils/isAbortError';

export function useAsyncList<T>(loader: (signal?: AbortSignal) => Promise<T[]>) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reloadToken, setReloadToken] = useState(0);

    const reload = useCallback(() => {
        setReloadToken((token) => token + 1);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError('');

        loader(controller.signal)
            .then(setData)
            .catch((err) => {
                if (isAbortError(err)) return;
                console.error(err);
                setError('No se pudieron cargar los datos.');
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [loader, reloadToken]);

    return { data, setData, loading, error, setError, reload };
}