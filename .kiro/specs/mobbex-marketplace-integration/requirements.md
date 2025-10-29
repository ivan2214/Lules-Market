# Documento de Requerimientos

## Introducción

Esta funcionalidad transforma Lules Market de un modelo basado en suscripciones a un modelo de marketplace basado en comisiones utilizando las capacidades multivendor de Mobbex Argentina. El sistema permitirá que los comercios conecten sus propias cuentas de Mobbex, configuren sus métodos de pago y procesen transacciones directamente mientras la plataforma cobra una comisión en cada venta.

## Glosario

- **Plataforma Lules Market**: La plataforma marketplace intermediaria que conecta comercios con clientes
- **Cuenta de Comercio**: Cuentas individuales de comerciantes registradas en Lules Market
- **Cuenta Merchant de Mobbex**: Cuenta propia de procesamiento de pagos Mobbex del comercio
- **Sistema de Comisiones**: Modelo de ingresos de la plataforma basado en porcentajes de transacciones
- **División de Pagos**: División automática del pago entre el comercio y la comisión de la plataforma
- **Manejador de Webhooks**: Componente del sistema que procesa notificaciones de pago de Mobbex
- **Vinculación de Cuenta**: Proceso de conectar la cuenta Mobbex del comercio a la plataforma
- **Procesamiento de Transacciones**: Flujo completo de pago desde el cliente al comercio con deducción de comisión

## Requerimientos

### Requerimiento 1

**Historia de Usuario:** Como dueño de comercio, quiero conectar mi propia cuenta de Mobbex a la plataforma, para poder recibir pagos directamente mientras la plataforma toma una comisión.

#### Criterios de Aceptación

1. CUANDO un comercio accede a la sección de configuración de pagos, LA Plataforma Lules Market DEBERÁ mostrar la interfaz de conexión de cuenta Mobbex
2. CUANDO un comercio inicia la vinculación de cuenta Mobbex, LA Plataforma Lules Market DEBERÁ redirigir al flujo de autorización OAuth de Mobbex
3. CUANDO la autorización de Mobbex se completa, LA Plataforma Lules Market DEBERÁ almacenar las credenciales Mobbex del comercio de forma segura
4. CUANDO la vinculación de cuenta falla, LA Plataforma Lules Market DEBERÁ mostrar mensajes de error claros y opciones de reintento
5. DONDE un comercio tiene múltiples cuentas Mobbex, LA Plataforma Lules Market DEBERÁ permitir la selección de la cuenta principal

### Requerimiento 2

**Historia de Usuario:** Como dueño de comercio, quiero configurar mis métodos de pago y opciones de cuotas a través de mi cuenta Mobbex, para que los clientes puedan pagar usando mis configuraciones preferidas.

#### Criterios de Aceptación

1. CUANDO un comercio accede a configuraciones de pago, LA Plataforma Lules Market DEBERÁ recuperar los métodos de pago disponibles de su cuenta Mobbex
2. CUANDO un comercio modifica configuraciones de pago, LA Plataforma Lules Market DEBERÁ sincronizar los cambios con su cuenta Mobbex
3. MIENTRAS un comercio configura planes de cuotas, LA Plataforma Lules Market DEBERÁ validar las opciones contra las capacidades de Mobbex
4. CUANDO la configuración de método de pago se guarda, LA Plataforma Lules Market DEBERÁ confirmar que las configuraciones están activas para transacciones de clientes
5. SI la configuración de pago contiene configuraciones inválidas, ENTONCES LA Plataforma Lules Market DEBERÁ prevenir la activación y mostrar errores de validación

### Requerimiento 3

**Historia de Usuario:** Como cliente, quiero comprar productos usando los métodos de pago configurados del comercio, para poder completar transacciones sin problemas.

#### Criterios de Aceptación

1. CUANDO un cliente inicia una compra, LA Plataforma Lules Market DEBERÁ crear una solicitud de pago usando la configuración Mobbex del comercio
2. CUANDO el procesamiento de pago comienza, LA Plataforma Lules Market DEBERÁ calcular automáticamente e incluir la comisión de la plataforma en la división de transacción
3. MIENTRAS el pago se está procesando, LA Plataforma Lules Market DEBERÁ mostrar actualizaciones de estado en tiempo real al cliente
4. CUANDO el pago se completa exitosamente, LA Plataforma Lules Market DEBERÁ notificar tanto al cliente como al comercio de la transacción
5. SI el pago falla, ENTONCES LA Plataforma Lules Market DEBERÁ proporcionar información de error clara y opciones de reintento

