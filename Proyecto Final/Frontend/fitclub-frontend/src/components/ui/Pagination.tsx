import { Button } from "./Button";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
                               page,
                               totalPages,
                               onPageChange
                           }: PaginationProps) {

    const paginas =
        Math.max(1, totalPages);

    function cambiarPagina(
        nuevaPagina: number
    ) {
        const paginaSegura =
            Math.min(
                Math.max(nuevaPagina, 1),
                paginas
            );

        onPageChange(paginaSegura);
    }

    return (
        <nav
            className="pagination"
            aria-label="Paginación"
        >
            <Button
                type="button"
                variant="ghost"
                disabled={page <= 1}
                onClick={() =>
                    cambiarPagina(page - 1)
                }
            >
                Anterior
            </Button>

            <span className="pagination__text">
        Página {page} de {paginas}
      </span>

            <Button
                type="button"
                variant="ghost"
                disabled={page >= paginas}
                onClick={() =>
                    cambiarPagina(page + 1)
                }
            >
                Siguiente
            </Button>
        </nav>
    );
}