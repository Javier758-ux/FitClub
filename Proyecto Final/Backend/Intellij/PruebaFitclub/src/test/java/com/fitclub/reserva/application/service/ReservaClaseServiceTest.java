package com.fitclub.reserva.application.service;

import com.fitclub.clase.application.port.in.ClaseUseCase;
import com.fitclub.clase.domain.model.Clase;
import com.fitclub.horario.application.port.in.HorarioUseCase;
import com.fitclub.horario.domain.model.HorarioClase;
import com.fitclub.membresia.application.port.in.MembresiaUseCase;
import com.fitclub.reserva.application.port.out.ReservaClaseRepositoryPort;
import com.fitclub.reserva.domain.exception.CupoCompletoException;
import com.fitclub.reserva.domain.exception.HorarioNoDisponibleParaReservaException;
import com.fitclub.reserva.domain.exception.MembresiaNoVigenteException;
import com.fitclub.reserva.domain.exception.ReservaDuplicadaException;
import com.fitclub.reserva.domain.model.EstadoReserva;
import com.fitclub.reserva.domain.model.ReservaClase;
import com.fitclub.socio.application.port.in.SocioUseCase;
import com.fitclub.socio.domain.model.Socio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

/**
 * Pruebas unitarias de las reglas críticas de ReservaClase:
 * - membresía vigente obligatoria para reservar
 * - no se puede reservar un horario que ya empezó o terminó
 * - no se permite una segunda reserva activa del mismo socio para el mismo horario (reserva duplicada)
 * - cupo máximo de la clase
 * - cancelación tardía según el límite configurado (fitclub.reserva.limite-cancelacion-horas)
 *
 * Dependencias simuladas con Mockito; no requiere base de datos.
 */
@ExtendWith(MockitoExtension.class)
class ReservaClaseServiceTest {

    private static final long SOCIO_ID = 10L;
    private static final long HORARIO_ID = 20L;
    private static final long CLASE_ID = 30L;
    private static final long LIMITE_CANCELACION_HORAS = 2L;

    @Mock
    private ReservaClaseRepositoryPort repository;
    @Mock
    private SocioUseCase socioUseCase;
    @Mock
    private HorarioUseCase horarioUseCase;
    @Mock
    private ClaseUseCase claseUseCase;
    @Mock
    private MembresiaUseCase membresiaUseCase;

    private ReservaClaseService service;

    @BeforeEach
    void setUp() {
        service = new ReservaClaseService(repository, socioUseCase, horarioUseCase, claseUseCase, membresiaUseCase);
        ReflectionTestUtils.setField(service, "limiteCancelacionHoras", LIMITE_CANCELACION_HORAS);
    }

    private HorarioClase horarioEnElFuturo(Duration margen) {
        LocalDateTime inicio = LocalDateTime.now().plus(margen);
        return new HorarioClase(HORARIO_ID, CLASE_ID, 2L, inicio.toLocalDate(), inicio.toLocalTime(), inicio.toLocalTime().plusHours(1));
    }

    private void stubSocioYHorarioValidos(HorarioClase horario) {
        lenient().when(socioUseCase.buscarPorId(SOCIO_ID)).thenReturn(Optional.of(
                new Socio(SOCIO_ID, "Ana", "ana@mail.com", "999", LocalDate.now())));
        lenient().when(horarioUseCase.buscarPorId(HORARIO_ID)).thenReturn(Optional.of(horario));
    }

    // ---------- registrar() ----------