### Requerimiento 4

**Historia de Usuario:** Como administrador de la plataforma, quiero cobrar automáticamente comisiones de cada transacción, para que la plataforma genere ingresos sin intervención manual.

#### Criterios de Aceptación

1. CUANDO una transacción es procesada, LA Plataforma Lules Market DEBERÁ deducir automáticamente el porcentaje de comisión configurado
2. CUANDO la comisión es calculada, LA Plataforma Lules Market DEBERÁ aplicar diferentes tarifas basadas en el nivel de suscripción del comercio
3. MIENTRAS procesa divisiones de pago, LA Plataforma Lules Market DEBERÁ asegurar distribución precisa entre comercio y plataforma
4. CUANDO la cobranza de comisión falla, LA Plataforma Lules Market DEBERÁ registrar el error e intentar reintento con backoff exponencial
5. DONDE las tarifas de comisión cambian, LA Plataforma Lules Market DEBERÁ aplicar nuevas tarifas solo a transacciones futuras

### Requerimiento 5

**Historia de Usuario:** Como dueño de comercio, quiero recibir notificaciones en tiempo real sobre transacciones y deducciones de comisión, para poder rastrear mis ganancias con precisión.

#### Criterios de Aceptación

1. CUANDO una transacción se completa, LA Plataforma Lules Market DEBERÁ enviar notificación inmediata al comercio
2. CUANDO la comisión es deducida, LA Plataforma Lules Market DEBERÁ proporcionar desglose detallado del cálculo
3. MIENTRAS las transacciones se están procesando, LA Plataforma Lules Market DEBERÁ actualizar el dashboard del comercio con estado en tiempo real
4. CUANDO las notificaciones webhook son recibidas de Mobbex, LA Plataforma Lules Market DEBERÁ procesar y reenviar información relevante a los comercios
5. SI la entrega de notificación falla, ENTONCES LA Plataforma Lules Market DEBERÁ reintentar la entrega y mantener historial de notificaciones

### Requerimiento 6

**Historia de Usuario:** Como administrador de la plataforma, quiero monitorear todas las transacciones del marketplace y cobranzas de comisión, para poder asegurar la integridad del sistema y resolver disputas.

#### Criterios de Aceptación

1. CUANDO ocurren transacciones, LA Plataforma Lules Market DEBERÁ registrar rastro de auditoría completo incluyendo cálculos de comisión
2. CUANDO surgen disputas, LA Plataforma Lules Market DEBERÁ proporcionar acceso a registros detallados de transacciones
3. MIENTRAS monitorea la salud del sistema, LA Plataforma Lules Market DEBERÁ rastrear tasas de éxito de cobranza de comisión
4. CUANDO se detecta actividad sospechosa, LA Plataforma Lules Market DEBERÁ marcar transacciones para revisión manual
5. DONDE se necesita reconciliación de transacciones, LA Plataforma Lules Market DEBERÁ proporcionar herramientas de reporte comprensivas

### Requerimiento 7

**Historia de Usuario:** Como dueño de comercio, quiero gestionar las configuraciones de mi cuenta Mobbex directamente desde la plataforma, para no tener que cambiar entre múltiples interfaces.

#### Criterios de Aceptación

1. CUANDO un comercio accede a gestión de cuenta, LA Plataforma Lules Market DEBERÁ mostrar el estado actual de configuración Mobbex
2. CUANDO el comercio actualiza configuraciones de pago, LA Plataforma Lules Market DEBERÁ sincronizar cambios con la API de Mobbex
3. MIENTRAS gestiona configuraciones de cuenta, LA Plataforma Lules Market DEBERÁ validar todos los cambios contra los requerimientos de Mobbex
4. CUANDO se solicita desconexión de cuenta, LA Plataforma Lules Market DEBERÁ remover credenciales de forma segura y deshabilitar procesamiento de pagos
5. SI la API de Mobbex no está disponible, ENTONCES LA Plataforma Lules Market DEBERÁ encolar cambios para sincronización posterior