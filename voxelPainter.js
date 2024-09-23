import {WebGLCanvas} from '../../base/helpers/WebGLCanvas.js';
import {WebGLShader} from '../../base/helpers/WebGLShader.js';
import {Camera} from '../../base/helpers/Camera.js';
import {ImageLoader} from '../../base/helpers/ImageLoader.js';
import {isPowerOfTwo1} from '../../base/lib/utility-functions.js';
import {initCoordBuffers, initPlayerTextureAndBuffers, initVoxelBuffer, initSquareWireframeBuffer} from './buffers.js'


export function main() {
	// Oppretter et canvas for WebGL-tegning:
	const canvas = new WebGLCanvas('myCanvas', document.body, 960, 640);

	// Starter med å laste teksturer:
	let imageLoader = new ImageLoader();
	let textureUrls = ['../../base/textures/moon.png'];
	imageLoader.load((textureImages) => {
		const textureImage1 = textureImages[0];
		if (isPowerOfTwo1(textureImage1.width) && isPowerOfTwo1(textureImage1.height)) {
			// Fortsetter:

			// Hjelpeobjekt som holder på objekter som trengs for rendring:
			const renderInfo = {
				gl: canvas.gl,
				baseShader: initBaseShaders(canvas.gl),
				textureShader: initTextureShaders(canvas.gl),
                voxelShader: initVoxelShaders(canvas.gl),
				coordBuffers: initCoordBuffers(canvas.gl),
				floorBuffers: initSquareWireframeBuffer(canvas.gl),
				playerBuffers: initPlayerTextureAndBuffers(canvas.gl, textureImage1),
                voxelBuffers: initVoxelBuffer(canvas.gl),
                playerPosition: {xpos: 1, ypos: 1, zpos: 1},
                voxels: [],
                randomColors : false,
                tegnVedFlytt: false,
				currentlyPressedKeys: [],
				lastTime: 0,
				fpsInfo: {  // Brukes til å beregne og vise FPS (Frames Per Seconds):
					frameCount: 0,
					lastTimeStamp: 0
				},
				floorSquares: [],
			};

			let i = 0;
			for (let x = -4; x < 5; x+=1){
				for (let z = -4; z < 5; z+=1){
					renderInfo.floorSquares[i] = {
						xpos: x,
						ypos: 0,
						zpos: z
					}
					i++;
				}
			}

            const addVox = document.getElementById("addVox");
            const plusX = document.getElementById("plusX");
            const minusX = document.getElementById("minusX");
            const plusY = document.getElementById("plusY");
            const minusY = document.getElementById("minusY");
            const plusZ = document.getElementById("plusZ");
            const minusZ = document.getElementById("minusZ");
            const randomColorsSwitch = document.getElementById("randomColorsSwitch");
            const tegnVedFlyttSwitch = document.getElementById("tegnVedFlytt")

            addVox.addEventListener("click", () => {
                createVoxel(renderInfo)
                

            })

            plusX.addEventListener("click", () => {
                if(renderInfo.tegnVedFlytt){
                    createVoxel(renderInfo)
                }
                renderInfo.playerPosition.xpos += 2;
                
            });

            minusX.addEventListener("click", () => {
                if(renderInfo.tegnVedFlytt){
                    createVoxel(renderInfo)
                }
                renderInfo.playerPosition.xpos -= 2;
            });
            
            plusY.addEventListener("click", () => {
                if(renderInfo.tegnVedFlytt){
                    createVoxel(renderInfo)
                }
                renderInfo.playerPosition.ypos += 2;
            });
            
            minusY.addEventListener("click", () => {
                if(renderInfo.tegnVedFlytt){
                    createVoxel(renderInfo)
                }
                renderInfo.playerPosition.ypos -= 2;
            });
            
       
            plusZ.addEventListener("click", () => {
                if(renderInfo.tegnVedFlytt){
                    createVoxel(renderInfo)
                }
                renderInfo.playerPosition.zpos += 2;
            });
            
     
            minusZ.addEventListener("click", () => {
                if(renderInfo.tegnVedFlytt){
                    createVoxel(renderInfo)
                }
                renderInfo.playerPosition.zpos -= 2;
            });
            
            randomColorsSwitch.addEventListener("change", () => {
                renderInfo.randomColors = randomColorsSwitch.checked;
            });

            tegnVedFlyttSwitch.addEventListener("change", () => {
                renderInfo.tegnVedFlytt = tegnVedFlyttSwitch.checked;
                
            });




			initKeyPress(renderInfo);
			const camera = new Camera(renderInfo.gl, renderInfo.currentlyPressedKeys);
			camera.camPosX = 15;
			camera.camPosY = 15;
			camera.camPosZ = 15;
			animate( 0, renderInfo, camera);
		}
	}, textureUrls);
}


