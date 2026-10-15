import { useAsyncList } from '../../../shared/hooks/useAsyncList';
import { getMembresias } from '../services/membresiaService';

export function useMembresias() {
    return useAsyncList(getMembresias);
}