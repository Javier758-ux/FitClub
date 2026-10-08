package com.fitclub.shared.infrastructure.web;

import com.fitclub.membresia.domain.exception.MembresiaNoEncontradaException;
import com.fitclub.socio.domain.exception.SocioNoEncontradoException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.fitclub.asistencia.domain.exception.AsistenciaDuplicadaException;
import com.fitclub.asistencia.domain.exception.AsistenciaNoEncontradaException;
import com.fitclub.asistencia.domain.exception.ReservaInvalidaException;
import com.fitclub.clase.domain.exception.ClaseNoEncontradaException;
import com.fitclub.historialmembresia.domain.exception.HistorialMembresiaNoEncontradoException;
import com.fitclub.horario.domain.exception.HorarioClaseNoEncontradoException;
import com.fitclub.horario.domain.exception.HorarioInvalidoException;
import com.fitclub.horario.domain.exception.InstructorHorarioSolapadoException;
import com.fitclub.instructor.domain.exception.InstructorNoEncontradoException;
import com.fitclub.plan.domain.exception.PlanNoEncontradoException;
import com.fitclub.notificacion.domain.exception.NotificacionNoEncontradaException;
import com.fitclub.reserva.domain.exception.CupoCompletoException;
import com.fitclub.reserva.domain.exception.MembresiaNoVigenteException;
import com.fitclub.reserva.domain.exception.ReservaClaseNoEncontradaException;
import com.fitclub.reserva.domain.exception.ReservaDuplicadaException;
import com.fitclub.reserva.domain.exception.ReservaYaCanceladaException;
import com.fitclub.membresia.domain.exception.CambioEstadoMembresiaInvalidoException;
import com.fitclub.reserva.domain.exception.HorarioNoDisponibleParaReservaException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import com.fitclub.auth.domain.exception.CredencialesInvalidasException;
import com.fitclub.shared.domain.exception.AccesoDenegadoException;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({SocioNoEncontradoException.class, MembresiaNoEncontradaException.class, AsistenciaNoEncontradaException.class,
            ClaseNoEncontradaException.class, HistorialMembresiaNoEncontradoException.class, HorarioClaseNoEncontradoException.class,
            InstructorNoEncontradoException.class, PlanNoEncontradoException.class, NotificacionNoEncontradaException.class,
            ReservaClaseNoEncontradaException.class})
    public ResponseEntity<ApiError> handleNoEncontrado(RuntimeException ex, HttpServletRequest request) {
        ApiError error = ApiError.of(HttpStatus.NOT_FOUND.value(), "Not Found",
                ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidacion(MethodArgumentNotValidException ex,
                                                     HttpServletRequest request) {
        List<String> errores = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.toList());

        ApiError error = ApiError.of(HttpStatus.BAD_REQUEST.value(), "Bad Request",
                "La solicitud contiene datos inválidos", request.getRequestURI(), errores);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleIntegridad(DataIntegrityViolationException ex,
                                                     HttpServletRequest request) {
        ApiError error = ApiError.of(HttpStatus.CONFLICT.value(), "Conflict",
                "El registro entra en conflicto con datos existentes (por ejemplo, un valor único duplicado)",
                request.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneral(Exception ex, HttpServletRequest request) {
        ApiError error = ApiError.of(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error",
                "Ocurrió un error inesperado", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(ReservaInvalidaException.class)
    public ResponseEntity<ApiError> handleReservaInvalida(
            ReservaInvalidaException ex,
            HttpServletRequest request) {

        return ResponseEntity.badRequest().body(
                ApiError.of(400, "Bad Request",
                        ex.getMessage(), request.getRequestURI())
        );
    }

    @ExceptionHandler(AsistenciaDuplicadaException.class)
    public ResponseEntity<ApiError> handleAsistenciaDuplicada(AsistenciaDuplicadaException ex, HttpServletRequest request) {
        return ResponseEntity.status(409).body(
                ApiError.of(409, "Conflict",
                        ex.getMessage(), request.getRequestURI())
        );
    }
    @ExceptionHandler(HorarioInvalidoException.class)
    public ResponseEntity<ApiError> handleHorarioInvalido(HorarioInvalidoException ex, HttpServletRequest request) {
        return ResponseEntity.badRequest().body(
                ApiError.of(
                        400,
                        "Bad Request",
                        ex.getMessage(),
                        request.getRequestURI()
                )
        );
    }
    @ExceptionHandler(InstructorHorarioSolapadoException.class)
    public ResponseEntity<ApiError> handleHorarioSolapado(InstructorHorarioSolapadoException ex, HttpServletRequest request) {
        return ResponseEntity.status(409).body(ApiError.of(
                        409,
                        "Conflict",
                        ex.getMessage(),
                        request.getRequestURI()
                )
        );
    }
    @ExceptionHandler({
            ReservaDuplicadaException.class,
            CupoCompletoException.class,
            MembresiaNoVigenteException.class,
            ReservaYaCanceladaException.class,
            HorarioNoDisponibleParaReservaException.class
    })
    public ResponseEntity<ApiError> handleConflictoReserva(RuntimeException ex, HttpServletRequest request) {
        return ResponseEntity.status(409).body(
                ApiError.of(
                        409,
                        "Conflict",
                        ex.getMessage(),
                        request.getRequestURI()
                )
        );
    }
    @ExceptionHandler(CambioEstadoMembresiaInvalidoException.class)
    public ResponseEntity<ApiError> handleCambioEstadoMembresia(CambioEstadoMembresiaInvalidoException ex, HttpServletRequest request) {

        return ResponseEntity.status(409).body(ApiError.of(
                        409,
                        "Conflict",
                        ex.getMessage(),
                        request.getRequestURI()
                )
        );
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> handleParametroInvalido(MethodArgumentTypeMismatchException ex,
            HttpServletRequest request) {

        return ResponseEntity.badRequest().body(
                ApiError.of(
                        400,
                        "Bad Request",
                        "El parámetro '" + ex.getName() + "' contiene un valor inválido",
                        request.getRequestURI()
                )
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleArgumentoInvalido(IllegalArgumentException ex, HttpServletRequest request) {

        return ResponseEntity.badRequest().body(
                ApiError.of(
                        400,
                        "Bad Request",
                        ex.getMessage(),
                        request.getRequestURI()
                )
        );
    }

    @ExceptionHandler(CredencialesInvalidasException.class)
    public ResponseEntity<ApiError> handleCredencialesInvalidas(
            CredencialesInvalidasException ex,
            HttpServletRequest request) {

        return ResponseEntity.status(401).body(
                ApiError.of(
                        401,
                        "Unauthorized",
                        ex.getMessage(),
                        request.getRequestURI()
                )
        );
    }
    @ExceptionHandler(AccesoDenegadoException.class)
    public ResponseEntity<ApiError> handleAccesoDenegado(
            AccesoDenegadoException ex,
            HttpServletRequest request) {

        return ResponseEntity.status(403).body(
                ApiError.of(
                        403,
                        "Forbidden",
                        ex.getMessage(),
                        request.getRequestURI()
                )
        );
    }
}