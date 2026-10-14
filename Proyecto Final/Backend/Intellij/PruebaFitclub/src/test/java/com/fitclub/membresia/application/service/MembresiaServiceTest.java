package com.fitclub.membresia.application.service;

import com.fitclub.auth.application.port.in.UsuarioActualUseCase;
import com.fitclub.auth.domain.model.Rol;
import com.fitclub.auth.domain.model.Usuario;
import com.fitclub.historialmembresia.application.port.in.HistorialMembresiaUseCase;
import com.fitclub.membresia.application.port.out.MembresiaRepositoryPort;
import com.fitclub.membresia.domain.exception.CambioEstadoMembresiaInvalidoException;
import com.fitclub.membresia.domain.exception.MembresiaNoEncontradaException;
import com.fitclub.membresia.domain.model.EstadoMembresia;
import com.fitclub.membresia.domain.model.Membresia;
import com.fitclub.plan.application.port.in.PlanUseCase;
import com.fitclub.plan.domain.exception.PlanNoEncontradoException;
import com.fitclub.plan.domain.model.Plan;
import com.fitclub.socio.application.port.in.SocioUseCase;
import com.fitclub.socio.domain.exception.SocioNoEncontradoException;
import com.fitclub.socio.domain.model.Socio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Pruebas unitarias de las reglas críticas de Membresia:
 * - vigencia / vencimiento automático (RN de vigencia de membresía)
 * - transiciones válidas de estado (ACTIVA -> SUSPENDIDA -> ACTIVA, ACTIVA/SUSPENDIDA -> CANCELADA)
 * - transiciones inválidas deben rechazarse (CambioEstadoMembresiaInvalidoException)
 *
 * Todas las dependencias (repositorio, otros casos de uso) se simulan con Mockito:
 * esta prueba no toca base de datos ni el contexto de Spring, por eso corre en milisegundos
 * y no necesita Docker.
 */
@ExtendWith(MockitoExtension.class)
class MembresiaServiceTest {

    @Mock
    private MembresiaRepositoryPort repository;
    @Mock
    private SocioUseCase socioUseCase;
    @Mock
    private PlanUseCase planUseCase;
    @Mock
    private HistorialMembresiaUseCase historialUseCase;
    @Mock
    private UsuarioActualUseCase usuarioActualUseCase;

    private MembresiaService service;

    @BeforeEach
    void setUp() {
        service = new MembresiaService(
                repository,
                socioUseCase,
                planUseCase,
                historialUseCase,
                usuarioActualUseCase
        );
    }

    private Usuario usuarioAutenticado() {
        return new Usuario(1L, "Recepción", "recepcion@fitclub.com", "hash", Rol.RECEPCION, true, null, null);
    }

    // ---------- registrar() ----------

