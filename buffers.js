


export function initVoxelBuffer(gl) {
    const width = 2;
    const height = 2;
    const depth = 2;
	const positions = new Float32Array([
    //Forsiden:
		-1, 1, 1,
		-1,-1, 1,
		1,-1, 1,

		-1,1,1,
		1, -1, 1,
		1,1,1,

		//Hoyre side:
		1,1,1,
		1,-1,1,
		1,-1,-1,

		1,1,1,
		1,-1,-1,
		1,1,-1,

		//Bakside:
		1, -1, -1,
		-1, -1, -1,
		1, 1, -1,

		-1, -1, -1,
		-1, 1, -1,
		1, 1, -1,

		//Venstre side:
		-1,-1,-1,
		-1,1,1,
		-1,1,-1,

		-1,-1,1,
		-1,1,1,
		-1,-1,-1,

		//Topp:
		-1,1,1,
		1,1,1,
		-1,1,-1,

		-1,1,-1,
		1,1,1,
		1,1,-1,

		//Bunn:
		-1,-1,-1,
		1,-1,1,
		-1,-1,1,

		-1,-1,-1,
		1,-1,-1,
		1,-1,1,
]);
	const normals =  [
		//Forsiden:
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		//Hoyre side:
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,

		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,

		//Baksiden:
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,

		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,

		//Venstre side:
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,

		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,

		//Topp
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,

		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,

		//Bunn:
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,

		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
	];


	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);


	const normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);



    const edges = new Uint16Array([
        // Forside
        0, 1,   1, 2,   2, 5,   5, 0,
        // Bakside
        12, 13, 13, 16, 16, 17, 17, 12, 
        //kanter
        0, 16, 1, 15, 2, 8, 5, 14,
    ]);
    
    const edgeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edgeBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, edges, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    



	return  {
		position: positionBuffer,
		normal: normalBuffer,
        edges: edgeBuffer,
		vertexCount: positions.length/3,
        edgeCount: edges.length
	};
}



export function initPlayerTextureAndBuffers(gl, textureImage) {
	let positions = [
		//Forsiden:
		-1, 1, 1,
		-1,-1, 1,
		1,-1, 1,

		-1,1,1,
		1, -1, 1,
		1,1,1,

		//Hoyre side:

		1,1,1,
		1,-1,1,
		1,-1,-1,

		1,1,1,
		1,-1,-1,
		1,1,-1,

		//Baksiden:
		1,-1,-1,
		-1,-1,-1,
		1, 1,-1,

		-1,-1,-1,
		-1,1,-1,
		1,1,-1,

		//Venstre side:
		-1,-1,-1,
		-1,1,1,
		-1,1,-1,

		-1,-1,1,
		-1,1,1,
		-1,-1,-1,

		//Topp:
		-1,1,1,
		1,1,1,
		-1,1,-1,

		-1,1,-1,
		1,1,1,
		1,1,-1,

		//Bunn:
		-1,-1,-1,
		1,-1,1,
		-1,-1,1,

		-1,-1,-1,
		1,-1,-1,
		1,-1,1,
	];
	const normals =  [
		//Forsiden:
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,

		//Hoyre side:
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,

		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		1.0, 0.0, 0.0,

		//Baksiden:
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,

		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,
		0.0, 0.0, -1.0,

		//Venstre side:
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,

		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,
		-1.0, 0.0, 0.0,

		//Topp
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,

		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 1.0, 0.0,

		//Bunn:
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,

		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0,
		0.0, -1.0, 0.0
	];


	let textureCoordinates = []
	let tl=[0,0.5];
	let bl=[0,0];
	let tr=[0.5,0.5];
	let br=[0.5,0];

    // Teksturkoordinater / UV-koordinater
	textureCoordinates = textureCoordinates.concat(
    //foran
    tl, bl, br, tl, br, tr,
    //høyre
    tl, bl, br, tl, br, tr,
    //bak
    bl, br, tl, br, tr, tl,
    //venstre
    bl, tr, tl, br, tr, bl,
    //topp
    tl, tr, bl, bl, tr, br,
    //bunn
    bl, tr, br, bl, tl, tr
    );

	let colors = [];
	for (let i = 0; i<36; i++){
		colors.push(0.9, 0.9, 0.0, 1)
	}



    
	


	
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	const normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	//Texture:
	const cubeTexture = gl.createTexture();
	//Teksturbildet er nå lastet fra server, send til GPU:
	gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
	//Unngaa at bildet kommer opp-ned:
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);   //NB! FOR GJENNOMSIKTIG BAKGRUNN!! Sett også gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	//Laster teksturbildet til GPU/shader:
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
	//Teksturparametre:
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	gl.bindTexture(gl.TEXTURE_2D, null);

	const textureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

	return  {
		position: positionBuffer,
		normal: normalBuffer,
		color: colorBuffer,
		texture: textureBuffer,
		textureObject: cubeTexture,
		vertexCount: positions.length/3,
	};
}




/**
 * Oppretter verteksbuffer for koordinatsystemet.
 */
export function initCoordBuffers(gl) {
	const extent =  100;

	const positions = new Float32Array([
		-extent, 0, 0,
		extent, 0, 0,
		0, -extent, 0,
		0, extent, 0,
		0, 0, -extent,
		0, 0, extent
	]);

	const colors = new Float32Array([
		1,0,0,1,   //R G B A
		1,0,0,1,   //R G B A
		0,1,0,1,   //R G B A
		0,1,0,1,   //R G B A
		0,0,1,1,   //R G B A
		0,0,1,1,   //R G B A
	]);

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return  {
		position: positionBuffer,
		color: colorBuffer,
		vertexCount: positions.length/3
	};
}


export function initSquareWireframeBuffer(gl) { 

	const positions = new Float32Array([

        -1, 0, -1,
        1, 0, -1,
        -1, 0, -0.5,
        1, 0, -0.5,
        -1, 0, 0,
        1, 0, 0,
        -1, 0, 0.5, 
        1, 0, 0.5, 
        -1, 0, 1, 
        1, 0, 1,
        -1, 0, -1,
        -1, 0, 1,
        -0.5, 0, -1,
        -0.5, 0, 1,
        0, 0, -1,
        0, 0, 1, 
        0.5, 0, -1, 
        0.5, 0, 1, 
        1, 0, -1,
        1, 0, 1,
    
])

	const colors = new Float32Array([

        0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,
		0, 0, 0, 1,

    
])
	

const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		
const colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);




		return  {
			position: positionBuffer,
			colors: colorBuffer,
			vertexCount: positions.length/3
		};
};