    @Test
    @DisplayName("registrar(): guarda la reserva cuando hay membresía vigente, cupo libre y no hay duplicados")
    void registrarReservaValida() {
        var horario = horarioEnElFuturo(Duration.ofDays(1));
        stubSocioYHorarioValidos(horario);
        when(membresiaUseCase.tieneMembresiaVigente(SOCIO_ID)).thenReturn(true);
        when(repository.existeReservaActiva(SOCIO_ID, HORARIO_ID)).thenReturn(false);
        when(claseUseCase.buscarPorId(CLASE_ID)).thenReturn(Optional.of(new Clase(CLASE_ID, "Yoga", "desc", 10)));
        when(repository.contarReservasActivas(HORARIO_ID)).thenReturn(3L);
        when(repository.guardar(any(ReservaClase.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var nueva = new ReservaClase(null, SOCIO_ID, HORARIO_ID, null, null, null, null);
        ReservaClase resultado = service.registrar(nueva);

        assertThat(resultado.getEstado()).isEqualTo(EstadoReserva.ACTIVA);
    }

    @Test
    @DisplayName("registrar(): rechaza la reserva si el socio no tiene membresía vigente")
    void registrarRechazaSinMembresiaVigente() {
        var horario = horarioEnElFuturo(Duration.ofDays(1));
        stubSocioYHorarioValidos(horario);
        when(membresiaUseCase.tieneMembresiaVigente(SOCIO_ID)).thenReturn(false);

        var nueva = new ReservaClase(null, SOCIO_ID, HORARIO_ID, null, null, null, null);

        assertThatThrownBy(() -> service.registrar(nueva))
                .isInstanceOf(MembresiaNoVigenteException.class);
    }

    @Test
    @DisplayName("registrar(): rechaza la reserva si el horario ya empezó")
    void registrarRechazaHorarioYaIniciado() {
        var horario = horarioEnElFuturo(Duration.ofHours(-1));
        stubSocioYHorarioValidos(horario);

        var nueva = new ReservaClase(null, SOCIO_ID, HORARIO_ID, null, null, null, null);

        assertThatThrownBy(() -> service.registrar(nueva))
                .isInstanceOf(HorarioNoDisponibleParaReservaException.class);
    }

    @Test
    @DisplayName("registrar(): rechaza una segunda reserva activa del mismo socio para el mismo horario (reserva duplicada)")
    void registrarRechazaReservaDuplicada() {
        var horario = horarioEnElFuturo(Duration.ofDays(1));
        stubSocioYHorarioValidos(horario);
        when(membresiaUseCase.tieneMembresiaVigente(SOCIO_ID)).thenReturn(true);
        when(repository.existeReservaActiva(SOCIO_ID, HORARIO_ID)).thenReturn(true);

        var nueva = new ReservaClase(null, SOCIO_ID, HORARIO_ID, null, null, null, null);

        assertThatThrownBy(() -> service.registrar(nueva))
                .isInstanceOf(ReservaDuplicadaException.class);
    }

    @Test
    @DisplayName("registrar(): rechaza la reserva si la clase ya alcanzó su cupo máximo")
    void registrarRechazaCupoCompleto() {
        var horario = horarioEnElFuturo(Duration.ofDays(1));
        stubSocioYHorarioValidos(horario);
        when(membresiaUseCase.tieneMembresiaVigente(SOCIO_ID)).thenReturn(true);
        when(repository.existeReservaActiva(SOCIO_ID, HORARIO_ID)).thenReturn(false);
        when(claseUseCase.buscarPorId(CLASE_ID)).thenReturn(Optional.of(new Clase(CLASE_ID, "Yoga", "desc", 10)));
        when(repository.contarReservasActivas(HORARIO_ID)).thenReturn(10L);

        var nueva = new ReservaClase(null, SOCIO_ID, HORARIO_ID, null, null, null, null);

        assertThatThrownBy(() -> service.registrar(nueva))
                .isInstanceOf(CupoCompletoException.class);
    }

    // ---------- cancelar() ----------

    @Test
    @DisplayName("cancelar(): marca cancelacionTardia = false cuando se cancela con más margen que el límite configurado")
    void cancelarDentroDelPlazoNoEsTardia() {
        var horario = horarioEnElFuturo(Duration.ofHours(LIMITE_CANCELACION_HORAS + 5));
        var reserva = new ReservaClase(1L, SOCIO_ID, HORARIO_ID, LocalDateTime.now(), EstadoReserva.ACTIVA, null, false);

        when(repository.buscarPorId(1L)).thenReturn(Optional.of(reserva));
        when(horarioUseCase.buscarPorId(HORARIO_ID)).thenReturn(Optional.of(horario));
        when(repository.guardar(any(ReservaClase.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ReservaClase resultado = service.cancelar(1L);

        assertThat(resultado.getEstado()).isEqualTo(EstadoReserva.CANCELADA);
        assertThat(resultado.getCancelacionTardia()).isFalse();
    }

    @Test
    @DisplayName("cancelar(): marca cancelacionTardia = true cuando se cancela dentro del límite configurado antes de la clase")
    void cancelarDentroDelLimiteEsTardia() {
        var horario = horarioEnElFuturo(Duration.ofMinutes(30));
        var reserva = new ReservaClase(1L, SOCIO_ID, HORARIO_ID, LocalDateTime.now(), EstadoReserva.ACTIVA, null, false);

        when(repository.buscarPorId(1L)).thenReturn(Optional.of(reserva));
        when(horarioUseCase.buscarPorId(HORARIO_ID)).thenReturn(Optional.of(horario));
        when(repository.guardar(any(ReservaClase.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ReservaClase resultado = service.cancelar(1L);

        assertThat(resultado.getCancelacionTardia()).isTrue();
    }
}
