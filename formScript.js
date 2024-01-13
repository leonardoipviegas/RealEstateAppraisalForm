document.addEventListener('DOMContentLoaded', function() {
    setupDynamicFields('balconies', 'Balcony');
    setupDynamicFields('arrecadacoes', 'Arrecadação');
    setupDynamicFields('marquises', 'Marquise');
    // Add more features as needed
});

function setupDynamicFields(featureId, featureName) {
    document.getElementById(featureId).addEventListener('change', function() {
        var detailsDiv = document.getElementById(featureId + 'Details');
        detailsDiv.innerHTML = ''; // Clear previous inputs

        if (this.value === 'Yes') {
            var count = prompt("Quantos " + featureName + "s?");
            for (let i = 1; i <= count; i++) {
                detailsDiv.innerHTML += createFeatureInputs(featureName, i);
            }
        }
    });
}

function createFeatureInputs(featureName, number) {
    return '<label for="' + featureName.toLowerCase() + 'Size' + number + '">' + featureName + ' ' + number + ' Tamanho (m2):</label>' +
           '<input type="number" id="' + featureName.toLowerCase() + 'Size' + number + '" name="' + featureName.toLowerCase() + 'Size' + number + '" required><br><br>';
}
