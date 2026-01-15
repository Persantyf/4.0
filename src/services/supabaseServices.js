// ============================================
// SERVICIOS SUPABASE - YLIO v4.0
// Mapeo de campos basado en Estructura_BD_YLIO.xlsx
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
  
  console.log(`📡 [${method}] ${endpoint}`);
  
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
      console.error('❌ Error:', response.status, data);
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
// TEST DE CONEXIÓN
// ============================================
export const testConexion = async () => {
  console.log('🔄 Probando conexión a Supabase...');
  const result = await supabaseFetch('ofertas?select=oferta_id&limit=1');
  
  if (result.success) {
    console.log('✅ CONEXIÓN OK');
    return { success: true };
  } else {
    console.error('❌ CONEXIÓN FALLIDA:', result.error);
    return result;
  }
};

// Test al cargar
testConexion();

// ============================================
// MAPEO DE CAMPOS: App → Base de Datos
// Basado en Estructura_BD_YLIO.xlsx
// ============================================
const mapearDatosOferta = (datos) => {
  // Helper para parsear números
  const toFloat = (v) => v ? parseFloat(v) : null;
  const toInt = (v) => v ? parseInt(v) : null;
  
  return {
    // Identificación del Proyecto (Paso 1)
    oferta_id: datos.id_oferta || null,
    oferta_denominacion: datos.denominacion_oferta || null,
    oferta_version: toInt(datos.version) || 1,
    oferta_descripcion_version: datos.descripcion_version || null,
    oferta_fecha_solicitud: datos.fecha_solicitud || null,
    oferta_fecha_inicio: datos.fecha_inicio || null,
    oferta_estado: datos.estado_oferta || 'oferta',
    
    // Archivos (Paso 1)
    archivo_sips: datos.archivo_sips || null,
    archivo_consumo: datos.archivo_consumo || null,
    fuente_datos_consumo: datos.fuente_datos_consumo || null,
    
    // Datos del Cliente (Paso 1)
    cliente_denominacion: datos.cliente_denominacion || null,
    cliente_razon_social: datos.cliente_nombre || null,  // En app es cliente_nombre
    cliente_cif: datos.cliente_cif || null,
    cliente_cnae: datos.cnae || null,
    
    // Ubicación del Proyecto (Paso 1)
    proyecto_direccion: datos.ubicacion_direccion || null,
    proyecto_cp: datos.ubicacion_cp || null,
    proyecto_municipio: datos.ubicacion_municipio || null,
    proyecto_provincia: datos.ubicacion_provincia || null,
    proyecto_comunidad: datos.ubicacion_comunidad || null,
    proyecto_latitud: toFloat(datos.ubicacion_latitud),
    proyecto_longitud: toFloat(datos.ubicacion_longitud),
    proyecto_coordenada_x: toInt(datos.coordenada_x),
    proyecto_coordenada_y: toInt(datos.coordenada_y),
    proyecto_huso: toInt(datos.huso),
    proyecto_referencia_catastral: datos.referencia_catastral || null,
    
    // Datos SIPS (Paso 1)
    sips_cups: datos.sips_cups || null,
    sips_distribuidora: datos.sips_distribuidora || null,
    sips_comercializadora: datos.sips_comercializadora || null,
    sips_tarifa: datos.sips_tarifa || null,
    sips_tension: datos.sips_tension || null,
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
    
    // Tarifa (Paso 2)
    cups: datos.cups || null,
    tarifa_acceso: datos.tarifa_acceso || null,
    distribuidora: datos.distribuidora || null,
    comercializadora: datos.comercializadora || null,
    tension: datos.tension || null,
    potencia_max_bie: toFloat(datos.potencia_max_bie),
    derechos_extension: toFloat(datos.derechos_extension),
    derechos_acceso: toFloat(datos.derechos_acceso),
    potencia_p1: toFloat(datos.potencia_p1),
    potencia_p2: toFloat(datos.potencia_p2),
    potencia_p3: toFloat(datos.potencia_p3),
    potencia_p4: toFloat(datos.potencia_p4),
    potencia_p5: toFloat(datos.potencia_p5),
    potencia_p6: toFloat(datos.potencia_p6),
    
    // Precios Potencia (Paso 2)
    tipo_precios_potencia: datos.tipo_precios_potencia || null,
    precio_potencia_p1: toFloat(datos.precio_potencia_p1),
    precio_potencia_p2: toFloat(datos.precio_potencia_p2),
    precio_potencia_p3: toFloat(datos.precio_potencia_p3),
    precio_potencia_p4: toFloat(datos.precio_potencia_p4),
    precio_potencia_p5: toFloat(datos.precio_potencia_p5),
    precio_potencia_p6: toFloat(datos.precio_potencia_p6),
    
    // Precios Energía (Paso 2)
    tipo_contrato_elec: datos.tipo_contrato || null,
    tipo_precios_energia: datos.tipo_precios_energia || null,
    precio_energia_p1: toFloat(datos.precio_energia_p1),
    precio_energia_p2: toFloat(datos.precio_energia_p2),
    precio_energia_p3: toFloat(datos.precio_energia_p3),
    precio_energia_p4: toFloat(datos.precio_energia_p4),
    precio_energia_p5: toFloat(datos.precio_energia_p5),
    precio_energia_p6: toFloat(datos.precio_energia_p6),
    
    // Otros costes (Paso 2)
    bonificacion_iee: toInt(datos.bonificacion_iee),
    coste_alquiler_contador: toFloat(datos.coste_alquiler_contador),
    
    // Situación FV Existente (Paso 3)
    fv_existente: datos.fv_existente || null,
    fv_existente_modalidad_autoconsumo: datos.modalidad_autoconsumo || null,
    fv_existente_potencia_max_vertido: toFloat(datos.potencia_max_vertido),
    fv_existente_potencia_pico: toFloat(datos.fv_potencia_pico_manual),
    fv_existente_potencia_nominal: toFloat(datos.fv_potencia_nominal_manual),
    fv_existente_archivo_produccion_real: datos.archivo_produccion_real || null,
    fv_existente_produccion_real_estadisticas: datos.produccion_real_estadisticas || null,
    fv_existente_archivo_produccion_simulado: datos.archivo_produccion_simulado || null,
    fv_existente_produccion_simulada_estadisticas: datos.produccion_simulada_estadisticas || null,
    fv_existente_produccion_anual_real: toFloat(datos.fv_produccion_anual),
    
    // Almacenamiento Existente (Paso 3)
    almac_existente: datos.almacenamiento_existente || null,
    
    // Propuesta (Paso 4)
    oferta_fv: datos.prop_incluir_fv || null,
    oferta_bateria: datos.prop_incluir_bateria || null,
    base_oferta_potencia_pico: toFloat(datos.prop_potencia_pico_manual),
    base_oferta_potencia_nominal: toFloat(datos.prop_potencia_nominal_manual),
    base_oferta_prod_fv_fuente: datos.prop_fuente_produccion || null,
    
    // Batería Propuesta (Paso 4)
    base_oferta_bateria_marca: datos.prop_bateria_marca || null,
    base_oferta_bateria_modelo: datos.prop_bateria_modelo || null,
    base_oferta_bateria_capacidad_unit: toFloat(datos.prop_bateria_capacidad),
    base_oferta_bateria_potencia_unit: toFloat(datos.prop_bateria_potencia),
  };
};

