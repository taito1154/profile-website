// import { float } from "three/tsl";
import * as THREE from "../node_modules/three/build/three.module.js";
import "../styles/styles.scss";

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
        if (section.id === "work") {
          // fsetupGuiltyPhotos();
        }
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
      video.pause();
      video.currentTime = 0;
      boxes[index].material.map = null;
      boxes[index].material.needsUpdate = true;

      // 動画を再生可能な状態に戻す
      video.loop = true;
      video.muted = true;
      video.play().catch((e) => console.log("Video play failed:", e));
    }

    // GSAPでボックスの透明度を元に戻す
    gsap.to(boxes[index].material, {
      opacity: 1,
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
    // 実行中のGSAPアニメーションを即座に停止
    gsap.killTweensOf(boxes[index].material);
    const videoTexture = videoTextures[index];
    const video = videoTexture?.image;
    if (video) {
      video.pause();
      video.currentTime = 0;
      boxes[index].material.map = null;
      boxes[index].material.needsUpdate = true;

      // 動画を再生可能な初期状態に戻す
      video.loop = true;
      video.muted = true;
      video.play().catch((e) => console.log("Video play failed:", e));

      // 即座に透明度を元に戻す
      gsap.to(boxes[index].material, {
        opacity: 1,
        duration: 0,
      });
    }
  }

  function playVideoSequence(index) {
    setTimeout(() => {
      gsap.to(boxes[index].material, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          const nextIndex = index + 3;
          const nextVideoTexture = videoTextures[nextIndex];
          const nextVideo = nextVideoTexture?.image;
          if (nextVideo) {
            // 現在のビデオを停止
            const currentVideo = videoTextures[index]?.image;
            if (currentVideo) {
              currentVideo.pause();
              currentVideo.currentTime = 0;
            }

            // 次のビデオの設定と再生
            nextVideo.currentTime = 0;
            nextVideo.loop = true;
            nextVideo.muted = true;
            nextVideo.play().catch((e) => console.log("Video play failed:", e));

            // マテリアルの更新
            boxes[index].material.map = nextVideoTexture;
            boxes[index].material.needsUpdate = true;

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

      sectionsContainer.style.display = "block";
      sections.forEach((section) => {
        if (section.id === hash) {
          section.style.display = "block";
          animateSection(section);
          if (section.id === "work") {
            setupGuiltyPhotos();
          }
        } else {
          section.style.display = "none";
        }
      });

      // ボックスを削除する代わりに非表示にする
      if (boxes.length) {
        boxes.forEach((box) => {
          gsap.to(box.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: "power3.in",
          });
        });
      }
    } else {
      sectionsContainer.style.display = "none";
      recreateBoxes();
    }
  }
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
    createVideoTexture("static/video/kemuri.mp4"),
    createVideoTexture("static/video/kemuri.mp4"),
    createVideoTexture("static/video/kemuri.mp4"),
    createVideoTexture("static/video/about-Shungo-video.mp4"),
    createVideoTexture("static/video/contact-Shungo-video.mp4"),
    createVideoTexture("static/video/work-Shungo-video.mp4"),
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
      box.scale.set(0, 0, 0); // 初期状態でスケールを0に
      scene.add(box);
    }
    // アニメーションで徐々にスケールを1に
    gsap.to(box.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.5,
      delay: PARAMS.introAnimationDuration * 0.6,
      ease: "power3.out",
    });

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
    stop = true;
    // window.removeEventListener("mousemove", onMouseMove);
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

      // クリックされた時点で全てのボックスの動画を停止し初期状態に戻す
      boxes.forEach((box, index) => {
        stopVideo(index);
        resetBox(index);

        // ボックスを非表示にする
        gsap.to(box.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.5,
          ease: "power3.in",
        });
      });

      window.location.hash = sectionId;
    }
  });

  function backScreen() {
    const container = document.getElementById("Canvas");
    const canvas = document.getElementById("threeCanvas");
    const backscene = newTHREE.Scene();
    const backcamera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    const backrenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
    });
    backrenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    const backmaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_time,
      },
      vertexShader: `
          varying vec2 vUv;
    varying vec3 vNormal; // 法線をフラグメントシェーダーに渡す
    varying vec3 vPosition; // 頂点位置をフラグメントシェーダーに渡す

    void main() {

      vUv = uv;
      vNormal = normal; // 法線を保存
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
      fragmentShader: `
          #ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