function createVoxel(renderInfo){
    let x = renderInfo.playerPosition.xpos;
    let y = renderInfo.playerPosition.ypos;
    let z = renderInfo.playerPosition.zpos;
    let r, g, b, a
    if (renderInfo.randomColors == true) {
        r = Math.random();
        g = Math.random();
        b = Math.random();
        a = 0.4;
    } else {
        r = 0.5;
        g = 0.5;
        b = 0.5;
        a = 0.4;
    }
    renderInfo.voxels.push({xpos: x, ypos: y, zpos: z, r: r, g: g, b: b, a: a})

}
/**
 * Knytter tastatur-evnents til eventfunksjoner.
 */
function initKeyPress(renderInfo) {
	document.addEventListener('keyup', (event) => {
		renderInfo.currentlyPressedKeys[event.code] = false;
	}, false);
	document.addEventListener('keydown', (event) => {
		renderInfo.currentlyPressedKeys[event.code] = true;
	}, false);
}

function initBaseShaders(gl) {
	// Leser shaderkode fra HTML-fila: Standard/enkel shader (posisjon og farge):
	let vertexShaderSource = document.getElementById('base-vertex-shader').innerHTML;
	let fragmentShaderSource = document.getElementById('base-fragment-shader').innerHTML;

	// Initialiserer  & kompilerer shader-programmene;
	const glslShader = new WebGLShader(gl, vertexShaderSource, fragmentShaderSource);

	// Samler all shader-info i ET JS-objekt, som returneres.
	return  {
		program: glslShader.shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(glslShader.shaderProgram, 'aVertexPosition'),
			vertexColor: gl.getAttribLocation(glslShader.shaderProgram, 'aVertexColor'),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(glslShader.shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(glslShader.shaderProgram, 'uModelViewMatrix'),
		},
	};
}

function initTextureShaders(gl) {
	// Leser shaderkode fra HTML-fila: Standard/enkel shader (posisjon og farge):
	let vertexShaderSource = document.getElementById('texture-vertex-shader').innerHTML;
	let fragmentShaderSource = document.getElementById('texture-fragment-shader').innerHTML;

	// Initialiserer  & kompilerer shader-programmene;
	const glslShader = new WebGLShader(gl, vertexShaderSource, fragmentShaderSource);

	// Samler all shader-info i ET JS-objekt, som returneres.
	return  {
		program: glslShader.shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(glslShader.shaderProgram, 'aVertexPosition'),
			vertexColor: gl.getAttribLocation(glslShader.shaderProgram, 'aVertexColor'),
			vertexTextureCoordinate: gl.getAttribLocation(glslShader.shaderProgram, 'aVertexTextureCoordinate'),
		},
		uniformLocations: {
			sampler: gl.getUniformLocation(glslShader.shaderProgram, 'uSampler'),
			projectionMatrix: gl.getUniformLocation(glslShader.shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(glslShader.shaderProgram, 'uModelViewMatrix'),
		},
	};
}

//Shaders uten vertexColor, men med uniformcolor
function initVoxelShaders(gl) {
	// Leser shaderkode fra HTML-fila: Standard/enkel shader (posisjon og farge):
	let vertexShaderSource = document.getElementById('voxel-vertex-shader').innerHTML;
	let fragmentShaderSource = document.getElementById('voxel-fragment-shader').innerHTML;

	// Initialiserer  & kompilerer shader-programmene;
	const glslShader = new WebGLShader(gl, vertexShaderSource, fragmentShaderSource);

	// Samler all shader-info i ET JS-objekt, som returneres.
	return  {
		program: glslShader.shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(glslShader.shaderProgram, 'aVertexPosition'),
		},
		uniformLocations: {
            fragmentColor: gl.getUniformLocation(glslShader.shaderProgram, 'uFragmentColor'),
			projectionMatrix: gl.getUniformLocation(glslShader.shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(glslShader.shaderProgram, 'uModelViewMatrix'),
		},
	};
}

