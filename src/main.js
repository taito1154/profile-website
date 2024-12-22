import * as THREE from "../node_modules/three/build/three.module.js";

const PARAMS = {
  animationSpeed: 0.5,
  introAnimationDuration: 10,
};
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

  function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(boxes);

    boxes.forEach((box, index) => {
      if (intersects.length > 0 && intersects[0].object === box) {
        box.material.map = videoTextures[index];
        // box.material.color.setHex(0xffffff);
        box.material.needsUpdate = true;
        playVideoSequence(index);
      } else {
        // box.material.map = null;
        // 動画を外す（元の白に戻す）
        if (box.material.map !== null) {
          box.material.map = null;
          box.material.needsUpdate = true;
        }
      }
      // box.material.needsUpdate = true;
    });
  }
  window.addEventListener("mousemove", onMouseMove, false);
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
    createVideoTexture("video/kemuri.mp4"),
    createVideoTexture("video/kemuri.mp4"),
    createVideoTexture("video/kemuri.mp4"),
    createVideoTexture("video/about-Shungo-video.mp4"),
    createVideoTexture("video/contact-Shungo-video.mp4"),
    createVideoTexture("video/work-Shungo-video.mp4"),
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
  // const materials = [
  //   new THREE.MeshPhongMaterial({ color: 0xffffff }),
  //   new THREE.MeshPhongMaterial({ color: 0xff0000 }),
  //   new THREE.MeshPhongMaterial({ color: 0x0000ff }),
  // ];
  const sectionIds = ["about", "work", "contact"];
  const boxes = materials.map((material, index) => {
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
  // Raycasterとマウスベクトルの設定
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  resizeRenderer(); // 初回リサイズ
  animate();

  function playVideoSequence(index) {
    const videoTexture = videoTextures[index];
    const video = videoTexture?.image; // VideoTexture の video 要素を取得
    if (!video) return;
    // 現在の動画を再生
    video.currentTime = 0; // 再生位置をリセット
    video.loop = false; // 最初の動画は通常再生
    video.play();

    // 数秒後にフェードアウトと次の動画再生を実行
    setTimeout(() => {
      gsap.to(boxes[index].material, {
        opacity: 0,
        duration: 3, // フェードアウト時間
        onComplete: () => {
          // 次の動画を再生（ループまたは順次再生）
          const nextIndex = index + 3;
          const nextVideoTexture = videoTextures[nextIndex];
          const nextVideo = nextVideoTexture?.image;
          if (nextVideo) {
            nextVideo.currentTime = 0; // 再生位置をリセット
            nextVideo.loop = true; // 次の動画はループ再生
            nextVideo.play();
            // 次のボックスにテクスチャを適用し、フェードイン
            boxes[index].material.map = nextVideoTexture; // 次のテクスチャを適用
            gsap.to(boxes[index].material, {
              opacity: 1,
              duration: 2, // フェードイン時間
            });
          }
        },
      });
    }); // 3秒後にフェードアウト
  }

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
      const clickedBox = intersects[0].object;
      const sectionId = clickedBox.userData.sectionId;

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
      console.log(`Clicked on box for section: ${sectionId}`);

      // セクション表示ロジックなどもここに追加できます
      const sections = document.querySelector(".sections");
      sections.style.display = "block"; // セクションを表示する例
      document.querySelectorAll(".section").forEach((section) => {
        if (section.id === sectionId) {
          section.style.display = "block";
          animateSection(section);
        } else {
          section.style.display = "none";
        }
      });
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

  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    sections.style.display = "none";
    bigButtons.style.display = "flex";
    homeLink.classList.add("active");
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
