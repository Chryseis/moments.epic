uniform sampler2D texture;
uniform float currentPosition;
uniform float newPosition;
uniform float texSize;
uniform float texStep;
uniform float depth;
uniform float scale;
uniform float timer;

varying vec2 vUv;

uniform float animRatio;
uniform float hideRatio;

float stepPercent;
vec2 uvBase;
vec3 col;

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float calculateSurface(float x, float time) {
    float y = (sin(x * 1.0 + time * 1.0) + sin(x * 2.3 + time * 1.5) + sin(x * 3.3 + time * 0.4)) / 3.0;
    return y;
}

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}


float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

//  Classic Perlin 2D Noise
//  by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = perm(perm(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 *
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

vec3 getCol(float indx) {
    vec2 uvTemp = vec2( uvBase.x, uvBase.y - indx * stepPercent);
    vec4 mapTemp = texture2D( texture, uvTemp ).rgba;
    float posX = (-.5 + vUv.x);
    float posY = (1.0 - vUv.y) * stepPercent;
    float posZ = step(.9, mapTemp.a) * depth;
    return vec3(posX, posY, posZ);;
}

void main() {
    stepPercent = texStep / texSize;
    uvBase = vec2(vUv.x,  1.0 - (vUv.y * stepPercent));

    float orderY = vUv.y * texStep;
    float orderX = vUv.x * texSize;
    float order = vUv.x * vUv.y;//((orderX * texStep) + orderY)/ ( texSize * texStep );// ( orderX + orderY * texSize ) / ( texSize * texStep );
    order = pow(order, 1.0);

    float animRatio2 = smoothstep (0.0, 1.0, animRatio - order);
    float hideRatio2 = smoothstep (0.0, 1.0, hideRatio - order);

    vec3 colBase = getCol(currentPosition) * (1.0 - animRatio2);
    colBase += getCol(newPosition) * animRatio2;
    colBase.xy *= scale;
    col = colBase;


    // noise

    col.x += (-.5 + noise( colBase * 0.1 + timer * .01)) * 100.0;
    col.y += (-.5 + noise( colBase * 0.2 + timer * .005)) * 100.0;
    
    vec3 attractor1 = col;
    float dispX1 = (sin(timer*0.01) + cnoise(col.xy)) * 100.0;
    float dispY1 = sin(timer*0.1 + cnoise(col.xy)) * 200.0;
    float dispZ1 = sin(timer*0.1 + cnoise(col.xy)) * 10.0;
    attractor1 += vec3( dispX1, dispY1, dispZ1);
    
    col += (attractor1 - col) * sin( animRatio2  * 3.14  *2.0);


    col.x += smoothstep(.9, 1.0, rand(colBase.xy)) * cnoise(colBase.xy*0.1 + timer*0.002)*3000.0;
    col.y += smoothstep(.95, 1.0, rand(colBase.xy)) * cnoise(colBase.xy*0.1 + timer*0.0001)*1000.0;
    col.y += smoothstep(.99, 1.0, rand(colBase.xy)) * cnoise(colBase.xy*0.9 + timer*0.01)*4000.0;
    
    // hide

    //col.y += hideRatio2 * (2.0 + cnoise(colBase.xy + timer*0.002)) * 1500.0;
    
    
    col.x += pow(hideRatio2, 1.0) * ( abs ( calculateSurface(colBase.x * .001, hideRatio2*1.0))) * 5000.0;
    col.y += pow(hideRatio2, 2.0) * ( abs ( calculateSurface(colBase.y * .001, hideRatio2*1.0))) * 2000.0;
    col.z -= pow(hideRatio2, 3.0) * ( abs ( 1.0 + calculateSurface(colBase.x * .005, hideRatio2*1.0))) * 1000.0;

    //col.x += ( 2000.0 - col.x) * hideRatio2; 
    //col.y += ( 200.0 - col.y) * hideRatio2; 

    gl_FragColor = vec4( col, 1.0);
}
