document.addEventListener('DOMContentLoaded', function() {
    setupDynamicField('varandas', 'Quantas varandas existem?');
    setupDynamicField('arrecadacoes', 'Quantas arrecadações existem?');
    setupDynamicField('marquises', 'Quantas marquises existem?');
    setupDynamicField('garagemSimples', 'Quantas garagens simples existem?');
    setupDynamicField('garagemDupla', 'Quantas garagens duplas existem?');
    setupDynamicField('parqueamentoSimples', 'Quantos parqueamentos simples existem?');
    setupDynamicField('parqueamentoDuplo', 'Quantos parqueamentos duplos existem?');
    setupDynamicField('quintal', 'Quantos quintais/logradouros existem?');
});

function setupDynamicField(featureId, questionText) {
    var featureSelect = document.getElementById(featureId);
    if (featureSelect) {
        featureSelect.addEventListener('change', function() {
            var detailsDiv = document.getElementById(featureId + 'Details');
            if (this.value === 'Yes') {
                detailsDiv.innerHTML = '<label for="' + featureId + 'Count">' + questionText + '</label>' +
                                        '<input type="number" id="' + featureId + 'Count" name="' + featureId + 'Count" min="1">' +
                                        '<button type="button" onclick="addFeatureDetails(\'' + featureId + '\')">Confirmar</button><br><br>';
            } else {
                detailsDiv.innerHTML = '';
            }
        });
    }
}

function addFeatureDetails(featureId) {
    var countElement = document.getElementById(featureId + 'Count');
    if (countElement) {
        var count = countElement.value;
        var detailsDiv = document.getElementById(featureId + 'Details');

        var sizesContainerId = featureId + 'SizesContainer';
        var sizesContainer = document.getElementById(sizesContainerId);
        if (!sizesContainer) {
            sizesContainer = document.createElement('div');
            sizesContainer.id = sizesContainerId;
            detailsDiv.appendChild(sizesContainer);
        }

        sizesContainer.innerHTML = '';

        for (let i = 1; i <= count; i++) {
            sizesContainer.innerHTML += createFeatureInput(featureId, i);
        }
    } else {
        console.error('Count element not found for feature:', featureId);
    }
}

function createFeatureInput(featureId, number) {
    var featureNamePortuguese = {
        'varandas': 'Varanda',
        'arrecadacoes': 'Arrecadação',
        'marquises': 'Marquise',
        'garagemSimples': 'Garagem Simples',
        'garagemDupla': 'Garagem Dupla',
        'parqueamentoSimples': 'Parqueamento Simples',
        'parqueamentoDuplo': 'Parqueamento Duplo',
        'quintal': 'Quintal/Logradouro'
    };

    return '<label for="' + featureId + 'Size' + number + '">Tamanho do(a) ' + featureNamePortuguese[featureId] + ' ' + number + ' (m2):</label>' +
    '<input type="number" id="' + featureId + 'Size' + number + '" name="' + featureId + 'Size' + number + '" required><br><br>';
}

