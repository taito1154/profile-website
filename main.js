const PARAMS = {
  animationSpeed: 0.5,
  introAnimationDuration: 10,
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
  // 動画コンテナのアニメーション
  const videoContainer = document.querySelector(".video-container");
  gsap.fromTo(
    videoContainer,
    { opacity: 1, scale: 1.1, zIndex: 3 },
    {
      opacity: 0.8,
      scale: 1,
      zIndex: -1,
      duration: PARAMS.introAnimationDuration,
      ease: "power2.out",
    }
  );

  const video = videoContainer.querySelector("video");
  gsap.fromTo(
    video,
    { filter: "blur(10px)" },
    {
      filter: "blur(0px)",
      duration: PARAMS.introAnimationDuration,
      ease: "power2.out",
    }
  );

  gsap.from(".main-header", {
    opacity: 0,
    y: -50,
    duration: 1,
    ease: "power3.out",
    delay: PARAMS.introAnimationDuration * 0.5,
  });
  gsap.from(".section", {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out",
    stagger: 0.2,
    delay: PARAMS.introAnimationDuration * 0.75,
  });

  // Tweakpane setup
  const pane = new Tweakpane.Pane();

  pane
    .addInput(PARAMS, "animationSpeed", { min: 0.1, max: 2 })
    .on("change", () => {
      console.log("Animation speed changed:", PARAMS.animationSpeed);
    });
});
