// import * as THREE from "three";

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   75,
//   innerWidth / innerHeight,
//   0.1,
//   1000
// );
// constrerender = new WebGLRerender();
// console.log(scene);
// console.log(camera);
// console.log(rerender);
import "./css/styles.css";

const PARAMS = {
  animationSpeed: 0.5,
  introAnimationDuration: 10,
};

// ボタンのアニメーション関数を定義
function animateButtons(bigBTNs) {
  gsap.set(bigBTNs, { scale: 0.5, opacity: 0 }); // ボタンを初期状態にリセット
  gsap.to(bigBTNs, {
    scale: 1,
    opacity: 1,
    duration: 1,
    ease: "back.out(1.7)",
    stagger: 0.2,
  });
}

// Initial animation
document.addEventListener("DOMContentLoaded", () => {
  const bigButtons = document.querySelector(".bigButtons");
  const sections = document.querySelector(".sections");
  const bigBTNs = document.querySelectorAll(".bigBTN");
  const homeLink = document.querySelector('.main-nav a[href="#home"]');
  const contactSection = document.querySelector(".section");
  const contactForm = document.querySelector(".contact-form");
  const formGroups = document.querySelectorAll(".form-group");
  const submitBtn = document.querySelector(".submit-btn");

  // コンタクトフォームのアニメーション関数
  function animateContactForm() {
    gsap.fromTo(
      contactSection,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
    );

    gsap.fromTo(
      formGroups,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
    );

    gsap.fromTo(
      submitBtn,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.5, ease: "power2.out" },
    );
  }
  // セクションのアニメーション関数を追加
  function animateSection(section) {
    gsap.fromTo(
      section,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
    );
  }
  // ボタンのアニメーション
  gsap.fromTo(
    bigBTNs,
    {
      scale: 0.5,
      opacity: 0,
    },
    {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: "back.out(1.7)",
      stagger: 0.2,
      delay: PARAMS.introAnimationDuration * 0.5,
    },
  );

  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    sections.style.display = "none";
    bigButtons.style.display = "flex";
    homeLink.classList.add("active");

    // ボタンのアニメーションを再実行
    animateButtons(bigBTNs);
  });
  bigBTNs.forEach((btn) => {
    const video = btn.querySelector(".btn-video-container video");
    const kemuriVideo = btn.querySelector(".kemuri-video");
    const kemuriContainer = btn.querySelector(".kemuri-video-container");
    const mainContainer = btn.querySelector(".btn-video-container");
    let kemuriAnimation;
    let mainAnimation;

    // 煙の動画を常に再生
    kemuriVideo.play().catch((error) => {
      console.error("Smoke video playback failed:", error);
    });
    // 動画を自動再生（ミュート状態で）
    video.play().catch((error) => {
      console.error("Video playback failed:", error);
    });
    btn.addEventListener("mouseenter", () => {
      // 既存のアニメーションを中止
      if (kemuriAnimation) kemuriAnimation.kill();
      if (mainAnimation) mainAnimation.kill();
      btn.style.transform = "scale(1.2)";
      kemuriAnimation = gsap.to(kemuriContainer, {
        opacity: 1,
        duration: 2,
        ease: "power2.out",
      });
      mainAnimation = gsap.to(mainContainer, {
        opacity: 1,
        duration: 2,
        delay: 1,
        ease: "power2.out",
      });
    });
    btn.addEventListener("mouseleave", () => {
      // 既存のアニメーションを中止
      if (kemuriAnimation) kemuriAnimation.kill();
      if (mainAnimation) mainAnimation.kill();
      btn.style.transform = "scale(1)";

      // 即座に不透明度を0に設定
      gsap.set([mainContainer, kemuriContainer], { opacity: 0 });
    });
    btn.addEventListener("click", () => {
      const sectionId = btn.getAttribute("data-section");
      bigButtons.style.display = "none";
      sections.style.display = "block";
      document.querySelectorAll(".section").forEach((section) => {
        if (section.id === sectionId) {
          section.style.display = "block";
          if (section.id === "contact") {
            animateContactForm();
            animateSection(section);
          } else {
            animateSection(section);
          }
        } else {
          section.style.display = "none";
        }
      });
      homeLink.classList.remove("active");
    });
  });
  // コンタクトフォームの送信イベント
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    gsap.to(formGroups, { opacity: 0, y: -20, duration: 0.3, stagger: 0.1 });
    gsap.to(submitBtn, { opacity: 0, y: -20, duration: 0.3 });

    const formStatus = document.getElementById("form-status");
    formStatus.textContent =
      "メッセージが送信されました。ありがとうございます！";
    formStatus.classList.add("success", "show");
    gsap.fromTo(
      formStatus,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.5 },
    );

    setTimeout(() => {
      contactForm.reset();
      gsap.to(formGroups, { opacity: 1, y: 0, duration: 0.3, stagger: 0.1 });
      gsap.to(submitBtn, { opacity: 1, y: 0, duration: 0.3 });
      gsap.to(formStatus, { opacity: 0, duration: 0.3, delay: 2 });
    }, 3000);
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
    },
  );

  const video = videoContainer.querySelector("video");
  gsap.fromTo(
    video,
    { filter: "blur(10px)" },
    {
      filter: "blur(0px)",
      duration: PARAMS.introAnimationDuration,
      ease: "power2.out",
    },
  );
  gsap.from(".main-header", {
    opacity: 0,
    y: -50,
    duration: 1,
    ease: "power3.out",
    delay: PARAMS.introAnimationDuration * 0.5,
  });
  // gsap.from(".section", {
  //   opacity: 0,
  //   y: 50,
  //   duration: 1,
  //   ease: "power3.out",
  //   stagger: 0.2,
  //   delay: PARAMS.introAnimationDuration * 0.75,
  // });
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
    delay: PARAMS.introAnimationDuration * 0.5,
  });

  // Tweakpane setup
  const pane = new Tweakpane.Pane();

  pane
    .addInput(PARAMS, "animationSpeed", { min: 0.1, max: 2 })
    .on("change", () => {
      console.log("Animation speed changed:", PARAMS.animationSpeed);
    });
});
