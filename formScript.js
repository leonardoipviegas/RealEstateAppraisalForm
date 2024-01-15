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
    // Get the current count from the input box
    var countElement = document.getElementById(featureId + 'Count');
    if (countElement) {
        var count = countElement.value;
        var detailsDiv = document.getElementById(featureId + 'Details');

        // Create a container for the new size inputs if it doesn't exist
        var sizesContainerId = featureId + 'SizesContainer';
        var sizesContainer = document.getElementById(sizesContainerId);
        if (!sizesContainer) {
            sizesContainer = document.createElement('div');
            sizesContainer.id = sizesContainerId;
            detailsDiv.appendChild(sizesContainer);
        }

        // Clear only the sizes container
        sizesContainer.innerHTML = '';

        // Append size inputs to the sizes container
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
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Function to add text with indentation
    function addListItem(text, yPos, indentLevel = 0) {
        const indentSize = 5; // Define the indent size
        const xPosition = 10 + (indentLevel * indentSize);
        doc.text(text, xPosition, yPos);
        return yPos + 7; // Increase Y position for next element, less spacing for list-like structure
    }

    // Starting Y position
    let yPos = 10;

    // Add the form data to the PDF with correct Portuguese
    yPos = addListItem('Endereço da Casa: ' + document.getElementById('address').value, yPos);
    yPos = addListItem('Data da Visita: ' + document.getElementById('visitDate').value, yPos);
    yPos = addListItem('Qualidade das Vistas: ' + document.getElementById('viewQuality').value, yPos);

    // Add each feature with the appropriate Portuguese question
    const features = [
        { id: 'varandas', question: 'Existem varandas?' },
        { id: 'arrecadacoes', question: 'Existem arrecadações?' },
        { id: 'garagemSimples', question: 'Existe garagem simples?' },
        { id: 'garagemDupla', question: 'Existe garagem dupla?' },
        { id: 'parqueamentoSimples', question: 'Existe parqueamento simples?' },
        { id: 'parqueamentoDuplo', question: 'Existe parqueamento duplo?' },
        { id: 'quintal', question: 'Existe quintal/logradouro?' },
    ];

    features.forEach(({ id, question }) => {
        let featureValue = document.getElementById(id).value === 'Yes' ? 'Sim' : 'Não';
        yPos = addListItem(question + ' ' + featureValue, yPos);

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
        // Add a small gap after each feature section
        yPos += 5;
    });

    // Add observations
    let observations = document.getElementById('observations').value;
    if (observations) {
        yPos = addListItem('Observações:', yPos);
        yPos = addListItem(observations, yPos, 1);
    }

    // Save the PDF with the dynamically generated filename
    const addressInput = document.getElementById('address').value;
    const visitDateInput = document.getElementById('visitDate').value;
    const dateObj = new Date(visitDateInput);
    const formattedDate = dateObj.toISOString().split('T')[0].slice(2); // Gets the date in YY-MM-DD format
    const sanitizedAddress = addressInput.replace(/[^\w\s]/gi, '_');
    const filename = `${formattedDate} ${sanitizedAddress}.pdf`;

    doc.save(filename);
});