// ============================================
// OBTENER SIGUIENTE ID
// ============================================
export const obtenerSiguienteOfertaId = async () => {
  const result = await supabaseFetch('ofertas?select=oferta_id&order=oferta_id.desc&limit=1');
  
  let nuevoId = '10001';
  
  if (result.success && result.data && result.data.length > 0) {
    const ultimoId = result.data[0].oferta_id;
    const match = ultimoId.match(/(\d+)$/);
    if (match) {
      nuevoId = String(parseInt(match[1]) + 1);
    }
  }
  
  console.log('🆔 Nuevo ID:', nuevoId);
  return { success: true, id: nuevoId };
};

// ============================================
// GUARDAR OFERTA
// ============================================
export const guardarOferta = async (ofertaId, datos) => {
  console.log('💾 Guardando oferta:', ofertaId);
  
  // Mapear datos de la app a la BD
  const ofertaData = mapearDatosOferta({ ...datos, id_oferta: ofertaId });
  
  // Verificar si ya existe
  const checkResult = await supabaseFetch(`ofertas?oferta_id=eq.${ofertaId}&select=id`);
  
  if (checkResult.success && checkResult.data && checkResult.data.length > 0) {
    console.log('📝 Actualizando oferta existente...');
    return await supabaseFetch(`ofertas?oferta_id=eq.${ofertaId}`, {
      method: 'PATCH',
      body: ofertaData
    });
  } else {
    console.log('➕ Creando nueva oferta...');
    return await supabaseFetch('ofertas', {
      method: 'POST',
      body: ofertaData
    });
  }
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
// GUARDAR CONSUMOS HORARIOS
// ============================================
export const guardarConsumosProcesados = async (ofertaId, consumos) => {
  console.log('💾 Guardando consumos:', consumos.length, 'registros');
  
  // Eliminar existentes
  await supabaseFetch(`ofertas_consumos_horarios?oferta_id=eq.${ofertaId}`, { method: 'DELETE' });
  
  // Insertar en batches de 500
  const batchSize = 500;
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
      return { success: false, error: result.error, count: i };
    }
    
    console.log(`📊 ${Math.min(i + batchSize, consumos.length)}/${consumos.length}`);
  }
  
  return { success: true, count: consumos.length };
};