/**
 * Funksjonen sammenlikner to nærliggende verdier i arrayet som sorteres.
 * Returnerer 1, -1 eller 0 avhengig av sammenlikningen.
 */
function compare( dist1, dist2 ) {
	if (dist1 < dist2 ){
		return 1;
	}
	if ( dist1 > dist2 ){
		return -1;
	}
	return 0;
}

/**
 * Merk: ** betyr eksponent. Eks. 2 ** 3 = 2 * 2 * 2 = 8
 */
function distanceFromCamera(camera, x, y, z) {
	return Math.sqrt((camera.camPosX - x) ** 2 + (camera.camPosY - y) ** 2 + (camera.camPosZ - z) ** 2);
}






/**
 * Aktiverer position-bufferet.
 * Kalles fra draw()
 */
function connectPositionAttribute(gl, baseShader, positionBuffer) {
	const numComponents = 3;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(
		baseShader.attribLocations.vertexPosition,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl.enableVertexAttribArray(baseShader.attribLocations.vertexPosition);
}
function connectColorUniform(gl, ShaderInfo, colorRGBA) {
	//let colorRGBA = [1.0, 1.0, 0.0, 1.0];
	gl.uniform4f(ShaderInfo.uniformLocations.fragmentColor, colorRGBA[0],colorRGBA[1],colorRGBA[2],colorRGBA[3]);
}

/**
 * Kopler til og aktiverer teksturkoordinat-bufferet.
 */
function connectTextureAttribute(gl, textureShader, textureBuffer, textureObject) {
	const numComponents = 2;    //NB!
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	//Bind til teksturkoordinatparameter i shader:
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.vertexAttribPointer(
		textureShader.attribLocations.vertexTextureCoordinate,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl.enableVertexAttribArray(textureShader.attribLocations.vertexTextureCoordinate);

	//Aktiver teksturenhet (0):
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textureObject);
	//Send inn verdi som indikerer hvilken teksturenhet som skal brukes (her 0):
	let samplerLoc = gl.getUniformLocation(textureShader.program, textureShader.uniformLocations.sampler);
	gl.uniform1i(samplerLoc, 0);
}

/**
 * Aktiverer color-bufferet.
 * Kalles fra draw()
 */
function connectColorAttribute(gl, baseShader, colorBuffer) {
	const numComponents = 4;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.vertexAttribPointer(
		baseShader.attribLocations.vertexColor,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl.enableVertexAttribArray(baseShader.attribLocations.vertexColor);
}

/**
 * Klargjør canvaset.
 * Kalles fra draw()
 */
function clearCanvas(gl) {
	gl.clearColor(0.9, 0.9, 0.9, 1);  // Clear screen farge.
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);           // Enable "depth testing".
	gl.depthFunc(gl.LEQUAL);            // Nære objekter dekker fjerne objekter.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function animate(currentTime, renderInfo, camera) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime, renderInfo, camera);
	});

	// Finner tid siden siste kall på draw().
	let elapsed = getElapsed(currentTime, renderInfo);
	calculateFps(currentTime, renderInfo.fpsInfo);
	camera.handleKeys(elapsed);
	draw(currentTime, renderInfo, camera);
}

/**
 * Beregner forløpt tid siden siste kall.
 * @param currentTime
 * @param renderInfo
 */
function getElapsed(currentTime, renderInfo) {
	let elapsed = 0.0;
	if (renderInfo.lastTime !== 0.0)	// Først gang er lastTime = 0.0.
		elapsed = (currentTime - renderInfo.lastTime)/1000; // Deler på 1000 for å operere med sekunder.
	renderInfo.lastTime = currentTime;						// Setter lastTime til currentTime.
	return elapsed;
}

/**
 * Beregner og viser FPS.
 * @param currentTime
 * @param renderInfo
 */
