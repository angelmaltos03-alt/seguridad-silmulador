import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ZONES = [
  { id:'production', label:'Producción', position:[-3.3,.8,.1], level:'alto' },
  { id:'maintenance', label:'Mantenimiento', position:[-4.6,.8,-2.4], level:'medio' },
  { id:'warehouse', label:'Almacén', position:[3.6,1.15,-2], level:'medio' },
  { id:'logistics', label:'Logística', position:[1.1,.15,2.6], level:'bajo' }
];
const COLORS = { bajo:0x42c991, medio:0x27c2d4, alto:0xf4b84e, critico:0xf16c63 };
const material = (color, roughness=.7, metalness=.08) => new THREE.MeshStandardMaterial({color,roughness,metalness});
function addBox(parent,size,position,mat){const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),mat);mesh.position.set(...position);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function addCylinder(parent,top,bottom,height,position,mat,segments=24){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(top,bottom,height,segments),mat);mesh.position.set(...position);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}

export default function FactoryScene3D({selectedZone='production',onSelect=()=>{},zones=ZONES}){
  const canvasRef=useRef(null);
  const [ready,setReady]=useState(true);
  const selectedRef=useRef(selectedZone);
  const selectRef=useRef(onSelect);
  selectedRef.current=selectedZone;
  selectRef.current=onSelect;

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas)return undefined;
    let renderer,observer,frame=0;
    let down=false,moved=false,lastX=0,lastY=0,targetX=-.12,targetY=.48;
    const markers=[];
    try{
      const scene=new THREE.Scene();
      scene.fog=new THREE.Fog(0x0b1421,15,34);
      const camera=new THREE.PerspectiveCamera(36,1,.1,80);
      camera.position.set(10.5,8.6,12.5);camera.lookAt(0,.45,0);
      renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));
      renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
      scene.add(new THREE.HemisphereLight(0xa9c9e8,0x182638,2.15));
      const key=new THREE.DirectionalLight(0xd7eaff,3.1);key.position.set(7,12,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);
      const glow=new THREE.PointLight(0x19c6dc,18,18);glow.position.set(-5,4,1);scene.add(glow);
      const world=new THREE.Group();scene.add(world);
      const floor=material(0x243346,.88),dark=material(0x172538,.76,.2),wall=material(0x526b82,.84),roof=material(0x30475d,.62,.22),cyan=material(0x21bfd0,.34,.35),yellow=material(0xf4b53f,.5,.15),white=material(0xb9c9d8,.62,.25);
      addBox(world,[13.8,.28,9.6],[0,-.28,0],floor);
      const grid=new THREE.GridHelper(13.5,27,0x4b6a83,0x344b61);grid.position.y=-.125;world.add(grid);
      // Nave principal.
      addBox(world,[4.7,2.7,3.25],[-3.3,1.2,-1.55],wall);
      addBox(world,[4.95,.18,3.5],[-3.3,2.65,-1.55],roof);
      addBox(world,[.14,2,3],[-.88,1,-1.55],dark);
      addBox(world,[.12,1.75,2.35],[-5.68,.98,-1.55],dark);
      for(let i=0;i<4;i++)addBox(world,[.08,2.35,.08],[-5.4+i*1.38,1.2,.12],cyan);
      for(let i=0;i<3;i++){addBox(world,[.72,.55,.52],[-4.8+i*1.45,.42,-1.1],dark);addCylinder(world,.25,.25,.1,[-4.8+i*1.45,.73,-1.1],yellow);}
      addBox(world,[1.25,.1,.12],[-3.25,2.02,.12],yellow);
      addBox(world,[.13,3,.13],[-5.45,1.35,-3.3],white);addBox(world,[.13,3,.13],[-1.15,1.35,-3.3],white);addBox(world,[4.45,.13,.13],[-3.3,2.82,-3.3],yellow);
      // Silos y plataformas.
      addCylinder(world,.72,.78,2.35,[3.6,1.05,-2],white,32);addCylinder(world,0,.83,.68,[3.6,2.56,-2],roof,32);addCylinder(world,.18,.18,.55,[3.6,3.12,-2],dark);
      addBox(world,[.15,2.7,.15],[4.42,1.15,-2],yellow);addCylinder(world,.74,.74,.08,[3.6,0,-2],cyan,32);addBox(world,[1.85,.08,.08],[3.6,2.15,-1.15],yellow);
      // Banda transportadora y caja.
      addBox(world,[4.4,.28,.76],[1.35,.72,1.1],dark);addBox(world,[4.25,.12,.55],[1.35,.91,1.1],white);
      for(let i=0;i<9;i++)addCylinder(world,.12,.12,.62,[-.62+i*.49,.62,1.1],dark,16).rotation.z=Math.PI/2;
      addBox(world,[.36,.36,.36],[.5,1.2,1.1],yellow);
      // Brazo robótico articulado.
      const robot=new THREE.Group();robot.position.set(2.4,.18,2);world.add(robot);
      addCylinder(robot,.24,.3,.35,[0,.18,0],cyan);
      const arm1=addBox(robot,[.22,1.05,.22],[.28,.72,0],yellow);arm1.rotation.z=-.52;
      const arm2=addBox(robot,[.18,.82,.18],[.68,1.2,0],white);arm2.rotation.z=.4;
      addBox(robot,[.48,.1,.22],[.95,1.53,0],dark);
      // Trabajador con casco y chaleco.
      addCylinder(world,.24,.3,.76,[-.35,.58,2.65],cyan);addCylinder(world,.14,.14,.2,[-.35,1.08,2.65],material(0xe2b78e));
      addCylinder(world,.23,.23,.13,[-.35,1.22,2.65],yellow);
      const helmet=new THREE.Mesh(new THREE.SphereGeometry(.23,24,12,0,Math.PI*2,0,Math.PI/2),yellow);helmet.position.set(-.35,1.24,2.65);helmet.castShadow=true;world.add(helmet);
      addBox(world,[.55,.12,.08],[-.35,.66,2.35],yellow);
      // Vialidades, franjas y zona de almacén.
      addBox(world,[.11,.025,7.5],[-.2,-.12,.65],yellow);addBox(world,[.11,.025,7.5],[.2,-.12,.65],yellow);
      for(let i=0;i<7;i++){const stripe=addBox(world,[.24,.03,.09],[3.6+(i%2)*.15,-.11,.3+i*.29],yellow);stripe.rotation.y=.18;}
      addBox(world,[2.35,1.45,2.25],[5.1,.72,-3],wall);addBox(world,[2.48,.12,2.38],[5.1,1.5,-3],roof);
      for(let i=0;i<3;i++){addBox(world,[.52,.55,.45],[4.45+i*.62,.38,-1.72],dark);addBox(world,[.52,.06,.45],[4.45+i*.62,.69,-1.72],yellow);}
      // Marcadores de riesgo seleccionables por raycasting.
      const extraPositions=[[-5.5,.2,2.9],[-1.2,.2,3.5],[5.4,.2,1.8],[5.2,.2,-.3],[-5.8,.2,-.2],[.7,.2,-3.7]];
      zones.forEach((zone,index)=>{
        const known=ZONES.find(item=>item.id===zone.id);
        const position=zone.position||(known&&known.position)||extraPositions[index%extraPositions.length];
        const tone=COLORS[zone.level]||COLORS.medio;
        const marker=new THREE.Group();marker.position.set(...position);marker.userData.zoneId=zone.id;marker.userData.baseY=marker.position.y;
        const ball=new THREE.Mesh(new THREE.SphereGeometry(.15,20,16),new THREE.MeshStandardMaterial({color:tone,emissive:tone,emissiveIntensity:.55,roughness:.3}));
        ball.castShadow=true;marker.add(ball);
        const ring=new THREE.Mesh(new THREE.TorusGeometry(.32,.018,8,40),new THREE.MeshBasicMaterial({color:tone,transparent:true,opacity:.76}));
        ring.rotation.x=Math.PI/2;marker.add(ring);marker.userData.ball=ball;marker.userData.ring=ring;world.add(marker);markers.push(marker);
      });
      const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
      const onDown=e=>{down=true;moved=false;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);};
      const onMove=e=>{if(!down)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(dx)+Math.abs(dy)>4)moved=true;targetY+=dx*.006;targetX=Math.max(-.4,Math.min(.25,targetX+dy*.003));lastX=e.clientX;lastY=e.clientY;};
      const onUp=e=>{
        if(down&&!moved){const rect=canvas.getBoundingClientRect();pointer.x=((e.clientX-rect.left)/rect.width)*2-1;pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(markers.map(m=>m.userData.ball),false)[0];if(hit){const marker=markers.find(m=>m.userData.ball===hit.object);if(marker)selectRef.current(marker.userData.zoneId);}}
        down=false;
      };
      canvas.addEventListener('pointerdown',onDown);canvas.addEventListener('pointermove',onMove);canvas.addEventListener('pointerup',onUp);canvas.addEventListener('pointercancel',onUp);
      const resize=()=>{const rect=canvas.getBoundingClientRect();const w=Math.max(1,rect.width),h=Math.max(1,rect.height);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
      observer=new ResizeObserver(resize);observer.observe(canvas);resize();
      const clock=new THREE.Clock();
      const render=()=>{
        const elapsed=clock.getElapsedTime();world.rotation.y+=(targetY-world.rotation.y)*.035;world.rotation.x+=(targetX-world.rotation.x)*.035;
        markers.forEach(marker=>{const active=marker.userData.zoneId===selectedRef.current;marker.position.y=marker.userData.baseY+Math.sin(elapsed*2.2+marker.position.x)*.055;marker.userData.ball.scale.setScalar(active?1.35:1+Math.sin(elapsed*2.4)*.08);marker.userData.ring.scale.setScalar(active?1.24:1);marker.userData.ring.material.opacity=active?.98:.56;});
        renderer.render(scene,camera);frame=requestAnimationFrame(render);
      };
      render();setReady(true);
      return ()=>{cancelAnimationFrame(frame);observer?.disconnect();canvas.removeEventListener('pointerdown',onDown);canvas.removeEventListener('pointermove',onMove);canvas.removeEventListener('pointerup',onUp);canvas.removeEventListener('pointercancel',onUp);scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());});renderer.dispose();};
    }catch(error){console.error('No fue posible iniciar el modelo 3D:',error);setReady(false);renderer?.dispose();return undefined;}
  },[zones]);;

  return <div className="factory-scene"><canvas ref={canvasRef} aria-label="Modelo 3D de una planta industrial; selecciona marcadores para consultar los riesgos." />{!ready&&<div className="factory-fallback"><strong>VISTA 3D NO DISPONIBLE</strong><span>El resto del centro de mando continúa funcionando.</span></div>}<div className="scene-hud scene-hud-left"><span>PLANTA / SECTOR</span><strong>MODELO DIGITAL</strong></div><div className="scene-hud scene-hud-right"><span>MAPA ACTIVO</span><strong>SELECCIONA UN MARCADOR</strong></div><div className="scene-coordinates">INTERACTIVE MODEL · WEBGL</div></div>;
}