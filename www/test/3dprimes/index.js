const renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id = "canvas";
document.querySelector("#container").appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.001, 1000);
window.addEventListener("resize", function() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
});
camera.position.set(80, 80, 80);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
const hemiLight = new THREE.HemisphereLight(0x999999, 0xbfbfbf, 0.6);
scene.add(hemiLight);
const dirLight = new THREE.DirectionalLight(0xf2f2f2);
dirLight.position.set(-1, 1.75, 1);
scene.add(dirLight);
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);
let num = 1;
let length = 0;
const moves = ["y", 1, "x", -1, "x", -1];
let maxOffset = 2;
const base = [[false, -2]];
let y = 1;
const geometry = new THREE.BoxGeometry(1, 1, 1);
const indicator = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
	color: 0xffffff
}));
indicator.position.x = 2;
scene.add(indicator);
const cubes = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const clock = new THREE.Clock();
const animate = () => {
	requestAnimationFrame(animate);
	if(!moves.length) {
		for(let i = 0; i < maxOffset; i++) {
			for(let j of base) {
				j[1] *= -1;
			}
			if(i === 0) {
				base.push([!base[base.length-1][0], 2*(Math.floor(length/2)%2)-1]);
			} else if(i === 1) {
				base.unshift([!base[0][0], -(2*(Math.floor(length/2)%2)-1)]);
			} else if(i%2 === 0) {
				base[base.length-1][1] = Math.sign(base[base.length-1][1])*(Math.abs(base[base.length-1][1])+1);
			} else {
				base[0][1] = Math.sign(base[0][1])*(Math.abs(base[0][1])+1);
			}
			const ySign = -Math.sign(y);
			const yAbs = Math.abs(y)+1;
			y = ySign*yAbs;
			for(let j = 0; j < yAbs; j++) {
				moves.push("y", ySign);
			}
			for(let j of base) {
				const axis = j[0] ? "z" : "x";
				const jSign = Math.sign(j[1]);
				const jAbs = Math.abs(j[1]);
				for(let k = 0; k < jAbs; k++) {
					moves.push(axis, jSign);
				}
			}
		}
		if(length%2 === 0) {
			maxOffset += 4;
		}
		length++;
	}
	let prime = num !== 1 && num > 0;
	for(let i = 2; i < Math.sqrt(num); i++) {
		if(num%i === 0) {
			prime = false;
			break;
		}
	}
	if(prime) {
		const cube = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
			color: Math.random()*0xffffff
		}));
		cube.position.copy(indicator.position);
		scene.add(cube);
		cubes.push(cube);
	}
	indicator.position[moves.shift()] += 2*moves.shift();
	num++;
	raycaster.setFromCamera(mouse, camera);
	const intersect = raycaster.intersectObjects(cubes)[0];
	if(intersect) {
		console.log(intersect.object);
	}
	controls.update(clock.getDelta());
	renderer.render(scene, camera);
}
requestAnimationFrame(animate);
window.addEventListener("mousemove", event => {
	mouse.x = 2*event.clientX/window.innerWidth-1;
	mouse.y = -2*event.clientY/window.innerHeight+1;
});