function calculateFps(currentTime, fpsInfo) {
	if (!currentTime) currentTime = 0;
	// Sjekker om  ET sekund har forløpt...
	if (currentTime - fpsInfo.lastTimeStamp >= 1000) {
		// Viser FPS i .html ("fps" er definert i .html fila):
		document.getElementById('fps').innerHTML = fpsInfo.frameCount;
		// Nullstiller fps-teller:
		fpsInfo.frameCount = 0;
		//Brukes for å finne ut om det har gått 1 sekund - i så fall beregnes FPS på nytt.
		fpsInfo.lastTimeStamp = currentTime;
	}
	// Øker antall frames per sekund:
	fpsInfo.frameCount++;
}

/**
 * Tegner!
 */
function draw(currentTime, renderInfo, camera) {
	clearCanvas(renderInfo.gl);
	drawCoord(renderInfo, camera);

    //** TEGN ALLE UGJENNOMSIKTIGE OBJEKTER FØRST:
	renderInfo.gl.disable(renderInfo.gl.BLEND);
	drawFloor(renderInfo, camera);
	

    let modelMatrix = new Matrix4();
    modelMatrix.setIdentity();
    modelMatrix.translate(renderInfo.playerPosition.xpos, renderInfo.playerPosition.ypos, renderInfo.playerPosition.zpos,)
    modelMatrix.scale(1.1, 1.1, 1.1)
    drawPlayer(renderInfo, camera, modelMatrix);
   
	//gjennomsiktige voxels

	renderInfo.gl.enable(renderInfo.gl.BLEND);
	renderInfo.gl.blendFunc(renderInfo.gl.SRC_ALPHA, renderInfo.gl.ONE_MINUS_SRC_ALPHA);
    //** Slår av depthMask:
	renderInfo.gl.depthMask(false);
	drawVoxels(renderInfo, camera)
    
	//slå på depthmask igjen
	renderInfo.gl.depthMask(true);
}



function drawFloor(renderInfo, camera){ 
	// Aktiver shader:
	renderInfo.gl.useProgram(renderInfo.voxelShader.program);

	// Kople posisjon og farge-attributtene til tilhørende buffer:
	connectPositionAttribute(renderInfo.gl, renderInfo.voxelShader, renderInfo.floorBuffers.position);
	connectColorUniform(renderInfo.gl, renderInfo.voxelShader, [0, 0, 0, 0.1]);
	


	let modelMatrix = new Matrix4();

	for(let j = 0; j < renderInfo.floorSquares.length; j++){
		
	modelMatrix.setIdentity();
	
	modelMatrix.scale(4, 0, 4)
	modelMatrix.translate(renderInfo.floorSquares[j].xpos, renderInfo.floorSquares[j].ypos, renderInfo.floorSquares[j].zpos)
	
	// Lager en kopi for å ikke påvirke kameramatrisene:
	let viewMatrix = new Matrix4(camera.viewMatrix);
	let modelviewMatrix = viewMatrix.multiply(modelMatrix); // NB! rekkefølge!
	// Send kameramatrisene til shaderen:
	renderInfo.gl.uniformMatrix4fv(renderInfo.voxelShader.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.voxelShader.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);

	// tegn sidene
	renderInfo.gl.drawArrays(renderInfo.gl.LINES, 0, renderInfo.floorBuffers.vertexCount);

	}
}


function drawCoord(renderInfo, camera) {
	// Aktiver shader:
	renderInfo.gl.useProgram(renderInfo.baseShader.program);

	// Kople posisjon og farge-attributtene til tilhørende buffer:
	connectPositionAttribute(renderInfo.gl, renderInfo.baseShader, renderInfo.coordBuffers.position);
	connectColorAttribute(renderInfo.gl, renderInfo.baseShader, renderInfo.coordBuffers.color);

	let modelMatrix = new Matrix4();
	modelMatrix.setIdentity();
	// Lager en kopi for å ikke påvirke kameramatrisene:
	let viewMatrix = new Matrix4(camera.viewMatrix);
	let modelviewMatrix = viewMatrix.multiply(modelMatrix); // NB! rekkefølge!
	// Send kameramatrisene til shaderen:
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShader.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.baseShader.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);
	// Tegn coord:
	renderInfo.gl.drawArrays(renderInfo.gl.LINES, 0, renderInfo.coordBuffers.vertexCount);
}

