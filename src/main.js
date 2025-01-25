import * as THREE from "../node_modules/three/build/three.module.js";
import "../styles/styles.scss";

const PARAMS = {
  animationSpeed: 0.5,
  introAnimationDuration: 10,
};

let first = false;

// グローバル変数として定義
let boxes = [];
let videoTextures = [];

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
      createBoxes();
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

  function createBoxes() {
    // 既存のボックスをクリーンアップ
    boxes.forEach((box) => {
      scene.remove(box);
      box.geometry.dispose();
      box.material.dispose();
    });
    boxes = [];

    // 新しいvideoTexturesを作成
    videoTextures = [
      createVideoTexture("static/video/kemuri.mp4"),
      createVideoTexture("static/video/kemuri.mp4"),
      createVideoTexture("static/video/kemuri.mp4"),
      createVideoTexture("static/video/about-Shungo-video.mp4"),
      createVideoTexture("static/video/contact-Shungo-video.mp4"),
      createVideoTexture("static/video/work-Shungo-video.mp4"),
    ];

    const materials = videoTextures.slice(0, 3).map(
      () =>
        new THREE.MeshPhongMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 1,
        })
    );

    const sectionIds = ["about", "work", "contact"];
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
      box.scale.set(0, 0, 0);
      scene.add(box);

      gsap.to(box.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.5,
        delay: PARAMS.introAnimationDuration * 0.6,
        ease: "power3.out",
      });

      return box;
    });
  }

  // 元のコードの代わりにこの関数を呼び出す
  createBoxes();

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

    // 新しいcanvas要素を作成
    const backCanvas = document.createElement("canvas");
    backCanvas.id = "backCanvas";
    backCanvas.style.position = "absolute";
    backCanvas.style.top = "0";
    backCanvas.style.left = "0";
    backCanvas.style.zIndex = "1"; // 背景を後ろに
    container.appendChild(backCanvas);

    const backscene = new THREE.Scene();
    const backcamera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const backrenderer = new THREE.WebGLRenderer({
      canvas: backCanvas,
      alpha: true,
    });
    backrenderer.setSize(container.clientWidth, container.clientHeight);

    // ジオメトリとマテリアルの作成
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0.0 },
        u_resolution: {
          value: new THREE.Vector2(
            container.clientWidth,
            container.clientHeight
          ),
        },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec2 u_resolution;
        varying vec2 vUv;

        void main() {
          vec2 center = vec2(0.5, 0.5);
          vec2 pos = vUv - center;
          float dist = length(pos);
          
          float wave = sin(dist * 10.0 - u_time * 2.0) * 0.5 + 0.5;
          float circle = smoothstep(0.5, 0.4, dist);
          float pattern = wave * circle;
          
          vec3 color = vec3(0.2, 0.4, 0.8) * pattern;
          gl_FragColor = vec4(color, pattern * 0.5);
        }
      `,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    backscene.add(mesh);
    backcamera.position.z = 1;

    let animationFrameId;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      material.uniforms.u_time.value += 0.01;
      backrenderer.render(backscene, backcamera);
    }

    function onResize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      backrenderer.setSize(width, height);
      material.uniforms.u_resolution.value.set(width, height);
      backcamera.aspect = width / height;
      backcamera.updateProjectionMatrix();
    }

    window.addEventListener("resize", onResize);
    animate();

    // クリーンアップ関数を返す
    return () => {
      cancelAnimationFrame(animationFrameId);
      backrenderer.dispose();
      material.dispose();
      geometry.dispose();
      if (backCanvas.parentNode) {
        backCanvas.parentNode.removeChild(backCanvas);
      }
    };
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

    // backScreenを先に実行して背景を設定
    const cleanupBackScreen = backScreen();

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

    // キャンバスのスタイルを設定
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    // レンダラーのサイズを設定
    photorenderer.setSize(container.clientWidth, container.clientHeight);
    photorenderer.setPixelRatio(window.devicePixelRatio);

    // カメラの設定を調整
    photocamera.position.z = 3;

    function onResize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      photocamera.aspect = width / height;
      photocamera.updateProjectionMatrix();
      photorenderer.setSize(width, height);
    }

    // リサイズイベントリスナーを追加
    window.addEventListener("resize", onResize);
    onResize(); // 初期サイズを設定

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
    let animationFrameId;

    photoPaths.forEach((path, index) => {
      loader.load(
        path,
        (texture) => {
          const imageWidth = texture.image.width;
          const imageHeight = texture.image.height;

          // アスペクト比を計算
          const aspectRatio = imageWidth / imageHeight;
          const width = 2;
          const height = width / aspectRatio;

          const photogeometry = new THREE.PlaneGeometry(width, height);
          const photomaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
          });

          const photo = new THREE.Mesh(photogeometry, photomaterial);

          // 初期位置を設定：全ての写真を重ねて配置
          photo.position.set(0, 0, -index * 0.01); // Z軸で少しずつずらして重ねる

          // 2枚目と3枚目は最初は非表示
          if (index > 0) {
            photo.material.opacity = 0;
          }

          photoscene.add(photo);
          photos.push(photo);

          loadedCount++;
          if (loadedCount === photoPaths.length) {
            console.log("All photos loaded:", photos.length); // デバッグ用
            animate();
            setupHoverEffect();
          }
        },
        undefined,
        (err) => {
          console.error(`Failed to load texture at ${path}`, err);
        }
      );
    });

    function setupHoverEffect() {
      const canvas = document.getElementById("threeCanvas");
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let isHovered = false;

      canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, photocamera);
        // 1枚目の写真だけを判定対象にする
        const intersects = raycaster.intersectObject(photos[0]);

        const currentlyHovered = intersects.length > 0;
        if (currentlyHovered !== isHovered) {
          isHovered = currentlyHovered;

          if (isHovered) {
            // ホバー時のアニメーション
            gsap.to(photos[1].position, {
              x: 2,
              duration: 0.5,
              ease: "power2.out",
            });
            gsap.to(photos[2].position, {
              x: -2,
              duration: 0.5,
              ease: "power2.out",
            });
            gsap.to([photos[1].material, photos[2].material], {
              opacity: 1,
              duration: 0.5,
            });
          } else {
            // マウスが離れた時のアニメーション
            gsap.to(photos[1].position, {
              x: 0,
              duration: 0.5,
              ease: "power2.in",
            });
            gsap.to(photos[2].position, {
              x: 0,
              duration: 0.5,
              ease: "power2.in",
            });
            gsap.to([photos[1].material, photos[2].material], {
              opacity: 0,
              duration: 0.5,
            });
          }
        }
      });
    }

    // ハッシュが変更されたときのクリーンアップ処理
    const handleHashChange = () => {
      if (photorenderer) {
        cancelAnimationFrame(animationFrameId);
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
      cleanupBackScreen(); // 背景のクリーンアップも実行
    };

    // ハッシュが変更されたときにクリーンアップを実行
    window.addEventListener("hashchange", handleHashChange);

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
