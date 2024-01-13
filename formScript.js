document.addEventListener('DOMContentLoaded', function() {
    // List of all features and their corresponding elements
    var features = [
        { id: 'varandas', question: 'Quantas Varandas?', name: 'Varanda' },
        { id: 'arrecadacoes', question: 'Quantas Arrecadações?', name: 'Arrecadação' },
        // ... add other features here
    ];

    // Setup dynamic fields for each feature
    features.forEach(function(feature) {
        if (document.getElementById(feature.id)) {
            setupDynamicField(feature.id, feature.question, feature.name);
        } else {
            console.error('Element not found:', feature.id);
        }
    });
});

function setupDynamicField(featureId, questionText, featureName) {
    var featureElement = document.getElementById(featureId);
    if (featureElement) {
        featureElement.addEventListener('change', function() {
            var detailsDiv = document.getElementById(featureId + 'Details');
            if (detailsDiv) {
                detailsDiv.innerHTML = ''; // Clear previous inputs
                if (this.value === 'Yes') {
                    var count = prompt(questionText);
                    for (let i = 1; i <= count; i++) {
                        detailsDiv.innerHTML += createFeatureInput(featureName, i);
                    }
                }
            }
        });
    }
}

function createFeatureInput(featureName, number) {
    return '<label for="' + featureName.toLowerCase().replace(/ /g, '') + 'Size' + number + '">Tamanho do(a) ' + featureName + ' ' + number + ' (m2):</label>' +
           '<input type="number" id="' + featureName.toLowerCase().replace(/ /g, '') + 'Size' + number + '" name="' + featureName.toLowerCase().replace(/ /g, '') + 'Size' + number + '" required><br><br>';
}