void main(){
vec2 uv=(fragcoord*2.0-iResolution.xy)/iResolution.y;
float d=length(uv);
d-=0.5;
d=abs(d);
fragcolor(u_time,u_time+1,u_time+2,1.0);
}
        `,
    });
  }

  let photos = [];
  let photoscene, photocamera, photorenderer;

  function setupGuiltyPhotos() {
    // 既存のリソースをクリーンアップ
    if (photorenderer) {
      photos.forEach((photo) => {
        if (photo.material.map) {
          photo.material.map.dispose();
        }
        photo.material.dispose();
        photo.geometry.dispose();
        photoscene.remove(photo);
      });
      photos = [];
      photorenderer.dispose();
    }

    const container = document.getElementById("Canvas");
    const canvas = document.getElementById("threeCanvas");
    photoscene = new THREE.Scene();
    photocamera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    photorenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      preserveDrawingBuffer: true,
    });

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";

    photorenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    photorenderer.setPixelRatio(window.devicePixelRatio);

    const photoPaths = [
      "static/photo/Guilty1.JPG",
      "static/photo/Guilty2.jpg",
      "static/photo/Guilty3.JPG",
    ];

    let loadedCount = 0;

    photoPaths.forEach((path, index) => {
      loader.load(
        path,
        (texture) => {
          // テクスチャがロードされたときに実行
          const imageWidth = texture.image.width;
          const imageHeight = texture.image.height;

          // アスペクト比を計算
          const aspectRatio = imageWidth / imageHeight;

          // ジオメトリの幅と高さを設定
          const width = 2; // 幅を基準に固定
          const height = width / aspectRatio; // 高さをアスペクト比に基づいて計算

          const photogeometry = new THREE.PlaneGeometry(width, height);
          const photomaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
          });

          // メッシュを作成
          const photo = new THREE.Mesh(photogeometry, photomaterial);

          // 配置位置を設定
          photo.position.set((index - 1) * (aspectRatio + 0.5), 0, 0);

          // シーンに追加
          photoscene.add(photo);
          photos.push(photo);

          loadedCount++;
          if (loadedCount === photoPaths.length) {
            // 全ての写真がロードされた後にアニメーションを開始
            animate();
          }
        },
        undefined,
        (err) => {
          console.error(`Failed to load texture at ${path}`, err);
        }
      );
    });

    photocamera.position.z = 3;

    function cleanup() {
      if (photorenderer) {
        cancelAnimationFrame(animationFrameId); // アニメーションを停止
        photos.forEach((photo) => {
          if (photo.material.map) {
            photo.material.map.dispose();
          }
          photo.material.dispose();
          photo.geometry.dispose();
          photoscene.remove(photo);
        });
        photos = [];
        photorenderer.dispose();
      }
    }

    // ハッシュが変更されたときにクリーンアップを実行
    window.addEventListener("hashchange", cleanup);

    let animationFrameId;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      photorenderer.render(photoscene, photocamera);
    }

    function onResize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      photocamera.aspect = width / height;
      photocamera.updateProjectionMatrix();
      photorenderer.setSize(width, height);
    }

    window.addEventListener("resize", onResize);
    onResize();
  }

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
    stop = false;
    // window.addEventListener("mousemove", onMouseMove);
    // 動画テクスチャを再初期化
    videoTextures.forEach((texture, index) => {
      const video = texture.image;
      if (video) {
        video.currentTime = 0;
        video.loop = true;
        video.muted = true;
        video.play().catch((e) => console.log("Video play failed:", e));
      }
    });

    boxes.forEach((box, index) => {
      // マテリアルを初期状態に戻す
      box.material.opacity = 1;
      box.material.map = null;
      box.material.needsUpdate = true;

      // スケールを0にリセット
      box.scale.set(0, 0, 0);

      // アニメーションで徐々にスケールを1に戻す
      gsap.to(box.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.5,
        ease: "power3.out",
        onComplete: () => {
          // ボックスのアニメーション完了後に動画を再生可能な状態にリセット
          resetBox(index);
        },
      });
    });

    // 現在のインタラクション状態をリセット
    currentIntersectedBox = null;
  }

  homeLink.addEventListener("click", (e) => {
    recreateBoxes();
    stop = false;
    // window.addEventListener("mousemove", onMouseMove);
    e.preventDefault();
    sections.style.display = "none";
    homeLink.classList.add("active");
    // URLのハッシュを消去
    history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search
    );

    // playVideoSequence();
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
