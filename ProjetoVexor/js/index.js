document.addEventListener("DOMContentLoaded", () => {
    // Animações de entrada ao rolar a página
    const scrollElements = document.querySelectorAll(".animate-on-scroll");

    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= 
            ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add("is-visible");
    };

    const hideScrollElement = (element) => {
        element.classList.remove("is-visible");
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 75)) { // Elemento aparece quando 75% dele está visível
                displayScrollElement(el);
            } 
            // Opcional: para re-animar se o usuário rolar para cima e para baixo
            // else {
            //     hideScrollElement(el);
            // }
        })
    }

    window.addEventListener("scroll", () => {
        handleScrollAnimation();
    });
    // Para animar elementos já visíveis no carregamento da página
    setTimeout(handleScrollAnimation, 250);


    // Placeholder para vídeo - se não carregar, mostra uma imagem de fundo via CSS
    const video = document.getElementById('heroVideo');
    if (video) {
        video.addEventListener('error', function() {
            // Se o vídeo falhar, você pode adicionar uma classe ao body/hero-section
            // para exibir uma imagem de fundo alternativa definida no CSS.
            document.querySelector('.hero-section').classList.add('video-failed');
            console.warn("Vídeo da Hero Section não pôde ser carregado.");
        });
         // Tenta dar play no vídeo, especialmente importante para mobile onde o autoplay pode ser restrito
        video.play().catch(error => {
            console.warn("Autoplay do vídeo bloqueado pelo navegador:", error);
            // Adicionar um botão de play/pause manual seria uma boa melhoria aqui
        });
    }
});