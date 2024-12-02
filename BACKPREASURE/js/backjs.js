document.getElementById('saveButton').addEventListener('click', () => {
    //  pwf y qg
    const pwfValues = Array.from(document.querySelectorAll('.pwf'))
        .map(input => parseFloat(input.value) || 0); 
    const qgValues = Array.from(document.querySelectorAll('.qg'))
        .map(input => parseFloat(input.value) || 0); 

    const pws = parseFloat(document.getElementById('pwsdato').value) || 0; 
    const Patm = 14.7; 

    // Calcular regresión lineal para obtener puntos cercanos
    const { m, b } = regresion(pwfValues, qgValues);

    const distancia = pwfValues.map((x, index) => {
        const yPred = m * x + b; 
        const actualY = qgValues[index]; 
        return {
            x,
            y: actualY,
            distancia: Math.abs(actualY - yPred) 
        };
    });

  
    distancia.sort((a, b) => a.distancia - b.distancia);
    const puntos = distancia.slice(0, 2);

    
    const p1 = puntos[0]; 
    const p2 = puntos[1]; 

    //    m
    const mValue = calcularM(pws, p1.x, p2.x, p1.y, p2.y);
    const n = 1 / mValue;

    console.log(`El valor calculado de m es: ${mValue}`);
    console.log(`El valor calculado de n es: ${n}`);

    // C 
    const cValue = calcularC(pws, p1.x, p1.y, n);

    console.log(`El valor calculado de C es: ${cValue}`);

    // qg
    const puntosX = generarPuntosX(pws, Patm);
    const puntosY = puntosX.map(x => calcularQg(cValue, pws, x, n));

    //tabla resultados
    mostrarTabla(puntosX, puntosY);

    
    generarGrafica(puntosX, puntosY);
});

// pws y Patm
function generarPuntosX(pws, Patm) {
    const puntos = [];
    const step = (pws - Patm) / 5;
    for (let i = 0; i <= 5; i++) {
        puntos.push(pws - i * step);
    }
    puntos.push(Patm); 
    return puntos;
}

//qg
function calcularQg(C, pws, x, n) {
    return C * Math.pow(Math.pow(pws, 2) - Math.pow(x, 2), n);
}

//C
function calcularC(pws, pwf, qg, n) {
   
    const numerador = qg;

   
    const denominador = Math.pow(Math.pow(pws, 2) - Math.pow(pwf, 2), n);

    //C
    const c = numerador / denominador;
    return c;
}

//tabla de resultados
function mostrarTabla(puntosX, puntosY) {
    // Crear tabla
    let html = '<table border="1"><tr><th>X</th><th>Y (qg)</th></tr>';
    for (let i = 0; i < puntosX.length; i++) {
        html += `<tr><td>${puntosX[i].toFixed(4)}</td><td>${puntosY[i].toFixed(4)}</td></tr>`;
    }
    html += '</table>';

    
    document.getElementById('resultadoback').innerHTML = html;
}

//gráfica
function generarGrafica(puntosX, puntosY) {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line', 
        data: {
            labels: puntosX.map(x => x.toFixed(2)),
            datasets: [{
                label: 'Relación Puntos X vs Y (qg)',
                data: puntosY,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'X (puntos)'
                    },
                    reverse: true 
                },
                y: {
                    title: {
                        display: true,
                        text: 'Y (qg)'
                    }
                }
            }
        }
    });
}

//  m 
function calcularM(pws, pwf1, pwf2, qg1, qg2) {
    const logNumerador1 = Math.log(Math.pow(pws, 2) - Math.pow(pwf1, 2));
    const logNumerador2 = Math.log(Math.pow(pws, 2) - Math.pow(pwf2, 2));
    const logDenominador1 = Math.log(qg1);
    const logDenominador2 = Math.log(qg2);
    const m = (logNumerador2 - logNumerador1) / (logDenominador2 - logDenominador1);
    return m;
}

//regresión lineal
function regresion(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;
    return { m, b };
}
