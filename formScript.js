document.addEventListener('DOMContentLoaded', function() {
    setupDynamicField('varandas', 'Quantas Varandas?', 'Varanda');
    setupDynamicField('arrecadacoes', 'Quantas Arrecadações?', 'Arrecadação');
    setupDynamicField('marquises', 'Quantas Marquises?', 'Marquise');
    setupDynamicField('garagemSimples', 'Quantas Garagens Simples?', 'Garagem Simples');
    setupDynamicField('garagemDupla', 'Quantas Garagens Duplas?', 'Garagem Dupla');
    setupDynamicField('parqueamentoSimples', 'Quantos Parqueamentos Simples?', 'Parqueamento Simples');
    setupDynamicField('parqueamentoDuplo', 'Quantos Parqueamentos Duplos?', 'Parqueamento Duplo');
    setupDynamicField('quintal', 'Quantos Quintais/Logradouros?', 'Quintal/Logradouro');
    setupDynamicField('outros', 'Quantos Outros?', 'Outro');
});

function setupDynamicField(featureId, questionText, featureName) {
    document.getElementById(featureId).addEventListener('change', function() {
        var detailsDiv = document.getElementById(featureId + 'Details');
        detailsDiv.innerHTML = ''; // Clear previous inputs

        if (this.value === 'Yes') {
            var count = prompt(questionText);
            for (let i = 1; i <= count; i++) {
                detailsDiv.innerHTML += createFeatureInput(featureName, i);
            }
        }
    });
}

function createFeatureInput(featureName, number) {
    return '<label for="' + featureName.toLowerCase().replace(/ /g, '') + 'Size' + number + '">Tamanho do(a) ' + featureName + ' ' + number + ' (m2):</label>' +
           '<input type="number" id="' + featureName.toLowerCase().replace(/ /g, '') + 'Size' + number + '" name="' + featureName.toLowerCase().replace(/ /g, '') + 'Size' + number + '" required><br><br>';
}
