// Definición de la clase VoguelIPR
class VoguelIPR {
    // Constructor que inicializa los valores de pws, pwf y q0
    constructor(voguelpws, voguelpwf, voguelq0) {
        this.voguelpwf = parseFloat(voguelpwf);  // Conversión de pwf a número
        this.voguelpws = parseFloat(voguelpws);  // Conversión de pws a número
        this.voguelq0 = parseFloat(voguelq0);    // Conversión de q0 a número
    }

    // Método para calcular q0max
    q0max() {
        // Fórmula para calcular q0max basada en los valores de pwf, pws y q0
        return this.voguelq0 / (1 - 0.2 * (this.voguelpwf / this.voguelpws) - 0.8 * Math.pow(this.voguelpwf / this.voguelpws, 2));
    }

    // Método para calcular q0 en función de un valor dado de pwf
    calcularQ0(pwf) {
        // Se utiliza el valor calculado de q0max para obtener q0 para un valor específico de pwf
        return this.q0max() * (1 - 0.2 * (pwf / this.voguelpws) - 0.8 * Math.pow(pwf / this.voguelpws, 2));
    }
}

// Función principal para obtener q0max, q0 y generar la gráfica IPR
function obtenerIPR() {
    // Leer los valores de los campos de entrada (pws, pwf y q0) y convertirlos a números
    const voguelpwf = parseFloat(document.getElementById('voguelpwf').value);
    const voguelpws = parseFloat(document.getElementById('voguelpws').value);
    const voguelq0 = parseFloat(document.getElementById('voguelq0').value);

    // Validar si los valores son numéricos. Si alguno es inválido, se muestra un mensaje y se detiene la función
    if (isNaN(voguelpwf) || isNaN(voguelpws) || isNaN(voguelq0)) {
        document.getElementById('voguelResultado').textContent = 'Por favor, ingresa valores numéricos válidos.';
        return; // Termina la ejecución si los valores no son válidos
    }

    // Crear una instancia de la clase VoguelIPR con los valores ingresados
    let voguel = new VoguelIPR(voguelpws, voguelpwf, voguelq0);

    // Calcular q0max usando el método de la clase y almacenarlo
    let voguelResultado = voguel.q0max();

    // Mostrar el resultado de q0max en la página
    document.getElementById('voguelResultado').textContent = `q0max: ${voguelResultado.toFixed(4)}`;

    // Preparar arrays para almacenar los valores de pwf y q0 para la gráfica
    let pwfValues = [];
    let q0Values = [];
    
    // Generar valores de pwf y calcular q0 para cada uno de ellos
    for (let i = 6; i >= 1; i--) {
        let pwf = voguelpws / i; // Dividir pws por 5, 4, 3, etc.
        pwfValues.push(pwf.toFixed(4));  // Almacenar el valor de pwf con 2 decimales
        q0Values.push(voguel.calcularQ0(pwf).toFixed(4));  // Calcular y almacenar el valor de q0 para cada pwf
    }

    

    // Llamar a la función para dibujar la gráfica con los valores generados
    dibujarGrafica(pwfValues, q0Values);
}

// Variable global para la gráfica, de manera que podamos actualizarla
let myChart;

// Función para dibujar la gráfica usando Chart.js
function dibujarGrafica(pwfValues, q0Values) {
    // Obtener el contexto del canvas donde se va a dibujar la gráfica
    const ctx = document.getElementById('myChart').getContext('2d');

    // Si ya existe una gráfica anterior, destruirla para no superponer datos
    if (myChart) {
        myChart.destroy();
    }

    // Crear una nueva gráfica de tipo línea con los datos de pwf y q0
    myChart = new Chart(ctx, {
        type: 'line', // Tipo de gráfica
        data: {
            labels: pwfValues, // Eje X: valores de pwf
            datasets: [{
                label: 'pwf vs q0', // Etiqueta de la gráfica
                data: q0Values, // Eje Y: valores de q0
                borderColor: 'rgba(75, 192, 192, 1)', // Color de la línea
                borderWidth: 2, // Grosor de la línea
                fill: false // No rellenar el área debajo de la línea
            }]
        },
        options: {
            scales: {
                x: { // Configuración del eje X
                    title: {
                        display: true, // Mostrar título del eje
                        text: 'pwf [lb/pg²]' // Texto del título del eje X
                    }
                },
                y: { // Configuración del eje Y
                    title: {
                        display: true, // Mostrar título del eje
                        text: 'q0 [bpd]' // Texto del título del eje Y
                    }
                }
            }
        }
    });
}
