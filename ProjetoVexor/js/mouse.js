document.addEventListener("DOMContentLoaded", () => {
  const timelineItems = document.querySelectorAll(".timeline-item");

  if (!timelineItems.length) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Opcional: para de observar depois que a animação acontece uma vez
        // observer.unobserve(entry.target); 
      }
    });
  }, {
    threshold: 0.1 // A animação começa quando 10% do item está visível
  });

  timelineItems.forEach((item) => {
    observer.observe(item);
  });
});