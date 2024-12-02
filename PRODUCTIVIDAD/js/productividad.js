class IPRCalculator {
    constructor(porosidad, permeabilidad, espesor, presiony, presionb, bo, viscosidad, compresibilidad, drene, radiop, factord, tiempo) {
        this.porosidad = parseFloat(porosidad);
        this.permeabilidad = parseFloat(permeabilidad);
        this.espesor = parseFloat(espesor);
        this.presiony = parseFloat(presiony);
        this.presionb = parseFloat(presionb);
        this.bo = parseFloat(bo);
        this.viscosidad = parseFloat(viscosidad);
        this.compresibilidad = parseFloat(compresibilidad);
        this.drene = parseFloat(drene);
        this.radiop = parseFloat(radiop);
        this.factord = parseFloat(factord);
        this.tiempo = parseFloat(tiempo);
    }

    calcularTransitorio() {
        return this.espesor * this.permeabilidad / 
               (162.6 * this.viscosidad * this.bo * 
               (Math.log10(this.tiempo) + 
               Math.log10(this.permeabilidad / (this.porosidad * this.compresibilidad * this.viscosidad * Math.pow(this.radiop, 2))) 
               - 3.23 + 0.87 * this.factord));
    }

    calcularEstacionario() {
        return this.espesor * this.permeabilidad / 
               (141.2 * this.bo * this.viscosidad * 
               (Math.log(this.drene / this.radiop) + this.factord));
    }

    calcularPseudoEstacionario() {
        return this.espesor * this.permeabilidad / 
               (141.2 * this.bo * this.viscosidad * 
               (Math.log(this.drene / this.radiop) - 0.75 + this.factord));
    }

    mostrarResultado(regimen) {
        let resultado;
        
        switch (regimen) {
            case 'Transitorio':
                resultado = this.calcularTransitorio();
                break;
            case 'Estacionario':
                resultado = this.calcularEstacionario();
                break;
            case 'Pseudo-Estacionario':
                resultado = this.calcularPseudoEstacionario();
                break;
            default:
                resultado = "Régimen no válido.";
        }

        const mostrarResultado = document.querySelector("#resultado");
        mostrarResultado.innerHTML = `El valor del IPR en régimen ${regimen} es: ${resultado.toFixed(4)}`;
    }
}

function obtenerValores() {
    const porosidad = document.getElementById('porosidad').value;
    const permeabilidad = document.getElementById('permeabilidad').value;
    const espesor = document.getElementById('espesor').value;
    const presiony = document.getElementById('presiony').value;
    const presionb = document.getElementById('presionb').value;
    const bo = document.getElementById('bo').value;
    const viscosidad = document.getElementById('viscocidad').value;
    const compresibilidad = document.getElementById('compresibilidad').value;
    const drene = document.getElementById('drene').value;
    const radiop = document.getElementById('radiop').value;
    const factord = document.getElementById('factord').value;
    const tiempo = document.getElementById('tiempo').value;
    
    // Obtener la opción seleccionada en el <select>
    const regimen = document.getElementById('regimen').value;

    // Crear una instancia de la clase IPRCalculator
    const calculadora = new IPRCalculator(porosidad, permeabilidad, espesor, presiony, presionb, bo, viscosidad, compresibilidad, drene, radiop, factord, tiempo);
    
    // Mostrar el resultado basado en la opción seleccionada
    calculadora.mostrarResultado(regimen);
}
