function bodyload() {
    
	var renderer	= new THREE.WebGLRenderer({
		antialiasing	: true
	});
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	var updateFcts	= [];
	var scene	= new THREE.Scene();
	scene.fog	= new THREE.FogExp2( 0xd0e0f0, 0.0021 );
	var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1400 );
	camera.position.z = 45;
    camera.position.y = 45;

	
	var proceduralCity	= new THREEx.ProceduralCity(renderer)
	// var building		= proceduralCity.getBuilding().clone()
	// proceduralCity.scaleBuilding(building)
	// proceduralCity.colorifyBuilding(building)
	// scene.add(building)	

	//var mesh	= proceduralCity.createSquareCity()
	var mesh	= proceduralCity.createCGCity();
	scene.add(mesh);


	var light	= new THREE.HemisphereLight( 0xfffff0, 0x101020, 0.75 );
	light.position.set( 0.75, 1, 0.25 );
	scene.add( light );
	
	
	/*
	var sunAngle = -1/6*Math.PI*2;
	//var sunAngle = -3/6*Math.PI*2;
	updateFcts.push(function(delta, now){
		var dayDuration	= 20	// nb seconds for a full day cycle
		sunAngle	+= delta/dayDuration * Math.PI*2
	})
	
	var sunSphere	= new THREEx.DayNight.SunSphere(1400)
	scene.add( sunSphere.object3d )
	updateFcts.push(function(delta, now){
		sunSphere.update(sunAngle)
	})
	
	var sunLight	= new THREEx.DayNight.SunLight()
	scene.add( sunLight.object3d )
	updateFcts.push(function(delta, now){
		sunLight.update(sunAngle)
	})*/
	



	
	var controls	= new THREE.FirstPersonControls( camera );
	controls.movementSpeed	= 40;
	controls.lookSpeed	= 0.05;
	controls.lookVertical	= true;
	controls.lookVerticalNotBelowZero = true;
	updateFcts.push(function(delta, now){
		controls.update( delta );		
	});



	// render the scene						
	updateFcts.push(function(){
		renderer.render( scene, camera );		
	});
	

	// loop runner							
	var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){

		requestAnimationFrame( animate );

		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec

		updateFcts.forEach(function(updateFn){
			updateFn(deltaMsec/1000, nowMsec/1000)
		})
	});
};