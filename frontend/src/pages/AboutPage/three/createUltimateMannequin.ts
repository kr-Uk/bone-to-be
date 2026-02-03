import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

export type MannequinType = "straight" | "wave" | "natural";

type CleanupFn = () => void;

export const createUltimateMannequin = (
  type: MannequinType,
  container: HTMLDivElement,
): CleanupFn => {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.04);

  const camera = new THREE.PerspectiveCamera(
    40,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  );
  camera.position.set(0, 1.0, 7.5);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ReinhardToneMapping;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.2));

  const keyLight = new THREE.DirectionalLight(0x9810fa, 2.0);
  keyLight.position.set(5, 5, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xa78bfa, 1.0);
  fillLight.position.set(-5, 2, 5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
  rimLight.position.set(0, 5, -5);
  scene.add(rimLight);

  const skinMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.4,
    transparent: true,
    opacity: 0.9,
    clearcoat: 1.0,
    ior: 1.5,
    thickness: 0.5,
  });

  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x9810fa,
    wireframe: true,
    transparent: true,
    opacity: 0.05,
  });

  const jointMaterial = new THREE.MeshBasicMaterial({
    color: 0x9810fa,
    transparent: true,
    opacity: 0.8,
  });

  const mannequin = new THREE.Group();
  const disposables: Array<THREE.BufferGeometry | THREE.Material> = [];

  const addWire = (mesh: THREE.Mesh, geometry: THREE.BufferGeometry) => {
    const wire = new THREE.Mesh(geometry, wireMaterial);
    mesh.add(wire);
  };

  const createJoint = (radius: number, x: number, y: number, z: number) => {
    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    const mesh = new THREE.Mesh(geometry, jointMaterial);
    mesh.position.set(x, y, z);
    disposables.push(geometry);

    const glowGeo = new THREE.SphereGeometry(radius * 1.5, 16, 16);
    const glowMesh = new THREE.Mesh(
      glowGeo,
      new THREE.MeshBasicMaterial({ color: 0x9810fa, transparent: true, opacity: 0.15 }),
    );
    mesh.add(glowMesh);
    disposables.push(glowGeo);
    return mesh;
  };

  const createLimb = (points: THREE.Vector3[], radius: number) => {
    const start = points[0];
    const end = points[points.length - 1];
    const dir = new THREE.Vector3().subVectors(end, start);
    const length = dir.length();

    const geometry = new THREE.CylinderGeometry(radius, radius, length, 12);
    const mesh = new THREE.Mesh(geometry, skinMaterial);
    addWire(mesh, geometry);
    disposables.push(geometry);

    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mesh.position.copy(mid);

    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
    mesh.setRotationFromQuaternion(quat);

    return mesh;
  };

  const torsoLathe = (points: THREE.Vector2[]) => {
    const geometry = new THREE.LatheGeometry(points, 32);
    const mesh = new THREE.Mesh(geometry, skinMaterial);
    addWire(mesh, geometry);
    disposables.push(geometry);
    return mesh;
  };

  const config = {
    straight: { sW: 0.55, wY: 2.0, hW: 0.5, tZ: 1.0, neck: false },
    wave: { sW: 0.38, wY: 1.7, hW: 0.6, tZ: 0.8, neck: false },
    natural: { sW: 0.72, wY: 1.9, hW: 0.45, tZ: 1.0, neck: false },
  }[type];

  const headGeo = new THREE.SphereGeometry(0.35, 32, 32);
  headGeo.scale(0.9, 1.1, 0.95);
  const head = new THREE.Mesh(headGeo, skinMaterial);
  addWire(head, headGeo);
  head.position.y = 3.3;
  mannequin.add(head);
  disposables.push(headGeo);

  const neckLen = config.neck ? 0.5 : 0.35;
  const neckY = 3.3 - 0.35 - neckLen / 2;
  const neckGeo = new THREE.CylinderGeometry(0.11, 0.12, neckLen, 16);
  const neck = new THREE.Mesh(neckGeo, skinMaterial);
  neck.position.y = neckY;
  mannequin.add(neck);
  disposables.push(neckGeo);

  const torsoPoints: THREE.Vector2[] = [
    new THREE.Vector2(0.1, 2.8),
    new THREE.Vector2(config.sW * 0.8, 2.6),
    new THREE.Vector2(type === "straight" ? 0.5 : 0.45, 2.3),
    new THREE.Vector2(type === "straight" ? 0.45 : 0.35, config.wY),
    new THREE.Vector2(config.hW, config.wY - 0.5),
    new THREE.Vector2(0.1, config.wY - 0.8),
  ];

  const torso = torsoLathe(torsoPoints);
  torso.scale.set(1, 1, config.tZ * 0.8);
  mannequin.add(torso);

  const shoulderGeo = new THREE.CylinderGeometry(0.04, 0.04, config.sW * 2.2, 8);
  const shoulderLine = new THREE.Mesh(shoulderGeo, jointMaterial);
  shoulderLine.rotation.z = Math.PI / 2;
  shoulderLine.position.y = 2.65;
  mannequin.add(shoulderLine);
  disposables.push(shoulderGeo);

  const armR = 0.1;
  const legR = 0.13;
  const jointSize = 0.08;

  [-1, 1].forEach((dir) => {
    const sX = dir * config.sW;
    const eX = dir * (config.sW + 0.2);
    const wX = dir * (config.sW + 0.3);

    mannequin.add(createJoint(jointSize, sX, 2.65, 0));
    mannequin.add(createJoint(jointSize * 0.9, eX, 1.9, 0.1));
    mannequin.add(createJoint(jointSize * 0.8, wX, 1.2, 0.2));

    mannequin.add(
      createLimb(
        [
          new THREE.Vector3(sX, 2.65, 0),
          new THREE.Vector3(sX + dir * 0.05, 2.3, 0.05),
          new THREE.Vector3(eX, 1.9, 0.1),
        ],
        armR,
      ),
    );

    mannequin.add(
      createLimb(
        [
          new THREE.Vector3(eX, 1.9, 0.1),
          new THREE.Vector3(eX + dir * 0.05, 1.5, 0.15),
          new THREE.Vector3(wX, 1.2, 0.2),
        ],
        armR * 0.8,
      ),
    );
  });

  [-1, 1].forEach((dir) => {
    const hX = dir * (config.hW * 0.5);
    const kY = config.wY - 1.4;
    const aY = config.wY - 2.4;

    mannequin.add(createJoint(jointSize, hX, config.wY - 0.6, 0));
    mannequin.add(createJoint(jointSize, hX, kY, 0.05));
    mannequin.add(createJoint(jointSize * 0.9, hX, aY, 0));

    mannequin.add(
      createLimb(
        [
          new THREE.Vector3(hX, config.wY - 0.6, 0),
          new THREE.Vector3(hX + dir * 0.05, config.wY - 1.0, 0.05),
          new THREE.Vector3(hX, kY, 0.05),
        ],
        legR,
      ),
    );

    mannequin.add(
      createLimb(
        [
          new THREE.Vector3(hX, kY, 0.05),
          new THREE.Vector3(hX + dir * 0.02, kY - 0.4, 0),
          new THREE.Vector3(hX, aY, 0),
        ],
        legR * 0.8,
      ),
    );
  });

  const ringGeo = new THREE.TorusGeometry(1.8, 0.02, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x9810fa, transparent: true, opacity: 0.8 });
  const scanRing = new THREE.Mesh(ringGeo, ringMat);
  scanRing.rotation.x = Math.PI / 2;
  scene.add(scanRing);
  disposables.push(ringGeo);

  mannequin.position.y = -1.5;
  scene.add(mannequin);

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    0.4,
    0.5,
    0.85,
  );
  composer.addPass(bloomPass);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const motionEnabled = !prefersReducedMotion;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.autoRotate = motionEnabled;
  controls.autoRotateSpeed = 2.0;
  controls.addEventListener("start", () => {
    controls.autoRotate = false;
  });

  const clock = new THREE.Clock();

  let frameId = 0;
  const animate = () => {
    frameId = requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    if (motionEnabled) {
      mannequin.position.y = -1.5 + Math.sin(time) * 0.05;
      scanRing.position.y = Math.sin(time * 1.5) * 1.5 + 1.0;
    }

    controls.update();
    composer.render();
  };
  animate();

  const handleResize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    composer.setSize(width, height);
  };

  window.addEventListener("resize", handleResize);

  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", handleResize);
    controls.dispose();
    composer.dispose();
    renderer.dispose();

    disposables.forEach((item) => {
      item.dispose();
    });
    skinMaterial.dispose();
    wireMaterial.dispose();
    jointMaterial.dispose();

    container.innerHTML = "";
  };
};
