// ============================================
// SERVICIOS SUPABASE - YLIO
// Mapeo de campos App → BD según Estructura_BD_YLIO.xlsx
// ============================================

const SUPABASE_URL = 'https://edhyacacepvfvjuwfzrp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkaHlhY2FjZXB2ZnZqdXdmenJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNzU4MTUsImV4cCI6MjA4Mzk1MTgxNX0.9M1Cs9OZi5FIzSKuzw5nT3H2Dq8PCoG1g2Xy6rlhQm0';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// ============================================
// FUNCIÓN BASE PARA PETICIONES
// ============================================
const supabaseFetch = async (endpoint, options = {}) => {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const method = options.method || 'GET';
  
  console.log(`📡 Supabase [${method}] ${endpoint}`);
  
  try {
    const fetchOptions = {
      method,
      headers: { ...headers, ...options.headers },
    };
    
    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }
    
    const response = await fetch(url, fetchOptions);
    const text = await response.text();
    
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    
    if (!response.ok) {
      console.error('❌ Error Supabase:', response.status, data);
      return { 
        success: false, 
        error: typeof data === 'object' ? (data.message || data.hint || JSON.stringify(data)) : data,
        status: response.status 
      };
    }
    
    console.log('✅ OK');
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Error de red:', error.message);
    return { success: false, error: error.message };
  }
};

// ============================================
// TEST DE CONEXIÓN (se ejecuta al cargar)
// ============================================
export const testConexion = async () => {
  console.log('🔄 Probando conexión a Supabase...');
  const result = await supabaseFetch('ofertas?select=oferta_id&limit=1');
  
  if (result.success) {
    console.log('✅ CONEXIÓN A SUPABASE OK');
    return { success: true };
  } else {
    console.error('❌ CONEXIÓN FALLIDA:', result.error);
    return result;
  }
};

// Ejecutar test al cargar el módulo
testConexion();

