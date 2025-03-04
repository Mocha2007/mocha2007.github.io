/*
(4(b^2 - 3ac)^3 - (2b^3 - 9abc + 27a^2d)^2)/(27a^2) > 0

4(b^2 - 3ac)^3 - (2b^3 - 9abc + 27a^2d)^2 > 0

4(b^2 - 3ac)^3 > (2b^3 - 9abc + 27a^2d)^2

4(b^2 - 3ac)^3 > (2b^3 - 9abc + 27a^2d)^2

-108 a^3 c^3 + 108 a^2 b^2 c^2 - 36 a b^4 c + 4 b^6 > 729 a^4 d^2 - 486 a^3 b c d + 108 a^2 b^3 d + 81 a^2 b^2 c^2 - 36 a b^4 c + 4 b^6

-108 a^3 c^3 + 27 a^2 b^2 c^2 > 729 a^4 d^2 - 486 a^3 b c d + 108 a^2 b^3 d

-4 a c^3 + b^2 c^2 > 27 a^2 d^2 - 18 a b c d + 4 b^3 d
*/

function cubic_roots(a, b, c, d){
	const det = (4*(b**2 - 3*a*c)**3 - (2*b**3 - 9*a*b*c + 27*a**2*d)**2)/(27*a**2);
	return det < 0 ? 1 : det > 0 ? 3 : 2;
}

function quad_roots(a, b, c){
	const det = b**2 - 4*a*c;
	return det < 0 ? 0 : det > 0 ? 2 : 1;
}

function computeQuarticDiscriminant(a, b, c, d, e){
	// Ensure the leading coefficient 'a' is non-zero
	if (a === 0){
		throw new Error('The coefficient \'a\' must be non-zero for a quartic polynomial.');
	}

	// Compute intermediate terms for the discriminant
	const term1 = 256 * Math.pow(a, 3) * Math.pow(e, 3);
	const term2 = -192 * Math.pow(a, 2) * b * d * Math.pow(e, 2);
	const term3 = -128 * Math.pow(a, 2) * Math.pow(c, 2) * Math.pow(e, 2);
	const term4 = 144 * Math.pow(a, 2) * c * Math.pow(d, 2) * e;
	const term5 = -27 * Math.pow(a, 2) * Math.pow(d, 4);
	const term6 = 144 * a * Math.pow(b, 2) * c * e * d;
	const term7 = -6 * a * Math.pow(b, 2) * Math.pow(d, 3);
	const term8 = -80 * a * b * Math.pow(c, 2) * d * e;
	const term9 = 18 * a * b * c * Math.pow(d, 3);
	const term10 = 16 * a * Math.pow(c, 4) * e;
	const term11 = -4 * a * Math.pow(c, 3) * Math.pow(d, 2);
	const term12 = -27 * Math.pow(b, 4) * Math.pow(e, 2);
	const term13 = 18 * Math.pow(b, 3) * c * d * e;
	const term14 = -4 * Math.pow(b, 3) * Math.pow(d, 3);
	const term15 = -4 * Math.pow(b, 2) * Math.pow(c, 3) * e;
	const term16 = Math.pow(b, 2) * Math.pow(c, 2) * Math.pow(d, 2);

	// Combine all terms to compute the discriminant
	const discriminant
        = term1
        + term2
        + term3
        + term4
        + term5
        + term6
        + term7
        + term8
        + term9
        + term10
        + term11
        + term12
        + term13
        + term14
        + term15
        + term16;

	const P = 8*a*c - 3*b*b;
	const D = 64*a*a*a*e - 16*a*a*c*c + 16*a*b*b*c - 16*a*a*b*d - 3*b*b*b*b;
	const K = a*a*d*d - 3*a*b*c*d + 12*a*a*c*e + b*b*b*d - 4*a*c*c*c - 3*b*b*c*e;
	const q = (8*a*a*d - 4*a*b*c + b*b*b) / (8*a*a*a);
	return {discriminant, P, D, K, q};
}

function quartic_roots(a, b, c, d, e){
	const cqf = computeQuarticDiscriminant(a, b, c, d, e);
	const disc = cqf.discriminant;
	const P = cqf.P;
	const D = cqf.D;
	const K = cqf.K;
	const q = cqf.q;
	// 4 = 4 or 0
	// 1 = "1 or 2 or 3"
	return 0 < disc ? (P < 0 && D < 0 ? 4 : 0) : disc < 0 ? 2 :
	// multiple root
	P < 0 && D < 0 && K !== 0 ? 3 :
	D > 0 || (P > 0 && (D !== 0 || q !== 0)) ? 1 :
	D === 0 && P < 0 ? 2 :
	D === 0 && P > 0 && q === 0 ? 1 : 2;
}

function uniform(min, max){
	return (max-min)*Math.random()+min;
}

const results = [0, 0, 0, 0, 0];
for (let i = 0; i < 1000000; i++){
	results[cubic_roots(uniform(-1, 1), uniform(-1, 1), uniform(-1, 1), uniform(-1, 1), uniform(-1, 1))]++;
}

/*
for interval [-1, 1]
~78.2289% 1
~21.7711% 3

for quadratics: 0 = 37.1863%, 2 = 62.8137%
for quartics: 0 = 23.5942%, 2 = 69.7628%, 4 = 6.6430%
*/