document.addEventListener('DOMContentLoaded', function() {
    setupDynamicFields('varandas', 'Varanda');
    setupDynamicFields('arrecadacoes', 'Arrecadação');
    setupDynamicFields('marquises', 'Marquise');
    setupDynamicFields('garagemSimples', 'Garagem Simples');
    setupDynamicFields('garagemDupla', 'Garagem Dupla');
    setupDynamicFields('parqueamentoSimples', 'Parqueamento Simples');
    setupDynamicFields('parqueamentoDuplo', 'Parqueamento Duplo');
    setupDynamicFields('quintal', 'Quintal/Logradouro');
    setupDynamicFields('outros', 'Outro');
    // Add more features as needed
});

function setupDynamicFields(featureId, featureName) {
    document.getElementById(featureId).addEventListener('change', function() {
        var detailsDiv = document.getElementById(featureId + 'Details');
        detailsDiv.innerHTML = ''; // Clear previous inputs

        if (this.value === 'Yes') {
            var count = prompt("Quantos " + featureName + (featureName.endsWith('ão') ? 'ões' : 's') + "?");
            for (let i = 1; i <= count; i++) {
                detailsDiv.innerHTML += createFeatureInputs(featureName, i);
            }
        }
    });
}

function createFeatureInputs(featureName, number) {
    var featureLabel = featureName + ' ' + number;
    return '<label for="' + featureName.toLowerCase() + 'Size' + number + '">Tamanho do(a) ' + featureLabel + ' (m2):</label>' +
           '<input type="number" id="' + featureName.toLowerCase() + 'Size' + number + '" name="' + featureName.toLowerCase() + 'Size' + number + '" required><br><br>';
}