// ============================================
// MAPEO DE CAMPOS: App (datosOportunidad) → BD (ofertas)
// Basado en Estructura_BD_YLIO.xlsx
// ============================================
const mapearAppABD = (datos) => {
  // Helpers para conversión segura
  const toFloat = (v) => {
    if (v === null || v === undefined || v === '') return null;
    const num = parseFloat(v);
    return isNaN(num) ? null : num;
  };
  
  const toInt = (v) => {
    if (v === null || v === undefined || v === '') return null;
    const num = parseInt(v);
    return isNaN(num) ? null : num;
  };
  
  const toStr = (v) => {
    if (v === null || v === undefined || v === '') return null;
    return String(v);
  };

  return {
    // ========== PASO 1: PROYECTO ==========
    // Identificación
    oferta_id: toStr(datos.id_oferta),
    oferta_denominacion: toStr(datos.denominacion_oferta),
    oferta_version: toInt(datos.version) || 1,
    oferta_descripcion_version: toStr(datos.descripcion_version),
    oferta_fecha_solicitud: datos.fecha_solicitud || null,
    oferta_fecha_inicio: datos.fecha_inicio || null,
    estado_oferta: toStr(datos.estado_oferta) || 'oferta',
    
    // Archivos
    archivo_sips: toStr(datos.archivo_sips),
    archivo_consumo: toStr(datos.archivo_consumo),
    fuente_datos_consumo: toStr(datos.fuente_datos_consumo),
    
    // Cliente (App usa cliente_nombre, BD usa cliente_razon_social)
    cliente_denominacion: toStr(datos.cliente_denominacion),
    cliente_razon_social: toStr(datos.cliente_nombre),
    cliente_cif: toStr(datos.cliente_cif),
    cliente_cnae: toStr(datos.cnae),
    
    // Ubicación (App usa ubicacion_*, BD usa proyecto_*)
    proyecto_direccion: toStr(datos.ubicacion_direccion),
    proyecto_cp: toStr(datos.ubicacion_cp),
    proyecto_municipio: toStr(datos.ubicacion_municipio),
    proyecto_provincia: toStr(datos.ubicacion_provincia),
    proyecto_comunidad: toStr(datos.ubicacion_comunidad),
    proyecto_latitud: toFloat(datos.ubicacion_latitud),
    proyecto_longitud: toFloat(datos.ubicacion_longitud),
    proyecto_coordenada_x: toInt(datos.coordenada_x),
    proyecto_coordenada_y: toInt(datos.coordenada_y),
    proyecto_huso: toInt(datos.huso),
    proyecto_referencia_catastral: toStr(datos.referencia_catastral),
    
    // Datos SIPS
    sips_cups: toStr(datos.sips_cups),
    sips_distribuidora: toStr(datos.sips_distribuidora),
    sips_tarifa: toStr(datos.sips_tarifa),
    sips_tension: toStr(datos.sips_tension),
    sips_potencia_max_bie: toFloat(datos.sips_potencia_max_bie),
    sips_derechos_extension: toFloat(datos.sips_derechos_extension),
    sips_derechos_acceso: toFloat(datos.sips_derechos_acceso),
    sips_potencia_p1: toFloat(datos.sips_potencia_p1),
    sips_potencia_p2: toFloat(datos.sips_potencia_p2),
    sips_potencia_p3: toFloat(datos.sips_potencia_p3),
    sips_potencia_p4: toFloat(datos.sips_potencia_p4),
    sips_potencia_p5: toFloat(datos.sips_potencia_p5),
    sips_potencia_p6: toFloat(datos.sips_potencia_p6),
    sips_consumo_anual: toInt(datos.sips_consumo_anual),
    sips_consumo_p1: toFloat(datos.sips_consumo_p1),
    sips_consumo_p2: toFloat(datos.sips_consumo_p2),
    sips_consumo_p3: toFloat(datos.sips_consumo_p3),
    sips_consumo_p4: toFloat(datos.sips_consumo_p4),
    sips_consumo_p5: toFloat(datos.sips_consumo_p5),
    sips_consumo_p6: toFloat(datos.sips_consumo_p6),
    
    // ========== PASO 2: TARIFA ==========
    cups: toStr(datos.cups),
    tarifa_acceso: toStr(datos.tarifa_acceso),
    distribuidora: toStr(datos.distribuidora),
    comercializadora: toStr(datos.comercializadora),
    tension: toStr(datos.tension),
    potencia_max_bie: toFloat(datos.potencia_max_bie),
    derechos_extension: toFloat(datos.derechos_extension),
    derechos_acceso: toFloat(datos.derechos_acceso),
    
    // Potencias
    potencia_p1: toFloat(datos.potencia_p1),
    potencia_p2: toFloat(datos.potencia_p2),
    potencia_p3: toFloat(datos.potencia_p3),
    potencia_p4: toFloat(datos.potencia_p4),
    potencia_p5: toFloat(datos.potencia_p5),
    potencia_p6: toFloat(datos.potencia_p6),
    
    // Precios Potencia
    tipo_precios_potencia: toStr(datos.tipo_precios_potencia),
    precio_potencia_p1: toFloat(datos.precio_potencia_p1),
    precio_potencia_p2: toFloat(datos.precio_potencia_p2),
    precio_potencia_p3: toFloat(datos.precio_potencia_p3),
    precio_potencia_p4: toFloat(datos.precio_potencia_p4),
    precio_potencia_p5: toFloat(datos.precio_potencia_p5),
    precio_potencia_p6: toFloat(datos.precio_potencia_p6),
    
    // Contrato y Energía
    tipo_contrato_elec: toStr(datos.tipo_contrato),
    tipo_precios_energia: toStr(datos.tipo_precios_energia),
    precio_energia_p1: toFloat(datos.precio_energia_p1),
    precio_energia_p2: toFloat(datos.precio_energia_p2),
    precio_energia_p3: toFloat(datos.precio_energia_p3),
    precio_energia_p4: toFloat(datos.precio_energia_p4),
    precio_energia_p5: toFloat(datos.precio_energia_p5),
    precio_energia_p6: toFloat(datos.precio_energia_p6),
    
    // Otros Costes
    bonificacion_iee: toInt(datos.bonificacion_iee),
    coste_alquiler_contador: toFloat(datos.coste_alquiler_contador),
    
    // ========== PASO 3: SITUACIÓN ACTUAL ==========
    fv_existente: toStr(datos.fv_existente),
    fv_existente_modalidad_autoconsumo: toStr(datos.modalidad_autoconsumo),
    fv_existente_potencia_max_vertido: toFloat(datos.potencia_max_vertido),
    fv_existente_potencia_pico: toFloat(datos.fv_potencia_pico_manual),
    fv_existente_potencia_nominal: toFloat(datos.fv_potencia_nominal_manual),
    fv_existente_archivo_produccion_real: toStr(datos.archivo_produccion_real),
    fv_existente_produccion_real_estadisticas: datos.produccion_real_estadisticas || null,
    fv_existente_archivo_produccion_simulado: toStr(datos.archivo_produccion_simulado),
    fv_existente_produccion_simulada_estadisticas: datos.produccion_simulada_estadisticas || null,
    fv_existente_produccion_anual_real: toFloat(datos.fv_produccion_anual),
    
    // Almacenamiento
    almac_existente: toStr(datos.almacenamiento_existente),
    
    // ========== PASO 4: PROPUESTA ==========
    oferta_fv: toStr(datos.prop_incluir_fv),
    oferta_bateria: toStr(datos.prop_incluir_bateria),
    base_oferta_potencia_pico: toFloat(datos.prop_potencia_pico_manual),
    base_oferta_potencia_nominal: toFloat(datos.prop_potencia_nominal_manual),
    
    // Batería Propuesta
    base_oferta_bateria_marca: toStr(datos.prop_bateria_marca),
    base_oferta_bateria_modelo: toStr(datos.prop_bateria_modelo),
    base_oferta_bateria_capacidad_unit: toFloat(datos.prop_bateria_capacidad),
    base_oferta_bateria_potencia_unit: toFloat(datos.prop_bateria_potencia),
  };
};

