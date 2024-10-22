const PARAMS = {
  animationSpeed: 0.5,
};
function appData() {
  return {
    currentSection: "home",
    switchSection(section) {
      const oldSection = document.querySelector(`#${this.currentSection}`);
      const newSection = document.querySelector(`#${section}`);

      gsap.to(oldSection, {
        opacity: 0,
        y: 50,
        duration: PARAMS.animationSpeed,
        onComplete: () => {
          this.currentSection = section;
          gsap.fromTo(
            newSection,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: PARAMS.animationSpeed }
          );
        },
      });
    },
  };
}

// Initial animation
document.addEventListener("DOMContentLoaded", () => {
  gsap.from(".main-header", {
    opacity: 0,
    y: -50,
    duration: 1,
    ease: "power3.out",
  });
  gsap.from(".section", {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out",
    stagger: 0.2,
  });

  // Tweakpane setup
  const pane = new Tweakpane.Pane();

  pane
    .addInput(PARAMS, "animationSpeed", { min: 0.1, max: 2 })
    .on("change", () => {
      console.log("Animation speed changed:", PARAMS.animationSpeed);
    });
});
