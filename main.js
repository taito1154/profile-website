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
  const bigButtons = document.querySelector(".bigButtons");
  const sections = document.querySelector(".sections");
  const bigBTNs = document.querySelectorAll(".bigBTN");
  const homeLink = document.querySelector('.main-nav a[href="#home"]');

  bigBTNs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const sectionId = btn.getAttribute("data-section");
      // ボタン達を非表示に
      bigButtons.style.display = "none";
      sections.style.display = "block";
      // クリックしたセクションの表示
      document.querySelectorAll(".section").forEach((section) => {
        if (section.id === sectionId) {
          section.style.display = "block";
        } else {
          section.style.display = "none";
        }
      });
      homeLink.classList.remove("active");
    });
  });
  // homeLinkを押すと
  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    sections.style.display = "none";
    bigButtons.style.display = "flex";
    homeLink.classList.add("active");
  });

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
  // フレームのアニメーション
  gsap.to(".frame-left, .frame-right", {
    scaleY: 1,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    stagger: 0.2,
    delay: PARAMS.introAnimationDuration * 0.5,
    autoAlpha: 1,
  });

  gsap.to(".frame-top, .frame-bottom", {
    scaleX: 1,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    stagger: 0.2,
    delay: PARAMS.introAnimationDuration * 0.5,
    autoAlpha: 1,
  });
  // フッターのアニメーション
  gsap.from("footer", {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
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