// ============================================
// OBTENER SIGUIENTE ID DE OFERTA
// ============================================
export const obtenerSiguienteOfertaId = async () => {
  const result = await supabaseFetch('ofertas?select=oferta_id&order=oferta_id.desc&limit=1');
  
  let nuevoId = '10001';
  
  if (result.success && result.data && result.data.length > 0) {
    const ultimoId = result.data[0].oferta_id;
    // Extraer número del ID
    const match = ultimoId.match(/(\d+)$/);
    if (match) {
      nuevoId = String(parseInt(match[1]) + 1);
    }
  }
  
  console.log('🆔 Nuevo ID de oferta:', nuevoId);
  return { success: true, id: nuevoId };
};

// ============================================
// GUARDAR OFERTA (crear o actualizar)
// ============================================
export const guardarOferta = async (ofertaId, datos) => {
  console.log('💾 Guardando oferta:', ofertaId);
  
  // Mapear datos de la app a la estructura de BD
  const ofertaData = mapearAppABD({ ...datos, id_oferta: ofertaId });
  
  // Verificar si ya existe
  const checkResult = await supabaseFetch(`ofertas?oferta_id=eq.${ofertaId}&select=id`);
  
  let result;
  if (checkResult.success && checkResult.data && checkResult.data.length > 0) {
    // Actualizar existente
    console.log('📝 Actualizando oferta existente...');
    result = await supabaseFetch(`ofertas?oferta_id=eq.${ofertaId}`, {
      method: 'PATCH',
      body: ofertaData
    });
  } else {
    // Crear nueva
    console.log('➕ Creando nueva oferta...');
    result = await supabaseFetch('ofertas', {
      method: 'POST',
      body: ofertaData
    });
  }
  
  // También guardar las tablas relacionadas si existen datos
  if (result.success) {
    // Inversores existentes
    if (datos.inversores_existentes && datos.inversores_existentes.length > 0) {
      await guardarInversoresExistentes(ofertaId, datos.inversores_existentes);
    }
    
    // Módulos existentes
    if (datos.modulos_existentes && datos.modulos_existentes.length > 0) {
      await guardarModulosExistentes(ofertaId, datos.modulos_existentes);
    }
    
    // Inversores propuesta
    if (datos.prop_inversores && datos.prop_inversores.length > 0) {
      await guardarPropuestaInversores(ofertaId, datos.prop_inversores);
    }
    
    // Módulos propuesta
    if (datos.prop_modulos && datos.prop_modulos.length > 0) {
      await guardarPropuestaModulos(ofertaId, datos.prop_modulos);
    }
    
    // Áreas propuesta
    if (datos.prop_areas_produccion && datos.prop_areas_produccion.length > 0) {
      await guardarPropuestaAreas(ofertaId, datos.prop_areas_produccion);
    }
  }
  
  return result;
};

