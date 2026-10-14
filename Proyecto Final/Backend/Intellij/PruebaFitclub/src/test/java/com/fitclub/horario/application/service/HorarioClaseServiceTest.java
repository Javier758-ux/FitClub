package com.fitclub.horario.application.service;

import com.fitclub.clase.application.port.in.ClaseUseCase;
import com.fitclub.clase.domain.model.Clase;
import com.fitclub.horario.application.port.out.HorarioClaseRepositoryPort;
import com.fitclub.horario.domain.exception.HorarioInvalidoException;
import com.fitclub.horario.domain.exception.InstructorHorarioSolapadoException;
import com.fitclub.horario.domain.model.HorarioClase;
import com.fitclub.instructor.application.port.in.InstructorUseCase;
import com.fitclub.instructor.domain.model.Instructor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

/**
 * Pruebas unitarias de la regla crítica de solapamiento de horario de instructor
 * (un mismo instructor no puede tener dos clases programadas que se cruzan en fecha/hora),
 * y de la validación básica de horario (hora de inicio antes de hora de fin, no crear en el pasado).
 *
 * Dependencias simuladas con Mockito; no requiere base de datos.
 */
@ExtendWith(MockitoExtension.class)
class HorarioClaseServiceTest {

    @Mock
    private HorarioClaseRepositoryPort repository;
    @Mock
    private ClaseUseCase claseUseCase;
    @Mock
    private InstructorUseCase instructorUseCase;

    private HorarioClaseService service;

    private HorarioClase horarioValidoFuturo() {
        LocalDate mañana = LocalDate.now().plusDays(1);
        return new HorarioClase(null, 1L, 2L, mañana, LocalTime.of(9, 0), LocalTime.of(10, 0));
    }

    private void stubClaseEInstructorExistentes() {
        lenient().when(claseUseCase.buscarPorId(1L))
                .thenReturn(Optional.of(new Clase(1L, "Spinning", "Clase de spinning", 20)));
        lenient().when(instructorUseCase.buscarPorId(2L))
                .thenReturn(Optional.of(new Instructor(2L, "Carlos", "carlos@mail.com", "999", "Spinning")));
    }

    @Test
    @DisplayName("registra el horario cuando no hay solapamiento con otra clase del mismo instructor")
    void registraSinSolapamiento() {
        service = new HorarioClaseService(repository, claseUseCase, instructorUseCase);
        stubClaseEInstructorExistentes();

        var horario = horarioValidoFuturo();
        when(repository.existeSolapamiento(2L, horario.getFecha(), horario.getHoraInicio(), horario.getHoraFin()))
                .thenReturn(false);
        when(repository.guardar(any(HorarioClase.class))).thenAnswer(invocation -> invocation.getArgument(0));

        HorarioClase resultado = service.registrar(horario);

        assertThat(resultado.getInstructorId()).isEqualTo(2L);
    }

    @Test
    @DisplayName("rechaza el horario si el instructor ya tiene una clase que se cruza en fecha/hora")
    void rechazaSolapamientoDeInstructor() {
        service = new HorarioClaseService(repository, claseUseCase, instructorUseCase);
        stubClaseEInstructorExistentes();

        var horario = horarioValidoFuturo();
        when(repository.existeSolapamiento(2L, horario.getFecha(), horario.getHoraInicio(), horario.getHoraFin()))
                .thenReturn(true);

        assertThatThrownBy(() -> service.registrar(horario))
                .isInstanceOf(InstructorHorarioSolapadoException.class);
    }

    @Test
    @DisplayName("rechaza un horario cuya hora de inicio no es anterior a la hora de fin")
    void rechazaHoraInicioNoAnteriorAHoraFin() {
        service = new HorarioClaseService(repository, claseUseCase, instructorUseCase);
        stubClaseEInstructorExistentes();

        var horarioInvalido = new HorarioClase(null, 1L, 2L, LocalDate.now().plusDays(1), LocalTime.of(11, 0), LocalTime.of(10, 0));

        assertThatThrownBy(() -> service.registrar(horarioInvalido))
                .isInstanceOf(HorarioInvalidoException.class);
    }

    @Test
    @DisplayName("rechaza un horario programado en una fecha/hora que ya pasó")
    void rechazaHorarioEnElPasado() {
        service = new HorarioClaseService(repository, claseUseCase, instructorUseCase);
        stubClaseEInstructorExistentes();

        var horarioPasado = new HorarioClase(null, 1L, 2L, LocalDate.now().minusDays(1), LocalTime.of(9, 0), LocalTime.of(10, 0));

        assertThatThrownBy(() -> service.registrar(horarioPasado))
                .isInstanceOf(HorarioInvalidoException.class);
    }

    @Test
    @DisplayName("al actualizar, también valida el solapamiento excluyendo el propio horario")
    void actualizarValidaSolapamientoExcluyendoId() {
        service = new HorarioClaseService(repository, claseUseCase, instructorUseCase);
        stubClaseEInstructorExistentes();

        var existente = horarioValidoFuturo();
        existente.setId(7L);
        var cambios = horarioValidoFuturo();

        when(repository.buscarPorId(7L)).thenReturn(Optional.of(existente));
        when(repository.existeSolapamientoExcluyendoId(7L, 2L, cambios.getFecha(), cambios.getHoraInicio(), cambios.getHoraFin()))
                .thenReturn(true);

        assertThatThrownBy(() -> service.actualizar(7L, cambios))
                .isInstanceOf(InstructorHorarioSolapadoException.class);
    }
}
