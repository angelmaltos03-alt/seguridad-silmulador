import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function makeMaterial(color, roughness = 0.72, metalness = 0.08) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function addBox(parent, size, position, material, bevel = false) {
  const geometry = new THREE.BoxGeometry(...size);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  if (bevel) {
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({ color: 0x91a5b9, transparent: true, opacity: 0.32 })
    );
    mesh.add(edges);
  }
  return mesh;
}

function addCylinder(parent, radiusTop, radiusBottom, height, position, material, segments = 24) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
    material
  );
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export default function FactoryScene3D() {
  const canvasRef = useRef(null);
  const [webglReady, setWebglReady] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let renderer;
    let animationFrame = 0;
    let resizeObserver;
    let pointerDown = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let targetX = -0.12;
    let targetY = 0.48;

    try {
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x0b1421, 15, 34);

      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
      camera.position.set(10.5, 8.6, 12.5);
      camera.lookAt(0, 0.45, 0);

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;

      scene.add(new THREE.HemisphereLight(0xa9c9e8, 0x182638, 2.15));
      const keyLight = new THREE.DirectionalLight(0xd7eaff, 3.1);
      keyLight.position.set(7, 12, 5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      scene.add(keyLight);
      const cyanLight = new THREE.PointLight(0x19c6dc, 18, 18);
      cyanLight.position.set(-5, 4, 1);
      scene.add(cyanLight);
      const amberLight = new THREE.PointLight(0xffa42c, 10, 12);
      amberLight.position.set(4, 3, -3);
      scene.add(amberLight);

      const world = new THREE.Group();
      scene.add(world);

      const floorMat = makeMaterial(0x243346, 0.88);
      const darkMat = makeMaterial(0x172538, 0.76, 0.2);
      const wallMat = makeMaterial(0x526b82, 0.84);
      const roofMat = makeMaterial(0x30475d, 0.62, 0.22);
      const cyanMat = makeMaterial(0x21bfd0, 0.34, 0.35);
      const yellowMat = makeMaterial(0xf4b53f, 0.5, 0.15);
      const whiteMat = makeMaterial(0xb9c9d8, 0.62, 0.25);
      const redMat = makeMaterial(0xec5c4f, 0.38, 0.22);
      const greenMat = makeMaterial(0x34c88a, 0.4, 0.16);

      addBox(world, [13.8, 0.28, 9.6], [0, -0.28, 0], floorMat, true);
      const grid = new THREE.GridHelper(13.5, 27, 0x4b6a83, 0x344b61);
      grid.position.y = -0.125;
      world.add(grid);

      // Main production hall.
      addBox(world, [4.7, 2.7, 3.25], [-3.3, 1.2, -1.55], wallMat, true);
      addBox(world, [4.95, 0.18, 3.5], [-3.3, 2.65, -1.55], roofMat, true);
      addBox(world, [0.14, 2.0, 3.0], [-0.88, 1.0, -1.55], darkMat);
      addBox(world, [0.12, 1.75, 2.35], [-5.68, 0.98, -1.55], darkMat);
      for (let i = 0; i < 4; i += 1) {
        addBox(world, [0.08, 2.35, 0.08], [-5.4 + i * 1.38, 1.2, 0.12], cyanMat);
      }
      for (let i = 0; i < 3; i += 1) {
        addBox(world, [0.72, 0.55, 0.52], [-4.8 + i * 1.45, 0.42, -1.1], darkMat, true);
        addCylinder(world, 0.25, 0.25, 0.1, [-4.8 + i * 1.45, 0.73, -1.1], yellowMat);
      }
      addBox(world, [1.25, 0.1, 0.12], [-3.25, 2.02, 0.12], yellowMat);

      // Overhead rails and structural columns.
      addBox(world, [0.13, 3.0, 0.13], [-5.45, 1.35, -3.3], whiteMat);
      addBox(world, [0.13, 3.0, 0.13], [-1.15, 1.35, -3.3], whiteMat);
      addBox(world, [4.45, 0.13, 0.13], [-3.3, 2.82, -3.3], yellowMat);
      addBox(world, [2.8, 0.12, 0.12], [-3.3, 2.2, -3.2], cyanMat);

      // Storage silos.
      const silo = addCylinder(world, 0.72, 0.78, 2.35, [3.6, 1.05, -2.0], whiteMat, 32);
      addCylinder(world, 0.0, 0.83, 0.68, [3.6, 2.56, -2.0], roofMat, 32);
      addCylinder(world, 0.18, 0.18, 0.55, [3.6, 3.12, -2.0], darkMat);
      addBox(world, [0.15, 2.7, 0.15], [4.42, 1.15, -2.0], yellowMat);
      addCylinder(world, 0.74, 0.74, 0.08, [3.6, 0.0, -2.0], cyanMat, 32);

      // Conveyor and robotic handling zone.
      addBox(world, [4.4, 0.28, 0.76], [1.35, 0.72, 1.1], darkMat, true);
      addBox(world, [4.25, 0.12, 0.55], [1.35, 0.91, 1.1], whiteMat);
      for (let i = 0; i < 9; i += 1) {
        addCylinder(world, 0.12, 0.12, 0.62, [-0.62 + i * 0.49, 0.62, 1.1], darkMat, 16).rotation.z = Math.PI / 2;
      }
      addBox(world, [0.34, 1.48, 0.34], [2.4, 1.15, 2.0], yellowMat);
      const robotArm = new THREE.Group();
      robotArm.position.set(2.4, 1.9, 2.0);
      robotArm.add(addCylinder(robotArm, 0.24, 0.3, 0.35, [0, -0.18, 0], cyanMat));
      const upperArm = addBox(robotArm, [0.22, 1.05, 0.22], [0.28, 0.42, 0], yellowMat);
      upperArm.rotation.z = -0.52;
      const lowerArm = addBox(robotArm, [0.18, 0.82, 0.18], [0.68, 0.9, 0], whiteMat);
      lowerArm.rotation.z = 0.4;
      addBox(robotArm, [0.48, 0.1, 0.22], [0.95, 1.23, 0], darkMat);
      world.add(robotArm);

      // Safety worker: body, head and hard hat.
      addCylinder(world, 0.24, 0.3, 0.76, [-0.35, 0.58, 2.65], cyanMat);
      addCylinder(world, 0.14, 0.14, 0.2, [-0.35, 1.08, 2.65], makeMaterial(0xe2b78e));
      addCylinder(world, 0.23, 0.23, 0.13, [-0.35, 1.22, 2.65], yellowMat);
      const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.23, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), yellowMat);
      helmet.position.set(-0.35, 1.24, 2.65);
      helmet.castShadow = true;
      world.add(helmet);
      addBox(world, [0.55, 0.12, 0.08], [-0.35, 0.66, 2.35], yellowMat);

      // Marked walkways and striped restricted zone.
      addBox(world, [0.11, 0.025, 7.5], [-0.2, -0.12, 0.65], yellowMat);
      addBox(world, [0.11, 0.025, 7.5], [0.2, -0.12, 0.65], yellowMat);
      for (let i = 0; i < 7; i += 1) {
        const stripe = addBox(world, [0.24, 0.03, 0.09], [3.6 + (i % 2) * 0.15, -0.11, 0.3 + i * 0.29], yellowMat);
        stripe.rotation.y = 0.18;
      }

      // Interactive hazard location, with animated beacon and radar ring.
      const hazard = new THREE.Group();
      hazard.position.set(1.25, 0.02, 2.65);
      world.add(hazard);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.95, 0.035, 12, 64),
        new THREE.MeshBasicMaterial({ color: 0xf36b57, transparent: true, opacity: 0.9 })
      );
      ring.rotation.x = Math.PI / 2;
      hazard.add(ring);
      const ringOuter = new THREE.Mesh(
        new THREE.TorusGeometry(1.25, 0.012, 8, 64),
        new THREE.MeshBasicMaterial({ color: 0xf3b64c, transparent: true, opacity: 0.42 })
      );
      ringOuter.rotation.x = Math.PI / 2;
      ringOuter.position.y = 0.015;
      hazard.add(ringOuter);
      addCylinder(hazard, 0.19, 0.22, 0.22, [0, 0.15, 0], darkMat);
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 18, 12),
        new THREE.MeshStandardMaterial({ color: 0xff654f, emissive: 0x8d180e, emissiveIntensity: 1.4 })
      );
      beacon.position.y = 0.46;
      hazard.add(beacon);
      const beaconLight = new THREE.PointLight(0xff604b, 7, 5);
      beaconLight.position.set(0, 0.55, 0);
      hazard.add(beaconLight);

      // Small status markers on the plant floor.
      const markerA = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), greenMat);
      markerA.position.set(-4.95, 0.16, 1.8);
      world.add(markerA);
      const markerB = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), yellowMat);
      markerB.position.set(4.75, 0.16, 1.15);
      world.add(markerB);

      const onPointerDown = (event) => {
        pointerDown = true;
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        canvas.setPointerCapture?.(event.pointerId);
      };
      const onPointerMove = (event) => {
        if (!pointerDown) return;
        const deltaX = event.clientX - lastPointerX;
        const deltaY = event.clientY - lastPointerY;
        targetY += deltaX * 0.006;
        targetX = Math.max(-0.4, Math.min(0.25, targetX + deltaY * 0.003));
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
      };
      const onPointerUp = () => { pointerDown = false; };

      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', onPointerUp);
      canvas.addEventListener('pointercancel', onPointerUp);

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      resize();

      const clock = new THREE.Clock();
      const render = () => {
        const elapsed = clock.getElapsedTime();
        world.rotation.y += (targetY - world.rotation.y) * 0.035;
        world.rotation.x += (targetX - world.rotation.x) * 0.035;
        beacon.scale.setScalar(1 + Math.sin(elapsed * 3.5) * 0.12);
        beaconLight.intensity = 5.5 + (Math.sin(elapsed * 3.5) + 1) * 2.3;
        ring.scale.setScalar(1 + (Math.sin(elapsed * 1.7) + 1) * 0.035);
        silo.rotation.y = Math.sin(elapsed * 0.12) * 0.025;
        renderer.render(scene, camera);
        animationFrame = window.requestAnimationFrame(render);
      };
      render();
      setWebglReady(true);

      return () => {
        window.cancelAnimationFrame(animationFrame);
        resizeObserver?.disconnect();
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', onPointerUp);
        canvas.removeEventListener('pointercancel', onPointerUp);
        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        renderer.dispose();
      };
    } catch (error) {
      console.error('No fue posible iniciar la escena 3D:', error);
      setWebglReady(false);
      renderer?.dispose();
      return undefined;
    }
  }, []);

  return (
    <div className="factory-scene">
      <canvas ref={canvasRef} aria-label="Modelo tridimensional interactivo de una planta industrial con zonas de seguridad" />
      {!webglReady && (
        <div className="factory-fallback">
          <strong>VISTA 3D NO DISPONIBLE</strong>
          <span>El resto del panel continúa funcionando sin WebGL.</span>
        </div>
      )}
      <div className="scene-hud scene-hud-left"><span>SECTOR 04</span><strong>PRODUCCIÓN</strong></div>
      <div className="scene-hud scene-hud-right"><span>ALERTA ACTIVA</span><strong>PUNTO DE RIESGO</strong></div>
      <div className="scene-coordinates">COORD. 25°32' N · 103°27' O</div>
    </div>
  );
}