// ============================================
// CARGAR OFERTA
// ============================================
export const cargarOferta = async (ofertaId) => {
  console.log('📂 Cargando oferta:', ofertaId);
  
  const result = await supabaseFetch(`ofertas?oferta_id=eq.${ofertaId}`);
  
  if (result.success && result.data && result.data[0]) {
    return { success: true, data: result.data[0] };
  }
  return { success: false, error: 'Oferta no encontrada' };
};

// ============================================
// GUARDAR DATOS SIPS (actualiza la oferta principal)
// ============================================
export const guardarDatosSIPS = async (ofertaId, datos) => {
  console.log('💾 Guardando SIPS para oferta:', ofertaId);
  return guardarOferta(ofertaId, datos);
};

// ============================================
// GUARDAR CONSUMOS HORARIOS (8760 registros)
// ============================================
export const guardarConsumosProcesados = async (ofertaId, consumos) => {
  console.log('💾 Guardando consumos:', consumos.length, 'registros para oferta:', ofertaId);
  
  // Primero eliminar consumos existentes
  await supabaseFetch(`ofertas_consumos_horarios?oferta_id=eq.${ofertaId}`, { 
    method: 'DELETE' 
  });
  
  // Insertar en batches de 500 para evitar timeouts
  const batchSize = 500;
  let insertados = 0;
  
  for (let i = 0; i < consumos.length; i += batchSize) {
    const batch = consumos.slice(i, i + batchSize).map(c => ({
      oferta_id: ofertaId,
      fecha: c.fecha,
      hora: c.hora,
      consumo: c.consumo
    }));
    
    const result = await supabaseFetch('ofertas_consumos_horarios', {
      method: 'POST',
      body: batch
    });
    
    if (!result.success) {
      console.error('❌ Error insertando batch:', result.error);
      return { success: false, error: result.error, count: insertados };
    }
    
    insertados += batch.length;
    console.log(`📊 Progreso: ${insertados}/${consumos.length}`);
  }
  
  console.log('✅ Consumos guardados:', insertados);
  return { success: true, count: insertados };
};

// Alias para compatibilidad
export const guardarConsumosBrutos = guardarConsumosProcesados;

// ============================================
// CARGAR CONSUMOS HORARIOS
// ============================================
export const cargarConsumosBrutos = async (ofertaId) => {
  console.log('📂 Cargando consumos para oferta:', ofertaId);
  
  const result = await supabaseFetch(
    `ofertas_consumos_horarios?oferta_id=eq.${ofertaId}&order=fecha,hora`
  );
  
  if (result.success) {
    const consumos = (result.data || []).map(c => ({
      fecha: c.fecha,
      hora: c.hora,
      consumo: parseFloat(c.consumo)
    }));
    console.log('✅ Consumos cargados:', consumos.length);
    return { success: true, data: consumos };
  }
  
  return result;
};

// ============================================
// FUNCIONES PARA TABLAS RELACIONADAS
// ============================================

// Inversores Existentes (Paso 3)
const guardarInversoresExistentes = async (ofertaId, inversores) => {
  // Eliminar existentes
  await supabaseFetch(`ofertas_inversores_existentes?oferta_id=eq.${ofertaId}`, { 
    method: 'DELETE' 
  });
  
  // Filtrar inversores con datos
  const inversoresConDatos = inversores.filter(inv => inv.marca || inv.modelo || inv.potencia);
  if (inversoresConDatos.length === 0) return { success: true };
  
  const datos = inversoresConDatos.map((inv, idx) => ({
    oferta_id: ofertaId,
    inversor_idx: idx + 1,
    marca: inv.marca || null,
    modelo: inv.modelo || null,
    potencia: inv.potencia ? parseFloat(inv.potencia) : null,
    cantidad: inv.cantidad ? parseInt(inv.cantidad) : 1
  }));
  
  return supabaseFetch('ofertas_inversores_existentes', {
    method: 'POST',
    body: datos
  });
};

