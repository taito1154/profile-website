import * as THREE from "../node_modules/three/build/three.module.js";

// import { color } from "three/tsl";

const PARAMS = {
  animationSpeed: 0.5,
  introAnimationDuration: 10,
};

// ボタンのアニメーション関数を定義
// function animateButtons(bigBTNs) {
//   gsap.set(bigBTNs, { scale: 0.5, opacity: 0 }); // ボタンを初期状態にリセット
//   gsap.to(bigBTNs, {
//     scale: 1,
//     opacity: 1,
//     duration: 1,
//     ease: "back.out(1.7)",
//     stagger: 0.2,
//   });
// }

// Initial animation
document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded");
  // const bigButtons = document.querySelector(".bigButtons");
  const sections = document.querySelector(".sections");
  // const bigBTNs = document.querySelectorAll(".bigBTN");
  const homeLink = document.querySelector('.main-nav a[href="#home"]');
  const contactSection = document.querySelector(".section");
  const contactForm = document.querySelector(".contact-form");
  const formGroups = document.querySelectorAll(".form-group");
  const submitBtn = document.querySelector(".submit-btn");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  console.log(scene);
  console.log(camera);
  console.log(renderer);

  renderer.setSize(innerWidth, innerHeight);

  renderer.setPixelRatio(devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const materials = [
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
  ];
  const boxes = materials.map((material, index) => {
    const box = new THREE.Mesh(boxGeometry, material);
    // 各ボックスの位置を設定
    if (index === 0) {
      box.position.set(0, 1, 2); // ボックス1: 上部中央
    } else if (index === 1) {
      box.position.set(0, -1, 2); // ボックス2: 下部中央
    } else if (index === 2) {
      box.position.set(-2, -1, 2); // ボックス3: 左下
    }

    scene.add(box);
    return box;
  });
  camera.position.z = 5;
  // アニメーションループ
  function animate() {
    requestAnimationFrame(animate);
    boxes.forEach((box) => {
      box.rotation.x += 0.01;
      box.rotation.y += 0.01;
    });
    renderer.render(scene, camera); // シーンをレンダリング
  }
  animate();
  // Raycasterとマウスベクトルの設定
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // ボックスへのクリックイベント追加
  window.addEventListener("click", (event) => {
    // マウス座標を正規化
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycasterを更新
    raycaster.setFromCamera(mouse, camera);

    // ボックスとの交差判定
    const intersects = raycaster.intersectObjects(boxes);

    if (intersects.length > 0) {
      const clickedBox = intersects[0].object; // 最初に交差したボックスを取得

      // GSAPでアニメーション（例：スケールアップ）
      gsap.to(clickedBox.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
      });

      // 他のアクション（セクション表示など）もここで追加可能
      console.log(
        `Clicked on box with color: ${clickedBox.material.color.getHexString()}`
      );

      // セクション表示ロジックなどもここに追加できます
      const sections = document.querySelector(".sections");
      sections.style.display = "block"; // セクションを表示する例
    }
  });

  // コンタクトフォームのアニメーション関数
  function animateContactForm() {
    gsap.fromTo(
      contactSection,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );

    gsap.fromTo(
      formGroups,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );

    gsap.fromTo(
      submitBtn,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.5, ease: "power2.out" }
    );
  }
  // セクションのアニメーション関数を追加
  function animateSection(section) {
    gsap.fromTo(
      section,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }
  // ボタンのアニメーション
  // gsap.fromTo(
  //   bigBTNs,
  //   {
  //     scale: 0.5,
  //     opacity: 0,
  //   },
  //   {
  //     scale: 1,
  //     opacity: 1,
  //     duration: 1,
  //     ease: "back.out(1.7)",
  //     stagger: 0.2,
  //     delay: PARAMS.introAnimationDuration * 0.5,
  //   }
  // );

  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    sections.style.display = "none";
    bigButtons.style.display = "flex";
    homeLink.classList.add("active");

    // ボタンのアニメーションを再実行
    animateButtons(bigBTNs);
  });
  // bigBTNs.forEach((btn) => {
  //   const video = btn.querySelector(".btn-video-container video");
  //   const kemuriVideo = btn.querySelector(".kemuri-video");
  //   const kemuriContainer = btn.querySelector(".kemuri-video-container");
  //   const mainContainer = btn.querySelector(".btn-video-container");
  //   let kemuriAnimation;
  //   let mainAnimation;

  //   // 煙の動画を常に再生
  //   kemuriVideo.play().catch((error) => {
  //     console.error("Smoke video playback failed:", error);
  //   });
  //   // 動画を自動再生（ミュート状態で）
  //   video.play().catch((error) => {
  //     console.error("Video playback failed:", error);
  //   });
  //   btn.addEventListener("mouseenter", () => {
  //     // 既存のアニメーションを中止
  //     if (kemuriAnimation) kemuriAnimation.kill();
  //     if (mainAnimation) mainAnimation.kill();
  //     btn.style.transform = "scale(1.2)";
  //     kemuriAnimation = gsap.to(kemuriContainer, {
  //       opacity: 1,
  //       duration: 2,
  //       ease: "power2.out",
  //     });
  //     mainAnimation = gsap.to(mainContainer, {
  //       opacity: 1,
  //       duration: 2,
  //       delay: 1,
  //       ease: "power2.out",
  //     });
  //   });
  //   btn.addEventListener("mouseleave", () => {
  //     // 既存のアニメーションを中止
  //     if (kemuriAnimation) kemuriAnimation.kill();
  //     if (mainAnimation) mainAnimation.kill();
  //     btn.style.transform = "scale(1)";

  //     // 即座に不透明度を0に設定
  //     gsap.set([mainContainer, kemuriContainer], { opacity: 0 });
  //   });
  //   btn.addEventListener("click", () => {
  //     const sectionId = btn.getAttribute("data-section");
  //     bigButtons.style.display = "none";
  //     sections.style.display = "block";
  //     document.querySelectorAll(".section").forEach((section) => {
  //       if (section.id === sectionId) {
  //         section.style.display = "block";
  //         if (section.id === "contact") {
  //           animateContactForm();
  //           animateSection(section);
  //         } else {
  //           animateSection(section);
  //         }
  //       } else {
  //         section.style.display = "none";
  //       }
  //     });
  //     homeLink.classList.remove("active");
  //   });
  // });
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
      { opacity: 1, y: 0, duration: 0.5, delay: 0.5 }
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