// ============================================
// CARGAR CONSUMOS HORARIOS
// ============================================
export const cargarConsumosBrutos = async (ofertaId) => {
  const result = await supabaseFetch(`ofertas_consumos_horarios?oferta_id=eq.${ofertaId}&order=fecha,hora`);
  
  if (result.success) {
    return { 
      success: true, 
      data: (result.data || []).map(c => ({
        fecha: c.fecha,
        hora: c.hora,
        consumo: parseFloat(c.consumo)
      }))
    };
  }
  return result;
};

// Alias para compatibilidad
export const guardarConsumosBrutos = guardarConsumosProcesados;

// ============================================
// GUARDAR DATOS SIPS (actualiza la oferta)
// ============================================
export const guardarDatosSIPS = async (ofertaId, datos) => {
  console.log('💾 Guardando SIPS para:', ofertaId);
  return guardarOferta(ofertaId, datos);
};

// ============================================
// GUARDAR INVERSORES/MÓDULOS EXISTENTES
// ============================================
export const guardarInversoresExistentes = async (ofertaId, inversores) => {
  await supabaseFetch(`ofertas_inversores_existentes?oferta_id=eq.${ofertaId}`, { method: 'DELETE' });
  
  if (!inversores || inversores.length === 0) return { success: true };
  
  const datos = inversores.map((inv, idx) => ({
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

export const guardarModulosExistentes = async (ofertaId, modulos) => {
  await supabaseFetch(`ofertas_modulos_existentes?oferta_id=eq.${ofertaId}`, { method: 'DELETE' });
  
  if (!modulos || modulos.length === 0) return { success: true };
  
  const datos = modulos.map((mod, idx) => ({
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

// ============================================
// GUARDAR PROPUESTA (Paso 4)
// ============================================
export const guardarPropuestaInversores = async (ofertaId, inversores) => {
  await supabaseFetch(`ofertas_prop_inversores?oferta_id=eq.${ofertaId}`, { method: 'DELETE' });
  
  if (!inversores || inversores.length === 0) return { success: true };
  
  const datos = inversores.map((inv, idx) => ({
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

export const guardarPropuestaModulos = async (ofertaId, modulos) => {
  await supabaseFetch(`ofertas_prop_modulos?oferta_id=eq.${ofertaId}`, { method: 'DELETE' });
  
  if (!modulos || modulos.length === 0) return { success: true };
  
  const datos = modulos.map((mod, idx) => ({
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

export const guardarPropuestaAreas = async (ofertaId, areas) => {
  await supabaseFetch(`ofertas_prop_areas?oferta_id=eq.${ofertaId}`, { method: 'DELETE' });
  
  if (!areas || areas.length === 0) return { success: true };
  
  const datos = areas.map((area, idx) => ({
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