// Módulos Existentes (Paso 3)
const guardarModulosExistentes = async (ofertaId, modulos) => {
  await supabaseFetch(`ofertas_modulos_existentes?oferta_id=eq.${ofertaId}`, { 
    method: 'DELETE' 
  });
  
  const modulosConDatos = modulos.filter(mod => mod.marca || mod.modelo || mod.potencia);
  if (modulosConDatos.length === 0) return { success: true };
  
  const datos = modulosConDatos.map((mod, idx) => ({
    oferta_id: ofertaId,
    modulo_idx: idx + 1,
    marca: mod.marca || null,
    modelo: mod.modelo || null,
    potencia: mod.potencia ? parseFloat(mod.potencia) : null,
    cantidad: mod.cantidad ? parseInt(mod.cantidad) : 1
  }));
  
  return supabaseFetch('ofertas_modulos_existentes', {
    method: 'POST',
    body: datos
  });
};

// Inversores Propuesta (Paso 4)
const guardarPropuestaInversores = async (ofertaId, inversores) => {
  await supabaseFetch(`ofertas_prop_inversores?oferta_id=eq.${ofertaId}`, { 
    method: 'DELETE' 
  });
  
  const inversoresConDatos = inversores.filter(inv => inv.marca || inv.modelo || inv.potencia);
  if (inversoresConDatos.length === 0) return { success: true };
  
  const datos = inversoresConDatos.map((inv, idx) => ({
    oferta_id: ofertaId,
    inversor_idx: idx + 1,
    marca: inv.marca || null,
    modelo: inv.modelo || null,
    potencia: inv.potencia ? parseFloat(inv.potencia) : null,
    cantidad: inv.cantidad ? parseInt(inv.cantidad) : 1
  }));
  
  return supabaseFetch('ofertas_prop_inversores', {
    method: 'POST',
    body: datos
  });
};

// Módulos Propuesta (Paso 4)
const guardarPropuestaModulos = async (ofertaId, modulos) => {
  await supabaseFetch(`ofertas_prop_modulos?oferta_id=eq.${ofertaId}`, { 
    method: 'DELETE' 
  });
  
  const modulosConDatos = modulos.filter(mod => mod.marca || mod.modelo || mod.potencia);
  if (modulosConDatos.length === 0) return { success: true };
  
  const datos = modulosConDatos.map((mod, idx) => ({
    oferta_id: ofertaId,
    modulo_idx: idx + 1,
    marca: mod.marca || null,
    modelo: mod.modelo || null,
    potencia: mod.potencia ? parseInt(mod.potencia) : null,
    cantidad: mod.cantidad ? parseInt(mod.cantidad) : 1
  }));
  
  return supabaseFetch('ofertas_prop_modulos', {
    method: 'POST',
    body: datos
  });
};

// Áreas Propuesta (Paso 4)
const guardarPropuestaAreas = async (ofertaId, areas) => {
  await supabaseFetch(`ofertas_prop_areas?oferta_id=eq.${ofertaId}`, { 
    method: 'DELETE' 
  });
  
  const areasConDatos = areas.filter(area => area.nombre || area.orientacion || area.inclinacion);
  if (areasConDatos.length === 0) return { success: true };
  
  const datos = areasConDatos.map((area, idx) => ({
    oferta_id: ofertaId,
    area_idx: idx + 1,
    nombre: area.nombre || `Área ${idx + 1}`,
    orientacion: area.orientacion ? parseFloat(area.orientacion) : null,
    inclinacion: area.inclinacion ? parseFloat(area.inclinacion) : null,
    tipo_modulo_idx: area.tipo_modulo_idx ? parseInt(area.tipo_modulo_idx) : null,
    num_modulos: area.num_modulos ? parseInt(area.num_modulos) : null,
    potencia_pico: area.kwp ? parseFloat(area.kwp) : null,
    estructuras: area.tipo_estructura || null,
    produccion_kwh: area.kwh_ano ? parseFloat(area.kwh_ano) : null
  }));
  
  return supabaseFetch('ofertas_prop_areas', {
    method: 'POST',
    body: datos
  });
};
