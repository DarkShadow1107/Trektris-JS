c = document.querySelector("#c");
c.width = 1920;
c.height = 1080;
x = c.getContext("2d");
C = Math.cos;
S = Math.sin;
t = 0;
T = Math.tan;

rsz = window.onresize = () => {
	setTimeout(() => {
		if (document.body.clientWidth > document.body.clientHeight * 1.77777778) {
			c.style.height = "100vh";
			setTimeout(() => (c.style.width = c.clientHeight * 1.77777778 + "px"), 0);
		} else {
			c.style.width = "100vw";
			setTimeout(() => (c.style.height = c.clientWidth / 1.77777778 + "px"), 0);
		}
	}, 0);
};
rsz();

async function Draw() {
	oX = oY = oZ = 0;
	if (!t) {
		reflect = (a, n) => {
			let d1 = Math.hypot(...a) + 0.0001;
			let d2 = Math.hypot(...n) + 0.0001;
			a[0] /= d1;
			a[1] /= d1;
			a[2] /= d1;
			n[0] /= d2;
			n[1] /= d2;
			n[2] /= d2;
			let dot = -a[0] * n[0] + -a[1] * n[1] + -a[2] * n[2];
			let rx = -a[0] - 2 * n[0] * dot;
			let ry = -a[1] - 2 * n[1] * dot;
			let rz = -a[2] - 2 * n[2] * dot;
			return [-rx * d1, -ry * d1, -rz * d1];
		};

		spawnTunnel = (
			tx,
			ty,
			tz,
			rw,
			cl,
			sp = 1,
			rad = 0.5,
			theta1 = 0,
			theta2 = 0,
			theta1ModFreq = 0,
			theta1ModMag = 0,
			theta2ModFreq = 0,
			theta2ModMag = 0,
			theta1Offset = 0,
			theta2Offset = 0,
			radModFreq = 0,
			radModMag = 0,
			radModOffset = 0,
			showLine = false
		) => {
			let X_ = (X = tx);
			let Y_ = (Y = ty);
			let Z_ = (Z = tz);
			let ret = [];
			let p2a, p2, p2a1, ls;
			if (showLine) x.beginPath();
			for (let i = cl + 1; i--; ) {
				let p1 = theta1 + C(((Math.PI * 2) / cl) * i * theta1ModFreq + theta1Offset) * theta1ModMag;
				let p2 = theta2 + C(((Math.PI * 2) / cl) * i * theta2ModFreq + theta2Offset) * theta2ModMag;
				let p2a1 = theta2 + C(((Math.PI * 2) / cl) * (i + 1) * theta2ModFreq + theta2Offset) * theta2ModMag;
				let lsa = rad + ((C(((Math.PI * 2) / cl) * i * radModFreq + radModOffset) * rad) / 2) * radModMag;
				let lsb = rad + ((C(((Math.PI * 2) / cl) * (i + 1) * radModFreq + radModOffset) * rad) / 2) * radModMag;
				if (i == cl) {
					p2a = p2;
					ls = lsa;
				} else if (i == 0) {
					p2a = p2a1;
					ls = lsb;
				} else {
					p2a = (p2 + p2a1) / 2;
					ls = (lsa + lsb) / 2;
				}
				let a = [];
				for (let j = rw + 1; j--; ) {
					p = ((Math.PI * 2) / rw) * j + Math.PI / rw;
					X = S(p) * ls;
					Y = 0;
					Z = C(p) * ls;
					R(-p2a + Math.PI / 2, 0, 0);
					R(0, 0, -p1);
					a = [...a, [X + X_, Y + Y_, Z + Z_]];
				}

				ret = [...ret, a];

				if (showLine) {
					X = X_;
					Y = Y_;
					Z = Z_;
					R(Rl, Pt, Yw, 1);
					if (Z > 0) x.lineTo(...Q());
				}

				vx = C(p1) * C(p2) * sp;
				vy = S(p2) * sp;
				vz = S(p1) * C(p2) * sp;
				X_ += vx;
				Y_ += vy;
				Z_ += vz;
			}
			if (showLine) stroke("#f00", "", 2, false);
			a = [];
			ret.map((v, i) => {
				if (i) {
					let s1 = ret[i];
					let s2 = ret[i - 1];
					for (let j = rw; j--; ) {
						b = [];
						let l1_ = (j + 0) % rw;
						let l2_ = (j + 1) % rw;
						X = s1[l1_][0];
						Y = s1[l1_][1];
						Z = s1[l1_][2];
						b = [...b, [X, Y, Z]];
						X = s1[l2_][0];
						Y = s1[l2_][1];
						Z = s1[l2_][2];
						b = [...b, [X, Y, Z]];
						X = s2[l2_][0];
						Y = s2[l2_][1];
						Z = s2[l2_][2];
						b = [...b, [X, Y, Z]];
						X = s2[l1_][0];
						Y = s2[l1_][1];
						Z = s2[l1_][2];
						b = [...b, [X, Y, Z]];
						a = [...a, b];
					}
				}
			});
			return a;
		};

		HSVFromRGB = (R, G, B) => {
			let R_ = R / 256;
			let G_ = G / 256;
			let B_ = B / 256;
			let Cmin = Math.min(R_, G_, B_);
			let Cmax = Math.max(R_, G_, B_);
			let val = Cmax; //(Cmax+Cmin) / 2
			let delta = Cmax - Cmin;
			let sat = Cmax ? delta / Cmax : 0;
			let min = Math.min(R, G, B);
			let max = Math.max(R, G, B);
			let hue = 0;
			if (delta) {
				if (R >= G && R >= B) hue = (G - B) / (max - min);
				if (G >= R && G >= B) hue = 2 + (B - R) / (max - min);
				if (B >= G && B >= R) hue = 4 + (R - G) / (max - min);
			}
			hue *= 60;
			while (hue < 0) hue += 360;
			while (hue >= 360) hue -= 360;
			return [hue, sat, val];
		};

		RGBFromHSV = (H, S, V) => {
			while (H < 0) H += 360;
			while (H >= 360) H -= 360;
			let C = V * S;
			let X = C * (1 - Math.abs(((H / 60) % 2) - 1));
			let m = V - C;
			let R_, G_, B_;
			if (H >= 0 && H < 60) (R_ = C), (G_ = X), (B_ = 0);
			if (H >= 60 && H < 120) (R_ = X), (G_ = C), (B_ = 0);
			if (H >= 120 && H < 180) (R_ = 0), (G_ = C), (B_ = X);
			if (H >= 180 && H < 240) (R_ = 0), (G_ = X), (B_ = C);
			if (H >= 240 && H < 300) (R_ = X), (G_ = 0), (B_ = C);
			if (H >= 300 && H < 360) (R_ = C), (G_ = 0), (B_ = X);
			let R = (R_ + m) * 256;
			let G = (G_ + m) * 256;
			let B = (B_ + m) * 256;
			return [R, G, B];
		};

		R = R2 = (Rl, Pt, Yw, m) => {
			M = Math;
			A = M.atan2;
			H = M.hypot;
			X = S((p = A(X, Z) + Yw)) * (d = H(X, Z));
			Z = C(p) * d;
			Y = S((p = A(Y, Z) + Pt)) * (d = H(Y, Z));
			Z = C(p) * d;
			X = S((p = A(X, Y) + Rl)) * (d = H(X, Y));
			Y = C(p) * d;
			if (m) {
				X += oX;
				Y += oY;
				Z += oZ;
			}
		};
		Q = () => [c.width / 2 + (X / Z) * 700, c.height / 2 + (Y / Z) * 700];
		I = (A, B, M, D, E, F, G, H) =>
			(K = ((G - E) * (B - F) - (H - F) * (A - E)) / (J = (H - F) * (M - A) - (G - E) * (D - B))) >= 0 &&
			K <= 1 &&
			(L = ((M - A) * (B - F) - (D - B) * (A - E)) / J) >= 0 &&
			L <= 1
				? [A + K * (M - A), B + K * (D - B)]
				: 0;

		Rn = Math.random;
		async function loadOBJ(url, scale, tx, ty, tz, rl, pt, yw, recenter = true) {
			let res;
			await fetch(url, (res) => res)
				.then((data) => data.text())
				.then((data) => {
					a = [];
					data.split("\nv ").map((v) => {
						a = [...a, v.split("\n")[0]];
					});
					a = a.filter((v, i) => i).map((v) => [...v.split(" ").map((n) => +n.replace("\n", ""))]);
					ax = ay = az = 0;
					a.map((v) => {
						v[1] *= -1;
						if (recenter) {
							ax += v[0];
							ay += v[1];
							az += v[2];
						}
					});
					ax /= a.length;
					ay /= a.length;
					az /= a.length;
					a.map((v) => {
						X = (v[0] - ax) * scale;
						Y = (v[1] - ay) * scale;
						Z = (v[2] - az) * scale;
						R2(rl, pt, yw, 0);
						v[0] = X;
						v[1] = Y;
						v[2] = Z;
					});
					maxY = -6e6;
					a.map((v) => {
						if (v[1] > maxY) maxY = v[1];
					});
					a.map((v) => {
						v[1] -= maxY - oY;
						v[0] += tx;
						v[1] += ty;
						v[2] += tz;
					});

					b = [];
					data.split("\nf ").map((v) => {
						b = [...b, v.split("\n")[0]];
					});
					b.shift();
					b = b.map((v) => v.split(" "));
					b = b.map((v) => {
						v = v.map((q) => {
							return +q.split("/")[0];
						});
						v = v.filter((q) => q);
						return v;
					});

					res = [];
					b.map((v) => {
						e = [];
						v.map((q) => {
							e = [...e, a[q - 1]];
						});
						e = e.filter((q) => q);
						res = [...res, e];
					});
				});
			return res;
		}

		function loadAnimation(name, size, X, Y, Z, rl, pt, yw, speed = 1) {
			let rootURL = "https://srmcgann.github.io/animations";
			if (typeof animations == "undefined") animations = [];

			let animation = {
				name,
				speed,
				frameCt: 0,
				fileList: "",
				curFrame: 0,
				loopRangeStart: 0,
				loopRangeEnd: 0,
				hasLoop: false,
				looping: false,
				frameData: [],
				loaded: false,
				active: true,
			};

			fetch(`${rootURL}/${name}/fileList.json`)
				.then((v) => v.json())
				.then((data) => {
					animation.fileList = data.fileList;
					if (animation.fileList.hasLoop) {
						animation.hasLoop = true;
						animation.looping = true;
						animation.loopRangeStart = animation.fileList.loopRangeStart;
						animation.loopRangeEnd = animation.fileList.loopRangeEnd;
					}
					for (let i = 0; i < +animation.fileList.fileCount; i++) {
						let file = `${rootURL}/${name}/${animation.fileList.fileName}${i}.${animation.fileList.suffix}`;
						loadOBJ(file, size, X, Y, Z, rl, pt, yw, false).then((el) => {
							animation.frameData[i] = el;
							animation.frameCt++;
							if (animation.frameCt == +animation.fileList.fileCount) {
								console.log(`loaded animation: ${name}`);
								animation.loaded = true;
								animations = [...animations, animation];
							}
						});
					}
				});
			return name;
		}

		drawAnimation = (animation_name, scol = "#8888", fcol = "", lineWidth = 2, glowing = true, overrideGlobalAlpha = 1) => {
			let animation = animations.filter((el) => animation_name == el.name);
			if (animation.length) {
				animation = animation[0];
				animation.curFrame += animation.speed;
				if (animation.hasLoop && animation.looping) {
					animation.curFrame %= Math.min(animation.loopRangeEnd, animation.frameCt);
					if (animation.curFrame < 1) animation.curFrame = Math.max(0, animation.loopRangeStart);
				} else {
					animation.curFrame %= animation.frameCt;
				}
				animation.frameData[animation.curFrame | 0].map((v, i) => {
					x.beginPath();
					v.map((q) => {
						X = q[0];
						Y = q[1];
						Z = q[2];
						R(Rl, Pt, Yw, 1);
						if (Z > 0) x.lineTo(...Q());
					});
					stroke(scol, fcol, lineWidth, glowing, overrideGlobalAlpha);
				});
			}
		};

		geoSphere = (mx, my, mz, iBc, size) => {
			let collapse = 0;
			let B = Array(iBc)
				.fill()
				.map((v) => {
					X = Rn() - 0.5;
					Y = Rn() - 0.5;
					Z = Rn() - 0.5;
					return [X, Y, Z];
				});
			for (let m = 200; m--; ) {
				B.map((v, i) => {
					X = v[0];
					Y = v[1];
					Z = v[2];
					B.map((q, j) => {
						if (j != i) {
							X2 = q[0];
							Y2 = q[1];
							Z2 = q[2];
							d = 1 + (Math.hypot(X - X2, Y - Y2, Z - Z2) * (3 + iBc / 40) * 3) ** 4;
							X += ((X - X2) * 99) / d;
							Y += ((Y - Y2) * 99) / d;
							Z += ((Z - Z2) * 99) / d;
						}
					});
					d = Math.hypot(X, Y, Z);
					v[0] = X / d;
					v[1] = Y / d;
					v[2] = Z / d;
					if (collapse) {
						d = 25 + Math.hypot(X, Y, Z);
						v[0] = (X - X / d) / 1.1;
						v[1] = (Y - Y / d) / 1.1;
						v[2] = (Z - Z / d) / 1.1;
					}
				});
			}
			mind = 6e6;
			B.map((v, i) => {
				X1 = v[0];
				Y1 = v[1];
				Z1 = v[2];
				B.map((q, j) => {
					X2 = q[0];
					Y2 = q[1];
					Z2 = q[2];
					if (i != j) {
						d = Math.hypot((a = X1 - X2), (b = Y1 - Y2), (e = Z1 - Z2));
						if (d < mind) mind = d;
					}
				});
			});
			a = [];
			B.map((v, i) => {
				X1 = v[0];
				Y1 = v[1];
				Z1 = v[2];
				B.map((q, j) => {
					X2 = q[0];
					Y2 = q[1];
					Z2 = q[2];
					if (i != j) {
						d = Math.hypot(X1 - X2, Y1 - Y2, Z1 - Z2);
						if (d < mind * 2) {
							if (
								!a.filter((q) => q[0] == X2 && q[1] == Y2 && q[2] == Z2 && q[3] == X1 && q[4] == Y1 && q[5] == Z1)
									.length
							)
								a = [...a, [X1 * size, Y1 * size, Z1 * size, X2 * size, Y2 * size, Z2 * size]];
						}
					}
				});
			});
			B.map((v) => {
				v[0] *= size;
				v[1] *= size;
				v[2] *= size;
				v[0] += mx;
				v[1] += my;
				v[2] += mz;
			});
			return [mx, my, mz, size, B, a];
		};

		lineFaceI = (X1, Y1, Z1, X2, Y2, Z2, facet, autoFlipNormals = false, showNormals = false) => {
			let X_, Y_, Z_, d, m, l_, K, J, L, p;
			let I_ = (A, B, M, D, E, F, G, H) =>
				(K = ((G - E) * (B - F) - (H - F) * (A - E)) / (J = (H - F) * (M - A) - (G - E) * (D - B))) >= 0 &&
				K <= 1 &&
				(L = ((M - A) * (B - F) - (D - B) * (A - E)) / J) >= 0 &&
				L <= 1
					? [A + K * (M - A), B + K * (D - B)]
					: 0;
			let Q_ = () => [c.width / 2 + (X_ / Z_) * 600, c.height / 2 + (Y_ / Z_) * 600];
			let R_ = (Rl, Pt, Yw, m) => {
				let M = Math,
					A = M.atan2,
					H = M.hypot;
				(X_ = S((p = A(X_, Y_) + Rl)) * (d = H(X_, Y_))),
					(Y_ = C(p) * d),
					(X_ = S((p = A(X_, Z_) + Yw)) * (d = H(X_, Z_))),
					(Z_ = C(p) * d),
					(Y_ = S((p = A(Y_, Z_) + Pt)) * (d = H(Y_, Z_))),
					(Z_ = C(p) * d);
				if (m) {
					(X_ += oX), (Y_ += oY), (Z_ += oZ);
				}
			};
			let rotSwitch = (m) => {
				switch (m) {
					case 0:
						R_(0, 0, Math.PI / 2);
						break;
					case 1:
						R_(0, Math.PI / 2, 0);
						break;
					case 2:
						R_(Math.PI / 2, 0, Math.PI / 2);
						break;
				}
			};
			let ax = 0,
				ay = 0,
				az = 0;
			facet.map((q_) => {
				(ax += q_[0]), (ay += q_[1]), (az += q_[2]);
			});
			(ax /= facet.length), (ay /= facet.length), (az /= facet.length);
			let b1 = facet[2][0] - facet[1][0],
				b2 = facet[2][1] - facet[1][1],
				b3 = facet[2][2] - facet[1][2];
			let c1 = facet[1][0] - facet[0][0],
				c2 = facet[1][1] - facet[0][1],
				c3 = facet[1][2] - facet[0][2];
			let crs = [b2 * c3 - b3 * c2, b3 * c1 - b1 * c3, b1 * c2 - b2 * c1];
			d = Math.hypot(...crs) + 0.001;
			let nls = 1; //normal line length
			crs = crs.map((q) => (q / d) * nls);
			let X1_ = ax,
				Y1_ = ay,
				Z1_ = az;
			let flip = 1;
			if (autoFlipNormals) {
				let d1_ = Math.hypot(X1_ - X1, Y1_ - Y1, Z1_ - Z1);
				let d2_ = Math.hypot(X1 - (ax + crs[0] / 99), Y1 - (ay + crs[1] / 99), Z1 - (az + crs[2] / 99));
				flip = d2_ > d1_ ? -1 : 1;
			}
			let X2_ = ax + (crs[0] *= flip),
				Y2_ = ay + (crs[1] *= flip),
				Z2_ = az + (crs[2] *= flip);
			if (showNormals) {
				x.beginPath();
				(X_ = X1_), (Y_ = Y1_), (Z_ = Z1_);
				R_(Rl, Pt, Yw, 1);
				if (Z_ > 0) x.lineTo(...Q_());
				(X_ = X2_), (Y_ = Y2_), (Z_ = Z2_);
				R_(Rl, Pt, Yw, 1);
				if (Z_ > 0) x.lineTo(...Q_());
				x.lineWidth = 5;
				x.strokeStyle = "#f004";
				x.stroke();
			}

			let p1_ = Math.atan2(X2_ - X1_, Z2_ - Z1_);
			let p2_ = -(Math.acos((Y2_ - Y1_) / (Math.hypot(X2_ - X1_, Y2_ - Y1_, Z2_ - Z1_) + 0.001)) + Math.PI / 2);
			let isc = false,
				iscs = [false, false, false];
			(X_ = X1), (Y_ = Y1), (Z_ = Z1);
			R_(0, -p2_, -p1_);
			let rx_ = X_,
				ry_ = Y_,
				rz_ = Z_;
			for (let m = 3; m--; ) {
				if (isc === false) {
					(X_ = rx_), (Y_ = ry_), (Z_ = rz_);
					rotSwitch(m);
					(X1_ = X_), (Y1_ = Y_), (Z1_ = Z_ = 5), (X_ = X2), (Y_ = Y2), (Z_ = Z2);
					R_(0, -p2_, -p1_);
					rotSwitch(m);
					(X2_ = X_), (Y2_ = Y_), (Z2_ = Z_);
					facet.map((q_, j_) => {
						if (isc === false) {
							let l = j_;
							(X_ = facet[l][0]), (Y_ = facet[l][1]), (Z_ = facet[l][2]);
							R_(0, -p2_, -p1_);
							rotSwitch(m);
							let X3_ = X_,
								Y3_ = Y_,
								Z3_ = Z_;
							l = (j_ + 1) % facet.length;
							(X_ = facet[l][0]), (Y_ = facet[l][1]), (Z_ = facet[l][2]);
							R_(0, -p2_, -p1_);
							rotSwitch(m);
							let X4_ = X_,
								Y4_ = Y_,
								Z4_ = Z_;
							if ((l_ = I_(X1_, Y1_, X2_, Y2_, X3_, Y3_, X4_, Y4_))) iscs[m] = l_;
						}
					});
				}
			}
			if (iscs.filter((v) => v !== false).length == 3) {
				let iscx = iscs[1][0],
					iscy = iscs[0][1],
					iscz = iscs[0][0];
				let pointInPoly = true;
				(ax = 0), (ay = 0), (az = 0);
				facet.map((q_, j_) => {
					(ax += q_[0]), (ay += q_[1]), (az += q_[2]);
				});
				(ax /= facet.length), (ay /= facet.length), (az /= facet.length);
				(X_ = ax), (Y_ = ay), (Z_ = az);
				R_(0, -p2_, -p1_);
				(X1_ = X_), (Y1_ = Y_), (Z1_ = Z_);
				(X2_ = iscx), (Y2_ = iscy), (Z2_ = iscz);
				facet.map((q_, j_) => {
					if (pointInPoly) {
						let l = j_;
						(X_ = facet[l][0]), (Y_ = facet[l][1]), (Z_ = facet[l][2]);
						R_(0, -p2_, -p1_);
						let X3_ = X_,
							Y3_ = Y_,
							Z3_ = Z_;
						l = (j_ + 1) % facet.length;
						(X_ = facet[l][0]), (Y_ = facet[l][1]), (Z_ = facet[l][2]);
						R_(0, -p2_, -p1_);
						let X4_ = X_,
							Y4_ = Y_,
							Z4_ = Z_;
						if (I_(X1_, Y1_, X2_, Y2_, X3_, Y3_, X4_, Y4_)) pointInPoly = false;
					}
				});
				if (pointInPoly) {
					(X_ = iscx), (Y_ = iscy), (Z_ = iscz);
					R_(0, p2_, 0);
					R_(0, 0, p1_);
					isc = [
						[X_, Y_, Z_],
						[crs[0], crs[1], crs[2]],
					];
				}
			}
			return isc;
		};

		TruncatedOctahedron = (ls) => {
			let shp = [],
				a = [];
			mind = 6e6;
			for (let i = 6; i--; ) {
				X = S((p = ((Math.PI * 2) / 6) * i + Math.PI / 6)) * ls;
				Y = C(p) * ls;
				Z = 0;
				if (Y < mind) mind = Y;
				a = [...a, [X, Y, Z]];
			}
			let theta = 0.6154797086703867;
			a.map((v) => {
				X = v[0];
				Y = v[1] - mind;
				Z = v[2];
				R(0, theta, 0);
				v[0] = X;
				v[1] = Y;
				v[2] = Z + 1.5;
			});
			b = JSON.parse(JSON.stringify(a)).map((v) => {
				v[1] *= -1;
				return v;
			});
			shp = [...shp, a, b];
			e = JSON.parse(JSON.stringify(shp)).map((v) => {
				v.map((q) => {
					X = q[0];
					Y = q[1];
					Z = q[2];
					R(0, 0, Math.PI);
					q[0] = X;
					q[1] = Y;
					q[2] = Z;
				});
				return v;
			});
			shp = [...shp, ...e];
			e = JSON.parse(JSON.stringify(shp)).map((v) => {
				v.map((q) => {
					X = q[0];
					Y = q[1];
					Z = q[2];
					R(0, 0, Math.PI / 2);
					q[0] = X;
					q[1] = Y;
					q[2] = Z;
				});
				return v;
			});
			shp = [...shp, ...e];

			coords = [
				[
					[3, 1],
					[4, 3],
					[4, 4],
					[3, 2],
				],
				[
					[3, 4],
					[3, 3],
					[2, 4],
					[6, 2],
				],
				[
					[1, 4],
					[0, 3],
					[0, 4],
					[4, 2],
				],
				[
					[1, 1],
					[1, 2],
					[6, 4],
					[7, 3],
				],
				[
					[3, 5],
					[7, 5],
					[1, 5],
					[3, 0],
				],
				[
					[2, 5],
					[6, 5],
					[0, 5],
					[4, 5],
				],
			];
			a = [];
			coords.map((v) => {
				b = [];
				v.map((q) => {
					X = shp[q[0]][q[1]][0];
					Y = shp[q[0]][q[1]][1];
					Z = shp[q[0]][q[1]][2];
					b = [...b, [X, Y, Z]];
				});
				a = [...a, b];
			});
			shp = [...shp, ...a];
			return shp.map((v) => {
				v.map((q) => {
					q[0] /= 3;
					q[1] /= 3;
					q[2] /= 3;
					q[0] *= ls;
					q[1] *= ls;
					q[2] *= ls;
				});
				return v;
			});
		};

		Cylinder = (rw, cl, ls1, ls2) => {
			let a = [];
			for (let i = rw; i--; ) {
				let b = [];
				for (let j = cl; j--; ) {
					X = S((p = ((Math.PI * 2) / cl) * j)) * ls1;
					Y = ((1 / rw) * i - 0.5) * ls2;
					Z = C(p) * ls1;
					b = [...b, [X, Y, Z]];
				}
				//a = [...a, b]
				for (let j = cl; j--; ) {
					b = [];
					X = S((p = ((Math.PI * 2) / cl) * j)) * ls1;
					Y = ((1 / rw) * i - 0.5) * ls2;
					Z = C(p) * ls1;
					b = [...b, [X, Y, Z]];
					X = S((p = ((Math.PI * 2) / cl) * (j + 1))) * ls1;
					Y = ((1 / rw) * i - 0.5) * ls2;
					Z = C(p) * ls1;
					b = [...b, [X, Y, Z]];
					X = S((p = ((Math.PI * 2) / cl) * (j + 1))) * ls1;
					Y = ((1 / rw) * (i + 1) - 0.5) * ls2;
					Z = C(p) * ls1;
					b = [...b, [X, Y, Z]];
					X = S((p = ((Math.PI * 2) / cl) * j)) * ls1;
					Y = ((1 / rw) * (i + 1) - 0.5) * ls2;
					Z = C(p) * ls1;
					b = [...b, [X, Y, Z]];
					a = [...a, b];
				}
			}
			b = [];
			for (let j = cl; j--; ) {
				X = S((p = ((Math.PI * 2) / cl) * j)) * ls1;
				Y = ls2 / 2;
				Z = C(p) * ls1;
				b = [...b, [X, Y, Z]];
			}
			//a = [...a, b]
			return a;
		};

		Tetrahedron = (size) => {
			ret = [];
			a = [];
			let h = size / 1.4142 / 1.25;
			for (i = 3; i--; ) {
				X = (S((p = ((Math.PI * 2) / 3) * i)) * size) / 1.25;
				Y = (C(p) * size) / 1.25;
				Z = h;
				a = [...a, [X, Y, Z]];
			}
			ret = [...ret, a];
			for (j = 3; j--; ) {
				a = [];
				X = 0;
				Y = 0;
				Z = -h;
				a = [...a, [X, Y, Z]];
				X = (S((p = ((Math.PI * 2) / 3) * j)) * size) / 1.25;
				Y = (C(p) * size) / 1.25;
				Z = h;
				a = [...a, [X, Y, Z]];
				X = (S((p = ((Math.PI * 2) / 3) * (j + 1))) * size) / 1.25;
				Y = (C(p) * size) / 1.25;
				Z = h;
				a = [...a, [X, Y, Z]];
				ret = [...ret, a];
			}
			ax = ay = az = ct = 0;
			ret.map((v) => {
				v.map((q) => {
					ax += q[0];
					ay += q[1];
					az += q[2];
					ct++;
				});
			});
			ax /= ct;
			ay /= ct;
			az /= ct;
			ret.map((v) => {
				v.map((q) => {
					q[0] -= ax;
					q[1] -= ay;
					q[2] -= az;
				});
			});
			return ret;
		};

		Cube = (size) => {
			for (CB = [], j = 6; j--; CB = [...CB, b])
				for (b = [], i = 4; i--; )
					b = [
						...b,
						[
							(a = [S((p = ((Math.PI * 2) / 4) * i + Math.PI / 4)), C(p), 2 ** 0.5 / 2])[j % 3] *
								(l = j < 3 ? size / 1.5 : -size / 1.5),
							a[(j + 1) % 3] * l,
							a[(j + 2) % 3] * l,
						],
					];
			return CB;
		};

		Octahedron = (size) => {
			ret = [];
			let h = size / 1.25;
			for (j = 8; j--; ) {
				a = [];
				X = 0;
				Y = 0;
				Z = h * (j < 4 ? -1 : 1);
				a = [...a, [X, Y, Z]];
				X = (S((p = ((Math.PI * 2) / 4) * j)) * size) / 1.25;
				Y = (C(p) * size) / 1.25;
				Z = 0;
				a = [...a, [X, Y, Z]];
				X = (S((p = ((Math.PI * 2) / 4) * (j + 1))) * size) / 1.25;
				Y = (C(p) * size) / 1.25;
				Z = 0;
				a = [...a, [X, Y, Z]];
				ret = [...ret, a];
			}
			return ret;
		};

		Dodecahedron = (size) => {
			ret = [];
			a = [];
			mind = -6e6;
			for (i = 5; i--; ) {
				X = S((p = ((Math.PI * 2) / 5) * i + Math.PI / 5));
				Y = C(p);
				Z = 0;
				if (Y > mind) mind = Y;
				a = [...a, [X, Y, Z]];
			}
			a.map((v) => {
				X = v[0];
				Y = v[1] -= mind;
				Z = v[2];
				R(0, 0.553573, 0);
				v[0] = X;
				v[1] = Y;
				v[2] = Z;
			});
			b = JSON.parse(JSON.stringify(a));
			b.map((v) => {
				v[1] *= -1;
			});
			ret = [...ret, a, b];
			mind = -6e6;
			ret.map((v) => {
				v.map((q) => {
					X = q[0];
					Y = q[1];
					Z = q[2];
					if (Z > mind) mind = Z;
				});
			});
			d1 = Math.hypot(ret[0][0][0] - ret[0][1][0], ret[0][0][1] - ret[0][1][1], ret[0][0][2] - ret[0][1][2]);
			ret.map((v) => {
				v.map((q) => {
					q[2] -= mind + d1 / 2;
				});
			});
			b = JSON.parse(JSON.stringify(ret));
			b.map((v) => {
				v.map((q) => {
					q[2] *= -1;
				});
			});
			ret = [...ret, ...b];
			b = JSON.parse(JSON.stringify(ret));
			b.map((v) => {
				v.map((q) => {
					X = q[0];
					Y = q[1];
					Z = q[2];
					R(0, 0, Math.PI / 2);
					R(0, Math.PI / 2, 0);
					q[0] = X;
					q[1] = Y;
					q[2] = Z;
				});
			});
			e = JSON.parse(JSON.stringify(ret));
			e.map((v) => {
				v.map((q) => {
					X = q[0];
					Y = q[1];
					Z = q[2];
					R(0, 0, Math.PI / 2);
					R(Math.PI / 2, 0, 0);
					q[0] = X;
					q[1] = Y;
					q[2] = Z;
				});
			});
			ret = [...ret, ...b, ...e];
			ret.map((v) => {
				v.map((q) => {
					q[0] *= size / 2;
					q[1] *= size / 2;
					q[2] *= size / 2;
				});
			});
			return ret;
		};

		Icosahedron = (size) => {
			ret = [];
			let B = [
				[
					[0, 3],
					[1, 0],
					[2, 2],
				],
				[
					[0, 3],
					[1, 0],
					[1, 3],
				],
				[
					[0, 3],
					[2, 3],
					[1, 3],
				],
				[
					[0, 2],
					[2, 1],
					[1, 0],
				],
				[
					[0, 2],
					[1, 3],
					[1, 0],
				],
				[
					[0, 2],
					[1, 3],
					[2, 0],
				],
				[
					[0, 3],
					[2, 2],
					[0, 0],
				],
				[
					[1, 0],
					[2, 2],
					[2, 1],
				],
				[
					[1, 1],
					[2, 2],
					[2, 1],
				],
				[
					[1, 1],
					[2, 2],
					[0, 0],
				],
				[
					[1, 1],
					[2, 1],
					[0, 1],
				],
				[
					[0, 2],
					[2, 1],
					[0, 1],
				],
				[
					[2, 0],
					[1, 2],
					[2, 3],
				],
				[
					[0, 0],
					[0, 3],
					[2, 3],
				],
				[
					[1, 3],
					[2, 0],
					[2, 3],
				],
				[
					[2, 3],
					[0, 0],
					[1, 2],
				],
				[
					[1, 2],
					[2, 0],
					[0, 1],
				],
				[
					[0, 0],
					[1, 2],
					[1, 1],
				],
				[
					[0, 1],
					[1, 2],
					[1, 1],
				],
				[
					[0, 2],
					[2, 0],
					[0, 1],
				],
			];
			for (p = [1, 1], i = 38; i--; ) p = [...p, p[(l = p.length - 1)] + p[l - 1]];
			phi = p[l] / p[l - 1];
			a = [
				[-phi, -1, 0],
				[phi, -1, 0],
				[phi, 1, 0],
				[-phi, 1, 0],
			];
			for (j = 3; j--; ret = [...ret, b])
				for (b = [], i = 4; i--; ) b = [...b, [a[i][j], a[i][(j + 1) % 3], a[i][(j + 2) % 3]]];
			ret.map((v) => {
				v.map((q) => {
					q[0] *= size / 2.25;
					q[1] *= size / 2.25;
					q[2] *= size / 2.25;
				});
			});
			cp = JSON.parse(JSON.stringify(ret));
			out = [];
			a = [];
			B.map((v) => {
				idx1a = v[0][0];
				idx2a = v[1][0];
				idx3a = v[2][0];
				idx1b = v[0][1];
				idx2b = v[1][1];
				idx3b = v[2][1];
				a = [...a, [cp[idx1a][idx1b], cp[idx2a][idx2b], cp[idx3a][idx3b]]];
			});
			out = [...out, ...a];
			return out;
		};

		stroke = (scol, fcol, lwo = 1, od = true, oga = 1, overrideClosePath = false) => {
			if (scol) {
				if (!overrideClosePath) x.closePath();
				if (od) x.globalAlpha = 0.2 * oga;
				x.strokeStyle = scol;
				x.lineWidth = Math.min(1000, (100 * lwo) / Z);
				if (od) x.stroke();
				x.lineWidth /= 4;
				x.globalAlpha = 1 * oga;
				x.stroke();
			}
			if (fcol) {
				x.globalAlpha = 1 * oga;
				x.fillStyle = fcol;
				x.fill();
			}
			x.globalAlpha = 1;
		};

		bezTo = (X1, Y1, X2, Y2, col1, col2, lw = 1, dual = true, oga = 1, horizontal = true) => {
			let Xa, Ya, Xb, Yb, X, Y, l1, l2, l3;
			if (horizontal) {
				Xa = X1 + ((X2 - X1) / 3) * 2;
				Ya = Y1;
				Xb = X1 + ((X2 - X1) / 3) * 1;
				Yb = Y2;
			} else {
				Xa = X1;
				Ya = Y1 + ((Y2 - Y1) / 3) * 2;
				Xb = X2;
				Yb = Y1 + ((Y2 - Y1) / 3) * 1;
			}
			x.beginPath();
			X = X1;
			Y = Y1;
			x.moveTo(X, Y);
			x.bezierCurveTo(Xa, Ya, Xb, Yb, X2, Y2);
			Z = 5;
			stroke(col1, col2, lw, dual, oga, true);
		};

		subbed = (subs, size, sphereize, shape) => {
			for (let m = subs; m--; ) {
				base = shape;
				shape = [];
				base.map((v) => {
					l = 0;
					X1 = v[l][0];
					Y1 = v[l][1];
					Z1 = v[l][2];
					l = 1;
					X2 = v[l][0];
					Y2 = v[l][1];
					Z2 = v[l][2];
					l = 2;
					X3 = v[l][0];
					Y3 = v[l][1];
					Z3 = v[l][2];
					if (v.length > 3) {
						l = 3;
						X4 = v[l][0];
						Y4 = v[l][1];
						Z4 = v[l][2];
						if (v.length > 4) {
							l = 4;
							X5 = v[l][0];
							Y5 = v[l][1];
							Z5 = v[l][2];
						}
					}
					mx1 = (X1 + X2) / 2;
					my1 = (Y1 + Y2) / 2;
					mz1 = (Z1 + Z2) / 2;
					mx2 = (X2 + X3) / 2;
					my2 = (Y2 + Y3) / 2;
					mz2 = (Z2 + Z3) / 2;
					a = [];
					switch (v.length) {
						case 3:
							mx3 = (X3 + X1) / 2;
							my3 = (Y3 + Y1) / 2;
							mz3 = (Z3 + Z1) / 2;
							(X = X1), (Y = Y1), (Z = Z1), (a = [...a, [X, Y, Z]]);
							(X = mx1), (Y = my1), (Z = mz1), (a = [...a, [X, Y, Z]]);
							(X = mx3), (Y = my3), (Z = mz3), (a = [...a, [X, Y, Z]]);
							shape = [...shape, a];
							a = [];
							(X = mx1), (Y = my1), (Z = mz1), (a = [...a, [X, Y, Z]]);
							(X = X2), (Y = Y2), (Z = Z2), (a = [...a, [X, Y, Z]]);
							(X = mx2), (Y = my2), (Z = mz2), (a = [...a, [X, Y, Z]]);
							shape = [...shape, a];
							a = [];
							(X = mx3), (Y = my3), (Z = mz3), (a = [...a, [X, Y, Z]]);
							(X = mx2), (Y = my2), (Z = mz2), (a = [...a, [X, Y, Z]]);
							(X = X3), (Y = Y3), (Z = Z3), (a = [...a, [X, Y, Z]]);
							shape = [...shape, a];
							a = [];
							(X = mx1), (Y = my1), (Z = mz1), (a = [...a, [X, Y, Z]]);
							(X = mx2), (Y = my2), (Z = mz2), (a = [...a, [X, Y, Z]]);
							(X = mx3), (Y = my3), (Z = mz3), (a = [...a, [X, Y, Z]]);
							shape = [...shape, a];
							break;
						case 4:
							mx3 = (X3 + X4) / 2;
							my3 = (Y3 + Y4) / 2;
							mz3 = (Z3 + Z4) / 2;
							mx4 = (X4 + X1) / 2;
							my4 = (Y4 + Y1) / 2;
							mz4 = (Z4 + Z1) / 2;
							cx = (X1 + X2 + X3 + X4) / 4;
							cy = (Y1 + Y2 + Y3 + Y4) / 4;
							cz = (Z1 + Z2 + Z3 + Z4) / 4;
							(X = X1), (Y = Y1), (Z = Z1), (a = [...a, [X, Y, Z]]);
							(X = mx1), (Y = my1), (Z = mz1), (a = [...a, [X, Y, Z]]);
							(X = cx), (Y = cy), (Z = cz), (a = [...a, [X, Y, Z]]);
							(X = mx4), (Y = my4), (Z = mz4), (a = [...a, [X, Y, Z]]);
							shape = [...shape, a];
							a = [];
							(X = mx1), (Y = my1), (Z = mz1), (a = [...a, [X, Y, Z]]);
							(X = X2), (Y = Y2), (Z = Z2), (a = [...a, [X, Y, Z]]);
							(X = mx2), (Y = my2), (Z = mz2), (a = [...a, [X, Y, Z]]);
							(X = cx), (Y = cy), (Z = cz), (a = [...a, [X, Y, Z]]);
							shape = [...shape, a];
							a = [];
							(X = cx), (Y = cy), (Z = cz), (a = [...a, [X, Y, Z]]);
							(X = mx2), (Y = my2), (Z = mz2), (a = [...a, [X, Y, Z]]);
							(X = X3), (Y = Y3), (Z = Z3), (a = [...a, [X, Y, Z]]);
							(X = mx3), (Y = my3), (Z = mz3), (a = [...a, [X, Y, Z]]);
							shape = [...shape, a];
							a = [];
							(X = mx4), (Y = my4), (Z = mz4), (a = [...a, [X, Y, Z]]);
							(X = cx), (Y = cy), (Z = cz), (a = [...a, [X, Y, Z]]);
							(X = mx3), (Y = my3), (Z = mz3), (a = [...a, [X, Y, Z]]);
							(X = X4), (Y = Y4), (Z = Z4), (a = [...a, [X, Y, Z]]);
							shape = [...shape, a];
							break;
						case 5:
							cx = (X1 + X2 + X3 + X4 + X5) / 5;
							cy = (Y1 + Y2 + Y3 + Y4 + Y5) / 5;
							cz = (Z1 + Z2 + Z3 + Z4 + Z5) / 5;
							mx3 = (X3 + X4) / 2;
							my3 = (Y3 + Y4) / 2;
							mz3 = (Z3 + Z4) / 2;
							mx4 = (X4 + X5) / 2;
							my4 = (Y4 + Y5) / 2;
							mz4 = (Z4 + Z5) / 2;
							mx5 = (X5 + X1) / 2;
							my5 = (Y5 + Y1) / 2;
							mz5 = (Z5 + Z1) / 2;
							(X = X1), (Y = Y1), (Z = Z1), (a = [...a, [X, Y, Z]]);
							(X = X2), (Y = Y2), (Z = Z2), (a = [...a, [X, Y, Z]]);
							(X = cx), (Y = cy), (Z = cz), (a = [...a, [X, Y, Z]]);
							shape = [...shape, a];
							a = [];
							(X = X2), (Y = Y2), (Z = Z2), (a = [...a, [X, Y, Z]]);
							(X = X3), (Y = Y3), (Z = Z3), (a = [...a, [X, Y, Z]]);
							(X = cx), (Y = cy), (Z = cz), (a = [...a, [X, Y, Z]]);
							shape = [...shape, a];
							a = [];
							(X = X3), (Y = Y3), (Z = Z3), (a = [...a, [X, Y, Z]]);
							(X = X4), (Y = Y4), (Z = Z4), (a = [...a, [X, Y, Z]]);
							(X = cx), (Y = cy), (Z = cz), (a = [...a, [X, Y, Z]]);
							shape = [...shape, a];
							a = [];
							(X = X4), (Y = Y4), (Z = Z4), (a = [...a, [X, Y, Z]]);
							(X = X5), (Y = Y5), (Z = Z5), (a = [...a, [X, Y, Z]]);
							(X = cx), (Y = cy), (Z = cz), (a = [...a, [X, Y, Z]]);
							shape = [...shape, a];
							a = [];
							(X = X5), (Y = Y5), (Z = Z5), (a = [...a, [X, Y, Z]]);
							(X = X1), (Y = Y1), (Z = Z1), (a = [...a, [X, Y, Z]]);
							(X = cx), (Y = cy), (Z = cz), (a = [...a, [X, Y, Z]]);
							shape = [...shape, a];
							a = [];
							break;
					}
				});
			}
			if (sphereize) {
				ip1 = sphereize;
				ip2 = 1 - sphereize;
				shape = shape.map((v) => {
					v = v.map((q) => {
						X = q[0];
						Y = q[1];
						Z = q[2];
						d = Math.hypot(X, Y, Z);
						X /= d;
						Y /= d;
						Z /= d;
						X *= size * 0.75 * ip1 + d * ip2;
						Y *= size * 0.75 * ip1 + d * ip2;
						Z *= size * 0.75 * ip1 + d * ip2;
						return [X, Y, Z];
					});
					return v;
				});
			}
			return shape;
		};

		subDividedIcosahedron = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Icosahedron(size));
		subDividedTetrahedron = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Tetrahedron(size));
		subDividedOctahedron = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Octahedron(size));
		subDividedCube = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Cube(size));
		subDividedDodecahedron = (size, subs, sphereize = 0) => subbed(subs, size, sphereize, Dodecahedron(size));

		Rn = Math.random;

		LsystemRecurse = (size, splits, p1, p2, stem, theta, LsystemReduction, twistFactor) => {
			if (size < 0.25) return;
			let X1 = stem[0];
			let Y1 = stem[1];
			let Z1 = stem[2];
			let X2 = stem[3];
			let Y2 = stem[4];
			let Z2 = stem[5];
			let p1a = Math.atan2(X2 - X1, Z2 - Z1);
			let p2a = -Math.acos((Y2 - Y1) / (Math.hypot(X2 - X1, Y2 - Y1, Z2 - Z1) + 0.0001)) + Math.PI;
			size /= LsystemReduction;
			for (let i = splits; i--; ) {
				X = 0;
				Y = -size;
				Z = 0;
				R(0, theta, 0);
				R(0, 0, ((Math.PI * 2) / splits) * i + twistFactor);
				R(0, p2a, 0);
				R(0, 0, p1a + twistFactor);
				X += X2;
				Y += Y2;
				Z += Z2;
				let newStem = [X2, Y2, Z2, X, Y, Z];
				Lshp = [...Lshp, newStem];
				LsystemRecurse(
					size,
					splits,
					p1 + ((Math.PI * 2) / splits) * i + twistFactor,
					p2 + theta,
					newStem,
					theta,
					LsystemReduction,
					twistFactor
				);
			}
		};
		DrawLsystem = (shp) => {
			shp.map((v) => {
				x.beginPath();
				X = v[0];
				Y = v[1];
				Z = v[2];
				R(Rl, Pt, Yw, 1);
				if (Z > 0) x.lineTo(...Q());
				X = v[3];
				Y = v[4];
				Z = v[5];
				R(Rl, Pt, Yw, 1);
				if (Z > 0) x.lineTo(...Q());
				lwo = Math.hypot(v[0] - v[3], v[1] - v[4], v[2] - v[5]) * 4;
				stroke("#0f82", "", lwo);
			});
		};
		Lsystem = (size, splits, theta, LsystemReduction, twistFactor) => {
			Lshp = [];
			stem = [0, 0, 0, 0, -size, 0];
			Lshp = [...Lshp, stem];
			LsystemRecurse(size, splits, 0, 0, stem, theta, LsystemReduction, twistFactor);
			Lshp.map((v) => {
				v[1] += size * 1.5;
				v[4] += size * 1.5;
			});
			return Lshp;
		};

		Sphere = (ls, rw, cl) => {
			a = [];
			ls /= 1.25;
			for (j = rw; j--; ) {
				for (i = cl; i--; ) {
					b = [];
					X = S((p = ((Math.PI * 2) / cl) * i)) * S((q = (Math.PI / rw) * j)) * ls;
					Y = C(q) * ls;
					Z = C(p) * S(q) * ls;
					b = [...b, [X, Y, Z]];
					X = S((p = ((Math.PI * 2) / cl) * (i + 1))) * S((q = (Math.PI / rw) * j)) * ls;
					Y = C(q) * ls;
					Z = C(p) * S(q) * ls;
					b = [...b, [X, Y, Z]];
					X = S((p = ((Math.PI * 2) / cl) * (i + 1))) * S((q = (Math.PI / rw) * (j + 1))) * ls;
					Y = C(q) * ls;
					Z = C(p) * S(q) * ls;
					b = [...b, [X, Y, Z]];
					X = S((p = ((Math.PI * 2) / cl) * i)) * S((q = (Math.PI / rw) * (j + 1))) * ls;
					Y = C(q) * ls;
					Z = C(p) * S(q) * ls;
					b = [...b, [X, Y, Z]];
					a = [...a, b];
				}
			}
			return a;
		};

		Torus = (rw, cl, ls1, ls2, parts = 1, twists = 0, part_spacing = 1.5) => {
			let ret = [],
				tx = 0,
				ty = 0,
				tz = 0,
				prl1 = 0,
				p2a = 0;
			let tx1 = 0,
				ty1 = 0,
				tz1 = 0,
				prl2 = 0,
				p2b = 0,
				tx2 = 0,
				ty2 = 0,
				tz2 = 0;
			for (let m = parts; m--; ) {
				avgs = Array(rw)
					.fill()
					.map((v) => [0, 0, 0]);
				for (j = rw; j--; )
					for (let i = cl; i--; ) {
						if (parts > 1) {
							ls3 = ls1 * part_spacing;
							X = S((p = ((Math.PI * 2) / parts) * m)) * ls3;
							Y = C(p) * ls3;
							Z = 0;
							R((prl1 = ((Math.PI * 2) / rw) * (j - 1) * twists), 0, 0);
							tx1 = X;
							ty1 = Y;
							tz1 = Z;
							R(0, 0, ((Math.PI * 2) / rw) * (j - 1));
							ax1 = X;
							ay1 = Y;
							az1 = Z;
							X = S((p = ((Math.PI * 2) / parts) * m)) * ls3;
							Y = C(p) * ls3;
							Z = 0;
							R((prl2 = ((Math.PI * 2) / rw) * j * twists), 0, 0);
							tx2 = X;
							ty2 = Y;
							tz2 = Z;
							R(0, 0, ((Math.PI * 2) / rw) * j);
							ax2 = X;
							ay2 = Y;
							az2 = Z;
							p1a = Math.atan2(ax2 - ax1, az2 - az1);
							p2a = Math.PI / 2 + Math.acos((ay2 - ay1) / (Math.hypot(ax2 - ax1, ay2 - ay1, az2 - az1) + 0.001));

							X = S((p = ((Math.PI * 2) / parts) * m)) * ls3;
							Y = C(p) * ls3;
							Z = 0;
							R(((Math.PI * 2) / rw) * j * twists, 0, 0);
							tx1b = X;
							ty1b = Y;
							tz1b = Z;
							R(0, 0, ((Math.PI * 2) / rw) * j);
							ax1b = X;
							ay1b = Y;
							az1b = Z;
							X = S((p = ((Math.PI * 2) / parts) * m)) * ls3;
							Y = C(p) * ls3;
							Z = 0;
							R(((Math.PI * 2) / rw) * (j + 1) * twists, 0, 0);
							tx2b = X;
							ty2b = Y;
							tz2b = Z;
							R(0, 0, ((Math.PI * 2) / rw) * (j + 1));
							ax2b = X;
							ay2b = Y;
							az2b = Z;
							p1b = Math.atan2(ax2b - ax1b, az2b - az1b);
							p2b =
								Math.PI / 2 +
								Math.acos((ay2b - ay1b) / (Math.hypot(ax2b - ax1b, ay2b - ay1b, az2b - az1b) + 0.001));
						}
						a = [];
						X = S((p = ((Math.PI * 2) / cl) * i)) * ls1;
						Y = C(p) * ls1;
						Z = 0;
						//R(0,0,-p1a)
						R(prl1, p2a, 0);
						(X += ls2 + tx1), (Y += ty1), (Z += tz1);
						R(0, 0, ((Math.PI * 2) / rw) * j);
						a = [...a, [X, Y, Z]];
						X = S((p = ((Math.PI * 2) / cl) * (i + 1))) * ls1;
						Y = C(p) * ls1;
						Z = 0;
						//R(0,0,-p1a)
						R(prl1, p2a, 0);
						(X += ls2 + tx1), (Y += ty1), (Z += tz1);
						R(0, 0, ((Math.PI * 2) / rw) * j);
						a = [...a, [X, Y, Z]];
						X = S((p = ((Math.PI * 2) / cl) * (i + 1))) * ls1;
						Y = C(p) * ls1;
						Z = 0;
						//R(0,0,-p1b)
						R(prl2, p2b, 0);
						(X += ls2 + tx2), (Y += ty2), (Z += tz2);
						R(0, 0, ((Math.PI * 2) / rw) * (j + 1));
						a = [...a, [X, Y, Z]];
						X = S((p = ((Math.PI * 2) / cl) * i)) * ls1;
						Y = C(p) * ls1;
						Z = 0;
						//R(0,0,-p1b)
						R(prl2, p2b, 0);
						(X += ls2 + tx2), (Y += ty2), (Z += tz2);
						R(0, 0, ((Math.PI * 2) / rw) * (j + 1));
						a = [...a, [X, Y, Z]];
						ret = [...ret, a];
					}
			}
			return ret;
		};

		(G_ = 100000), (iSTc = 1e4);
		ST = Array(iSTc)
			.fill()
			.map((v) => {
				X = (Rn() - 0.5) * G_;
				Y = (Rn() - 0.5) * G_;
				Z = (Rn() - 0.5) * G_;
				return [X, Y, Z];
			});

		burst = new Image();
		burst.src = "https://srmcgann.github.io/temp/burst.png";

		document.body.onload = () => {
			c.focus();
		};

		(starsLoaded = false), (starImgs = [{ loaded: false }]);
		starImgs = Array(9)
			.fill()
			.map((v, i) => {
				let a = { img: new Image(), loaded: false };
				a.img.onload = () => {
					a.loaded = true;
					setTimeout(() => {
						if (starImgs.filter((v) => v.loaded).length == 9) starsLoaded = true;
					}, 0);
				};
				a.img.src = `https://srmcgann.github.io/stars/star${i + 1}.png`;
				return a;
			});

		showstars = true;

		tboard = new Image();
		//tboard.src = 'tboard.png'
		tboard.src = "https://i.imgur.com/tXnnqzu.png";
		tboard_inactive = new Image();
		//tboard_inactive.src = 'tboard_inactive.jpg'
		tboard_inactive.src = "https://i.imgur.com/FhBEuaY.jpeg";
		gridoverlay = new Image();
		//gridoverlay.src = 'gridoverlay.png'
		gridoverlay.src = "https://i.imgur.com/QzF5K9b.png";
		border = new Image();
		//border.src = 'border.png'
		border.src = "https://i.imgur.com/yzLTMwN.png";

		manualBoards = false;

		spawnPiece = (uid, rndPc = true, pc = 0) => {
			let ret = [];
			if (rndPc && uid != -1 && typeof players != "undefined" && players.length) {
				let player = players.filter((player) => player.id == uid);
				let np;
				if (player.length && typeof player[0]?.nextPieces != "undefined" && player[0]?.nextPieces.length) {
					np = player[0]?.nextPieces[player[0]?.nextPieces.length - 1][1];

					//force non-duplicate next-piece

					do {
						pieceSel = (Rn() * 7) | 0;
					} while (np == pieceSel);

					// use NES Tetris® rule: re-draw only once on duplicate
					//pieceSel = Rn()*7|0
				} else {
					pieceSel = (Rn() * 7) | 0;
				}
			} else {
				pieceSel = rndPc ? (Rn() * 7) | 0 : pc;
			}
			switch (pieceSel) {
				case 0: // longboi
					ret = [
						[0, 0, 0],
						[0, 1, 0],
						[0, -2, 0],
						[0, -1, 0],
					];
					break;
				case 1: // square
					ret = [
						[0, 0, 0],
						[-1, -1, 0],
						[0, -1, 0],
						[-1, 0, 0],
					];
					break;
				case 2: // zig
					ret = [
						[0, -1, 0],
						[-1, -2, 0],
						[-1, -1, 0],
						[0, 0, 0],
					];
					break;
				case 3: // zag
					ret = [
						[0, -1, 0],
						[0, -2, 0],
						[-1, -1, 0],
						[-1, 0, 0],
					];
					break;
				case 4: // L
					ret = [
						[-1, -1, 0],
						[-1, 0, 0],
						[0, 0, 0],
						[-1, -2, 0],
					];
					break;
				case 5: // 7
					ret = [
						[0, -1, 0],
						[0, 0, 0],
						[0, -2, 0],
						[-1, 0, 0],
					];
					break;
				case 6: // T
					ret = [
						[0, 0, 0],
						[-1, 0, 0],
						[1, 0, 0],
						[0, -1, 0],
					];
					break;
			}
			ret = ret.map((v) => {
				v[1] -= 3;
				X = v[6] = v[3] = v[0];
				Y = v[7] = v[4] = v[1];
				Z = v[8] = v[5] = v[2];
				if (typeof players != "undefined" && players.length && players.length - 1 > uid) {
					let idx = Y * 10 + X + 95;
					l = players.filter((player) => player.id == uid)[0];
					if (l.alive && l.box[idx] != -1) {
						l.alive = false;
						l.respawns++;
					}
				}
				return v;
			});
			return [ret, pieceSel];
		};

		spawnPlayer = (uid, max = 0, speed = 10, tetrises = 0, respawns = 0) => {
			let ret = {
				keys: Array(128)
					.fill()
					.map((v) => false),
				keyTimers: Array(128).fill(0),
				box: Array(10 * 30).fill(-1),
				alive: true,
				name: uid ? "AI p. " + uid : "human",
				deathGrow: 0,
				pieceSwapped: false,
				moveDecided: false,
				speed: speed,
				respawns: respawns,
				tetrises: tetrises,
				rowsCompleted: 0,
				maxRowsCompleted: max,
				swapPiece: [],
				keyQueue: [0, 0],
				curPiece: spawnPiece(uid),
				id: uid,
				settledTimer: -1,
				nextPieces: Array(10)
					.fill()
					.map((piece) => spawnPiece(uid)),
			};

			return ret;
		};

		masterInit = (setAI = false) => {
			if (1 || !setAI) {
				rw = 20;
				cl = 10;
				localsp = sp = 2.125;
				spawnBoard = (tx, ty, tz, sp, active = false, name = "unknown player") => {
					let board = {};
					if (name.length > 7) {
						name = name.substring(0, 7) + "…";
					}
					board.grid = Array(rw * cl)
						.fill()
						.map((v, i) => {
							X = ((i % cl) - cl / 2 + 0.5) * sp + tx;
							Y = (((i / cl) | 0) - rw / 2 + 0.5) * sp + ty;
							Z = tz;
							return [X, Y, Z];
						});
					board.sp = sp;
					board.active = active;
					return board;
				};
				boards = [];
				boards = [...boards, spawnBoard(-sp * 12.5, 3, 0, sp)];
				cbcl = 5;
				cbrw = 3;
				remotesp = sp = 0.5;
				for (let i = 0; i < cbcl * cbrw; i++) {
					let X = ((i % cbcl) - cbcl / 2 + 0.5) * sp * 12 + sp * 40 + 4;
					let Y = (((i / cbcl) | 0) - cbrw / 2 + 0.5) * sp * 27 - 4.5;
					let Z = 0;
					boards = [...boards, spawnBoard(X, Y, Z, sp, !i)];
				}
			}

			players = [];
			iPlayerc = 4;
			if (setAI) {
				do {
					iPlayerc = +prompt("how many AI players? [0-14]");
				} while (!(iPlayerc !== null && iPlayerc >= 0 && iPlayerc <= 14));
			}
			showSideBars = true;
			sidebarPieces = setAI
				? sidebarPieces
				: Array(7)
						.fill()
						.map((v, i) => spawnPiece(-1, false, i));
			settleInterval = 0.15;
			showInfo = false;
			mousedown = false;
			instadropAI = false;
			buttons = setAI ? buttons : [];
			buttonsLoaded = setAI ? buttonsLoaded : false;
			dropTimer = 50;
			flashes = [];
			lerpFactor = 5;
			sortCriteria = "maxRowsCompleted";
			paused = false;
			sliders = setAI ? sliders : [];
			grav = 0.005;
			showLeaderBoard = true;
			AISpeed = setAI ? AISpeed : 25;
			gameInPlay = true;
			keyTimerInterval = 0.14;
			tplayer = spawnPlayer(0);
			players = [tplayer, tplayer];
			Array(iPlayerc)
				.fill()
				.map((player, idx) => {
					players = [...players, spawnPlayer(idx + 1, 0, AISpeed)];
				});
			players.map((player, idx) => {
				boards[idx].active = true;
			});
		};
		masterInit();

		togglePause = () => {
			paused = !paused;
		};

		c.onkeydown = (e) => {
			e.preventDefault();
			e.stopPropagation();
			let player = players[0];
			player.keys[e.keyCode] = true;
			if (e.keyCode == 32 && player.deathGrow > 200) resetGame(player, 0);
		};

		c.onkeyup = (e) => {
			e.preventDefault();
			e.stopPropagation();
			let player = players[0];
			player.keys[e.keyCode] = false;
			player.keyTimers[e.keyCode] = 0;
		};

		c.onmousedown = (e) => {
			let rect = c.getBoundingClientRect();
			mx = ((e.pageX - rect.left) / c.clientWidth) * c.width;
			my = ((e.pageY - rect.top) / c.clientHeight) * c.height;
			if (sliders.length) {
				sliders.map((slider) => {
					X = slider.posX - slider.width / 2 + (slider.width / (slider.max - slider.min)) * eval(slider.valVariable);
					Y = slider.posY;
					s = slider.height / 2;
					d = Math.hypot(X - mx, Y - my);
					if (d < s && e.button == 0) {
						slider.sliding = true;
						slider.tmx = mx;
						slider.tmy = my;
					}
				});
			}

			if (e.button == 0) {
				mousedown = true;
				buttons.map((button) => {
					if (button.hover) {
						hov = false;
						if (button.visible) eval(button.callback);
					}
				});
			}
		};

		c.onmouseup = (e) => {
			sliders.map((slider) => {
				slider.sliding = false;
			});
			if (e.button == 0) mousedown = false;
			buttons.map((button) => {
				if (button.hover) {
					hov = false;
				}
			});
		};

		mx = my = 0;
		c.onmousemove = (e) => {
			e.preventDefault();
			e.stopPropagation();
			let rect = c.getBoundingClientRect();
			mx = ((e.pageX - rect.left) / c.clientWidth) * c.width;
			my = ((e.pageY - rect.top) / c.clientHeight) * c.height;
			buttons.map((button) => {
				if (button.hover) {
					hov = true;
				}
			});

			if (sliders.length) {
				c.style.cursor = "unset";
				sliders.map((slider) => {
					X = slider.posX - slider.width / 2 + (slider.width / (slider.max - slider.min)) * eval(slider.valVariable);
					Y = slider.posY;
					s = slider.height / 2;
					d = Math.hypot(X - mx, Y - my);
					if (d < s) {
						c.style.cursor = "pointer";
					}
					if (slider.sliding) {
						if (slider.style == "horizontal") {
							dx = ((mx - slider.tmx) / slider.width) * (slider.max - slider.min);
							eval(slider.valVariable + " += dx");
							slider.tmx = mx;
							slider.tmy = my;
							eval(slider.valVariable + " = Math.min(slider.max,Math.max(slider.min," + slider.valVariable + "))");

							// trektris specific
							players.map((player, idx) => {
								if (idx > 1) {
									player.speed = AISpeed;
								}
							});
							//

							slider.captionVar = Math.round(eval(slider.valVariable)) + "%";
						} else {
						}
					}
				});
			}
		};

		toggleInstadrop = () => {
			instadropAI = !instadropAI;
		};

		renderButton = (text, X, Y, tooltip = "", callback = "", typ = "rectangle", col1 = "#0ff8", col2 = "#2088", fs = 36) => {
			render =
				(((text != "instadrop AI[✔]" && text != "instadrop AI[ ]") ||
					(text == "instadrop AI[✔]" && instadropAI) ||
					(text == "instadrop AI[ ]" && !instadropAI)) &&
					text != "[tab] pause" &&
					text != "[tab] unpause") ||
				(text == "[tab] pause" && !paused) ||
				(text == "[tab] unpause" && paused);
			x.globalAlpha = 1;
			if (render) {
				x.beginPath();
				x.fillStyle = "#4f8c";
			}
			let X1, Y1, X2, Y2;
			x.font = fs + "px Courier Prime";
			let margin = 2;
			let w = x.measureText(text).width + margin * 8;
			let h = fs + margin * 2;
			(X1 = X - w / 2), (Y1 = Y - h / 2);
			if (render || !buttonsLoaded) {
				if (render) {
					//c.style.cursor = 'unset'
					switch (typ) {
						case "rectangle":
							x.lineTo(X1, Y1);
							x.lineTo(X + w / 2, Y - h / 2);
							x.lineTo(X + w / 2, Y + h / 2);
							x.lineTo(X - w / 2, Y + h / 2);
							break;
						case "circle":
							break;
					}
					Z = 30;
					stroke(col1, col2, 3, true);
				}
			}

			X2 = X1 + w;
			Y2 = Y1 + h;
			if (mx > X1 && mx < X2 && my > Y1 && my < Y2) {
				if (buttonsLoaded) {
					buttons[bct].hover = true;
				} else {
					buttons = [...buttons, { callback, X1, Y1, X2, Y2, hover: true, tooltip, visible: false }];
				}
				c.style.cursor = "pointer";
			} else {
				if (buttonsLoaded) {
					buttons[bct].hover = false;
				} else {
					buttons = [...buttons, { callback, X1, Y1, X2, Y2, hover: false, tooltip, visible: false }];
				}
			}
			if (render) {
				ota = x.textAlign;
				x.textAlign = "center";
				x.fillStyle = "#fff";
				x.fillText(text, X, Y + fs / 3.2);
				x.textAlign = ota;
			}
			if (render) {
				buttons[bct].visible = true;
			} else {
				buttons[bct].visible = false;
			}
			bct++;
		};

		loadSliders = () => {
			sliders = [
				...sliders,
				{
					caption: "my speed",
					style: "horizontal", // vertical/horizontal
					posX: c.width / 2 - 50,
					posY: c.height - 85,
					width: 400,
					height: 70,
					min: 0,
					max: 100,
					majorStep: 25,
					minorStep: 2.5,
					tickColor: "#0f8a",
					backgroundColor: "#40f1",
					selectorColor: "#fff",
					valVariable: "players[0].speed",
					padding: 75,
					textColor: "#0ff",
					fontSize: 24,
					captionVar: players[0].speed + "%",
					sliding: false,
					tmx: 0,
					tmy: 0,
				},
			];

			sliders = [
				...sliders,
				{
					caption: "AI speed",
					style: "horizontal", // vertical/horizontal
					posX: c.width / 2 + 450,
					posY: c.height - 85,
					width: 400,
					height: 70,
					min: 0,
					max: 100,
					majorStep: 25,
					minorStep: 2.5,
					tickColor: "#0f8a",
					backgroundColor: "#40f1",
					selectorColor: "#fff",
					valVariable: "AISpeed",
					padding: 75,
					textColor: "#0ff",
					fontSize: 24,
					captionVar: AISpeed + "%",
					sliding: false,
					tmx: 0,
					tmy: 0,
				},
			];
		};

		loadSliders();

		drawSlider = (slider) => {
			if (slider.style == "horizontal") {
				x.fillStyle = slider.backgroundColor;
				X = slider.posX - slider.width / 2 - slider.padding / 2;
				Y = slider.posY - slider.height / 2 - slider.padding / 2;
				w = slider.width + slider.padding;
				h = slider.height + slider.padding;
				x.fillRect(X, Y, w, h);
			}
			for (let i = slider.min; i < slider.max + 1; i += slider.minorStep) {
				if (slider.style == "horizontal") {
					x.beginPath();
					X = slider.posX - slider.width / 2 + (slider.width / (slider.max - slider.min)) * i;
					Y = slider.posY - slider.height / 16;
					x.lineTo(X, Y);
					X = slider.posX - slider.width / 2 + (slider.width / (slider.max - slider.min)) * i;
					Y = slider.posY + slider.height / 16;
					x.lineTo(X, Y);
					Z = 1;
					stroke(slider.tickColor, "", 0.1, false);
				} else {
				}
			}
			for (let i = slider.min; i < slider.max + 1; i += slider.majorStep) {
				if (slider.style == "horizontal") {
					x.beginPath();
					X = slider.posX - slider.width / 2 + (slider.width / (slider.max - slider.min)) * i;
					Y = slider.posY - slider.height / 8;
					x.lineTo(X, Y);
					X = slider.posX - slider.width / 2 + (slider.width / (slider.max - slider.min)) * i;
					Y = slider.posY + slider.height / 8;
					x.lineTo(X, Y);
					Z = 1;
					stroke(slider.tickColor, "", 0.1, false);
					x.fillStyle = slider.textColor;
					x.textAlign = "center";
					x.font = slider.fontSize + "px Courier Prime";
					x.fillText(i, X, Y + slider.height / 2);
				} else {
				}
			}
			if (slider.style == "horizontal") {
				x.beginPath();
				X = slider.posX - slider.width / 2;
				Y = slider.posY;
				x.lineTo(X, Y);
				X = slider.posX + slider.width / 2;
				Y = slider.posY;
				x.lineTo(X, Y);
				stroke(slider.tickColor, "", 0.1, false);
			}
			x.fillStyle = slider.textColor;
			x.textAlign = "left";
			x.font = slider.fontSize * 1.5 + "px Courier Prime";
			x.fillText(
				slider.caption + " " + slider.captionVar,
				slider.posX - slider.width / 2,
				Y - slider.height / 2 - slider.fontSize / 3
			);
			X = slider.posX - slider.width / 2 + (slider.width / (slider.max - slider.min)) * eval(slider.valVariable);
			Y = slider.posY;
			s = slider.height * 2.5;
			x.drawImage(starImgs[0].img, X - s / 2, Y - s / 2, s, s);
			s /= 2;
			x.drawImage(starImgs[3].img, X - s / 2 / 1.05, Y - s / 2 / 1.05, s, s);
		};

		tryMov = (pc, player, action = "default") => {
			ret = true;
			let minx = (miny = 6e6);
			let maxx = (maxy = -6e6);

			pc.map((v) => {
				if (v[0] > maxx) maxx = v[0];
				if (v[0] < minx) minx = v[0];
				if (v[1] > maxy) maxy = v[1];
				if (v[1] < miny) miny = v[1];
			});

			pc.map((v, i) => {
				X = v[0];
				Y = v[1];
				Z = v[2];
				let idx = Y * 10 + X + 95;
				if (player.box[idx] != -1) ret = false;
			});

			if (action == "rotate") {
				if (maxx >= 5) {
					pc.map((v) => {
						v[0]--;
					});
					return tryMov(pc, player, action);
				}
				if (minx <= -6) {
					pc.map((v) => {
						v[0]++;
					});
					return tryMov(pc, player, action);
				}
			}

			if (!(minx > -6 && maxx < 5 && maxy < 21)) ret = false;
			return ret;
		};

		movPieceLeft = (player) => {
			cp = player.curPiece[0];
			let tp;
			if (
				tryMov(
					(tp = JSON.parse(JSON.stringify(cp)).map((v) => {
						v[0]--;
						return v;
					})),
					player
				)
			) {
				cp = player.curPiece[0] = tp;
			}
		};

		movPieceRight = (player) => {
			cp = player.curPiece[0];
			let tp;
			if (
				tryMov(
					(tp = JSON.parse(JSON.stringify(cp)).map((v) => {
						v[0]++;
						return v;
					})),
					player
				)
			) {
				cp = player.curPiece[0] = tp;
			}
		};

		rotPiece = (player) => {
			if (player.curPiece[1] == 1) return;
			let tp;
			cp = player.curPiece[0];
			cx = cp[0][0];
			cy = cp[0][1];
			cz = cp[0][2];
			if (
				tryMov(
					(tp = JSON.parse(JSON.stringify(cp)).map((v, i) => {
						if (i) {
							X = v[0] - cx;
							Y = v[1] - cy;
							Z = v[2] - cz;
							R(Math.PI / 2, 0, 0);
							v[0] = X + cx;
							v[1] = Y + cy;
							v[2] = Z + cz;
						}
						return v;
					})),
					player,
					"rotate"
				)
			) {
				cp = player.curPiece[0] = tp;
			}
		};

		checkRows = (player, idx, overrideSparks = false) => {
			let rowsToDelete = [];
			let rowsCompleted = 0;
			player.box.map((v, i) => {
				if (i > player.box.length - 221) {
					if (!(i % 10)) {
						ct = 0;
						a = [];
					}
					if (v != -1) {
						ct++;
						a = [...a, i];
					}
					if (i % 10 == 9 && ct == 10) {
						rowsCompleted++;
						player.rowsCompleted++;
						player.maxRowsCompleted = Math.max(player.rowsCompleted, player.maxRowsCompleted);
						rowsToDelete = [...rowsToDelete, (i / 10) | 0];
					}
				}
			});
			if (rowsCompleted == 4) player.tetrises++;
			rowsToDelete.map((row) => {
				for (let m = 10; m--; ) {
					v = m + row * 10;
					if (!overrideSparks) {
						let sp = idx ? remotesp : localsp;
						let ls = (2 ** 0.5 / 2) * sp;
						let ofx = boards[idx].grid[0][0] + 4.5 * sp;
						let ofy = boards[idx].grid[0][1] - 0.5 * sp;
						let ofz = boards[idx].grid[0][2];
						X = ((v % cl) - cl / 2 + 0.5) * sp + ofx;
						Y = (((v / cl) | 0) - rw / 2 + 0.5) * sp + ofy;
						Z = ofz;
						spawnSparks(X, Y, Z, rowsCompleted == 4, idx);
					}
					for (n = 0; n < 30; n++) {
						l = v - n * 10;
						//player.box[l] = -1
						if (l >= 10 && l < player.box.length) player.box[l] = player.box[l - 10];
					}
				}
			});
		};

		dropPiece = (player, overrideSettleTimer = false, idx, overrideSpawnPiece = false, overrideSparks = false) => {
			let ret = false;
			cp = player.curPiece[0];
			let tp;
			if (
				tryMov(
					(tp = JSON.parse(JSON.stringify(cp)).map((v) => {
						v[1]++;
						return v;
					})),
					player
				)
			) {
				cp = player.curPiece[0] = tp;
			} else {
				if (overrideSettleTimer || (player.settledTimer != -1 && player.settledTimer < t)) {
					ret = true;
					cp.map((v, i) => {
						X = v[0];
						Y = v[1];
						Z = v[2];
						let idx_ = Y * 10 + X + 95;
						player.box[idx_] = player.curPiece[1];
					});
					if (!overrideSpawnPiece) {
						player.moveDecided = false;
						player.curPiece = player.nextPieces.shift();
						player.nextPieces = [...player.nextPieces, spawnPiece(player.id)];
						player.pieceSwapped = false;
					}
					player.settledTimer = -1;
				} else {
					if (player.settledTimer == -1) player.settledTimer = t + settleInterval;
				}
			}
			if (ret) checkRows(player, idx, overrideSparks);
			return ret;
		};

		fullDropPiece = (player, idx, overrideSpawnPiece = false, overrideSparks = false) => {
			let ret = false;
			do {
				ret = dropPiece(player, true, idx, overrideSpawnPiece, overrideSparks);
			} while (!ret);
		};

		sparks = [];
		iSparkv = 0.2;
		spawnSparks = (X, Y, Z, tetris = false, idx = 0) => {
			let a = (tetris ? 2 : 1) * (idx > 1 ? 0.5 : 1);
			for (let m = idx > 1 ? 3 : 10; m--; ) {
				let vx = (Rn() - 0.5) * iSparkv * a;
				let vy = (Rn() - 0.5) * iSparkv * a;
				let vz = (Rn() - 0.5) * iSparkv * a;
				sparks = [...sparks, [X, Y, Z, vx, vy, vz, tetris ? 1.25 : 1, tetris, idx]];
			}
		};

		drawDropShadow = (player, idx) => {
			cp = player.curPiece[0];
			let dropping = true;
			let tp = JSON.parse(JSON.stringify(cp));
			let sp = idx ? remotesp : localsp;
			let l = idx ? idx : 0;
			let ofx = boards[l].grid[0][0] + 5 * sp;
			let ofy = boards[l].grid[0][1] - 2 * sp;
			let ofz = boards[l].grid[0][2];
			let ls = (2 ** 0.5 / 2) * sp;
			do {
				if (
					tryMov(
						(tp = tp.map((v) => {
							v[1]++;
							return v;
						})),
						player
					)
				) {
				} else {
					x.beginPath();
					tp.map((v) => {
						tx = ofx + v[0] * (l ? remotesp : localsp);
						ty = ofy + v[1] * (l ? remotesp : localsp);
						tz = ofz + v[2] * (l ? remotesp : localsp);
						x.beginPath();
						for (let j = 4; j--; ) {
							X = tx + S((p = ((Math.PI * 2) / 4) * j + Math.PI / 4)) * ls;
							Y = ty + C(p) * ls;
							Z = tz;
							R(Rl, Pt, Yw, 1);
							if (Z > 0) x.lineTo(...Q());
						}
						col1 = ""; //`hsla(${360/7*player.curPiece[1]},0%,50%,.05)`
						col2 = `hsla(${(360 / 7) * player.curPiece[1]},0%,70%,.1)`;
						stroke(col1, col2, sp, false);
					});
					dropping = false;
				}
			} while (dropping);
		};

		swapPiece = (player) => {
			if (!player.pieceSwapped) {
				if (!player.swapPiece.length) {
					player.swapPiece = player.curPiece;
					player.curPiece = player.nextPieces.shift();
					player.nextPieces = [...player.nextPieces, spawnPiece(player.id)];
				} else {
					let tempPiece = JSON.parse(JSON.stringify(player.curPiece));

					ax = ay = az = 0;
					player.curPiece[0].map((v) => {
						ax += v[0];
						ay += v[1];
						az += v[2];
					});
					ax / 4;
					ay / 4;
					az / 4;

					player.curPiece = player.swapPiece;
					player.curPiece[0].map((v) => {
						v[3] = 10;
						v[4] = 20;
						v[5] = 0;
						v[0] = v[6];
						v[1] = v[7];
						v[2] = v[8];
					});

					player.swapPiece = tempPiece;
				}
				player.pieceSwapped = true;
				spawnFlash(-12.2, 5.25, 0);
			}
		};

		doKeys = (player, idx) => {
			player.keys.map((val, key) => {
				if (val && (!paused || (key == 9 && paused))) {
					switch (key) {
						case 65:
							if (player.keyTimers[key] <= t) {
								player.keyTimers[key] =
									t + (player.keyTimers[key] == 0 ? keyTimerInterval : keyTimerInterval / 4);
								movPieceLeft(player);
							}
							break;
						case 87:
							if (player.keyTimers[key] <= t) {
								player.keyTimers[key] =
									t + (player.keyTimers[key] == 0 ? keyTimerInterval : keyTimerInterval / 4);
								rotPiece(player);
							}
							break;
						case 68:
							if (player.keyTimers[key] <= t) {
								player.keyTimers[key] =
									t + (player.keyTimers[key] == 0 ? keyTimerInterval : keyTimerInterval / 4);
								movPieceRight(player);
							}
							break;
						case 83:
							if (player.keyTimers[key] <= t) {
								player.keyTimers[key] = t + keyTimerInterval / 50;
								dropPiece(player, false, idx);
							}
							break;
						case 37:
							if (player.keyTimers[key] <= t) {
								player.keyTimers[key] =
									t + (player.keyTimers[key] == 0 ? keyTimerInterval : keyTimerInterval / 4);
								movPieceLeft(player);
							}
							break;
						case 38:
							if (player.keyTimers[key] <= t) {
								player.keyTimers[key] =
									t + (player.keyTimers[key] == 0 ? keyTimerInterval : keyTimerInterval / 4);
								rotPiece(player);
							}
							break;
						case 39:
							if (player.keyTimers[key] <= t) {
								player.keyTimers[key] =
									t + (player.keyTimers[key] == 0 ? keyTimerInterval : keyTimerInterval / 4);
								movPieceRight(player);
							}
							break;
						case 40:
							if (player.keyTimers[key] <= t) {
								player.keyTimers[key] = t + keyTimerInterval / 50;
								dropPiece(player, false, idx);
							}
							break;
						case 32:
							if (player.keyTimers[key] <= t) {
								player.keyTimers[key] = t + keyTimerInterval;
								fullDropPiece(player, idx);
							}
							break;
						case 17:
							if (player.keyTimers[key] <= t) {
								player.keyTimers[key] = t + keyTimerInterval;
								swapPiece(player);
							}
							break;
						case 9:
							if (player.keyTimers[key] <= t) {
								player.keyTimers[key] = t + keyTimerInterval;
								togglePause();
							}
							break;
					}
				}
			});
		};

		drawBox = (player, idx) => {
			let sp = idx ? remotesp : localsp;
			let ls = (2 ** 0.5 / 2) * sp;
			let l = idx ? idx : 0;
			let ofx = boards[l].grid[0][0] + 4.5 * sp;
			let ofy = boards[l].grid[0][1] - 0.5 * sp;
			let ofz = boards[l].grid[0][2];
			if (!idx) {
				X = ofx - sp * 0.0375;
				Y = ofy - sp * 1.22;
				Z = ofz;
				R(Rl, Pt, Yw, 1);
				if (Z > 0) {
					x.globalAlpha = 0.125;
					sw = border.width / 1.9;
					sh = border.height / 2.0325;
					l = Q();
					x.drawImage(border, l[0] - sw / 2, l[1], sw, sh);
					x.globalAlpha = 1;
				}
			}
			player.box.map((v, i) => {
				if ((!idx || i > 100) && v != -1) {
					tx = ((i % cl) - cl / 2 + 0.5) * sp + ofx;
					ty = (((i / cl) | 0) - rw / 2 + 0.5) * sp + ofy;
					tz = ofz;
					x.beginPath();
					for (j = 4; j--; ) {
						X = tx + S((p = ((Math.PI * 2) / 4) * j + Math.PI / 4)) * ls;
						Y = ty + C(p) * ls;
						Z = tz;
						R(Rl, Pt, Yw, 1);
						if (Z > 0) x.lineTo(...Q());
					}
					col1 = ""; //idx?'':`hsla(${360/7*v},99%,50%,.5)`
					col2 = idx ? `hsla(${(360 / 7) * v},99%,70%,.75)` : `hsla(${(360 / 7) * v},99%,70%,.5)`;
					stroke(col1, col2, sp * 2, false);
				}
			});
		};

		drawDeath = (player, idx) => {
			let sp = idx ? remotesp : localsp;
			let ls = (2 ** 0.5 / 2) * sp;
			let l = idx ? idx : 0;
			let ofx = boards[l].grid[0][0] + 4.5 * sp;
			let ofy = boards[l].grid[0][1] - 0.5 * sp;
			let ofz = boards[l].grid[0][2];
			player.box.map((v, i) => {
				if (i >= 100 && i < 100 + player.deathGrow) {
					tx = ((i % cl) - cl / 2 + 0.5) * sp + ofx;
					ty = (((i / cl) | 0) - rw / 2 + 0.5) * sp + ofy;
					tz = ofz;
					x.beginPath();
					for (j = 4; j--; ) {
						X = tx + S((p = ((Math.PI * 2) / 4) * j + Math.PI / 4)) * ls;
						Y = ty + C(p) * ls;
						Z = tz;
						R(Rl, Pt, Yw, 1);
						if (Z > 0) x.lineTo(...Q());
					}
					col1 = ``; //`hsla(${360/7*v},99%,50%,.5)`
					col2 = `hsla(${-2},99%,40%,.4)`;
					stroke(col1, col2, sp, true);
				}
			});
			X = ofx;
			Y = ofy + 10 * sp + sp;
			Z = ofz;
			R(Rl, Pt, Yw, 1);
			if (Z > 0) {
				x.font = (fs = (3e3 * sp) / Z) + "px Courier Prime";
				x.textAlign = "center";
				x.lineWidth = 8 * sp;
				x.fillStyle = "#d00c";
				x.strokeStyle = "#0007";
				l = Q();
				x.strokeText("DED", l[0], l[1]);
				x.fillText("DED", l[0] - sp * 2, l[1] - sp * 2);

				if (!idx) {
					x.font = (fs = (1e3 * sp) / Z) + "px Courier Prime";
					x.fillStyle = "#fffc";
					x.strokeStyle = "#0007";
					x.strokeText("hit space", l[0], l[1] + fs * 1.5);
					x.fillText("hit space", l[0] - sp * 2, l[1] - sp * 2 + fs * 1.5);
				}
			}
		};

		recurseAI = (player, idx, depth, tgtDepth, o_i = 0, o_j = 0) => {
			if (depth > tgtDepth) return;
			let maxVincent = 0,
				tgt_i = -1,
				tgt_j = -1;
			let maxDeltaRows = 0;
			let l1,
				l2,
				tmdr = 0,
				tvincent = 0;
			for (let i = 5; i--; ) movPieceLeft(player, idx);
			for (let i = 0; i < 5; i++) {
				for (let j = 0; j < 11; j++) {
					let testPlayer = JSON.parse(JSON.stringify(player));
					let orows = testPlayer.rowsCompleted;
					let vincent = 0;
					for (let m = j; m--; ) movPieceRight(testPlayer, idx);
					for (let m = i; m--; ) rotPiece(testPlayer, idx);
					fullDropPiece(testPlayer, idx, true, true);
					let deltaRows = (testPlayer.rowsCompleted - orows) * 100;
					if (deltaRows > maxDeltaRows) {
						tgt_i = i;
						tgt_j = j;
						tmdr = deltaRows;
						maxDeltaRows = deltaRows;
					}
					testPlayer.curPiece[0].map((v) => {
						vincent += v[1] * 2;
						X = v[0];
						Y = v[1];
						let idx_ = Y * 10 + X + 95;
						if (idx_ + 10 < testPlayer.box.length && testPlayer.box[idx_ + 10] == -1) {
							vincent -= v[1] * 2;
							if (idx_ + 20 < testPlayer.box.length && testPlayer.box[idx_ + 20] == -1) {
								vincent -= v[1] * 2;
								//  if(idx_+30 < testPlayer.box.length && testPlayer.box[idx_+30] == -1){
								//    vincent-= v[1]
								//  }
							}
						}
					});
					if (vincent > maxVincent) {
						tgt_i = i;
						tgt_j = j;
						maxVincent = vincent;
						tvincent = vincent;
					}
					if (!depth) {
						l1 = tgt_i;
						l2 = tgt_j;
					} else {
						l1 = o_i;
						l2 = o_j;
					}

					let score = Math.max(tmdr, tvincent);
					if (score > maxScore) {
						maxScore = score;
						tgt_i_ = l1;
						tgt_j_ = l2;
					}
					tmdr = tvincent = 0;

					//testPlayer.moveDecided = false
					testPlayer.curPiece = testPlayer.nextPieces.shift();
					testPlayer.nextPieces = [...testPlayer.nextPieces, spawnPiece(testPlayer.id)];

					recurseAI(testPlayer, idx, depth + 1, tgtDepth, l1, l2);
				}
			}
		};

		doAI = () => {
			let tgtDepth = 0;
			players.map((player, idx) => {
				if (idx > 1) {
					if (player.alive) {
						if (!player.moveDecided) {
							maxScore = tgt_i_ = tgt_j_ = 0;
							recurseAI(player, idx, 0, tgtDepth);
							player.moveDecided = true;
							let ti = tgt_i_,
								tj = tgt_j_;

							for (let i = 5; i--; ) movPieceLeft(player, idx);

							if (instadropAI) {
								for (let m = tj; m--; ) movPieceRight(player, idx);
								for (let m = ti; m--; ) rotPiece(player, idx);
								//lol
								fullDropPiece(player, idx, true, false);
								dropPiece(player, false, idx);
							} else {
								player.keyQueue = [tj, ti];
							}
						}
					} else {
						if (player.deathGrow > 400) resetGame(player, idx);
					}
				}
			});
		};

		resetGame = (player, idx) => {
			player.deathGrow = 0;
			let tplayer = spawnPlayer(player.id, player.maxRowsCompleted, player.speed, player.tetrises, player.respawns);
			if (!idx) {
				players[0] = players[1] = tplayer;
			} else {
				players[idx] = tplayer;
			}
		};

		drawPiece = (player, idx) => {
			x.beginPath();
			let sp = idx ? remotesp : localsp;
			let l = idx ? idx : 0;
			let ofx = boards[l].grid[0][0] + 5 * sp;
			let ofy = boards[l].grid[0][1] - 1 * sp;
			let ofz = boards[l].grid[0][2];
			let ls = (2 ** 0.5 / 2) * sp;
			let lf = idx > 1 && instadropAI ? lerpFactor / 2 : lerpFactor;
			player.curPiece[0].map((v) => {
				v[3] += (v[0] - v[3]) / lf;
				v[4] += (v[1] - v[4]) / lf;
				v[5] += (v[2] - v[5]) / lf;
				if (!idx || v[4] >= 0) {
					tx = ofx + v[3] * (l ? remotesp : localsp);
					ty = ofy + v[4] * (l ? remotesp : localsp);
					tz = ofz + v[5] * (l ? remotesp : localsp);
					x.beginPath();
					for (let j = 4; j--; ) {
						X = tx + S((p = ((Math.PI * 2) / 4) * j + Math.PI / 4)) * ls;
						Y = ty + C(p) * ls;
						Z = tz;
						R(Rl, Pt, Yw, 1);
						if (Z > 0) x.lineTo(...Q());
					}
					let v_ = player.curPiece[1];
					col1 = ""; //idx?'':`hsla(${360/7*v_},99%,50%,.5)`
					col2 = idx ? `hsla(${(360 / 7) * v_},99%,70%,.75)` : `hsla(${(360 / 7) * v_},99%,70%,.5)`;
					stroke(col1, col2, sp * 2, false);
				}
			});
		};

		drawSwapPiece = (player) => {
			let ofx, ofy;
			ofx = -12.25;
			ofy = 2;
			ofz = 0;
			x.beginPath();
			let sd = 6;
			let ls = 10;
			for (let i = sd; i--; ) {
				X = ofx + (S((p = ((Math.PI * 2) / sd) * i)) * ls) / 4.25;
				Y = ofy + C(p) * ls * 1.5;
				Z = ofz;
				R(0.04, 0, 0);
				R(Rl, Pt, Yw, 1);
				if (Z > 0) x.lineTo(...Q());
			}
			stroke("#0844", "#0844", 6, true);
			X = ofx - 1.25;
			Y = ofy - 7.5;
			Z = ofz;
			R(Rl, Pt, Yw, 1);
			if (Z > 0) {
				l = Q();
				x.textAlign = "center";
				x.fillStyle = "#cf4";
				x.font = (fs = 1600 / Z) + "px Courier Prime";
				let string;
				string = "SWAP";
				string.split("").map((v, i) => {
					x.fillText(v, l[0] + i * 4, l[1] + (i * fs) / 1.33 + fs);
				});
				string = "PIECE";
				string.split("").map((v, i) => {
					x.fillText(v, l[0] + i * 4 + fs / 1.5, l[1] + (i * fs) / 1.33);
				});
			}
			X = ofx - 0.45;
			Y = ofy + 7;
			Z = ofz;
			R(Rl, Pt, Yw, 1);
			if (Z > 0) {
				l = Q();
				x.textAlign = "center";
				x.fillStyle = "#cf4";
				x.font = (fs = 750 / Z) + "px Courier Prime";
				x.fillText("[CTRL]", l[0] + fs / 1.5, l[1]);
			}

			x.beginPath();
			if (player.swapPiece.length) {
				let ls = ((2 ** 0.5 / 2) * localsp) / 2;
				player.swapPiece[0].map((v) => {
					let v_ = player.swapPiece[1];
					dox = v_ == 0 || v_ == 6 ? -0.33 : 0;
					tx = ofx + (v[6] * localsp) / 2 + 0.6 + dox;
					ty = ofy + (v[7] * localsp) / 2 + 7.25;
					tz = ofz + (v[8] * localsp) / 2;
					x.beginPath();
					for (let j = 4; j--; ) {
						X = tx + S((p = ((Math.PI * 2) / 4) * j + Math.PI / 4)) * ls * 1.1;
						Y = ty + C(p) * ls * 1.1;
						Z = tz;
						R(Rl, Pt, Yw, 1);
						if (Z > 0) x.lineTo(...Q());
					}
					col1 = ""; //idx?'':`hsla(${360/7*v_},99%,50%,.5)`
					col2 = `hsla(${(360 / 7) * v_},99%,70%,.75)`;
					stroke(col1, col2, sp * 2, false);
				});
			}
		};

		drawNextPieces = (player, idx_ = 0) => {
			x.beginPath();
			for (i = 40; i--; ) {
				X = -13 - i / 7 + 2;
				Y = -4.75 - ((i + 1) / 40) ** 0.1 * 10 * 1.5;
				Z = 0;
				R(Rl, Pt, Yw, 1);
				if (Z > 0) x.lineTo(...Q());
			}
			for (i = 0; i < 2; i++) {
				X = -10.5 + 2 + i * 2.66;
				Y = 14; //+ 10*(i) - 4.25
				Z = 0;
				R(Rl, Pt, Yw, 1);
				if (Z > 0) x.lineTo(...Q());
			}
			for (i = 40; i--; ) {
				X = -5 - (40 - i) / 3.75;
				Y = -8.5 - ((40 - (i + 1)) / 40) ** 0.1 * 6 * 3;
				Z = 0;
				R(Rl, Pt, Yw, 1);
				if (Z > 0) x.lineTo(...Q());
			}
			col1 = ""; //'#fff2'
			col2 = "#2466";
			stroke(col1, col2, 5, true);

			let t_ = paused ? 0 : t;

			player.nextPieces = player.nextPieces.map((piece, idx) => {
				if (piece.length < 3) piece[2] = JSON.parse(JSON.stringify(piece[0]));

				let mod = !idx ? 1 + S(t * 20) / 16 : 1;
				let sp = idx_ ? remotesp : localsp;
				let sp2 = (sp / (1 + idx / 5)) * 1.33;
				if (idx < 1) {
					ofx_ = 15 + (5 * (idx + 1) * sp) / 2 + 2;
					ofy_ = sp2 / 2;
				} else {
					ofx_ = (30 * sp) / 2 - 5 - (idx == 1 ? 2.25 : 0) + 2;
					ofy_ = sp2 / 3 + ((idx - 0.5) * sp * 5) / 2 / (1 + idx / 20);
				}
				x.beginPath();
				let ofx = boards[idx_].grid[0][0] + ofx_;
				let ofy = boards[idx_].grid[0][1] - (1 * sp2) / 2 + ofy_;
				let ofz = boards[idx_].grid[0][2];
				piece[0].map((v, i) => {
					v[3] += (v[0] - v[3]) / lerpFactor;
					v[4] += (v[1] - v[4]) / lerpFactor;
					v[5] += (v[2] - v[5]) / lerpFactor;
					tx = ofx + (v[3] * sp2) / 2;
					ty = ofy + (v[4] * sp2) / 2;
					tz = ofz + (v[5] * sp2) / 2;
					piece[2][i][0] += (tx - piece[2][i][0]) / lerpFactor;
					piece[2][i][1] += (ty - piece[2][i][1]) / lerpFactor;
					piece[2][i][2] += (tz - piece[2][i][2]) / lerpFactor;
				});
				return piece;
			});

			player.nextPieces.map((piece, idx) => {
				let sp2 = (sp / (1 + idx / 5)) * 1.33;
				let mod = !idx ? 1 + S(t_ * 20) / 16 : 1;
				let ls = (2 ** 0.5 / 2) * sp2 * 2 * mod;
				piece[2].map((v, i) => {
					v[3] += (v[0] - v[3]) / lerpFactor;
					v[4] += (v[1] - v[4]) / lerpFactor;
					v[5] += (v[2] - v[5]) / lerpFactor;
					tx = v[3];
					ty = (v[4] * (1 + mod / 2)) / 1.5;
					tz = v[5];
					x.beginPath();
					for (let j = 4; j--; ) {
						X = tx + S((p = ((Math.PI * 2) / 4) * j + Math.PI / 4)) * ls;
						Y = ty + C(p) * ls;
						Z = tz;
						R(Rl, Pt, Yw, 1);
						if (Z > 0) x.lineTo(...Q());
					}
					col1 = `hsla(${(360 / 7) * piece[1]},99%,50%,.25)`;
					col2 = `hsla(${(360 / 7) * piece[1]},99%,70%,.5)`;
					stroke(col1, col2, sp, true);
				});
			});
		};

		drawLeaderBoard = () => {
			x.fillStyle = "#f008";
			let ls = 5;
			x.beginPath();
			for (let i = 4; i--; ) {
				X = S((p = ((Math.PI * 2) / 4) * i + Math.PI / 4)) * ls * 1.9 + 1.8;
				Y = C(p) * ls * 5.98 - 3.8;
				Z = 0;
				R(Rl, Pt, Yw, 1);
				if (Z > 0) x.lineTo(...Q());
			}
			stroke("#222a", "#111a", 10, false);
			X = 1;
			Y = -23.5;
			Z = 0;
			R(Rl, Pt, Yw, 1);
			if (Z > 0) {
				x.fillStyle = "#0f4";
				x.font = (fs = 1100 / Z) + "px Courier Prime";
				x.textAlign = "center";
				l = Q();
				x.fillText("LEADERBOARD", l[0] + 18, l[1]);
				x.fillStyle = "#fff";
				x.font = (fs = 1e3 / Z) + "px Courier Prime";
				//x.fillText('max|cur|tet|ded',l[0]+18.5, l[1]+fs)
				l[0] += 16;
				x.textAlign = "left";
				x.font = (fs = 750 / Z) + "px Courier Prime";
				let ln = 2.62;
				JSON.parse(JSON.stringify(players))
					.filter((v, i) => i != 1)
					.map((v, i) => [v, i])
					.sort((a, b) => b[0][sortCriteria] - a[0][sortCriteria])
					.map((pl_, idx) => {
						x.fillStyle = lcol = `hsla(${160 - (160 / (players.length - 2)) * idx},99%,50%,1)`;
						if (1 || idx > 1) {
							X = -4.75;
							Y = -21.5 + 2.62 * idx;
							Z = 0;
							R(Rl, Pt, Yw, 1);
							if (Z > 0) {
								l___ = Q();
								x.strokeStyle = "#fff8";
								for (n = 2; n--; ) {
									if (n) {
										s_ = 275 / 4;
										for (let m = 4; m--; ) {
											x.fillStyle = lcol;
											x.globalAlpha = 0.1;
											x.fillRect(l___[0] + s_ * m, l___[1] + (50 / 2) * n, s_ - 2, 50 / 2);
											if (m) {
												x.fillStyle = "#fff8";
												x.globalAlpha = 0.8;
												x.fillRect(l___[0] + s_ * m, l___[1] + (50 / 2) * n, 1, 50 / 2);
											}
										}
									} else {
										x.globalAlpha = 0.1;
										s_ = 275;
										x.fillRect(l___[0], l___[1] + (50 / 2) * n - 5, s_, 50 / 2 + 5);
									}
								}
							}
						}
						x.globalAlpha = 1;
						let player = pl_[0];
						let idx_ = pl_[1];
						x.fillStyle = player.alive ? "#2fa" : "#f22";
						x.fillText(`#${idx + 1}`, (bx = l[0] - fs * 6), (by = l[1] + fs * ln));
						x.fillStyle = player.alive ? "#ff4" : "#f61";
						x.fillText(`     ${player.name}`, (bx = l[0] - fs * 6), (by = l[1] + fs * ln++));
						x.fillStyle = "#fffa";
						x.textAlign = "center";
						x.fillText(`${player.maxRowsCompleted}`, l[0] - fs * 4.5, l[1] + fs * ln + 4);
						x.fillText(`${player.rowsCompleted}`, l[0] - fs * 1.5, l[1] + fs * ln + 4);
						x.fillText(`${player.tetrises}`, l[0] + fs * 1.7, l[1] + fs * ln + 4);
						x.fillText(`${player.respawns}`, l[0] + fs * 4.75, l[1] + fs * ln++ + 4);
						x.textAlign = "left";
						ln += 0.445;
						x.beginPath();
						x.moveTo(bx, by);
						let l_ = idx_ + 1;
						X = boards[l_].grid[0][0] + 4.5 * sp - sp * 3;
						Y = boards[l_].grid[0][1] - 0.5 * sp + sp * 24 - (boards[l_].grid[0][0] * sp) / 1.5;
						Z = boards[l_].grid[0][2];
						R(Rl, Pt, Yw, 1);
						if (Z > 0) {
							l__ = Q();
							Z = 5;
							bezTo((ax = bx + 270), (ay = by + 7.5), l__[0], l__[1], lcol, "", 0.5, true, 0.6);
							x.fillStyle = lcol;
							s = Math.min(1e3, 150 / Z);
							x.globalAlpha = 0.1;
							x.fillRect(ax - s / 2, ay - s / 2, s, s);
							s /= 3;
							x.globalAlpha = 0.2;
							x.fillRect(ax - s / 2, ay - s / 2, s, s);
							s /= 3;
							x.globalAlpha = 1;
							x.fillRect(ax - s / 2, ay - s / 2, s, s);

							s = Math.min(1e3, 150 / Z);
							x.globalAlpha = 0.1;
							x.fillRect(l__[0] - s / 2, l__[1] - s / 2, s, s);
							s /= 3;
							x.globalAlpha = 0.2;
							x.fillRect(l__[0] - s / 2, l__[1] - s / 2, s, s);
							s /= 3;
							x.globalAlpha = 1;
							x.fillRect(l__[0] - s / 2, l__[1] - s / 2, s, s);
						}
					});
			}
		};

		drawSideBars = () => {
			let ls = 1;
			t_ = paused ? t_ : t;
			for (let i = 7; i--; ) {
				let tx = 0;
				let ty1 = (-24 + ((i + (t_ * (sliders[0].sliding ? 0 : players[0].speed)) / 10) % 7) * 8) * ls;
				let ty2 = (-24 + ((i + (t_ * (sliders[1].sliding ? 0 : AISpeed)) / 10) % 7) * 8) * ls;
				let tz = 0;
				sidebarPieces.map((piece, idx) => {
					if (i % 7 == idx) {
						piece[0].map((v) => {
							for (let m = 2; m--; ) {
								x.beginPath();
								for (let j = 4; j--; ) {
									X = tx + v[0] + S((p = (Math.PI * 2 * j) / 4 + Math.PI / 4)) * sp * 1.5 + 43 * (m ? -1 : 1);
									Y = (m ? ty1 : ty2) + v[1] + C(p) * sp * 1.5;
									Z = tz;
									R(Rl, Pt, Yw, 1);
									if (Z > 0) x.lineTo(...Q());
								}
								col1 = ``; //`hsla(${360/7*piece[1]},100%,50%,.05)`
								col2 = `hsla(${(360 / 7) * piece[1]},100%,70%,.25)`;
								stroke(col1, col2, 4, false);
							}
						});
					}
				});
			}
		};

		spawnFlash = (X, Y, Z) => {
			flashes = [...flashes, [X, Y, Z, 1]];
		};
	}

	(oX = 0), (oY = 0), (oZ = 34);
	(Rl = 0), (Pt = 0), (Yw = 0);

	x.globalAlpha = 1;
	x.fillStyle = "#000a";
	x.fillRect(0, 0, c.width, c.height);
	x.lineJoin = x.lineCap = "roud";

	if (showstars)
		ST.map((v, i) => {
			X = v[0];
			Y = v[1];
			d = Math.hypot(X, Y);
			t_ = paused ? 0 : C(t / 16) / 1e3;
			p = Math.atan2(X, Y) + t_;
			X = v[0] = S(p) * d;
			Y = v[1] = C(p) * d;
			Z = v[2] -= paused ? 0 : 10;
			if (Z < -G_ / 2) X = v[2] += G_;
			R(Rl, Pt, Yw, 1);
			if (Z > 0) {
				if ((x.globalAlpha = ((Math.min(1, Z / 1e4) * 1) / (1 + Z ** 4 / 1e18)) * 1.1) > 0.1) {
					l = Q();
					s = 5 + Math.min(1e5, 6e7 / Z ** 1.5);
					x.drawImage(
						starImgs[(i + 99) ** 3.1 % 1 < 0.9 ? 0 : 1 + (i % 8)].img,
						l[0] - s / 2 / 1.05,
						l[1] - s / 2 / 1.05,
						s,
						s
					);
				}
			}
		});

	x.globalAlpha = 1;

	x.beginPath();
	ls = 20;
	for (let j = 4; j--; ) {
		X = 24 + S((p = ((Math.PI * 2) / 4) * j + Math.PI / 4)) * ls * 1.075;
		Y = 0.7 + C(p) * ls * 1.5 - 4.5;
		Z = 0;
		R(Rl, Pt, Yw, 1);
		if (Z > 0) x.lineTo(...Q());
	}
	stroke("#8882", "#111a", 4, true);

	X = 24;
	Y = -19.65 - 4;
	Z = 0;
	R(Rl, Pt, Yw, 1);
	if (Z > 0) {
		l = Q();
		x.textAlign = "center";
		x.font = (fs = 1100 / Z) + "px Courier Prime";
		x.fillStyle = "#0f4";
		x.fillText("CONNECTED PLAYERS", l[0], l[1]);
		sw = (gridoverlay.width * 32) / Z;
		sh = (gridoverlay.height * 32) / Z;
		x.globalAlpha = 0.1;
		x.drawImage(gridoverlay, l[0] - sw / 2, l[1] - sh / 30, sw, sh);
		x.globalAlpha = 1;
	}

	boards.map((board, idx) => {
		ls = (2 ** 0.5 / 2) * board.sp;
		if (manualBoards) {
			board.grid.map((v, i) => {
				X = tx = v[0];
				Y = ty = v[1];
				Z = tz = v[2];
				x.beginPath();
				for (let j = 4; j--; ) {
					X = tx + S((p = ((Math.PI * 2) / 4) * j + Math.PI / 4)) * ls;
					Y = ty + C(p) * ls;
					Z = 0;
					R(Rl, Pt, Yw, 1);
					if (Z > 0) x.lineTo(...Q());
				}
				stroke("#f001", "#f001", 2, false);
			});
		}

		tx = board.grid[0][0];
		ty = board.grid[0][1];
		tz = board.grid[0][2];
		X = tx - board.sp / 2;
		Y = ty - board.sp / 2;
		Z = tz;
		R(Rl, Pt, Yw, 1);
		if (Z > 0) {
			x.globalAlpha = !idx || board.active ? 0.75 : 0.25;
			l = Q();
			sw = (((tboard.width * board.sp) / 1.75) * 24) / Z;
			sh = (((tboard.height * board.sp) / 1.75) * 24) / Z;
			x.drawImage(!idx || board.active ? tboard : tboard_inactive, l[0] - 1, l[1] - 1, sw, sh);
			if (idx) {
				x.globalAlpha = 1;
				x.strokeStyle = idx < players.length ? (players[idx].alive ? "#0f88" : "#f008") : "#8888";
				x.lineWidth = 1;
				x.strokeRect(l[0] - 1, l[1] - 2, sw + 1, sh + 2);
			}
		}
		if (idx) {
			player = players[idx];
			x.textAlign = "left";
			X = tx - ls;
			Y = ty + ls * 30 - 0.2;
			Z = tz;
			R(Rl, Pt, Yw, 1);
			if (Z > 0) {
				l = Q();
				x.font = (fs = 650 / Z) + "px Courier Prime";
				fs *= 0.75;
				if (board.active) {
					x.fillStyle = "#0f8";
					x.fillText(player.name, l[0], l[1]);
					x.fillStyle = "#f80";
					x.fillText(`  rows`, l[0], l[1] + fs);
					x.fillText(`   max`, l[0], l[1] + fs * 2);
					x.fillText(`tetris`, l[0], l[1] + fs * 3);
					x.fillStyle = "#fff";
					x.fillText(`       ${player.rowsCompleted}`, l[0], l[1] + fs);
					x.fillText(`       ${player.maxRowsCompleted}`, l[0], l[1] + fs * 2);
					x.fillText(`       ${player.tetrises}`, l[0], l[1] + fs * 3);
				} else {
					//fs*=.9
					x.fillStyle = "#555";
					l1 = 1 + (((t * 3) | 0) % 8);
					l2 = 1 + (((t * 6) | 0) % 8);
					l3 = 1 + (((t * 1) | 0) % 8);
					l4 = 1 + (((t * 9) | 0) % 8);
					x.fillText(".".repeat(l1), l[0], l[1]);
					x.fillText(".".repeat(l2), l[0], l[1] + fs);
					x.fillText(".".repeat(l3), l[0], l[1] + fs * 2);
					x.fillText(".".repeat(l4), l[0], l[1] + fs * 3);
				}
			}
		}
	});

	if (gameInPlay) {
		players.map((player, idx) => {
			if (!idx) {
				drawSwapPiece(player);
				drawNextPieces(player);
			} else {
				if (!paused) {
					if (idx > 1) {
						l = player.keyQueue.filter((v) => v).length;
						if (l) {
							if (Rn() < 1 - 1 / (1 + player.speed / (instadropAI ? 1 : 100))) {
								if (l == 2) {
									if (player.keyQueue[0]) {
										movPieceRight(player, idx);
										player.keyQueue[0]--;
									}
								} else if (l == 1) {
									if (player.keyQueue[0]) {
										movPieceRight(player, idx);
										player.keyQueue[0]--;
									} else {
										rotPiece(player, idx);
										player.keyQueue[1]--;
									}
								}
							}
						} else {
							if (Rn() < 1 - 1 / (1 + player.speed / (instadropAI ? 1 : 1e3))) fullDropPiece(player, idx);
						}
					}
				}
			}
			drawBox(player, idx);
			//if(!instadropAI || idx<2) drawPiece(player, idx)
			drawPiece(player, idx);
			if (player.alive) {
				doKeys(player, idx);
				if (!idx) drawDropShadow(player, idx);
				if (!paused && (idx > 1 || !idx)) {
					if (!(((t * 60) | 0) % (idx > 1 && instadropAI ? 0 : (dropTimer / (1 + player.speed / 5)) | 0)))
						dropPiece(player, false, idx);
				}
			} else {
				drawDeath(player, idx);
				if (!paused) player.deathGrow += idx > 1 && instadropAI ? 30 : 3;
			}
		});
	}

	sparks = sparks.filter((v) => v[6] > 0);
	sparks.map((v) => {
		X = v[0] += v[3];
		Y = v[1] += v[4] += grav;
		Z = v[2] += v[5];
		R(Rl, Pt, Yw, 1);
		if (Z > 0) {
			l = Q();
			s = Math.min(1e4, (2e3 / Z) * v[6] * (v[8] > 1 ? remotesp : localsp));
			x.fillStyle = v[7] ? "#00ff0005" : "#ff000006";
			x.fillRect(l[0] - s / 2, l[1] - s / 2, s, s);
			s /= 3;
			x.fillRect(l[0] - s / 2, l[1] - s / 2, s, s);
			x.fillStyle = v[7] ? "#00ff8810" : "#ff880015";
			s /= 3;
			x.fillStyle = "#ffffffff";
			x.fillRect(l[0] - s / 2, l[1] - s / 2, s, s);
		}
		v[6] -= 0.066;
	});

	sliders.map((slider) => {
		drawSlider(slider);
	});

	if (players.length - 2 > 0) {
		doAI();
	}

	if (showLeaderBoard) drawLeaderBoard();

	flashes = flashes.filter((flash) => flash[3] > 0.25);
	flashes.map((flash) => {
		X = flash[0];
		Y = flash[1];
		Z = flash[2];
		R(Rl, Pt, Yw, 1);
		if (Z > 0) {
			l = Q();
			s = Math.min(1e4, (3e4 / Z) * flash[3] ** 1.5);
			x.fillStyle = "#ff000006";
			x.drawImage(starImgs[0].img, l[0] - s / 2, l[1] - s / 2, s, s);
			s /= 2;
			x.drawImage(starImgs[(1 + Rn() * 8) | 0].img, l[0] - s / 2 / 1.05, l[1] - s / 2 / 1.05, s, s);
		}
		flash[3] -= 0.1;
	});

	if (showSideBars) drawSideBars();

	menuWidth = 150;
	menux = -menuWidth;
	bct = 0; // must appear before 1st button (for callbacks/ clickability)

	//X = c.width - 690
	//Y = c.height - 132
	X = c.width - 129;
	Y = c.height - 140;
	renderButton("instadrop AI[✔]", X, Y, "cancel instadrop  ", "toggleInstadrop()", "rectangle", "#f008", "#4018", 24);

	X = c.width - 129;
	Y = c.height - 140;
	renderButton(
		"instadrop AI[ ]",
		X,
		Y,
		"enable instadrop (CPU INTENSIVE!)  ",
		"toggleInstadrop()",
		"rectangle",
		"#0ff4",
		"#2088",
		24
	);

	X = c.width - 100;
	Y = c.height - 100;
	renderButton("[tab] pause", X, Y, "[tab] pause/unpause game  ", "togglePause()", "rectangle", "#0ff4", "#2088", 24);

	X = c.width - 115;
	Y = c.height - 100;
	renderButton("[tab] unpause", X, Y, "[tab] pause/unpause game  ", "togglePause()", "rectangle", "#f008", "#4018", 24);

	X = c.width - 107;
	Y = c.height - 60;
	renderButton("(re)set AI #", X, Y, "configure how many AI Players  ", "masterInit(true)", "rectangle", "#0ff4", "#2088", 24);

	X = c.width / 2 - 65;
	Y = 76;

	col = sortCriteria == "maxRowsCompleted" ? "#0f88" : "#0848";
	renderButton("max", X, Y, "  sort by max rows completed  ", "sortCriteria='maxRowsCompleted'", "rectangle", "", col, 28);

	s___ = 69;
	X = c.width / 2 - 65 + s___ * 1;
	Y = 76;
	col = sortCriteria == "rowsCompleted" ? "#0f88" : "#0848";
	renderButton("cur", X, Y, "  sort by current rows completed ", "sortCriteria='rowsCompleted'", "rectangle", "", col, 28);

	X = c.width / 2 - 65 + s___ * 2;
	Y = 76;
	col = sortCriteria == "tetrises" ? "#0f88" : "#0848";
	renderButton(
		"tet",
		X,
		Y,
		"  sort by total tetrises (4-rows) completed  ",
		"sortCriteria='tetrises'",
		"rectangle",
		"",
		col,
		28
	);

	X = c.width / 2 - 65 + s___ * 3;
	Y = 76;
	col = sortCriteria == "respawns" ? "#0f88" : "#0848";
	renderButton("ded", X, Y, "  sort by total losses  ", "sortCriteria='respawns'", "rectangle", "", col, 28);

	if (Rn() < 0.1) console.log(sortCriteria);

	buttons.map((button) => {
		if (button.hover && button.visible) {
			let fs;
			let margin = 8;
			x.font = (fs = 24) + "px Courier Prime";
			X = mx + 5;
			let w = x.measureText(button.tooltip).width + margin * 2;
			let h = fs + margin * 2;
			if (X + w > c.width) w *= -1;
			if (my + h > c.height) h *= -1;
			x.textAlign = "left";
			x.fillStyle = "#1068";
			x.fillRect(X, my, w, h);
			x.fillStyle = "#0ff";
			x.fillText(button.tooltip, X + (w < 0 ? w : 0) + fs / 2 - 2, my + (h < 0 ? h : 0) + fs * 1.125);
		}
	});

	buttonsLoaded = true;

	t += 1 / 60;
	requestAnimationFrame(Draw);
}
Draw();
