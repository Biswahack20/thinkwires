import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const ThinkWiresAnimation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FAF8FF'); // Matches the theme background

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 2000);
    camera.position.set(0, 0, 420);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(140, 180, 260);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.7);
    fillLight.position.set(-140, -90, 180);
    scene.add(fillLight);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    const colCobalt = 0x004b87;
    const colMidBlue = 0x0284c7;
    const colVividLime = 0x22c55e;
    const colBrightEmerald = 0x10b981;

    const matCobalt = new THREE.MeshPhongMaterial({
      color: colCobalt,
      specular: 0x38bdf8,
      shininess: 85,
    });
    const matMidBlue = new THREE.MeshPhongMaterial({
      color: colMidBlue,
      specular: 0x7dd3fc,
      shininess: 85,
    });
    const matLime = new THREE.MeshPhongMaterial({
      color: colVividLime,
      specular: 0x86efac,
      shininess: 95,
    });
    const matEmerald = new THREE.MeshPhongMaterial({
      color: colBrightEmerald,
      specular: 0xa7f3d0,
      shininess: 90,
    });

    const globeCenter = new THREE.Group();
    globeCenter.position.set(-80, 0, 0);
    masterGroup.add(globeCenter);

    const GLOBE_RADIUS = 64;
    const tileMeshes = [];
    const LAT_BANDS = 18;

    for (let lat = 1; lat < LAT_BANDS; lat++) {
      const phi = (lat / LAT_BANDS) * Math.PI;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const ringRadius = GLOBE_RADIUS * sinPhi;
      const yPos = GLOBE_RADIUS * cosPhi;

      const LON_STEPS = Math.max(10, Math.round(34 * sinPhi));
      const tileW = (2 * Math.PI * ringRadius) / (LON_STEPS * 1.5);
      const tileH = (Math.PI * GLOBE_RADIUS) / (LAT_BANDS * 1.45);
      const tileD = 3.6;

      const boxGeom = new THREE.BoxGeometry(tileW, tileH, tileD);

      for (let lon = 0; lon < LON_STEPS; lon++) {
        const theta = (lon / LON_STEPS) * Math.PI * 2;
        const xPos = ringRadius * Math.cos(theta);
        const zPos = ringRadius * Math.sin(theta);

        if (zPos < -15) continue;

        const normX = xPos / GLOBE_RADIUS;
        const normY = yPos / GLOBE_RADIUS;

        let isEmpty = false;
        let isGreen = false;

        if (normX > 0.05) {
          if (normY > -0.55 && normY < 0.55) {
            isEmpty = true;
          }
        }

        if (normX > 0.0) isGreen = true;
        if (normX > -0.2 && (normY > 0.6 || normY < -0.6)) isGreen = true;

        if (isEmpty) continue;

        let tileMat = matCobalt;
        if (isGreen) {
          tileMat = Math.random() > 0.5 ? matLime : matEmerald;
        } else {
          tileMat = Math.random() > 0.75 ? matMidBlue : matCobalt;
        }

        const mesh = new THREE.Mesh(boxGeom, tileMat);
        mesh.position.set(xPos, yPos, zPos);
        mesh.lookAt(xPos * 2, yPos * 2, zPos * 2);
        globeCenter.add(mesh);

        const burstDistance = 600 + Math.random() * 800;
        const bTheta = Math.random() * Math.PI * 2;
        const bPhi = Math.acos(Math.random() * 2 - 1);
        const startPos = new THREE.Vector3(
          xPos + burstDistance * Math.sin(bPhi) * Math.cos(bTheta),
          yPos + burstDistance * Math.cos(bPhi),
          zPos + burstDistance * Math.sin(bPhi) * Math.sin(bTheta)
        );

        tileMeshes.push({
          mesh: mesh,
          targetPos: new THREE.Vector3(xPos, yPos, zPos),
          startPos: startPos,
          delay: (lon / LON_STEPS) * 0.25 + (lat / LAT_BANDS) * 0.25,
        });
      }
    }

    const SPARK_COUNT = 240;
    const sGeom = new THREE.BufferGeometry();
    const sPositions = new Float32Array(SPARK_COUNT * 3);
    const sColors = new Float32Array(SPARK_COUNT * 3);

    for (let i = 0; i < SPARK_COUNT; i++) {
      const r = 80 + Math.random() * 260;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      sPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      sPositions[i * 3 + 1] = r * Math.cos(phi);
      sPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      if (Math.random() > 0.45) {
        sColors[i * 3] = 0.13;
        sColors[i * 3 + 1] = 0.77;
        sColors[i * 3 + 2] = 0.37;
      } else {
        sColors[i * 3] = 0.0;
        sColors[i * 3 + 1] = 0.29;
        sColors[i * 3 + 2] = 0.53;
      }
    }
    sGeom.setAttribute('position', new THREE.BufferAttribute(sPositions, 3));
    sGeom.setAttribute('color', new THREE.BufferAttribute(sColors, 3));

    const sMat = new THREE.PointsMaterial({
      size: 3.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.NormalBlending,
    });
    const sparks = new THREE.Points(sGeom, sMat);
    scene.add(sparks);

    const textGroup = new THREE.Group();
    textGroup.position.set(-10, -5, 0);
    textGroup.scale.set(1.5, 1.5, 1.5);
    masterGroup.add(textGroup);

    const textCanvas = document.createElement('canvas');
    textCanvas.width = 4096;
    textCanvas.height = 1024;
    const ctx = textCanvas.getContext('2d');

    function drawPerfectWordmark() {
      ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
      const brandBlue = '#004B87';
      const brandLime = '#22C55E';
      const taglineBlue = '#0284C7';
      const fontSize = 350;
      ctx.font = `900 ${fontSize}px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`;
      ctx.textBaseline = 'alphabetic';

      const startX = 60;
      const startY = 480;

      ctx.fillStyle = brandBlue;
      ctx.fillText('THINK', startX, startY);
      const thinkW = ctx.measureText('THINK').width;

      ctx.fillStyle = brandLime;
      const wX = startX + thinkW + 8;
      ctx.fillText('W', wX, startY);
      const wW = ctx.measureText('W').width;

      ctx.fillStyle = brandBlue;
      const iresX = wX + wW + 8;
      ctx.fillText('IRES', iresX, startY);

      ctx.font = `600 134px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = taglineBlue;
      ctx.fillText(
        'Your partner in digital success.',
        startX + 8,
        startY + 220
      );
    }
    drawPerfectWordmark();

    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.minFilter = THREE.LinearFilter;
    textTexture.magFilter = THREE.LinearFilter;

    const textTiles = [];
    const pxTo3D = 210 / 4096;
    const pyTo3D = 52.5 / 1024;

    const createTextFragment = (xPix, yPix, wPix, hPix) => {
      const pad = 15;
      xPix -= pad;
      wPix += pad * 2;
      yPix -= pad;
      hPix += pad * 2;

      const fragW = wPix * pxTo3D;
      const fragH = hPix * pyTo3D;
      const tGeo = new THREE.PlaneGeometry(fragW, fragH);
      const uvs = tGeo.attributes.uv.array;

      for (let i = 0; i < uvs.length; i += 2) {
        const isRight = uvs[i] > 0.5;
        const isTop = uvs[i + 1] > 0.5;
        uvs[i] = (xPix + (isRight ? wPix : 0)) / 4096;
        uvs[i + 1] = (1024 - (yPix + (isTop ? 0 : hPix))) / 1024;
      }

      const tMat = new THREE.MeshBasicMaterial({
        map: textTexture,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
      });
      const tMesh = new THREE.Mesh(tGeo, tMat);

      const xPos = -35 + (xPix + wPix / 2) * pxTo3D;
      const yPos = 24.25 - (yPix + hPix / 2) * pyTo3D;
      const zPos = 15;

      const burstDistance = 600 + Math.random() * 800;
      const bTheta = Math.random() * Math.PI * 2;
      const bPhi = Math.acos(Math.random() * 2 - 1);
      const startPos = new THREE.Vector3(
        xPos + burstDistance * Math.sin(bPhi) * Math.cos(bTheta),
        yPos + burstDistance * Math.cos(bPhi),
        zPos + burstDistance * Math.sin(bPhi) * Math.sin(bTheta)
      );

      tMesh.position.copy(startPos);
      const startRot = new THREE.Euler(
        (Math.random() - 0.5) * Math.PI * 4,
        (Math.random() - 0.5) * Math.PI * 4,
        (Math.random() - 0.5) * Math.PI * 4
      );
      tMesh.rotation.copy(startRot);

      textGroup.add(tMesh);
      textTiles.push({
        mesh: tMesh,
        targetPos: new THREE.Vector3(xPos, yPos, zPos),
        startPos: startPos,
        startRot: startRot,
        delay: Math.random() * 0.4,
      });
    };

    ctx.font = `900 350px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`;
    const word1 = 'THINK';
    for (let i = 0; i < word1.length; i++) {
      const preW = ctx.measureText(word1.substring(0, i)).width;
      const charW = ctx.measureText(word1[i]).width;
      createTextFragment(60 + preW, 120, charW, 400);
    }

    const thinkW = ctx.measureText('THINK').width;
    const wW = ctx.measureText('W').width;
    createTextFragment(60 + thinkW + 8, 120, wW, 400);

    const word3 = 'IRES';
    for (let i = 0; i < word3.length; i++) {
      const preW = ctx.measureText(word3.substring(0, i)).width;
      const charW = ctx.measureText(word3[i]).width;
      createTextFragment(60 + thinkW + 8 + wW + 8 + preW, 120, charW, 400);
    }

    ctx.font = `600 134px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`;
    const tagW = ctx.measureText('Your partner in digital success.').width;
    createTextFragment(60 + 8, 540, tagW, 200);

    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 512;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(256, 64, 10, 256, 64, 220);
    sGrad.addColorStop(0, 'rgba(0, 75, 135, 0.15)');
    sGrad.addColorStop(0.5, 'rgba(0, 75, 135, 0.04)');
    sGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 512, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.75,
    });
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(360, 75),
      shadowMat
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -68, 0);
    masterGroup.add(shadowPlane);

    // --- REAL 3D TEXT GEOMETRY SETUP ---
    const textSequenceGroup = new THREE.Group();
    // Camera is at z = -180. We place text at z = -350
    textSequenceGroup.position.set(0, 0, -350);
    scene.add(textSequenceGroup);

    const phrases = [
      'THINKWIRE STAFFING\nAI-Powered Gatekeeper\nSeamless Talent Matching',
      'INTELLIGENT SCORING\nVector Semantic Search\nPredictive Candidate Fit',
      'DYNAMIC BENCH LEDGER\nTrack Unassigned Resources\nSingle-Click Redeployment',
      'PROCTORED ASSESSMENTS\nCustom AI Generated Tests\nReal-Time Activity Monitoring',
      'AUTOMATED PIPELINES\nReduce Time-to-Fill by 30%\nMaximize Internal Utilization',
      'EXECUTIVE ANALYTICS\nLive Business Intelligence\nMargin & Fulfillment Metrics',
      'YOUR PARTNER\nIn Digital Success.',
    ];

    let phraseGroups = [];

    const loader = new FontLoader();
    loader.load('/fonts/optimer_regular.typeface.json', (font) => {
      phrases.forEach((text, pIndex) => {
        const group = new THREE.Group();
        const lines = text.split('\n');
        const yOffsets = lines.length > 2 ? [16, -2, -20] : [8, -10];

        if (!group.userData.chars) group.userData.chars = [];

        lines.forEach((line, lIndex) => {
          const isTitle = lIndex === 0;
          const spaceWidth = isTitle ? 3.5 : 2.5;
          const letterSpacing = isTitle ? 0.3 : 0.1;

          const lineGroup = new THREE.Group();
          let currentX = 0;
          let wordIdx = 0;

          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === ' ') {
              currentX += spaceWidth;
              wordIdx++;
              continue;
            }

            const textGeo = new TextGeometry(char, {
              font: font,
              size: isTitle ? 10 : 7,
              depth: 1,
              curveSegments: 12,
              bevelEnabled: true,
              bevelThickness: 0.3,
              bevelSize: 0.1,
              bevelSegments: 3,
            });

            textGeo.computeBoundingBox();
            const charWidth =
              textGeo.boundingBox.max.x - textGeo.boundingBox.min.x;
            textGeo.translate(-charWidth / 2, 0, 0);

            const mat = new THREE.MeshPhongMaterial({
              color: 0x050505,
              specular: 0x333333,
              shininess: 30,
            });
            const charMesh = new THREE.Mesh(textGeo, mat);
            charMesh.position.x = currentX + charWidth / 2;

            lineGroup.add(charMesh);
            group.userData.chars.push({
              mesh: charMesh,
              baseX: charMesh.position.x,
              lIndex: lIndex,
              wordIdx: wordIdx,
              charIdx: i,
            });

            currentX += charWidth + letterSpacing;
          }

          lineGroup.position.x = -currentX / 2;
          lineGroup.position.y = yOffsets[lIndex];
          group.add(lineGroup);
        });

        group.position.x = -1500;
        group.position.y = 0;
        textSequenceGroup.add(group);
        phraseGroups.push(group);
      });
    });

    let mouseX = 0,
      mouseY = 0;
    let targetMouseX = 0,
      targetMouseY = 0;
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      targetMouseX = (x / (rect.width || window.innerWidth) - 0.5) * 2;
      targetMouseY = (y / (rect.height || window.innerHeight) - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const initialScale = new THREE.Vector3(1.4, 1.4, 1.4);
    const centerPos = new THREE.Vector3(20, 0, 0);

    masterGroup.scale.copy(initialScale);
    masterGroup.position.copy(centerPos);

    let clock = new THREE.Clock();
    let animTime = 0;
    let reqId;

    function animate() {
      reqId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      animTime += dt;

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const TEXT_DURATION = phrases.length * 2.5;
      const TOTAL_DURATION = 7.0 + TEXT_DURATION;
      const localTime = animTime % TOTAL_DURATION;

      if (localTime < 7.0) {
        // PHASE 1: LOGO ANIMATION
        masterGroup.visible = true;
        textSequenceGroup.visible = false;

        masterGroup.rotation.y =
          mouseX * 0.08 + Math.sin(localTime * 0.35) * 0.012;
        masterGroup.rotation.x =
          -mouseY * 0.06 + Math.cos(localTime * 0.3) * 0.008;

        const assembleProgress = Math.min(1.0, localTime / 4.0);
        const f = 1 - assembleProgress;
        const assembleEase = 1 - f * f * ((1.70158 + 1) * f - 1.70158);

        globeCenter.rotation.y = (1 - assembleEase) * Math.PI * 2;
        globeCenter.rotation.x = (1 - assembleEase) * Math.PI + 0.4;
        globeCenter.rotation.z = 0.35;
        sparks.rotation.y = -localTime * 0.08;

        for (let i = 0; i < textTiles.length; i++) {
          const t = textTiles[i];
          const p = Math.max(
            0,
            Math.min(1, (assembleEase - t.delay) / (1 - t.delay + 0.001))
          );
          t.mesh.position.lerpVectors(t.startPos, t.targetPos, p);
          t.mesh.rotation.set(
            t.startRot.x * (1 - p),
            t.startRot.y * (1 - p),
            t.startRot.z * (1 - p)
          );
          t.mesh.material.opacity = Math.min(1.0, p * 1.5);
        }

        for (let i = 0; i < tileMeshes.length; i++) {
          const t = tileMeshes[i];
          const p = Math.max(
            0,
            Math.min(
              1,
              (assembleEase - t.delay * 0.25) / (1 - t.delay * 0.25 + 0.001)
            )
          );
          t.mesh.position.lerpVectors(t.startPos, t.targetPos, p);
        }

        if (localTime < 5.5) {
          camera.position.z = 420 + Math.max(0, 1 - assembleEase) * 250;
          keyLight.intensity = 1.4 + Math.max(0, 1 - assembleEase) * 2.0;
        } else {
          // Cinematic Fly-Through (5.5s to 7.0s)
          const fadeTime = localTime - 5.5;
          const fadeOutProgress = Math.min(1.0, fadeTime / 1.5);
          const flyEase = fadeOutProgress * fadeOutProgress * fadeOutProgress;

          camera.position.z = 420 - flyEase * 600; // Drops to -180
          masterGroup.rotation.y += flyEase * 0.15;
          masterGroup.rotation.x -= flyEase * 0.08;
          keyLight.intensity = 1.4 + Math.sin(fadeOutProgress * Math.PI) * 3.0;
        }
      } else {
        // PHASE 2: TEXT SEQUENCE
        masterGroup.visible = false;
        textSequenceGroup.visible = true;

        camera.position.z = -180;
        keyLight.intensity = 1.0;

        const textPhaseTime = localTime - 7.0;
        const phraseDuration = 2.5;

        if (phraseGroups.length === phrases.length) {
          phraseGroups.forEach((group, index) => {
            const t = textPhaseTime - index * phraseDuration;
            if (t < -0.2 || t > phraseDuration + 0.4) {
              group.position.x = -1500; // Keep completely off-screen horizontally
              group.position.y = 0;
            } else {
              const p = Math.max(0, Math.min(1, t / phraseDuration)); // 0 to 1

              group.position.x = 0;
              group.position.y = 0;
              group.rotation.y = 0;
              group.rotation.x = 0;
              group.scale.setScalar(0.9 + p * 0.1); // Slow push

              if (group.userData.chars) {
                group.userData.chars.forEach((charData, idx) => {
                  // Floating wave effect
                  const wave = Math.sin(animTime * 4 + idx * 0.15) * 0.6;
                  charData.mesh.position.y = wave;

                  // Word by word / line by line cascading entry
                  const delay =
                    charData.lIndex * 0.2 +
                    charData.wordIdx * 0.04 +
                    charData.charIdx * 0.005;

                  let charX = charData.baseX;
                  let charRotY = 0;
                  let charScale = 1;

                  if (t < delay) {
                    charX = charData.baseX - 80;
                    charRotY = Math.PI;
                    charScale = 0.001;
                  } else if (t < delay + 0.3) {
                    const enterP = (t - delay) / 0.3;
                    const smoothEase = 1 - Math.pow(1 - enterP, 4);
                    charX = charData.baseX - 80 * (1 - smoothEase);
                    charRotY = (1 - smoothEase) * Math.PI;
                    charScale = smoothEase;
                  } else if (t > phraseDuration - 0.4 + delay * 0.5) {
                    const exitP =
                      (t - (phraseDuration - 0.4 + delay * 0.5)) / 0.3;
                    const clampedExitP = Math.max(0, Math.min(1, exitP));
                    const smoothEase = Math.pow(clampedExitP, 4);
                    charX = charData.baseX + 80 * smoothEase;
                    charRotY = -smoothEase * Math.PI;
                    charScale = 1 - smoothEase;
                  } else {
                    charX = charData.baseX;
                    charRotY = 0;
                    charScale = 1;
                  }

                  // Apply horizontal center drift
                  const holdP = (p - 0.15) / 0.7;
                  charX += holdP * 12 - 6;

                  charData.mesh.position.x = charX;
                  charData.mesh.rotation.y = charRotY;
                  charData.mesh.scale.setScalar(Math.max(0.001, charScale));
                });
              }
            }
          });
        }
      }

      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-50`}
      style={{
        backgroundColor: 'transparent',
      }}
    />
  );
};

export default ThinkWiresAnimation;
