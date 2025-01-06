import * as THREE from "../node_modules/three/build/three.module.js";

const PARAMS = {
  animationSpeed: 0.5,
  introAnimationDuration: 10,
};
let first = false;
function AnimateSection(section) {
  gsap.fromTo(
    section,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
  );
}
function firsthandleRouting() {
  const hash = window.location.hash.substring(1);
  const sections = document.querySelectorAll(".section");
  const mainContent = document.querySelector(".main-content");
  const sectionsContainer = document.querySelector(".sections");

  if (hash && hash !== "home") {
    first = true;
    gsap.killTweensOf(
      ".video-container, .frame-left, .frame-right, .frame-top, .frame-bottom, .main-header, footer"
    );
    gsap.set(".video-container", { opacity: 0.8, scale: 1, zIndex: -1 });
    gsap.set(".frame-left, .frame-right", {
      scaleY: 1,
      opacity: 1,
    });
    gsap.set(".frame-top, .frame-bottom", {
      scaleX: 1,
      opacity: 1,
    });
    gsap.set(".main-header", { opacity: 1, y: 0 });
    gsap.set("footer", { y: 0, opacity: 1 });

    // mainContent.style.display = "none";
    sectionsContainer.style.display = "block";
    sections.forEach((section) => {
      if (section.id === hash) {
        section.style.display = "block";
        AnimateSection(section);
      } else {
        section.style.display = "none";
      }
    });
  }
}
firsthandleRouting();
// Initial animation
document.addEventListener("DOMContentLoaded", () => {
  firsthandleRouting();
  window.addEventListener("hashchange", handleRouting);
  // window.addEventListener("load", handleRouting);
  // document.addEventListener("DOMContentLoaded", handleRouting);

  console.log("Script loaded");
  const sections = document.querySelector(".sections");
  const homeLink = document.querySelector('.main-nav a[href="#home"]');
  const contactSection = document.querySelector(".section");
  const contactForm = document.querySelector(".contact-form");
  const formGroups = document.querySelectorAll(".form-group");
  const submitBtn = document.querySelector(".submit-btn");
  const hash = window.location.hash.substring(1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000, 0); // 完全に透明な背景
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  // .boxes要素にThree.jsのキャンバスを追加
  const boxesContainer = document.querySelector(".boxes");
  boxesContainer.appendChild(renderer.domElement);

  // レンダラーのサイズを、.boxesのサイズに合わせる
  function resizeRenderer() {
    const width = boxesContainer.clientWidth;
    const height = boxesContainer.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  // ウィンドウのリサイズ時にレンダラーをリサイズ
  window.addEventListener("resize", resizeRenderer);

  let currentIntersectedBox = null;

  function resetBox(index) {
    const videoTexture = videoTextures[index];
    const video = videoTexture?.image;

    if (video) {
      video.pause(); // 動画を停止
      video.currentTime = 0; // 再生位置をリセット
      boxes[index].material.map = null; // テクスチャを解除
      boxes[index].material.needsUpdate = true; // マテリアルの更新を強制
    }

    // GSAPでボックスの透明度を元に戻す
    gsap.to(boxes[index].material, {
      opacity: 1, // 元の透明度に戻す
      duration: 0,
    });
  }

  function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(boxes);

    if (intersects.length > 0) {
      const intersectedBox = intersects[0].object;
      if (intersectedBox !== currentIntersectedBox) {
        if (currentIntersectedBox) {
          stopVideo(boxes.indexOf(currentIntersectedBox));
        }
        currentIntersectedBox = intersectedBox;
        playVideo(boxes.indexOf(intersectedBox));
      }
    } else if (currentIntersectedBox) {
      stopVideo(boxes.indexOf(currentIntersectedBox));
      currentIntersectedBox = null;
    }
  }

  function playVideo(index) {
    const videoTexture = videoTextures[index];
    const video = videoTexture?.image;
    if (video) {
      video.currentTime = 0;
      video.loop = false;
      video.play();
      boxes[index].material.map = videoTexture;
      boxes[index].material.needsUpdate = true;
      playVideoSequence(index);
    }
  }

  function stopVideo(index) {
    const video = videoTextures[index]?.image;
    if (video) {
      video.pause();
      video.currentTime = 0;
      boxes[index].material.map = null;
      boxes[index].material.needsUpdate = true;
    }
  }

  let stopSequence = false; // 停止フラグ
  function playVideoSequence(index) {
    if (stopSequence) return; // フラグがtrueなら何もしない
    setTimeout(() => {
      gsap.to(boxes[index].material, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          const nextIndex = index + 3;
          const nextVideoTexture = videoTextures[nextIndex];
          const nextVideo = nextVideoTexture?.image;
          if (nextVideo) {
            nextVideo.currentTime = 0;
            nextVideo.loop = true;
            nextVideo.play();
            boxes[index].material.map = nextVideoTexture;
            gsap.to(boxes[index].material, {
              opacity: 1,
              duration: 2,
            });
          }
        },
      });
    }, 0);
  }

  window.addEventListener("mousemove", onMouseMove, false);

  function handleRouting() {
    const hash = window.location.hash.substring(1);
    const sections = document.querySelectorAll(".section");
    const mainContent = document.querySelector(".main-content");
    const sectionsContainer = document.querySelector(".sections");

    if (hash && hash !== "home") {
      gsap.killTweensOf(
        ".video-container, .frame-left, .frame-right, .frame-top, .frame-bottom, .main-header, footer"
      );
      gsap.set(".video-container", { opacity: 0.8, scale: 1, zIndex: -1 });
      gsap.set(".frame-left, .frame-right", {
        scaleY: 1,
        opacity: 1,
      });
      gsap.set(".frame-top, .frame-bottom", {
        scaleX: 1,
        opacity: 1,
      });
      gsap.set(".main-header", { opacity: 1, y: 0 });
      gsap.set("footer", { y: 0, opacity: 1 });

      // mainContent.style.display = "none";
      sectionsContainer.style.display = "block";
      sections.forEach((section) => {
        if (section.id === hash) {
          section.style.display = "block";
          animateSection(section);
        } else {
          section.style.display = "none";
        }
      });
      if (!boxes.length) return;
      boxes.forEach((box) => {
        scene.remove(box);
      });
      boxes.length = 0;
    } else {
      sectionsContainer.style.display = "none";
      recreateBoxes(); // ボックスを再生成
    }
    // if (["about", "work", "contact"].includes(hash)) {
    //   gsap.killTweensOf(
    //     ".video-container, .frame-left, .frame-right, .frame-top, .frame-bottom, .main-header, footer"
    //   );
    //   gsap.set(".video-container", { opacity: 0.8, scale: 1, zIndex: -1 });
    //   gsap.set(".frame-left, .frame-right", {
    //     scaleY: 1,
    //     opacity: 1,
    //   });
    //   gsap.set(".frame-top, .frame-bottom", {
    //     scaleX: 1,
    //     opacity: 1,
    //   });
    //   gsap.set(".main-header", { opacity: 1, y: 0 });
    //   gsap.set("footer", { y: 0, opacity: 1 });

    //   boxes.forEach((box) => {
    //     scene.remove(box);
    //   });
    //   boxes.length = 0;
    // }
  }
  // function firsthandleRouting() {
  //   const hash = window.location.hash.substring(1);
  //   const sections = document.querySelectorAll(".section");
  //   const mainContent = document.querySelector(".main-content");
  //   const sectionsContainer = document.querySelector(".sections");

  //   if (hash && hash !== "home") {
  //     gsap.killTweensOf(
  //       ".video-container, .frame-left, .frame-right, .frame-top, .frame-bottom, .main-header, footer"
  //     );
  //     gsap.set(".video-container", { opacity: 0.8, scale: 1, zIndex: -1 });
  //     gsap.set(".frame-left, .frame-right", {
  //       scaleY: 1,
  //       opacity: 1,
  //     });
  //     gsap.set(".frame-top, .frame-bottom", {
  //       scaleX: 1,
  //       opacity: 1,
  //     });
  //     gsap.set(".main-header", { opacity: 1, y: 0 });
  //     gsap.set("footer", { y: 0, opacity: 1 });

  //     // mainContent.style.display = "none";
  //     sectionsContainer.style.display = "block";
  //     sections.forEach((section) => {
  //       if (section.id === hash) {
  //         section.style.display = "block";
  //         animateSection(section);
  //       } else {
  //         section.style.display = "none";
  //       }
  //     });
  //   } else {
  //     sectionsContainer.style.display = "none";
  //     recreateBoxes(); // ボックスを再生成
  //   }
  // }

  // document.body.appendChild(renderer.domElement);
  // 環境光を追加
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // 平行光源を追加
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const boxGeometry = new THREE.BoxGeometry(1.3, 1.3, 1.3);
  // 動画テクスチャを作成する関数
  function createVideoTexture(src) {
    const video = document.createElement("video");
    video.src = src;
    video.loop = true;
    video.muted = true;
    // video.autoplay = true; // 自動再生を設定
    video.play();
    const texture = new THREE.VideoTexture(video);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    video.addEventListener("loadedmetadata", () => {
      const aspectRatio = video.videoWidth / video.videoHeight;
      if (aspectRatio > 1) {
        texture.repeat.set(1, 1 / aspectRatio);
        texture.offset.set(0, (1 - 1 / aspectRatio) / 2);
      } else {
        texture.repeat.set(aspectRatio, 1);
        texture.offset.set((1 - aspectRatio) / 2, 0);
      }
    });

    return texture;
    // return new THREE.VideoTexture(video);
  }

  const videoTextures = [
    createVideoTexture("public/video/kemuri.mp4"),
    createVideoTexture("public/video/kemuri.mp4"),
    createVideoTexture("public/video/kemuri.mp4"),
    createVideoTexture("public/video/about-Shungo-video.mp4"),
    createVideoTexture("public/video/contact-Shungo-video.mp4"),
    createVideoTexture("public/video/work-Shungo-video.mp4"),
  ];

  const materials = videoTextures
    .slice(0, 3) // videoTextures 配列の最初の3つを取得
    .map(
      () =>
        new THREE.MeshPhongMaterial({
          color: 0xffffff, // 通常は白色
          // map: texture,
          transparent: true,
          opacity: 1,
          // color: 0x000000, // 黒色
        })
    );

  const sectionIds = ["about", "work", "contact"];
  let boxes = materials.map((material, index) => {
    const box = new THREE.Mesh(boxGeometry, materials[index]);
    // 各ボックスの位置を設定
    if (index === 0) {
      box.position.set(0, 1, 2); // ボックス1: 上部中央
    } else if (index === 1) {
      box.position.set(2, -1, 2); // ボックス2: 下部中央
    } else if (index === 2) {
      box.position.set(-2, -1, 2); // ボックス3: 左下
    }

    box.userData.sectionId = sectionIds[index]; // セクションIDを設定
    if (!hash || hash === "home") {
      scene.add(box);
    }
    // handleRouting()
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
  // Raycasterとマウスベクトルの設定
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  resizeRenderer(); // 初回リサイズ
  animate();
  // ボックスへのクリックイベント追加
  window.addEventListener("click", (event) => {
    homeLink.classList.remove("active");

    // マウス座標を正規化
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycasterを更新
    raycaster.setFromCamera(mouse, camera);

    // ボックスとの交差判定
    const intersects = raycaster.intersectObjects(boxes);
    if (intersects.length > 0) {
      const clickedBox = intersects[0].object;
      const sectionId = clickedBox.userData.sectionId;

      // 他のアクション（セクション表示など）もここで追加可能
      console.log(`Clicked on box for section: ${sectionId}`);
      // ボックスを即座に削除し、boxes配列も空にする
      boxes.forEach((box) => {
        scene.remove(box);
      });
      boxes.length = 0; // boxes配列を空にする
      window.location.hash = sectionId; // URLのハッシュを変更
      // let index = boxes.indexOf(clickedBox); // クリックされたボックスのインデックス
      // resetBox(index);
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

  function recreateBoxes() {
    // 既存のボックスを削除
    boxes.forEach((box) => scene.remove(box));
    boxes.length = 0;

    // ボックスを再生成
    boxes = materials.map((material, index) => {
      const box = new THREE.Mesh(boxGeometry, materials[index]);
      if (index === 0) {
        box.position.set(0, 1, 2);
      } else if (index === 1) {
        box.position.set(2, -1, 2);
      } else if (index === 2) {
        box.position.set(-2, -1, 2);
      }
      box.userData.sectionId = sectionIds[index];
      scene.add(box);
      console.log(`Box ${index} created:`, box);
      return box;
    });
    // boxes 配列の長さをログに出力
    console.log("Boxes recreated, current length:", boxes.length);
    // ボックスの動画をリセット;
    boxes.forEach((box, index) => {
      resetBox(index); // 動画をリセット
    });
  }

  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    sections.style.display = "none";
    homeLink.classList.add("active");
    // URLのハッシュを消去
    history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search
    );
    recreateBoxes();
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
      { opacity: 1, y: 0, duration: 0.5, delay: 0.5 }
    );

    setTimeout(() => {
      contactForm.reset();
      gsap.to(formGroups, { opacity: 1, y: 0, duration: 0.3, stagger: 0.1 });
      gsap.to(submitBtn, { opacity: 1, y: 0, duration: 0.3 });
      gsap.to(formStatus, { opacity: 0, duration: 0.3, delay: 2 });
    }, 3000);
  });
  if (!first) {
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
  }
  // Tweakpane setup
  const pane = new Tweakpane.Pane();

  pane
    .addInput(PARAMS, "animationSpeed", { min: 0.1, max: 2 })
    .on("change", () => {
      console.log("Animation speed changed:", PARAMS.animationSpeed);
    });
});
