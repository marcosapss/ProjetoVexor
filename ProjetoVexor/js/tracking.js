document.addEventListener('DOMContentLoaded', function () {
    const trackingForm = document.getElementById('trackingForm');
    const trackingCodeInput = document.getElementById('trackingCode');
    const trackingResultDiv = document.getElementById('trackingResult');
    const trackingErrorDiv = document.getElementById('trackingError');
    const trackingErrorMessageSpan = document.getElementById('trackingErrorMessage');
    const trackingLoadingDiv = document.getElementById('trackingLoading');
    const resultOrderId = document.getElementById('resultOrderId');
    const resultStatus = document.getElementById('resultStatus');
    const resultLastUpdate = document.getElementById('resultLastUpdate');
    const resultLocation = document.getElementById('resultLocation');
    const resultHistoryUl = document.getElementById('resultHistory');

    trackingForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const code = trackingCodeInput.value.trim();

        if (!code) {
            trackingErrorMessageSpan.textContent = 'Por favor, insira um código de rastreamento.';
            trackingErrorDiv.style.display = 'block';
            trackingResultDiv.style.display = 'none';
            trackingLoadingDiv.style.display = 'none';
            return;
        }

        // Simular chamada de API
        trackingLoadingDiv.style.display = 'block';
        trackingResultDiv.style.display = 'none';
        trackingErrorDiv.style.display = 'none';

        setTimeout(() => {
            trackingLoadingDiv.style.display = 'none';
            // Lógica de simulação:
            if (code.toUpperCase() === "VEXOR123XYZ") {
                resultOrderId.textContent = code.toUpperCase();
                resultStatus.textContent = "Em trânsito";
                resultLastUpdate.textContent = new Date().toLocaleString('pt-BR');
                resultLocation.textContent = "Centro de Distribuição, Curitiba-PR";

                resultHistoryUl.innerHTML = `
                            <li class="list-group-item d-flex justify-content-between align-items-start">
                                <div class="ms-2 me-auto"><div class="fw-bold">Objeto postado</div>Agência Correios</div>
                                <span class="badge bg-secondary rounded-pill">24/05/2024 14:30</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-start">
                                <div class="ms-2 me-auto"><div class="fw-bold">Objeto em trânsito</div>SAO PAULO/SP para CURITIBA/PR</div>
                                <span class="badge bg-info rounded-pill">25/05/2024 08:15</span>
                            </li>`;
                trackingResultDiv.style.display = 'block';
            } else if (code.toUpperCase() === "VEXORRJ456") { // Novo código simulado para RJ
                resultOrderId.textContent = code.toUpperCase();
                resultStatus.textContent = "Aguardando Envio";
                resultLastUpdate.textContent = new Date().toLocaleDateString('pt-BR') + " 09:30";
                resultLocation.textContent = "Rio de Janeiro, RJ";

                resultHistoryUl.innerHTML = `
                            <li class="list-group-item d-flex justify-content-between align-items-start">
                                <div class="ms-2 me-auto"><div class="fw-bold">Pagamento Aprovado</div>Seu pedido está sendo preparado.</div>
                                <span class="badge bg-success rounded-pill">${new Date().toLocaleDateString('pt-BR')} 09:15</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-start">
                                <div class="ms-2 me-auto"><div class="fw-bold">Pedido em separação no estoque</div>Centro de Distribuição - Rio de Janeiro</div>
                                <span class="badge bg-primary rounded-pill">${new Date().toLocaleDateString('pt-BR')} 09:30</span>
                            </li>
                            `;
                trackingResultDiv.style.display = 'block';
            } else if (code.toUpperCase() === "ERRO123") {
                trackingErrorMessageSpan.textContent = 'Ocorreu um erro inesperado ao buscar seu pedido. Tente mais tarde.';
                trackingErrorDiv.style.display = 'block';
            }
            else {
                trackingErrorMessageSpan.textContent = `Nenhum pedido encontrado para o código "${code}". Verifique e tente novamente.`;
                trackingErrorDiv.style.display = 'block';
            }
        }, 2000); // Simula delay da rede
    });
});