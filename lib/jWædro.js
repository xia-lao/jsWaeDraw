$(function () {
  var WD;

  var Ls = {
    _get_alphabet: function (lang) {
      if (Ls.hasOwnProperty(lang)) {
        return Ls[lang].split(" ");
      } else {
        return -1;
      }
    },
    _get_letter: function (lang, offset) {
      var _lang = Ls._get_alphabet(lang);
      if (_lang !== -1) {
        return _lang[offset];
      } else {
        return -1;
      }
    },
    _get_heb_value: function (letter) {
      if (letter.length > 1) {
        var let = letter.split(""), sum = 0;
        for (var l in let) {
          sum += Ls._get_heb_value(let[l]); //a bit of recursion
        }
        return sum;
      }
      if (typeof Ls.Hebrew_gematria !== 'undefined') {
        return parseInt(Ls.Hebrew_gematria[letter]);
      }
      var gs = Ls._hebGem.split(" ");//values
      //Ls.DebugVersion?{}:gs = gs.reverse();
      var norm_gs = _.map(gs, function (elem) {
        return parseInt(elem);
      });
      var where = Ls._hebAll.split(" ").reverse();//letters
      Ls.Hebrew_gematria = {};
      for (var i = 0; i < _.size(norm_gs); i++) {
        Ls.Hebrew_gematria[where[i]] = norm_gs[i];
      }
      return parseInt(Ls.Hebrew_gematria[letter]);
    },
    _get_offset: function (lang, letter) {
      var _lang = Ls._get_alphabet(lang);
      if (_lang !== -1) {
        return _lang.indexOf(letter);
      } else {
        return -1;
      }
    },
    _get_color: function (value) {
      var clist = 
//blue-white 40 colors
['#0000ff','#2810ff','#391cff','#4825ff','#522dff','#5c35ff','#653bff','#6e43ff','#7449ff','#7b4fff','#8256ff','#885cff','#8e62ff','#9467ff','#9a6dff','#9f74ff','#a47aff','#a980ff','#ae85ff','#b38cff','#b891ff','#bc97ff','#c19eff','#c5a3ff','#caa9ff','#ceafff','#d2b5ff','#d6bcff','#dac1ff','#dec8ff','#e2ceff','#e6d3ff','#e9daff','#ede0ff','#f1e6ff','#f5edff','#f8f2ff','#fbf9ff','#ffffff']
      return clist[value];
    },
    _T: function (dec) {
      var res = dec.toString(3);
      while (res.length % 3 !== 0) {
        res = "0" + res;
      }
      return res;
    },
    _D: function (tern) {
      return parseInt(tern, 3);
    },
    _heb_ternary: function (ternary) {
      var res = [], tern = ternary.split("");
      for (var i = 0; i < ternary.length; i++) {
        switch (tern[i]) { //по старшинству в алавите
          case "0":
            res[i] = "ה";
            break;
          case "1":
            res[i] = "ו";
            break;
          case "2":
            res[i] = "י";
            break;
        }
      }
    },
    _trigram: function (ternary) {
      var tg = _.map(ternary.split(""), function (elem) {
        switch (elem) { //▯▮●
          case "0":
            return "●";
            break;
          case "1":
            return "▮";
            break;
          case "2":
            return "▯";
            break;
        }
      });
      return "(" + tg.join("") + ")";
    },
    _trigram_dec: function (trigram) { //always in "(●▮▯)" form
      var t = _.initial(_.rest(trigram.split(""))); //trim brackets
      var t1 = _.map(t, function (elem) {
        switch (elem) {
          case "●":
            return "0";
            break;
          case "▮":
            return "1";
            break;
          case "▯":
            return "2";
            break;
        }
      });
      while (_.first(t1) === "0") {
        t1 = _.rest(t1);
      }
      return Ls._D(t1.join(""));
    },
    _cycle_g: function (offset, arragh) {
      var l = arragh.length - 1, o = offset;
      if (o > l) { o = o % l; }
      return arragh[o];
    },
    init: function () {
      Ls._heb = "ת ש ר ק צ פ ע ס נ מ ל כ י ט ח ז ו ה ד ג ב א";
      Ls._hebEnds = "לף ית מל לת ה ו ין ית ית וד ף מד ים ון מך ין ה די וף יש ין ו";
      Ls._hebSofits = "ץ ף ן ם ך";
      Ls._hebAll = "ץ ף ן ם ך ת ש ר ק צ פ ע ס נ מ ל כ י ט ח ז ו ה ד ג ב א";
      Ls._hebGem = 
              "1 2 3 4 5 6 7 8 9 1 2 3 4 5 6 7 8 9 1 2 3 4 5 6 7 8 9"
              //"1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27";
              //"1 2 3 4 5 6 7 8 9 10 20 30 40 50 60 70 80 90 100 200 300 400 20 40 50 80 90";
              //"1 2 3 4 5 6 7 8 9 10 20 30 40 50 60 70 80 90 100 200 300 400 500 600 700 800 900";
      //Ls._hebEndsGem = "6 710 310 806 14 5 710 540 706 610 44 800 10 410 410 710 6 5 430 70 410 830";
      //      Ls._teq = "i l c h x t y p a j w o g z b f s m n e r q v k d u #";
      //      Ls._teqGem = "0 1 2 3 6 9 18 4 5 7 8 10 11 19 20 12 15 21 24 13 14 16 22 17 23 25 26";
      //      Ls._teqSymbol = "☸ ☯ ☷ ☶ ☴ ☰ ☊ ☋ ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓ ♄ ☿ ☉ ♃ ♀ ☽ ♂ ⨁";
      //      Ls._teqSymLat = "Tao De Fire Water Air Earth Caput Cauda "+"Aries Taurus Gemini Cancer Leo Virgo Librae Scorpius Sagittarius Capricornus Aquarius "+"Saturnus Mercurius Sol Jupiter Venus Luna Mars Terra";
      //      Ls._wae =     "э ы ь я з а ъ м ю г к т в у щ б о Р ш л с ё р ж й п х е и В ц д н";
      //      Ls._waeGem =  "1 2 3 4 5 6 7 8 9 A B 10 20 30 40 50 60 70 80 90 A0 B00 100 200 300 400 500 600 700 800 900 A00 B00";
      //      Ls._waeTEQ = 'k x e . j a c o b . . # l . q s y z g p h b r n f . t i u m v d .';
      //      Ls._waeHeb = '. a C . o r q g . i S d m t x . s k p n . w . . . h z l . . b T .';
      //      Ls._waeEno = '. g z . f l t r b m . . h s x . p c . d i . y . e . u a . q n . o';
      //      Ls._waeHEn = '. t a . S m t q h C . . a i T . x S . d s . s . z . o v . m n . l';
        //    Ls._eno = "b c g d f a e m i y h l p q n x o r z v s t";
        //    Ls._enoGem = "5 300 9 4 300 6 7 90 60 1 8 40 50 400 30 100 1 70 10 400";
        //    Ls._gre = "α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ σ τ υ φ χ ψ ω";
      //"♄ ☿ ☉ ♃ ♀ ☽ ♂ ⨁";//"ᛟ ᛚ ᚨ ᛇ ᚴ"; //middle //"1 2 3 4 5 6 7 8";//"ᛟ ᚱ ᛋ ᚷ ᚹ ᚾ ᚦ ᚢ";//"♄ ☿ ☸ ☉ ♂"; //middle
        //    Ls._greGem = "1 2 3 4 5 7 8 9 10 20 30 40 50 60 70 80 100 200 300 400 500 600 700 800";*/
      if (Ls.DebugVersion) {
        var a = "а б в г д е ж з";
        var b = "гд вз в де з е еж зв";
        var start = Ls.Start, length = Ls.Length, end = start * 2 + (length * 2) - 1;
        Ls._heb = a.substring(start * 2, end);
        Ls._hebEnds = b.substring(start * 2, end).split(" ").reverse().join(" ");
        Ls._hebAll = a + " " + b;
        Ls._hebGem = "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17";
        //"1 2 3 4 5 6 7 8 1 2 3 4 5 6 7 8";
      }
      if (typeof Ls.Base === 'undefined') {
        Ls.Base = {
          LVal: Ls._heb.split(" ").reverse(),
          RVal: Ls._hebEnds.split(" ").reverse()
        };
        _M231.Xer1 = Ls.Base.RVal.length;
        Ls._even = (_M231.Xer1 % 2 === 0);
      }
      return Ls.Base;
    }
  };

  var _M231 = { //if concentrics are drawn for Model231, determines the gap between them, CHANGEABLE
    offsetX: 0, offsetY: 0, //offset of centers from upper left )
    Object: {},
    /**
     * 
     * Initializes the whole M231 thing with parameters, or returns the centers based on existing values of Mok1, Xer1 and _sayl
     * It also djustes canvas to fit the image
     * @param {Float} M - steps count 
     * @param {Float} X - size of step in pixels
     * @returns {_1{x, y}, _2{x, y}}*/
    _dim: function (M, X) {
      if (typeof M === 'undefined') {
        M = _M231.Mok1; X = _M231.Xer1;
      } else {
        this.Mok1 = M; this.Xer1 = X;
      }
      var
        c1 = { x: (M * (X - 1)) + this.offsetX, y: (M * (X - 1)) + this.offsetY },
        c2 = { x: c1.x + (M * (X - 1)), y: c1.y },
        c3 = { x: c1.x - (M * (X - 1) / 2), y: c2.y }; //center of the ellipses in SVG notation
      var e = { _1: c1, _2: c2, r: this.Mok1 * (this.Xer1 - 1), c: c3 };
      return e;
    },
    /**
     * Calculates coords of points, where two concentrics interfere
     * @param {int} r1 radius in steps
     * @param {int} r2 radius in steps
     * @returns {jWædro_L1._M231._interference_data.jWædroAnonym$55}*/
    _interference_data: function (r1, r2) {
      //A and Z - focuses, M - cardinal and base axia crossing point, B, C: vesica limits on cardinal axis
      var d = _M231._dim(), points = {
        A: d._1,
        B: { x: 0, y: 0 }, C: { x: 0, y: 0 },
        Z: d._2, M: { x: 0, y: 0 }
      }, lines = {
          AZ: d.r, //base line
          AB: r1 * _M231.Mok1, ZB: r2 * _M231.Mok1 //radii of circles
        }, x = _M231.Xer1, angles = { MZB: 0, MAB: 0, MBZ: 0, MBA: 0, ABZ: 0 }, v = r1 + r2;
      if (((r1 >= x & r2 <= Math.ceil(x / 2)) |
        (r2 >= x & r1 <= Math.ceil(x / 2)))
        & (r1 !== 0 & r2 !== 0)) { //I2
        v = ((x - 1) - (((r1 >= x) ? r1 : r2) - (x - 1))) + (r2 < Math.ceil(x / 2) ? r2 : r1); //circles more, than basal, will look like itself's number reflected by Xer1-1 axis
      }

      if (v == x - 1) {
        points.M = { y: points.A.y, x: points.A.x + r1 * _M231.Mok1 };
        points.B = points.C = -1;
        lines.BM = 0; lines.AM = r1 * _M231.Mok1; lines.MZ = r2 * _M231.Mok1;

        var hyp = Math.sqrt(Math.pow(lines.AZ, 2) + Math.pow(lines.AB, 2)); //hypothetic hypothenuse

        if (hyp < lines.ZB) { //if HH is less, than r2, the angle is > 90
          lines.MZ = lines.AZ + lines.AM; //от конца до точки на базовой оси
          points.M = { x: points.A.x - lines.AM, y: points.A.y };
        } else {
          lines.MZ = lines.AZ - lines.AM; //от конца до точки на базовой оси
          points.M = { x: points.A.x + lines.AM, y: points.A.y };
        }
      } else if (v < x - 1) {//no interference
        return {};
      } else if (v > x - 1) {
        //two interference points
        var p = (lines.AZ + lines.AB + lines.ZB) / 2;
        lines.BM = ((2 * Math.sqrt(p * (p - lines.AZ) * (p - lines.AB) * (p - lines.ZB))) / lines.AZ); //высота
        if (isNaN(lines.BM)) { //stupid solution, but hope it will cut out the shit
          return {};
        }
        lines.AM = (Math.sqrt(Math.pow(lines.AB, 2) - Math.pow(lines.BM, 2))); //от начала до точки на базовой оси
        if (isNaN(lines.AM)) {
          return {};
        }

        var hyp = Math.sqrt(Math.pow(lines.AZ, 2) + Math.pow(lines.AB, 2)); //hypothetic hypothenuse

        if (hyp < lines.ZB) { //if HH is less, than r2, the angle is > 90
          lines.MZ = lines.AZ + lines.AM; //от конца до точки на базовой оси
          points.M = { x: points.A.x - lines.AM, y: points.A.y };
          points.B = { x: points.A.x - lines.AM, y: points.A.y - lines.BM };
          points.C = { x: points.B.x, y: points.A.y + lines.BM };
        } else {
          lines.MZ = lines.AZ - lines.AM; //от конца до точки на базовой оси
          points.M = { x: points.A.x + lines.AM, y: points.A.y };
          points.B = { x: points.A.x + lines.AM, y: points.A.y - lines.BM };
          points.C = { x: points.B.x, y: points.A.y + lines.BM };
        }
        //          angles.MZB = Math.round(Math.asin(lines.BM / lines.ZB) * (180 / Math.PI));
        //          angles.MAB = Math.round(Math.asin(lines.BM / lines.AB) * (180 / Math.PI));
        //          angles.MBZ = Math.round(Math.asin(lines.MZ / lines.ZB) * (180 / Math.PI));
        //          angles.MBA = Math.round(Math.asin(lines.AM / lines.AB) * (180 / Math.PI));
        //          angles.ABZ = angles.MBZ + angles.MBA;
      }
      return { _A: angles, _P: points, _L: lines };
    },
    /**
     * Returns dot's vertical half: left or right or base/card.
     * Horisontal half we know from K index of dot
     * @param {type} dot
     * @returns {Number} quadrant
     */
    _half: function (dot) {
      if (dot.Position[2] == 0) {
        //basal axis
        return 0;
      }
      if (dot.Position[0] == dot.Position[1]) {
        //cardinal
        return -1;
      }
      if (dot.Position[0] > dot.Position[1]) {
        //right side
        return 1;
      }
      if (dot.Position[0] < dot.Position[1]) {
        //left side
        return 2;
      }
    },
    _is_FE: function (i, j) {
      for (var a in _M231.Object.FE) {
        //we don't care, whether the dot is K1 or K2
        if (_M231.Object.FE[a].Position[0] === i && _M231.Object.FE[a].Position[1] === j) {
          return true;
        }
      }
      return false;
    },
    _is_Base: function (i, j) {
      for (var a in _M231.Object.Base) {
        if (_M231.Object.Base[a].Position[0] === i && _M231.Object.Base[a].Position[1] === j) {
          return true;
        }
      }
      return false;
    },
    _is_I2: function (i, j) {
      if (i >= _M231.Xer1 | j >= _M231.Xer1) {
        return true;
      }
      return false;
    },
    _dots_sum: function (dots_array) {
      var sum = 0;
      for (var i in dots_array) {
        sum += Ls._get_heb_value(dots_array[i].RVal) + Ls._get_heb_value(dots_array[i].LVal);
      };
      return sum;
    },
    /**
     * Makes pairs of closely related dots. If diagOrVert is defined, true is for ellipses, false for verticals
     * @param {type} first_dot
     * @param {type} new_position_array
     */
    _make_pair: function (first_dot, new_position_array) {
      var npr = new_position_array, p = first_dot.Position; //shorter forms ))
      if (_M231._dexists(npr[0], npr[1], npr[2])) {
        var d0name = _M231._dname(p[0], p[1], p[2]), d1name = _M231._dname(npr[0], npr[1], npr[2]);
        if (typeof _M231.Object.Pairs["P_" + d0name + "_" + d1name] === 'undefined' &&
          typeof _M231.Object.Pairs["P_" + d1name + "_" + d0name] === 'undefined') {
          _M231.Object.Pairs["P_" + d0name + "_" + d1name] = [d0name, d1name];
          _M231.Object.Neighbours["P_" + d0name + "_" + d1name] = [d0name, d1name];
        }
      }
    },
    _dots_connect: function (dname1, dname2) {
      //L by j, UR, G by j, LR, L by i, UL, G by i, LL
      var d1 = dname1.split(""), d2 = dname2.split(""),
        rdot1 = _M231.Object.Dots[parseInt(d1[0], 36)][parseInt(d1[1], 36)][parseInt(d1[2], 36)],
        rdot2 = _M231.Object.Dots[parseInt(d2[0], 36)][parseInt(d2[1], 36)][parseInt(d2[2], 36)];
      var s = _M231._dots_sum([rdot1, rdot2]);
      var l = _SVG._line_d(rdot1, rdot2, "L_" + s, s).attr(_SVG.Params);
      return l;
    },
    _u: function (i) { //make directions universal
      return (i < _M231.Xer1) ? i : ((i + 2) - _M231.Xer1) % _M231.Xer1;
    },
    _c: function (i) { return _M231.Xer1 - i; },
    _dname: function (i, j, k) {
      return i.toString(36) + j.toString(36) + k.toString();
    },
    _dexists: function (i, j, k) {
      if (i < 0 || j < 0 || i > _M231.MaxVal || j > _M231.MaxVal) { return false; }
      if (typeof _M231.Object.Dots[i][j][k] !== 'undefined' & _M231.Object.Dots[i][j][k] !== 0) {
        return true;
      }
      return false;
    },
    _neighbours: function (dot) {
      var dname = _M231._dname(dot.Position[0], dot.Position[1], dot.Position[2]), result = [];
      for (var d in _M231.Object.Neighbours) {
        if (d.indexOf(dname) !== -1) {
          result.push(_M231.Object.Neighbours[d]);
        }
      }
      return result;
    },
    _csv: function (data) {
      var csvContent = "data:text/csv;charset=utf-8,";
      data.forEach(function (infoArray, index) {
        var dataString = infoArray.join(",");
        csvContent += index < data.length ? dataString + "\n" : dataString;
      });
      var encodedUri = encodeURI(csvContent);
      window.open(encodedUri);
    },
    _dots_from_line: function (circleNo, focus) {
      var a = ((_M231.Object.Circles[focus].Dots[circleNo][1])
        .concat(_M231.Object.Circles[focus].Dots[circleNo][0]))
        .concat(_M231.Object.Circles[focus].Dots[circleNo][2]);
      return a;
    },
  };

  var Q = {
    //    HitCounter: 0,
    /*//any small figure, like quadrat on k==1 or triangle (which formally is a quadrat due to
    // doubling of base axis' dots between focuses)
    //based on natural direction (based on direction of base axis and 
    //development of reduction, we choose the following formulas for the figures
    //starting pair tends to the focus, so first line of a figure always is one circle higher
    //35-34 (by F0) and next will be 24-25 by F0 in K1      //▯▮●
    //pattern                                           a)  02 (20) 01 (10) 
    //33-32 (by F0) 23-23 by F0 in K1>K0
    //pattern                                           b)  02 (20) 00 (10) 
    //32-42 (by F1) 41-41 by F1 in K0>K2
    //pattern                                           c)  10 (02) 00 (21) 
    //43-53 (by F1) 52-42 by F1 in K2
    //pattern                                           d)  10 (02) 20 (01) 
    //we don't take into account other directions, which will give us the same picture with all trinary numbers inversed
    //
    //in order to get Q we need one dot: we should find direction (find the quadrant(1-F0, 2-F1), see K, check if dot from FE)
    //if K==1 and !FE choose patt "a"
    //if K==1 and FE choose patt "b" 
    //if K==0 choose patt "c"
    //if K==2 choose patt "d"*/
    _B: function (dot) {
      var dp = dot.Position, dn = _M231._dname(dp[0], dp[1], dp[2]);
      if (typeof _M231.Object.Q[dn] !== "undefined") {
        return [_M231.Object.Q[dn], dn];
      }
      //Dot Position. First Ellipse, New Dots Array, Left Dot, Right Dot, Lower Dot
      var FE = _M231._is_FE(dp[0], dp[1]), nda = [], ld = [], rd = [], Ld = [];
      ld[0] = dp[0] - 1; ld[1] = dp[1]; rd[0] = dp[0]; rd[1] = dp[1] - 1;
      Ld[0] = ld[0]; Ld[1] = rd[1];
      if (dp[2] === 0) { //this happens only in I2!!!
        //APO PANTOS kAKODAIMONOS, for this place is Holy!
        //////////////////////////////////////////////////
        //here we should draw Z0 and Z1 Qs at the same time
        //we get here only in I2, since I1 k0 figures are covered by k1/k2 FE dots
        //Qs lay horizontally. Lower dot is k0, left/right have same I,J, diffirent K
        if (dp[0] > dp[1] && dp[0] >= _M231.Xer1) {
          Ld[0] = dp[0] - 1; Ld[1] = dp[1] - 1; Ld[2] = 0;
          ld[2] = 1;
          rd[0] = dp[0] - 1; rd[1] = dp[1]; rd[2] = 2;
        } else if (dp[0] < dp[1] && dp[1] >= _M231.Xer1) {
          Ld[0] = dp[0] - 1; Ld[1] = dp[1] - 1; Ld[2] = 0;
          ld[0] = dp[0]; ld[1] = dp[1] - 1; ld[2] = 2;
          rd[2] = 1;
        }
        //////////////////////////////////////////////////
      } else if (dp[2] === 2) {
        ld[2] = _M231._is_Base(ld[0], ld[1]) ? 0 : 2;
        rd[2] = _M231._is_Base(rd[0], rd[1]) ? 0 : 2; 
        //not the best way, but... some Dao )))
        if (!_M231._dexists(ld[0], ld[1], ld[2])) {
          return 0;
        }
        Ld[2] = (_M231._is_FE(ld[0], ld[1]) & _M231._is_FE(rd[0], rd[1])) ? 0 : 2;
      } else if (dp[2] === 1 && !FE) {
        ld[2] = 1; rd[2] = 1;
        //not the best way, but... some Dao )))
        if (!_M231._dexists(ld[0], ld[1], ld[2])) {
          return 0;
        }
        Ld[2] = (_M231._is_FE(ld[0], ld[1]) & _M231._is_FE(rd[0], rd[1])) ? 0 : 1;
      } else if (FE) {
        if (_M231._is_I2(dp[0], dp[1])) {
          if (_M231._is_Base(ld[0], ld[1])) {
            ld[2] = 0; rd[2] = dp[2];
          } else if (_M231._is_Base(rd[0], rd[1])) {
            rd[2] = 0; ld[2] = dp[2];
          }
          Ld[2] = dp[2];
        } else {
          ld[2] = 0; rd[2] = 0; Ld = rd;
        }
      }

      nda[0] = dot; //start dot, the value of Q is set by it
      if (_M231._dexists(rd[0], rd[1], rd[2])) {
        nda[1] = _M231.Object.Dots[rd[0]][rd[1]][rd[2]]; //right dot
      }
      if (_M231._dexists(ld[0], ld[1], ld[2])) { //left dot
        //fill nda[3] first in order not to get crosses ))
        nda[3] = _M231.Object.Dots[ld[0]][ld[1]][ld[2]];
      }
      if (_M231._dexists(Ld[0], Ld[1], Ld[2])) { //lower dot
        nda[2] = _M231.Object.Dots[Ld[0]][Ld[1]][Ld[2]];
      } else {
        nda[2] = nda[3];
      }
      if (typeof nda[0] === "undefined" || typeof nda[1] === "undefined" || typeof nda[2] === "undefined") {
        return 0;
      }
      _M231.Object.Q[dn] = nda;
      return [_M231.Object.Q[dn], dn];
    },
    TT: { //To Table :-)
      Offsets: function () {
        var d = _M231._dim(),
          xs = d._1.x + d.r,
          ys = d._1.y + d.r * 1.5;//d._2.x + d.r;
        return { x: xs, y: ys };
      },
      Row: function (dot) {
        var qnum = _M231.Object.Q[Q._Name(dot)];

      },
      Col: function (dot) {

      },
      DrawCell: function (dot) {

      }
    },
    _Area: function (dot) {
      var pts = Q._B(dot)[0]; //dots
      var area = 0;
      var nPts = pts.length; //how maony dots
      var j = nPts - 1;
      var p1; var p2;

      for (var i = 0; i < nPts; j = i++) {
        p1 = pts[i]; p2 = pts[j];
        area += p1.DotCoords.x * p2.DotCoords.y;
        area -= p1.DotCoords.y * p2.DotCoords.x;
      }
      area /= 2;
      return area;
    },
    _Centroid: function (dot) {
      var pts = Q._B(dot)[0];
      var nPts = pts.length;
      var x = 0; var y = 0;
      var f;
      var j = nPts - 1;
      var p1; var p2;

      for (var i = 0; i < nPts; j = i++) {
        p1 = pts[i]; p2 = pts[j];
        f = p1.DotCoords.x * p2.DotCoords.y - p2.DotCoords.x * p1.DotCoords.y;
        x += (p1.DotCoords.x + p2.DotCoords.x) * f;
        y += (p1.DotCoords.y + p2.DotCoords.y) * f;
      }

      f = Q._Area(dot) * 6;
      return { x: x / f, y: y / f };
    },
    _OrdinalSum: function (dot) {
      var q = Q._B(dot)[0], n = 0;
      for (var d in q) {
        n += Ls._get_offset("_hebAll", q[parseInt(d)].LVal) + Ls._get_offset("_hebAll", q[parseInt(d)].RVal);
      }
      return n;
    },
    _CircleNs: function (dot) {
      var q = Q._B(dot)[0], n = 0;
      for (var d in q) {
        n += q[parseInt(d)].Position[0] + q[parseInt(d)].Position[1];
      }
      return n;
    },
    _TotalG: function (dot) {
      var q = Q._B(dot)[0], n = 0;
      for (var d in q) {
        n += Ls._get_heb_value(q[parseInt(d)].LVal) + Ls._get_heb_value(q[parseInt(d)].RVal);
      }
      return n;
    },
    _G: function (dot) {
      return _SVG.QuadratValueToShow.ColorRVALOnly ?
        Ls._get_heb_value(dot.RVal) :
        _SVG.QuadratValueToShow.ColorLVALOnly ?
          Ls._get_heb_value(dot.LVal) :
          Ls._get_heb_value(dot.LVal) + Ls._get_heb_value(dot.RVal);
    },
    _VTS: function (dot) { //value to show
      var value = "", q = Q._B(dot)[0], n = 0;
      /*if (_SVG.QuadratValueToShow.LVal) {
        value += dot.LVal;
      }
      if (_SVG.QuadratValueToShow.RVal) {
        value += dot.RVal;
      }*/

      if (_SVG.QuadratValueToShow.Values) {
        value = _SVG.QuadratValueToShow.ColorRVALOnly ? dot.RVal :
          _SVG.QuadratValueToShow.ColorLVALOnly ? dot.LVal :
            dot.LVal + dot.RVal;
      }
      if (_SVG.QuadratValueToShow.ValGems) {
        value += (value === "" ? "" : ".") + "GS" +
        (_SVG.QuadratValueToShow.ColorRVALOnly ? "" : Ls._get_heb_value(dot.LVal) +
          _SVG.QuadratValueToShow.ColorLVALOnly ? "" : Ls._get_heb_value(dot.RVal));
        //value = dot.RVal+""+dot.LVal;
      }
      if (_SVG.QuadratValueToShow.QNum) {
        value += (value === "" ? "" : "\n") + "QN" + _M231.Object.Q[Q._Name(dot)].Number;
        //value = dot.RVal+""+dot.LVal;
      }
      if (_SVG.QuadratValueToShow.GemValsSep) {
        value += (value === "" ? "" : "\n") + "G" + _SVG.QuadratValueToShow.ColorRVALOnly ? "" : Ls._get_heb_value(dot.LVal) + ":" +
          _SVG.QuadratValueToShow.ColorLVALOnly ? "" : Ls._get_heb_value(dot.RVal);
        //value = dot.RVal+""+dot.LVal;
      }
      if (_SVG.QuadratValueToShow.PValues) {
        var nb = _SVG.ShowDecimal ? 10 : 36;
        value += (value === "" ? "" : "\n") + "P" + dot.Position[0].toString(nb) + ":" + dot.Position[1].toString(nb);
      }
      if (_SVG.QuadratValueToShow.TotalGematria) {
        for (var d in q) {
          n += _SVG.QuadratValueToShow.ColorRVALOnly ? "" : Ls._get_heb_value(q[d].LVal) +
            _SVG.QuadratValueToShow.ColorLVALOnly ? "" : Ls._get_heb_value(q[d].RVal);
        }
        value += (value === "" ? "" : "\n") + "TG" + n;
      }
      if (_SVG.QuadratValueToShow.OrdinalSum) {
        value += (value === "" ? "" : ".") + "OS" + Q._OrdinalSum(dot);
      }
      //      if (_SVG.QuadratValueToShow.TotalGematria) {
      //        
      //      }
      return value;
    },
    _Subscribe: function (dot) {
      var c = Q._Centroid(dot), val = Q._VTS(dot), qn = Q._Name(dot);
      if (dot.Position[2] === 0 && dot.Position[0] >= _M231.Xer1) {
        c.x += _SVG.DotSize / 2 + _M231.Mok1 / _M231.HolyCoefficient * (dot.Position[0] - _M231.Xer1);
      } else if (dot.Position[2] === 0 && dot.Position[1] >= _M231.Xer1) {
        c.x -= _SVG.DotSize / 2 + _M231.Mok1 / _M231.HolyCoefficient * (dot.Position[1] - _M231.Xer1);
      }
      var t = _SVG._text(val, c.x, c.y, "QT_" + qn).attr({ fill: "green" });
      return t;
    },
    _Name: function (dot) {
      var q = Q._B(dot), name = "Q";
      if (q === 0) {
        return 0;
      }
      for (var n in q[0]) {
        name += "_" + _M231._dname(q[0][n].Position[0], q[0][n].Position[1], q[0][n].Position[2]);
      }
      return name;
    },
    _Draw: function (dot) {
      var q = Q._B(dot);
      if (q === 0) { return; }
      //q.0 = dot, q.1 = left dot, q.2 = right dot, q.3 = lower dot
      var path = "M" + dot.DotCoords.x + "," + dot.DotCoords.y;
      for (var i in q[0]) {
        if (i > 0) {
          var l = q[0][i].DotCoords.x + "," + q[0][i].DotCoords.y;
          if (_.contains(_M231.Object.QLS, l)) { //in order not to redraw lines
            l = "M" + l; //move cursor to position
          } else {
            l = "L" + l; //create the line and add it to the array
            _M231.Object.QLS.push(l);
          }
          path += l;
        }
      }
      path += "z";
      var p = _SVG._path(path, "Q_" + q[1]);
      _M231.Object.Lines[Q._Name(dot)] = p;
      return p;
    },
    _ColorizeQ_byOrdinal: function (dot) {
      var qw = Q._OrdinalSum(dot), qcol = Ls._get_color(qw), qn = Q._Name(dot);
      _M231.Object.Lines[qn].attr({ fill: qcol });
    },
    _ColorizeQ_byPosition: function (dot) {
      var qw = Q._CircleNs(dot), qcol = Ls._get_color(qw), qn = Q._Name(dot);
      _M231.Object.Lines[qn].attr({ fill: qcol });
    },
    _ColorizeQ_byTotalG: function (dot) {
      var qw = Q._TotalG(dot), qcol = Ls._get_color(qw), qn = Q._Name(dot);
      _M231.Object.Lines[qn].attr({ fill: qcol });
    },
    _ColorizeQ_byG: function (dot) {
      var qw = Q._G(dot), qcol = Ls._get_color(qw), qn = Q._Name(dot);
      _M231.Object.Lines[qn].attr({ fill: qcol });
    },
    /*//On I2 we have:
    //a2-a3 (by F0) 93-92 in I2K1
    //pattern                     e) 01 (20) 01 (10)
    //81-71 (by F0) 
    //*/
  };
  
  /*////      A1 = {
  ////        steps: 4, //we continue reducing the Hexagram 4 times
  //      var Inside = function (HGO) { //HGO: HexaGramObject, A1/A2 and so on, POL: "points on lines" version of reduction
  ////        if (A1.prototype.hasOwnProperty("A1_"+A1.steps)) {
  ////          return A1["A1_"+A1.steps];
  ////        }
  ////        A1["A1_"+A1.steps] = {};
  //        var a = A1["A1_"+A1.steps];
  //        a.Offset = R._1*2-R._2; //diameter minus second radius
  ////        R["_"+(3+A1.steps)] = R._1-a.Offset; //A1-D`
  ////        var r = R["_"+(3+A1.steps)];
  ////        //TODO: Recursive calc!!!
  //        a.CR = {y: HGO.CR.y, x: HGO.CR.x - a.Offset};
  //        a.CL = {y: HGO.CL.y, x: HGO.CL.x - a.Offset};
  //        a.H = {y: HGO.CL.y, x: HGO.CL.x - r/2, lenUL_H: Math.sqrt(Math.pow(r,2)-Math.pow((r/2),2))};
  //        a.UL = {y: d._1.y - a.H.lenUL_H, x: d._1.x - r/2};
  //        a.UR = {y: a.UL.y, x: d._1.x + r/2};
  //        a.LL = {y: d._1.y + a.H.lenUL_H, x: d._1.x - r/2};
  //        a.LR = {y: a.LL.y, x: a.UR.x};
  //      }
  ////        }
  ////      };*/

  /*
  //      Monad.Radii._3 = (Monad.Radii._1 * 2) - Monad.Radii._2;
  //      A1 = {
  //        Offset: R._1*2-R._2, //diameter minus second radius
  //        CR: {y: d._2.y, x: d._2.x - A1.Offset},
  //        CL: {y: d._1.y, x: d._1.x - A1.Offset},
  //        H: {y: d._1.y, x: d._1.x - r/2, lenUL_H: Math.sqrt(Math.pow(r,2)-Math.pow((r/2),2))},
  //        UL: {y: d._1.y - A1.H.lenUL_H, x: d._1.x - r/2},
  //        UR: {y: A1.UL.y, x: d._1.x + r/2},
  //        LL: {y: d._1.y + A1.H.lenUL_H, x: d._1.x - r/2},
  //        LR: {y: A1.LL.y, x: A1.UR.x},
  //      };*/
  var Monad = {
    Lines: {},
    Points: { A1: {}, A2: {} },
    Radii: {},
    Initialise: function () {
      var d = _M231._dim();
      Monad.Radii._1 = d.r;
      Monad.Radii._2 = 2 * d.r * (Math.sin(((Math.PI / 180) * 120) / 2));
      var ip = _M231._interference_data(_M231.Xer1 - 1, _M231.Xer1 - 1);
      Monad.Points.A1 = {
        UR: { x: ip._P.B.x, y: ip._P.B.y },
        UL: { x: ip._P.B.x - d.r, y: ip._P.B.y },
        LR: { x: ip._P.C.x, y: ip._P.C.y },
        LL: { x: ip._P.C.x - d.r, y: ip._P.C.y },
        CR: { x: d._2.x, y: d._1.y },
        CL: { x: d._1.x - d.r, y: d._1.y },
      };
      Monad.Points.A2 = {
        UR: { x: ip._P.B.x + d.r, y: ip._P.B.y },
        UL: { x: ip._P.B.x, y: ip._P.B.y },
        LR: { x: ip._P.C.x + d.r, y: ip._P.C.y },
        LL: { x: ip._P.C.x, y: ip._P.C.y },
        CR: { x: d._2.x + d.r, y: d._1.y },
        CL: d._1
      };
      Monad.Lines.A1 = {
        IB: _SVG._arc(1, Monad.Points.A1.LL, Monad.Points.A1.UL, "IB").hide(),
        I1: _SVG._arc(1, Monad.Points.A1.UL, Monad.Points.A1.CR, "I1").hide(),
        I2: _SVG._arc(1, Monad.Points.A1.CR, Monad.Points.A1.LL, "I2").hide(),
        OB: _SVG._arc(1, Monad.Points.A1.UR, Monad.Points.A1.LR, "OB").hide(),
        O1: _SVG._arc(1, Monad.Points.A1.LR, Monad.Points.A1.CL, "O1").hide(),
        O2: _SVG._arc(1, Monad.Points.A1.CL, Monad.Points.A1.UR, "O2").hide(),
        Hide: function () {
          for (var L in Monad.Lines.A1) {
            if (Monad.Lines.A1.prototype.hasOwnProperty(L)) {
              Monad.Lines.A1[L].hide();
            }
          }
        },
        Show: function () {
          for (var L in Monad.Lines.A1) {
            if (Monad.Lines.A1.prototype.hasOwnProperty(L)) {
              Monad.Lines.A1[L].show();
            }
          }
        }
      };
      Monad.Lines.A2 = {
        IB: _SVG._arc(2, Monad.Points.A1.LL, Monad.Points.A1.UL, "IB").hide(),
        I1: _SVG._arc(2, Monad.Points.A1.UL, Monad.Points.A1.CR, "I1").hide(),
        I2: _SVG._arc(2, Monad.Points.A1.CR, Monad.Points.A1.LL, "I2").hide(),
        OB: _SVG._arc(2, Monad.Points.A1.UR, Monad.Points.A1.LR, "OB").hide(),
        O1: _SVG._arc(2, Monad.Points.A1.LR, Monad.Points.A1.CL, "O1").hide(),
        O2: _SVG._arc(2, Monad.Points.A1.CL, Monad.Points.A1.UR, "O2").hide(),
        Hide: function () {
          for (var L in Monad.Lines.A2) {
            if (Monad.Lines.A2.prototype.hasOwnProperty(L)) {
              Monad.Lines.A2[L].hide();
            }
          }
        },
        Show: function () {
          for (var L in Monad.Lines.A2) {
            if (Monad.Lines.A2.prototype.hasOwnProperty(L)) {
              Monad.Lines.A2[L].show();
            }
          }
        }
      };
    },
    ShowAll: function () {
      for (var A in Monad.Lines) {
        if (Monad.Lines.prototype.hasOwnProperty(A)) {
          for (var L in Monad.Lines[A]) {
            if (Monad.Lines[A].prototype.hasOwnProperty(L)) {
              Monad.Lines[A][L].show();
            }
          }
        }
      }
    },
    HideAll: function () {
      for (var A in Monad.Lines) {
        if (Monad.Lines.prototype.hasOwnProperty(A)) {
          for (var L in Monad.Lines[A]) {
            if (Monad.Lines[A].prototype.hasOwnProperty(L)) {
              Monad.Lines[A][L].show();
            }
          }
        }
      }
    }
  };

  var _SVG = {
    DotValueToShow: {},
    CreateProperties: function () {
      _SVG.Params = {
        //stroke: "#FFF",//"rgba(156,156,156,1)",
        "stroke-width": 1
      };
      _SVG.FontParams = {
        "font-family": "code2000",
        //"font-size": 20,
        fill: "red"
      };
      _M231.NoDraw = false;
      _M231.Mok1 = 30;//120;
      _SVG.DotSize = .01;
      _SVG.FontParams["font-size"] = 4;//20;
      _M231.HolyCoefficient = 1;//17; //stupidity used in positioning of Q subscription
      _SVG.DotColor = "#eaeaea";
      _SVG.TextAngle = 0;
      _SVG.TextOffsetX = 0; //offset of text from dot or center of some line/arc
      _SVG.TextOffsetY = 0;//_M231.Mok1/3; //offset of text from dot or center of some line/arc
      _SVG.hslSVal = "50%";
      _SVG.hslLVal = "50%";
      _SVG.ShowDecimal = false;
      _M231.Object.Pairs = {};
      _M231.Object.Lines = {};
      _M231.Object.Paths = {
        Lines: {},
        Triangles: {}
      };
      _M231.Object.Neighbours = {};
      //[0|1] for focuses, for each focus an object with dots' array, subdivided into zones
      _M231.Object.Circles = [{ Dots: _.range(_M231.Xer1).map(function () { return []; }) },
        { Dots: _.range(_M231.Xer1).map(function () { return []; }) }];
      _M231.Object.Q = {};
      _M231.Object.QLS = [];
      _M231.Object.TotalLetters = 0;
      _M231.Object.I1Z1TL = 0;
      _M231.Object.QDots = 0;
      _M231.Object.I1Z1QD = 0;
      _M231.Object.FE = [];//_.range(_M231.Xer1-1).map(function () {return 0;}); //First Ellipse, where we count only upper (k=1) zone
      _M231.Object.Base = [];
      _M231.Object.CardAx = [];
      _M231.Object.Dots = _.range(_M231.Xer1 * 1.5).map(function () { return _.range(_M231.Xer1 * 1.5).map(function () { return [0, 0, 0]; }); });
      _M231.Object.Values = _.range(_M231.Xer1 * 1.5).map(function () { return _.range(_M231.Xer1 * 1.5).map(function () { return [0, 0, 0]; }); });
      _SVG.DotValueToShow = {
        Values: false,
        Position: false,
        SubscribeLines: false,
        DrawBase: false,
        QuadsCenters: false,
        DotType: false,
        FullGematrias: false,
        Trinary: false,
        Trigram: false,
        TrigramAlchemy: false
      };
      _SVG.QuadratValueToShow = {
        ColorRVALOnly: false,
        RLavOnly: false,
        OrdinalSum: false,
        TotalGematria: false,
        RVal: false,
        QNum: false,
        LVal: false,
        GemValsSep: false,
        ValGems: false
      };
    },
    SetParams: function () {
      _SVG.ShowDecimal = true;
      _SVG.DotValueToShow.FullGematrias = true;
      _SVG.DotValueToShow.Values = true;
      //_SVG.DotValueToShow.Position = true;
      //_SVG.DotValueToShow.DotType = true;
      //_SVG.DotValueToShow.Neighbours = true;
      //_SVG.QuadratValueToShow.ColorRVALOnly = true;
      //_SVG.QuadratValueToShow.ColorLVALOnly = true;
      //_SVG.QuadratValueToShow.PValues = true;
      //_SVG.QuadratValueToShow.Values = true;
      //_SVG.QuadratValueToShow.ValGems = true;
      //_SVG.QuadratValueToShow.QNum = true;
      _SVG.QuadratValueToShow.GemValsSep = true;
      //_SVG.QuadratValueToShow.TotalGematria = true;
      _SVG.QuadratValueToShow.OrdinalSum= true;
      _SVG.FontParams["font-family"] = "code2000";
      //"WaerIasen";
      //_SVG.FontParams["font-weight"] = "bold";
      _M231.MaxVal = Math.floor(_M231.Xer1 * 1.5);
    },
    _circle: function (cx, cy, r, name) {
      var p = "M " + cx + "," + cy + " " +
        "m -" + r + ",0 " +
        "a " + r + "," + r + " 0 1 0 " + (r * 2) + ",0" +
        "a " + r + "," + r + " 0 1 0 -" + (r * 2) + ",0" +
        "";
      var c = WD.path(p);
      c.attr(_SVG.Params);
      $(c.node).attr('id', name);
      return c;
    },
    _dot: function (cx, cy, name, value) {
      var d = WD.circle(cx, cy, _SVG.DotSize).attr(_SVG.Params);
      $(d.node).attr('id', name);
      if (typeof value !== "undefined") {
        var t = _SVG._text(value, cx - _SVG.TextOffsetX, cy - _SVG.TextOffsetY, "t_" + value);
        t.attr(_SVG.FontParams);
        $(d.node).data("Txt", t);
      }
      d.attr({ fill: _SVG.DotColor });
      return d;
    },
    _subscribe_dot: function (dot) {
      var cx = dot.DotCoords.x - _SVG.TextOffsetX,
        cy = dot.DotCoords.y - _SVG.TextOffsetY,
        name = "DT_" + dot.Position[0].toString(36) + "_" + dot.Position[1] + "_" + dot.Position[2].toString(36),
        value = _SVG._curValue(dot), t;
      if (_M231.Object.Values[dot.Position[0]][dot.Position[1]][dot.Position[2]] !== 0) {
        _M231.Object.Values[dot.Position[0]][dot.Position[1]][dot.Position[2]].attr('text', value);
      } else {
        t = _SVG._text(value, cx, cy, name).attr(_SVG.FontParams);
        _M231.Object.Values[dot.Position[0]][dot.Position[1]][dot.Position[2]] = t;
      }
    },
    _curValue: function (dot) {
      var f = _SVG.DotValueToShow, value = "";
      if (f.Values) {
        value += dot.LVal + dot.RVal;
        value += "\n";
      }
      if (f.Position) {
        value += dot.Position[0].toString(36) + "" + dot.Position[1].toString(36);
      }
      if (f.DotType) {
        value += ".";
        value += dot.Position[2];
      }
      if (f.FullGematrias) {
        value += "\n";
        value += (Ls._get_heb_value(dot.LVal) + Ls._get_heb_value(dot.RVal));
      }
      return value;
    },
    _line_d: function (sd, ed, name, value) {
      var path = "M" + sd.DotCoords.x + "," + sd.DotCoords.y,
        l = " L" + ed.DotCoords.x + "," + ed.DotCoords.y;
      var line = WD.path(path + l).attr(_SVG.Params);
      if (typeof value !== 'undefined' && _SVG.DotValueToShow.SubscribeLines) {
        var point = line.getPointAtLength(line.getTotalLength() / (1.49)); //get center of line;
        point.x -= _SVG.TextOffsetX / 2;
        point.y -= _SVG.TextOffsetY / 2;
        var text = _SVG._text(value, point.x, point.y, "LV_" + name).attr({ fill: "blue" });
        $(line.node).data('Txt', text);
        $(line.node).data('Val', value);
      }
      $(line.node).attr('id', name);
      return line;
      _M231.Object.Lines["P_" + name] = line; //we name'em by pairs' names
      _M231.Object.Paths.Lines["P_" + name] = l;
    },
    _path: function (path, name, value, ccs) { //path to draw and center coordinates
      var l = WD.path(path).attr(_SVG.Params).toBack();
      $(l.node).attr("id", name);
      if (typeof value !== "undefined") {
        if (typeof ccs !== "undefined") {
          var t = _SVG._text(value, ccs.x, ccs.y, "PL_".name).attr({ fill: "black" });
          $(l.node).data("Txt", t);
          $(l.node).data("Val", value);
        }
      }
      return l;
    },
    _line_c: function (sx, sy, ex, ey, name, value) {
      var path = "M" + sx + "," + sy + " L" + ex + "," + ey;
      var line = WD.path(path);
      if (typeof value !== 'undefined') {
        var point = line.getPointAtLength(line.getTotalLength() / 2); //get center of line;
        point.x -= _SVG.TextOffsetX / 2;
        point.y -= _SVG.TextOffsetY / 2;
        var text = _SVG._text(value, point.x, point.y, "Line_" + name + "_Value");
        $(line.node).data('Txt', text);
        $(line.node).data('Val', value);
      }
      line.attr(_SVG.Params);
      $(line.node).attr('id', name);
      return line;
    },
    _text: function (text, sx, sy, name) {
      var txt = WD.text(sx, sy, text).rotate(_SVG.TextAngle).attr(_SVG.FontParams);
      $(txt.node).attr('id', name);
      return txt;
    },
    _change_text: function () {
      _.each(_M231.Object.Dots, function (element, index, list) {
        _.each(element, function (elem, ind, li) {
          _.each(elem, function (el, i, l) {
            if (el !== 0) {
              _SVG._subscribe_dot(el);
            }
          });
        });
      });
    },
    _redraw_lines: function () {
      if (typeof _M231.Object.Lines === "undefined") {
        return;
      }
      for (var line in _M231.Object.Lines) {
        if (!_SVG.DotValueToShow.Neighbours) {
          if (typeof _.find(_.keys(_M231.Object.Neighbours), function (name) {
            return name === line;
          }) !== "undefined") {
            _M231.Object.Lines[line].hide();
          }
        } else {
          if (typeof _.find(_.keys(_M231.Object.Neighbours), function (name) {
            return name === line;
          }) !== "undefined") {
            _M231.Object.Lines[line].show();
          }
        }
      }
    },
    _arc: function (focus, sd, ed, name, value) { //focus is 1 or 2
      var d = _M231._dim(),
        //rey = Math.abs(d.c.y - sd.DotCoords.y)*3,
        rex = d.r / 2 + _M231.Mok1 / 2;
      var pe = ["M", sd.DotCoords.x, ",", sd.DotCoords.y].join(""),
        ep = ["A", rex, ",", rex,
          focus === 1 ? "0 0 1" : "0 0 0",
          ed.DotCoords.x, ",", ed.DotCoords.y].join(" ");
      pe += ep;
      //      sd.Paths[ed.Position[0]][ed.Position[1]][ed.Position[2]] = ep;
      //      ed.Paths[sd.Position[0]][sd.Position[1]][sd.Position[2]] = ep;
      var ee = WD.path(pe).attr(_SVG.Params);
      if (typeof value !== 'undefined') {
        var point = ee.getPointAtLength(ee.getTotalLength() / 2); //get center of line;
        point.x -= _SVG.TextOffsetX / 2;
        point.y -= _SVG.TextOffsetY / 2;
        var text = _SVG._text(value, point.x, point.y, "AVal_" + name).attr(_SVG.FontParams);
        $(ee.node).data('Txt', text).data('Val', value);
      }
      return ee;
    },
    init: function () {
      Ls.init();
      var d = _M231._dim(), dots = WD.set(), x = _SVG;
      var draw_dots = function () {
        for (var i = 0; i < _M231.MaxVal; i++) {
          for (var j = 0; j < _M231.MaxVal; j++) {
            if (i + j > _M231.Xer1 * 2 - 2) { //we don't mark the dots outside the cardinal axis
              continue;
            }
            //we should take into consideration the interaction between circles with Ns higher that Xer1, and mark`em not with letters
            //if there are no correspondences between circles, just walk away
            var ip = _M231._interference_data(i, j);
            if ($.isEmptyObject(ip)) {
              continue;
            }
            var Row = (i < _M231.Xer1) ? i : (_M231.Xer1 - ((i + 2) - _M231.Xer1)), //+2 is collected from both _M231.Xer1-1
              Col = (j < _M231.Xer1) ? j : (_M231.Xer1 - ((j + 2) - _M231.Xer1));
            if (ip._P.B === -1) { ///if B and C are in base axis
              _M231.Object.Dots[i][j][0] = {
                Position: [i, j, 0], //circle numbers
                //                RVal: Ls._cycle_get(Row, true, Ls.Base.RVal),
                //                LVal: Ls._cycle_get(Col, false, Ls.Base.LVal),
                RVal: Ls._cycle_g(Row, Ls.Base.RVal),
                LVal: Ls._cycle_g(Col, Ls.Base.LVal),
                DotCoords: ip._P.M
              };
              _M231.Object.Base.push(_M231.Object.Dots[i][j][0]);
            } else {
              _M231.Object.Dots[i][j][1] = {
                Position: [i, j, 1], //circle numbers
                //                RVal: Ls._cycle_get(Row, true, Ls.Base.RVal),
                //                LVal: Ls._cycle_get(Col, false, Ls.Base.LVal),
                RVal: Ls._cycle_g(Row, Ls.Base.RVal),
                LVal: Ls._cycle_g(Col, Ls.Base.LVal),
                DotCoords: ip._P.B
              };
              _M231.Object.Dots[i][j][2] = {
                Position: [i, j, 2], //circle numbers
                //                RVal: Ls._cycle_get(Row, false, Ls.Base.RVal),
                //                LVal: Ls._cycle_get(Col, true, Ls.Base.LVal),
                RVal: Ls._cycle_g(_M231.Xer1 - 1 - Col, Ls.Base.RVal),
                LVal: Ls._cycle_g(_M231.Xer1 - 1 - Row, Ls.Base.LVal),
                DotCoords: ip._P.C
              };
              if (i === j) {
                _M231.Object.CardAx.push(_M231.Object.Dots[i][j][1]); //we store only the upper zone
              }
            }
            for (var k = 0; k < 3; k++) {
              var o = _M231.Object.Dots[i][j][k];
              if (o !== 0) {
                var dname = _M231._dname(i, j, k); //will permit waer
                var dc = o.DotCoords,
                  dot = x._dot(dc.x, dc.y, dname);
                o.Knot = dot;
                $(dot.node).data('Dot', o);
                dots.push(dot);
                _M231.Object.QDots += 1;
                _M231.Object.TotalLetters += o.LVal.length + o.RVal.length;
                if (k === 1) {
                  _M231.Object.I1Z1TL += o.LVal.length + o.RVal.length;
                  _M231.Object.I1Z1QD += 1;
                }
              }
            }
          }
        }
      };
      var find_relations = function () {
        var find_neighbours = function () {
          //revisit`em all to find neighbours
          for (var i = 0; i < _M231.MaxVal; i++) {
            for (var j = 0; j < _M231.MaxVal; j++) {
              for (var k = 0; k < 3; k++) {
                var d = _M231.Object.Dots[i][j][k];
                _M231.Object.Circles[0].Dots.push(d);
                _M231.Object.Circles[1].Dots.push(d);
                if (d !== 0) {//object must exist and be initialized
                  var i1, j1, k1;
                  if (k == 0) {
                    for (l = 1; l < 3; l++) { //run through upper and lower dots and connect them with base axis
                      i1 = i; j1 = j + 1; k1 = l;
                      _M231._make_pair(d, [i1, j1, k1]);
                      if (j > 0) {
                        i1 = i; j1 = j - 1; k1 = l;
                        _M231._make_pair(d, [i1, j1, k1]);
                      }
                      i1 = i + 1; j1 = j; k1 = l;
                      _M231._make_pair(d, [i1, j1, k1]);
                      if (i > 0) {
                        i1 = i - 1; j1 = j; k1 = l;
                        _M231._make_pair(d, [i1, j1, k1]);
                      }
                    } //end cycle .Position[2]
                    if (j > 0) {
                      i1 = i + 1; j1 = j - 1; k1 = k;
                      _M231._make_pair(d, [i1, j1, k1]);
                      i1 = i + 1; j1 = j + 1; k1 = k;
                      _M231._make_pair(d, [i1, j1, k1]);
                    }
                    if (i > 0) {//end if j > 0
                      i1 = i - 1; j1 = j + 1; k1 = k;
                      _M231._make_pair(d, [i1, j1, k1]);
                      i1 = i + 1; j1 = j + 1; k1 = k;
                      _M231._make_pair(d, [i1, j1, k1]);
                    } //end if i > 0
                  } else {//k != 0
                    i1 = i + 1; j1 = j; k1 = k;
                    _M231._make_pair(d, [i1, j1, k1]);
                    i1 = i; j1 = j + 1; k1 = k;
                    _M231._make_pair(d, [i1, j1, k1]);
                    //for the first ellipse we count only one (k===1) zone
                    if (_M231._dexists(
                      i1 >= _M231.Xer1 ? (i1 === _M231.MaxVal - 2 ? i : i + 1) : (i - 1),
                      i1 === _M231.MaxVal - 2 ? j - 1 : j,
                      0)
                      && k === 1) {
                      _M231.Object.FE.push(d);
                    }
                  }
                }
              }
            }
          }//end of revisiting to find neighbours
        };
        find_neighbours();
      };
      var draw_all_lines = function () {
        _.each(_M231.Object.Pairs, function (pair, key) {          //if (pair[0].substr(2)!=="0" && pair[1].substr(2)!=="0") {
          _M231.Object.Lines[key] = _M231._dots_connect(pair[0], pair[1]).toBack();          //}
        });
      };
      var draw_Qs = function () {
        _M231.Object.Q.Names = []; var qnumber = 0;
        for (var i = 0; i < _M231.MaxVal; i++) {
          for (var j = 0; j < _M231.MaxVal; j++) {
            for (var k = 0; k < 3; k++) {
              if (_M231._dexists(i, j, k)) {
                var d = _M231.Object.Dots[i][j][k], dn = _M231._dname(i, j, k), qn = Q._Name(d);
                if (qn === 0) {
                  continue;
                }
                qnumber++;
                _M231.Object.Q[qn] = {
                  Object: Q._Draw(d),
                  Dots: _M231.Object.Q[dn],
                  Number: qnumber
                };
                _M231.Object.Q[qn].Text = Q._Subscribe(d);
                _M231.Object.Q.Names.push(qn);
                Q._ColorizeQ_byG(d);
              }
            }
          }
        }

        var t = "Base: " + _M231.Xer1 + "\n" +
          "Quadrats #: " + _M231.Object.Q.Names.length + "\n" + "DSymbols #: " + _M231.Object.TotalLetters + "\n" +
          "I1QSymbols #: " + _M231.Object.I1Z1TL + "\n" + "I1QDots #: " + _M231.Object.I1Z1QD + "\n" + "QDots #: " + _M231.Object.QDots;
        _SVG._text(t, 150, 150);
      };
      (function () { //also just for beauty and code folding in Netbeans ))
        _SVG.CreateProperties();
        _SVG.SetParams();//        _SVG.DotValueToShow.DrawBase?draw_base():{};
        draw_dots();
        _SVG._change_text();
        find_relations();//        _SVG.DotValueToShow.DrawSimpleEllipses?draw_simple_ellipses():{};
        draw_all_lines();//        _SVG.DotValueToShow.I2Arcs?draw_i2():{};
        _SVG._redraw_lines();//        draw_all_triangles();
        draw_Qs();
        
        ////////////////////////////////////////////////////////
        /*      var draw_base = function () {
                var d = _M231._dim();
                var A1 = x._circle(d._1.x, d._1.y, 4, "A1").toBack(),
                    A2 = x._circle(d._2.x, d._2.y, 4, "A2").toBack();
                var col = tinycolor("purple");
                var cor = tinycolor("violet");
                col.setAlpha(.03); cor.setAlpha(.03);
                for (var i=0;i<_M231.Xer1;i++) { //writes circles of radius between Bet and Shin
                  _SVG.Params.fill = col.toHslString();
                  var c1 = x._circle(d._1.x, d._1.y, _M231.Mok1 * i, "C1_"+i).toBack();
                  _SVG.Params.fill = cor.toHslString();
                  var c2 = x._circle(d._2.x, d._2.y, _M231.Mok1 * i, "C2_"+i).toBack();
                }
                delete _SVG.Params.fill;
              };draw_base();
              var draw_i2 = function () {
                var d = _M231._dim();
                var j = _M231.Xer1-2, f = 0;
                for (var i=_M231.Xer1;i<Math.floor(_M231.Xer1*1.5)-1;i++) { //in case of odd base we should limit i to xer1/2+1 from one side
                  var r1 = _M231.Mok1 * i;
                  var c1 = x._circle(d._1.x, d._1.y, _M231.Mok1 * i, "I2C1_"+i).toBack();
                  var c2 = x._circle(d._2.x, d._2.y, _M231.Mok1 * i, "I2C2_"+i).toBack();
                  j--;
                }
              };draw_i2();*/
        ////////////////////////////////////////////////////////        
        
        ///////////////////////////////////////////////////////////////////
        //        for (d in _M231.Object.FE) {
        //          _M231.Object.FE[d].Knot.attr({fill: "grey"});
        //        }

        ///////////////////////////////////////////////////////////////////
      })();
    }
  };

  var work = function () {
    Ls.DebugVersion = false;
    Ls.Start = 0;
    Ls.Length = 6;
    _SVG.init();

  };

  (function () {
    (function () {
      if (typeof ({}.__defineGetter__) != "function" && typeof (Object.defineProperty) != "function")
        alert("Your browser doesn't support latest JavaScript version.");
    })();
    //$("#wedro").height($(document).height()-90).width($(document).width()-90);
    var w = $(document).width() * 5, h = $(document).height() * 5;
    $("#wedro").height(h).width(w);//.css({height: '100%', width: '100%'});
    WD = new Raphael("wedro", w, h);
    WD.setViewBox(0, 0, w, h, true);
    // http://jsfiddle.net/mklement/7rpmH/
    //WD.canvas.setAttribute('preserveAspectRatio', 'none'); // always scale to fill container, without preserving aspect ratio.
    work();
  })();

});