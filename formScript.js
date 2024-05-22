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

    let formData = {
        'Endereço da Casa': document.getElementById('address').value,
        'Data da Visita': document.getElementById('visitDate').value,
        'Qualidade das Vistas': document.getElementById('viewQuality').value,
        'Qualidade dos Acabamentos/Equipamentos': document.getElementById('furQuality').value
    };

    const features = [
        { id: 'varandas', question: 'Existem varandas?' },
        { id: 'arrecadacoes', question: 'Existem arrecadações?' },
        { id: 'marquises', question: 'Existem marquises?' },
        { id: 'garagemSimples', question: 'Existe garagem simples?' },
        { id: 'garagemDupla', question: 'Existe garagem dupla?' },
        { id: 'parqueamentoSimples', question: 'Existe parqueamento simples?' },
        { id: 'parqueamentoDuplo', question: 'Existe parqueamento duplo?' },
        { id: 'quintal', question: 'Existe quintal/logradouro?' }
    ];

    features.forEach(({ id, question }) => {
        let featureValue = document.getElementById(id).value === 'Yes' ? 'Sim' : 'Não';
        formData[question] = featureValue;

        if (featureValue === 'Sim') {
            let countElement = document.getElementById(id + 'Count');
            if (countElement) {
                let count = countElement.value;
                formData[`Quantidade de ${id}`] = count;

                for (let i = 1; i <= count; i++) {
                    let sizeElement = document.getElementById(id + 'Size' + i);
                    if (sizeElement) {
                        let size = sizeElement.value;
                        formData[`Tamanho do(a) ${id} ${i} (m2)`] = size;
                    }
                }
            }
        }
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
        formData[label] = document.getElementById(id).value;
    });

    formData['Observações'] = document.getElementById('observations').value;

    const csvContent = "\uFEFF" + Object.keys(formData).map(key => `"${key}","${formData[key]}"`).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "real_estate_appraisal.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

});