    @Test
    @DisplayName("registrar(): calcula fechaFin a partir de la duración del plan y deja la membresía en ACTIVA")
    void registrarCalculaFechaFinYQuedaActiva() {
        var socio = new Socio(10L, "Ana", "ana@mail.com", "999", LocalDate.now());
        var plan = new Plan(5L, "Mensual", "Plan mensual", BigDecimal.TEN, 30);
        var nueva = new Membresia(null, 10L, 5L, LocalDate.of(2026, 1, 1), null, null);

        when(socioUseCase.buscarPorId(10L)).thenReturn(Optional.of(socio));
        when(planUseCase.buscarPorId(5L)).thenReturn(Optional.of(plan));
        when(usuarioActualUseCase.obtener()).thenReturn(usuarioAutenticado());
        when(repository.guardar(any(Membresia.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Membresia resultado = service.registrar(nueva);

        assertThat(resultado.getEstado()).isEqualTo(EstadoMembresia.ACTIVA);
        assertThat(resultado.getFechaFin()).isEqualTo(LocalDate.of(2026, 1, 31));
        verify(historialUseCase).registrar(any());
    }

    @Test
    @DisplayName("registrar(): rechaza la membresía si el socio no existe")
    void registrarRechazaSocioInexistente() {
        var nueva = new Membresia(null, 999L, 5L, LocalDate.now(), null, null);
        when(socioUseCase.buscarPorId(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.registrar(nueva))
                .isInstanceOf(SocioNoEncontradoException.class);
    }

    @Test
    @DisplayName("registrar(): rechaza la membresía si el plan no existe")
    void registrarRechazaPlanInexistente() {
        var socio = new Socio(10L, "Ana", "ana@mail.com", "999", LocalDate.now());
        var nueva = new Membresia(null, 10L, 404L, LocalDate.now(), null, null);

        when(socioUseCase.buscarPorId(10L)).thenReturn(Optional.of(socio));
        when(planUseCase.buscarPorId(404L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.registrar(nueva))
                .isInstanceOf(PlanNoEncontradoException.class);
    }

    // ---------- vigencia / vencimiento automático ----------

    @Test
    @DisplayName("vigencia: al consultar, una membresía ACTIVA cuya fechaFin ya pasó se marca VENCIDA y queda auditada")
    void listarMarcaVencidaAutomaticamente() {
        var vencida = new Membresia(1L, 10L, 5L, LocalDate.now().minusDays(40), LocalDate.now().minusDays(10), EstadoMembresia.ACTIVA);

        when(repository.buscarVencidasPendientes(any(LocalDate.class)))
                .thenReturn(List.of(vencida));
        when(repository.guardar(any(Membresia.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(repository.listar()).thenReturn(Collections.emptyList());

        service.listar();

        ArgumentCaptor<Membresia> captor = ArgumentCaptor.forClass(Membresia.class);
        verify(repository).guardar(captor.capture());
        assertThat(captor.getValue().getEstado()).isEqualTo(EstadoMembresia.VENCIDA);
        verify(historialUseCase).registrar(any());
    }

    @Test
    @DisplayName("vigencia: tieneMembresiaVigente() primero actualiza vencidas y luego consulta vigencia real")
    void tieneMembresiaVigenteActualizaVencidasAntes() {
        when(repository.buscarVencidasPendientes(any(LocalDate.class)))
                .thenReturn(Collections.emptyList());
        when(repository.existeVigentePorSocio(10L)).thenReturn(true);

        boolean vigente = service.tieneMembresiaVigente(10L);

        assertThat(vigente).isTrue();
        verify(repository).buscarVencidasPendientes(any(LocalDate.class));
        verify(repository).existeVigentePorSocio(10L);
    }

    // ---------- transiciones de estado ----------

    @Test
    @DisplayName("transiciones: suspender() solo funciona si la membresía está ACTIVA")
    void suspenderSoloDesdeActiva() {
        var activa = new Membresia(1L, 10L, 5L, LocalDate.now(), LocalDate.now().plusDays(30), EstadoMembresia.ACTIVA);

        when(repository.buscarVencidasPendientes(any(LocalDate.class))).thenReturn(Collections.emptyList());
        when(repository.buscarPorId(1L)).thenReturn(Optional.of(activa));
        when(repository.guardar(any(Membresia.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(usuarioActualUseCase.obtener()).thenReturn(usuarioAutenticado());

        Membresia resultado = service.suspender(1L);

        assertThat(resultado.getEstado()).isEqualTo(EstadoMembresia.SUSPENDIDA);
    }

    @Test
    @DisplayName("transiciones: suspender() rechaza una membresía que no está ACTIVA")
    void suspenderRechazaSiNoEstaActiva() {
        var cancelada = new Membresia(1L, 10L, 5L, LocalDate.now(), LocalDate.now().plusDays(30), EstadoMembresia.CANCELADA);

        when(repository.buscarVencidasPendientes(any(LocalDate.class))).thenReturn(Collections.emptyList());
        when(repository.buscarPorId(1L)).thenReturn(Optional.of(cancelada));

        assertThatThrownBy(() -> service.suspender(1L))
                .isInstanceOf(CambioEstadoMembresiaInvalidoException.class);
    }

    @Test
    @DisplayName("transiciones: cancelar() rechaza una membresía ya CANCELADA")
    void cancelarRechazaSiYaEstaCancelada() {
        var cancelada = new Membresia(1L, 10L, 5L, LocalDate.now(), LocalDate.now().plusDays(30), EstadoMembresia.CANCELADA);

        when(repository.buscarVencidasPendientes(any(LocalDate.class))).thenReturn(Collections.emptyList());
        when(repository.buscarPorId(1L)).thenReturn(Optional.of(cancelada));

        assertThatThrownBy(() -> service.cancelar(1L))
                .isInstanceOf(CambioEstadoMembresiaInvalidoException.class);
    }

    @Test
    @DisplayName("transiciones: cancelar() rechaza una membresía VENCIDA")
    void cancelarRechazaSiEstaVencida() {
        var vencida = new Membresia(1L, 10L, 5L, LocalDate.now(), LocalDate.now().plusDays(30), EstadoMembresia.VENCIDA);

        when(repository.buscarVencidasPendientes(any(LocalDate.class))).thenReturn(Collections.emptyList());
        when(repository.buscarPorId(1L)).thenReturn(Optional.of(vencida));

        assertThatThrownBy(() -> service.cancelar(1L))
                .isInstanceOf(CambioEstadoMembresiaInvalidoException.class);
    }

    @Test
    @DisplayName("transiciones: reactivar() solo funciona si la membresía está SUSPENDIDA")
    void reactivarSoloDesdeSuspendida() {
        var suspendida = new Membresia(1L, 10L, 5L, LocalDate.now(), LocalDate.now().plusDays(30), EstadoMembresia.SUSPENDIDA);

        when(repository.buscarVencidasPendientes(any(LocalDate.class))).thenReturn(Collections.emptyList());
        when(repository.buscarPorId(1L)).thenReturn(Optional.of(suspendida));
        when(repository.guardar(any(Membresia.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(usuarioActualUseCase.obtener()).thenReturn(usuarioAutenticado());

        Membresia resultado = service.reactivar(1L);

        assertThat(resultado.getEstado()).isEqualTo(EstadoMembresia.ACTIVA);
    }

    @Test
    @DisplayName("transiciones: una operación sobre una membresía inexistente lanza MembresiaNoEncontradaException")
    void operacionSobreMembresiaInexistenteLanzaExcepcion() {
        when(repository.buscarVencidasPendientes(any(LocalDate.class))).thenReturn(Collections.emptyList());
        when(repository.buscarPorId(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.suspender(999L))
                .isInstanceOf(MembresiaNoEncontradaException.class);
    }
}