document.getElementById('realEstateForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    function addListItem(text, yPos, indentLevel = 0, bold = false) {
        const indentSize = 5;
        const xPosition = 10 + (indentLevel * indentSize);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.text(text, xPosition, yPos);
        return yPos + 7;
    }

    let yPos = 10;
    const sectionSpacing = 10;

    yPos = addListItem('Endereço da Casa: ' + document.getElementById('address').value, yPos, 0, true);
    yPos = addListItem('Data da Visita: ' + document.getElementById('visitDate').value, yPos);
    yPos += sectionSpacing;
    
    yPos = addListItem('Qualidade das Vistas: ' + document.getElementById('viewQuality').value, yPos, 0, true);
    yPos = addListItem('Qualidade dos Acabamentos/Equipamentos: ' + document.getElementById('furQuality').value, yPos);
    yPos += sectionSpacing;

    const features = [
        { id: 'varandas', question: 'Existem varandas?' },
        { id: 'arrecadacoes', question: 'Existem arrecadações?' },
        { id: 'marquises', question: 'Existem marquises?' },
        { id: 'garagemSimples', question: 'Existe garagem simples?' },
        { id: 'garagemDupla', question: 'Existe garagem dupla?' },
        { id: 'parqueamentoSimples', question: 'Existe parqueamento simples?' },
        { id: 'parqueamentoDuplo', question: 'Existe parqueamento duplo?' },
        { id: 'quintal', question: 'Existe quintal/logradouro?' },
    ];

    features.forEach(({ id, question }) => {
        let featureValue = document.getElementById(id).value === 'Yes' ? 'Sim' : 'Não';
        yPos = addListItem(question + ' ' + featureValue, yPos, 0, true);

        if (featureValue === 'Sim') {
            let countElement = document.getElementById(id + 'Count');
            if (countElement) {
                let count = countElement.value;
                yPos = addListItem(`Quantidade: ` + count, yPos, 1);

                for (let i = 1; i <= count; i++) {
                    let sizeElement = document.getElementById(id + 'Size' + i);
                    if (sizeElement) {
                        let size = sizeElement.value;
                        yPos = addListItem(`Tamanho ${i} (m2): ` + size, yPos, 2);
                    }
                }
            }
        }
        yPos += sectionSpacing;
    });

    let additionalFields = [
        { id: 'numWCs', label: 'N.º WCs' },
        { id: 'caves', label: 'Caves' },
        { id: 'pisosAcimaSolo', label: 'Pisos Acima do Solo' },
        { id: 'sotao', label: 'Sotão' },
        { id: 'elevadores', label: 'Elevadores' },
        { id: 'estrutura', label: 'Estrutura' },
        { id: 'cobertura', label: 'Cobertura' },
        { id: 'paredes', label: 'Paredes' },
        { id: 'caixilharias', label: 'Caixilharias' },
        { id: 'fachadas', label: 'Fachadas' },
        { id: 'paredesZonasSecas', label: 'Paredes - ZONAS SECAS' },
        { id: 'paredesZonasHumidas', label: 'Paredes - ZONAS HÚMIDAS' },
        { id: 'pavimentosZonasSecas', label: 'Pavimentos - ZONAS SECAS' },
        { id: 'pavimentosZonasHumidas', label: 'Pavimentos - ZONAS HÚMIDAS' },
        { id: 'climatizacao', label: 'Climatização' },
        { id: 'classeEnergetica', label: 'Classe Energética' },
        { id: 'captacaoSolar', label: 'Captação Solar' },
        { id: 'nivelAcabamentos', label: 'Nível de Acabamentos' },
        { id: 'estadoConservacao', label: 'Estado de Conservação' },
        { id: 'habitavel', label: 'Habitável' },
        { id: 'disposicaoEspacoInterior', label: 'Disposição do Espaço Interior' },
        { id: 'instalacaoGasNatural', label: 'Instalação de Gás Natural' },
        { id: 'facilidadeEstacionamento', label: 'Facilidade de Estacionamento' },
        { id: 'zona', label: 'Zona' },
        { id: 'tendenciaDesenvUrbanistico', label: 'Tendência De Desenv. Urbanístico' },
        { id: 'facilidadeAcesso', label: 'Facilidade De Acesso' },
        { id: 'transportesPublicos', label: 'Transportes Públicos' },
        { id: 'valorComercialLocalizacao', label: 'Valor Comercial Da Localização' },
        { id: 'servicosProximidade', label: 'Serviços Na Proximidade' },
        { id: 'zonasVerdes', label: 'Zonas Verdes' },
        { id: 'enquadramentoPaisagistico', label: 'Enquadramento Paisagístico' },
        { id: 'facilComercializacao', label: 'Facil. Comercialização' }
    ];

    additionalFields.forEach(({ id, label }) => {
        let elementValue = document.getElementById(id).value;
        yPos = addListItem(label + ': ' + elementValue, yPos, 0, true);
        yPos += 3;
    });

    let observations = document.getElementById('observations').value;
    if (observations) {
        yPos = addListItem('Observações:', yPos, 0, true);
        yPos = addListItem(observations, yPos, 1);
    }

    const addressInput = document.getElementById('address').value;
    const visitDateInput = document.getElementById('visitDate').value;
    const dateObj = new Date(visitDateInput);
    const formattedDate = dateObj.toISOString().split('T')[0].slice(2);
    const sanitizedAddress = addressInput.replace(/[^\w\s]/gi, '_');
    const filename = `${formattedDate} ${sanitizedAddress}.pdf`;

    doc.save(filename);
});
