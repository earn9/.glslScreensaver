// Copyright (c) 2015 Patricio Gonzalez Vivo

#ifdef GL_ES
precision mediump float;
#endif


uniform sampler2D   u_tex0;

uniform vec4        u_date;
uniform vec2        u_resolution;
uniform float       u_time;

#define PI  3.141592653589793238462643383279
#define TAU 6.283185307179586476925286766559

float digits(in vec2 st, in vec2 size, in float value, in float nDecDigit) {
  st /= size;

  float absValue = abs(value);
  float biggestDigitIndex = max(floor(log2(absValue) / log2(10.)), 0.);

  float nIntDigits = 0.;
  float counter = floor(value);
  for (int i = 0; i < 9; i++) {
    counter = floor(counter*.1);
    nIntDigits++;
    if (counter == 0.) {
      break;
    }
  }
  float digit = 12.;
  float digitIndex = (nIntDigits-1.) - floor(st.x);
  if (digitIndex > (-nDecDigit - 1.5)) {
    if (digitIndex > biggestDigitIndex) {
      if (value < 0.) {
        if (digitIndex < (biggestDigitIndex+1.5)) {
          digit = 11.;
        }
      }
    } else {
      if (digitIndex == -1.) {
        if (nDecDigit > 0.) {
          digit = 10.;
        }
      } else {
        if (digitIndex < 0.) {
          digitIndex += 1.;
        }
        float digitValue = (absValue / (pow(10., digitIndex)));
        digit = mod(floor(0.0001+digitValue), 10.);
      }
    }
  }
  vec2 pos = vec2(fract(st.x), st.y);

  if (pos.x < 0.) return 0.;
  if (pos.y < 0.) return 0.;
  if (pos.x >= 1.) return 0.;
  if (pos.y >= 1.) return 0.;

  // make a 4x5 array of bits
  float bin = 0.;
  if(digit < 0.5) { // 0
    bin = 7. + 5. * 16. + 5. * 256. + 5. * 4096. + 7. * 65536.;
  } else if(digit < 1.5) { // 1
    bin = 2. + 2. * 16. + 2. * 256. + 2. * 4096. + 2. * 65536.;
  } else if(digit < 2.5) { // 2
    bin = 7. + 1. * 16. + 7. * 256. + 4. * 4096. + 7. * 65536.;
  } else if(digit < 3.5) { // 3
    bin = 7. + 4. * 16. + 7. * 256. + 4. * 4096. + 7. * 65536.;
  } else if(digit < 4.5) { // 4
    bin = 4. + 7. * 16. + 5. * 256. + 1. * 4096. + 1. * 65536.;
  } else if(digit < 5.5) { // 5
    bin = 7. + 4. * 16. + 7. * 256. + 1. * 4096. + 7. * 65536.;
  } else if(digit < 6.5) { // 6
    bin = 7. + 5. * 16. + 7. * 256. + 1. * 4096. + 7. * 65536.;
  } else if(digit < 7.5) { // 7
    bin = 4. + 4. * 16. + 4. * 256. + 4. * 4096. + 7. * 65536.;
  } else if(digit < 8.5) { // 8
    bin = 7. + 5. * 16. + 7. * 256. + 5. * 4096. + 7. * 65536.;
  } else if(digit < 9.5) { // 9
    bin = 7. + 4. * 16. + 7. * 256. + 5. * 4096. + 7. * 65536.;
  } else if(digit < 10.5) { // '.'
    bin = 2. + 0. * 16. + 0. * 256. + 0. * 4096. + 0. * 65536.;
  } else if(digit < 11.5) { // '-'
    bin = 0. + 0. * 16. + 7. * 256. + 0. * 4096. + 0. * 65536.;
  }
  vec2 pixel = floor(pos * vec2(4., 5.));
  return mod(floor(bin / pow(2., (pixel.x + (pixel.y * 4.)))), 2.);
}

void main() {
    vec3 color = vec3(0.0);
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    float pct = min(u_time * 0.1, 1.0);
    color = texture2D(u_tex0, st).rgb * (1.0 - pct);

    if (u_resolution.y > u_resolution.x ) {
        st.y *= u_resolution.y/u_resolution.x;
        st.y -= (u_resolution.y*.5-u_resolution.x*.5)/u_resolution.x;
    } else {
        st.x *= u_resolution.x/u_resolution.y;
        st.x -= (u_resolution.x*.5-u_resolution.y*.5)/u_resolution.y;
    }

    float h = floor(u_date.w / 3600.0);
    float m = floor( mod(u_date.w, 3600.0) / 60.0 );
    float time = 0.0;

    st -= vec2(0.3, 0.45);
    time += digits(st, vec2(0.1), h, 0.);
    time += digits(st - vec2(0.2, 0.0), vec2(0.1), m, 0.);

    color += time * pct;

    gl_FragColor = vec4(color, 1.);
}