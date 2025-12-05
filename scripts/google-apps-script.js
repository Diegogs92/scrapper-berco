/**
 * Script para Google Apps Script
 *
 * Este script permite exportar los datos del scraper de Google Sheets
 * hacia la API del sistema de análisis de precios.
 *
 * INSTRUCCIONES:
 * 1. Abrir tu Google Sheet con los datos del scraper
 * 2. Ir a Extensiones > Apps Script
 * 3. Copiar y pegar este código
 * 4. Modificar la variable URL_API con tu URL (local o Vercel)
 * 5. Guardar y ejecutar la función exportarAAPI()
 */

// Configuración
const SHEET_NAME = 'Scraper';  // Nombre de la hoja con los datos

// URL de la API
// Para desarrollo local:
const URL_API = 'http://localhost:3002/api/import';

// Para producción en Vercel (descomentar y modificar):
// const URL_API = 'https://tu-proyecto.vercel.app/api/import';

/**
 * Función para agregar un menú personalizado en Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Exportar a API')
    .addItem('Exportar productos', 'exportarAAPI')
    .addItem('Ver instrucciones', 'mostrarInstrucciones')
    .addToUi();
}

/**
 * Función principal para exportar datos a la API
 */
function exportarAAPI() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  if (!sheet) {
    SpreadsheetApp.getUi().alert('Error: No se encontró la hoja "' + SHEET_NAME + '"');
    return;
  }

  const data = sheet.getDataRange().getValues();

  // Verificar que hay datos
  if (data.length <= 1) {
    SpreadsheetApp.getUi().alert('No hay datos para exportar');
    return;
  }

  // Construir array de productos (saltar header en fila 0)
  const products = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    // Saltar filas vacías (sin URL)
    if (!row[0]) continue;

    // Mapear columnas según el formato del scraper
    products.push({
      url: row[0] || '',                    // Columna A: URL
      nombre: row[1] || '',                 // Columna B: Nombre
      precio: parseFloat(row[2]) || 0,      // Columna C: Precio
      descuento: row[3] || '',              // Columna D: Descuento
      categoria: row[4] || '',              // Columna E: Categoría
      proveedor: row[5] || '',              // Columna F: Proveedor
      status: row[6] || '',                 // Columna G: Status
      fecha_scraping: new Date().toISOString(),
      precioLista: row[10] ? parseFloat(row[10]) : null  // Columna K: Precio Lista (debug)
    });
  }

  if (products.length === 0) {
    SpreadsheetApp.getUi().alert('No hay productos válidos para exportar');
    return;
  }

  // Preparar payload
  const payload = {
    products: products,
    clearBefore: true  // Cambiar a false si quieres agregar sin limpiar
  };

  // Configurar petición HTTP
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  // Realizar petición
  try {
    const response = UrlFetchApp.fetch(URL_API, options);
    const statusCode = response.getResponseCode();
    const result = JSON.parse(response.getContentText());

    if (statusCode === 200) {
      Logger.log('Éxito: ' + result.message);
      SpreadsheetApp.getUi().alert(
        'Exportación exitosa\n\n' +
        'Productos importados: ' + result.imported
      );
    } else {
      Logger.log('Error: ' + result.error);
      SpreadsheetApp.getUi().alert(
        'Error en la exportación\n\n' +
        'Status: ' + statusCode + '\n' +
        'Error: ' + result.error
      );
    }
  } catch (error) {
    Logger.log('Error de conexión: ' + error);
    SpreadsheetApp.getUi().alert(
      'Error de conexión\n\n' +
      'Verifica que:\n' +
      '1. La URL de la API es correcta\n' +
      '2. El servidor está funcionando\n' +
      '3. No hay problemas de red\n\n' +
      'Error: ' + error
    );
  }
}

/**
 * Función para mostrar instrucciones
 */
function mostrarInstrucciones() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    'Instrucciones de uso',
    'Para exportar los datos:\n\n' +
    '1. Asegúrate de que el servidor esté funcionando\n' +
    '2. Verifica la URL_API en el código (línea 20)\n' +
    '3. Haz clic en "Exportar a API > Exportar productos"\n\n' +
    'Configuración actual:\n' +
    'URL: ' + URL_API + '\n' +
    'Hoja: ' + SHEET_NAME,
    ui.ButtonSet.OK
  );
}

/**
 * Función de prueba para verificar que el script funciona
 */
function testExportarAAPI() {
  Logger.log('=== INICIO TEST ===');

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  Logger.log('Filas encontradas: ' + (data.length - 1));
  Logger.log('Primera fila de datos:');
  Logger.log('URL: ' + data[1][0]);
  Logger.log('Nombre: ' + data[1][1]);
  Logger.log('Precio: ' + data[1][2]);
  Logger.log('Proveedor: ' + data[1][5]);

  Logger.log('=== FIN TEST ===');
}
