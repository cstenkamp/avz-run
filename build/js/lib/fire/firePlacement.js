var fire_list = [];
var fire_count = 0;

var pointlight_list = [];
var smoke_list = [];
var smoke_and_light_count = 0;

var fire;
var fireWidth = -1;
var fireHeight = -1;
var fireDepth = -1;
var sliceSpacing = -1;

var clock = new THREE.Clock();

function initFire() {
    fire = new VolumetricFire(
        fireWidth,
        fireHeight,
        fireDepth,
        sliceSpacing,
        camera
    );

    // Feuer wird für die animate Funktion in ein Array gelegt
    fire_list.push(fire);
    fire_count++;
}

function addFire(x, y, z, width, height, depth, spacing) {

    // Compare to last used fire
    if (fireWidth != width || fireHeight != height || fireDepth != depth || sliceSpacing != spacing) {

        var exists = false;

        // Check if the fire exists in the Array. If it does use the existing one.
        for (i = 0; i < fire_count; i++) {
            if (fire_list[i]._width == width && fire_list[i]._height == height &&
                fire_list[i]._depth == depth && fire_list[i]._sliceSpacing == spacing) {
                fire = fire_list[i];
                exists = true;
                break;
            }
        }

        if (exists == false) {
            //Create new fire
            fireWidth = width;
            fireHeight = height;
            fireDepth = depth;
            sliceSpacing = spacing;
            initFire();
        }
    }

    var pointlight = new THREE.PointLight(0xff9933, 1, 1.5);
    pointlight.position.set(x, y + 1, z);
    scene.add(pointlight);

    var fmesh = fire.mesh.clone();
    scene.add(fmesh);
    fmesh.position.set(x, y + fireHeight / 2, z);

    var smoke = addSmoke(x, y, z);

    // Push smoke und light in Array
    pointlight_list.push(pointlight);
    smoke_list.push(smoke);
    smoke_and_light_count++;

}

function addSmallFire(x, y, z) {
    addFire(x, y, z, 1.5, 2, 1.5, 0.5);
}

function animateFire() {

    requestAnimationFrame(animateFire);

    var elapsed = clock.getElapsedTime();

    // update alle fire Objekte aus dem Array
    for (i = 0; i < fire_count; i++) {
        fire_list[i].update(elapsed);
    }

    // update alle smoke und pointlights
    for (j = 0; j < smoke_and_light_count; j++) {

        pointlight_list[j].intensity = Math.sin(elapsed * 30) * 0.25 + 3;

        smoke_list[j].material.uniforms.time.value = clock.getElapsedTime();
    }
}