function drawPlayer(renderInfo, camera, modelMatrix) {
	// Aktiver shader:
	renderInfo.gl.useProgram(renderInfo.textureShader.program);

	// Kople posisjon og farge-attributtene til tilhørende buffer:
	connectPositionAttribute(renderInfo.gl, renderInfo.textureShader, renderInfo.playerBuffers.position);
	connectColorAttribute(renderInfo.gl, renderInfo.textureShader, renderInfo.playerBuffers.color);
	connectTextureAttribute(renderInfo.gl, renderInfo.textureShader, renderInfo.playerBuffers.texture, renderInfo.playerBuffers.textureObject);

	// Lager en kopi for å ikke påvirke kameramatrisene:
	let viewMatrix = new Matrix4(camera.viewMatrix);
	let modelviewMatrix = viewMatrix.multiply(modelMatrix); // NB! rekkefølge!
	renderInfo.gl.uniformMatrix4fv(renderInfo.textureShader.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.textureShader.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);

	renderInfo.gl.drawArrays(renderInfo.gl.TRIANGLES, 0, renderInfo.playerBuffers.vertexCount);
}

function drawVoxel(renderInfo, camera, colorRGBA, modelMatrix) {
	// Aktiver shader:
	renderInfo.gl.useProgram(renderInfo.voxelShader.program);

	// Kople posisjon og farge-attributtene til tilhørende buffer:
	connectPositionAttribute(renderInfo.gl, renderInfo.voxelShader, renderInfo.voxelBuffers.position);
    


	// Lager en kopi for å ikke påvirke kameramatrisene:
	let viewMatrix = new Matrix4(camera.viewMatrix);
	let modelviewMatrix = viewMatrix.multiply(modelMatrix); // NB! rekkefølge!
	renderInfo.gl.uniformMatrix4fv(renderInfo.voxelShader.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
	renderInfo.gl.uniformMatrix4fv(renderInfo.voxelShader.uniformLocations.projectionMatrix, false, camera.projectionMatrix.elements);

    //tegner rammen
    connectColorUniform(renderInfo.gl, renderInfo.voxelShader, [0, 0, 0, 1]);
    renderInfo.gl.bindBuffer(renderInfo.gl.ELEMENT_ARRAY_BUFFER, renderInfo.voxelBuffers.edges);
	renderInfo.gl.drawElements(renderInfo.gl.LINES, renderInfo.voxelBuffers.edgeCount, renderInfo.gl.UNSIGNED_SHORT, 0);
	renderInfo.gl.bindBuffer(renderInfo.gl.ELEMENT_ARRAY_BUFFER, null);


    connectColorUniform(renderInfo.gl, renderInfo.voxelShader, colorRGBA);
	//Bruker culling for korrekt blending:
	renderInfo.gl.frontFace(renderInfo.gl.CCW);     // Angir vertekser CCW.
	renderInfo.gl.enable(renderInfo.gl.CULL_FACE);  // Aktiverer culling
    //Tegner baksidene først:
	renderInfo.gl.cullFace(renderInfo.gl.FRONT);    // Skjuler forsider.
	renderInfo.gl.drawArrays(renderInfo.gl.TRIANGLES, 0, renderInfo.voxelBuffers.vertexCount)


	//Tegner deretter forsidene:
	renderInfo.gl.cullFace(renderInfo.gl.BACK);     // Skjuler baksider.
	renderInfo.gl.drawArrays(renderInfo.gl.TRIANGLES, 0, renderInfo.voxelBuffers.vertexCount)

}

function drawVoxels(renderInfo, camera){
	let modelMatrix = new Matrix4();

	let voxToDraw = [];
	for (let i = 0; i < renderInfo.voxels.length; i++){
		let dist = distanceFromCamera(camera, renderInfo.voxels[i].xpos, renderInfo.voxels[i].ypos, renderInfo.voxels[i].zpos);
		voxToDraw.push({voxel: renderInfo.voxels[i], distance: dist})
	}
	voxToDraw.sort((distFromCam1, distFromCam2) => compare(distFromCam1.distance, distFromCam2.distance));

	for (let i = 0; i < voxToDraw.length; i++){
        let voxel = voxToDraw[i].voxel;
        modelMatrix.setIdentity();
        modelMatrix.translate(voxel.xpos, voxel.ypos, voxel.zpos)
        drawVoxel(renderInfo, camera, [voxel.r, voxel.g, voxel.b, voxel.a], modelMatrix)
    }


}