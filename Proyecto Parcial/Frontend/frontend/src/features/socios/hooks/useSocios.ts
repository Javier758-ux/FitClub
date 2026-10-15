import { useAsyncList } from '../../../shared/hooks/useAsyncList';
import { getSocios } from '../services/socioService';

export function useSocios() {
    return useAsyncList(getSocios);
}