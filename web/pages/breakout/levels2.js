Breakout.Colors = {

    arkanoid: {
        w: "#FCFCFC", // white
        o: "#FC7460", // orange
        l: "#3CBCFC", // light blue
        g: "#80D010", // green
        r: "#D82800", // red
        b: "#0070EC", // blue
        p: "#FC74B4", // pink
        y: "#FC9838", // yellow
        s: "#BCBCBC", // silver
        d: "#F0BC3C"  // gold
    },

    pastel: {
        y: "#FFF7A5", // yellow
        p: "#FFA5E0", // pink
        b: "#A5B3FF", // blue
        g: "#BFFFA5", // green
        o: "#FFCBA5"  // orange
    },

    vintage: {
        a: "#EFD279", // yellow
        b: "#95CBE9", // light blue
        c: "#024769", // dark blue
        d: "#AFD775", // light green
        e: "#2C5700", // grass
        f: "#DE9D7F", // red
        g: "#7F9DDE", // purple
        h: "#00572C", // dark green
        i: "#75D7AF", // mint
        j: "#694702", // brown
        k: "#E9CB95", // peach
        l: "#79D2EF"  // blue
    },

    liquidplanner: {
        a: '#62C4E7', // light blue
        b: '#00A5DE', // dark  blue
        x: '#969699', // light gray
        y: '#7B797E'  // dark  gray
    },


};

Breakout.Levels = [

    { colors: Breakout.Colors.pastel,
      bricks: [
          "", "", "",
          "yyyyyYYYYYyyyyy",
          "pppppPPPPPppppp",
          "bbbbbBBBBBbbbbb",
          "gggggGGGGGggggg",
          "oooooOOOOOooooo"
      ]
    },

    { colors: Breakout.Colors.arkanoid,
      bricks: [
          "   yy     yy   ",
          "     yy yy     ",
          "   ssSSsSSss   ",
          " SSsswwswwssSS ",
          "sSSssSSsSSssSSs",
          "s  ssSSsSSss  s",
          "s  ss     ss  s",
          "s  ss     ss  s",
          "     ss ss     ",
          "     ss ss     "
      ]
    },

    { colors: Breakout.Colors.arkanoid,
      bricks: [
          "",
          "oo             ",
          "ooll           ",
          "oollgg         ",
          "oollggbb       ",
          "oollggbbrr     ",
          "oollggbbrroo   ",
          "oollggbbrrooll "
      ]
    },

    { colors: Breakout.Colors.arkanoid,
      bricks: [
          "", "",
          "      sss      ",
          "   bbBBsggGG   ",
          " BBbbWWwWWGGgg ",
          "bBBwwWWwWWwwggG",
          "bBBwwWWwWWwwggG",
          "s  ss  s  ss  s",
          "       s       ",
          "   oo  o       ",
          "   ooOOo       ",
          "     OO        "
      ]
    }/*,

    { colors: {
        r: '#D80000', // red
        b: '#706800', // brown
        o: '#F8AB00', // orange
        f: '#F83800', // fire
        w: '#FFFFFF', // white
        e: '#FFE0A8'  // beige
    },

      bricks: [
          "",
          "    rRrRr                     ",
          "   RrRrRrRrR                  ",
          "   BbBoObo                    ",
          "  boboOoboOo       F    f   f ",
          "  bobBoOoboOo     f e         ",
          "  bBoOoObBbB       F  f     e ",
          "    oOoOoOo        Ff      E  ",
          "   bBrbBb        E  f fF F  f ",
          "  bBbrbBrbBb       FfFfFf  F  ",
          " bBbBrRrRbBbB     fFeFeFfFf   ",
          " oObrorRorboO    FfEeEeEfF    ",
          " oOorRrRrRoOo    FeEeWwEeFf   ",
          " oOrRrRrRrRoO   fFeFwWfEeFf   ",
          "   rRr  RrR     fFeFwWfEeFf   ",
          "  bBb    bBb    fFeEwWeEeFf   ",
          " bBbB    bBbB   fFfEeEeEfF    ",
          "                 FfFfFfFfF    ",
          "                   FfFfF      "
      ]
    },
    { colors: Breakout.Colors.pastel,
      bricks: [
          "yyyyyYYYYYyyyyyYYYYYyyyyyYYYYY",
          "pppppPPPPPpppppPPPPPpppppPPPPP",
          "bbbbbBBBBBbbbbbBBBBBbbbbbBBBBB",
          "gggggGGGGGgggggGGGGGgggggGGGGG",
          "oooooOOOOOoooooOOOOOoooooOOOOO",
          "yyyyyYYYYYyyyyyYYYYYyyyyyYYYYY",
          "pppppPPPPPpppppPPPPPpppppPPPPP",
          "bbbbbBBBBBbbbbbBBBBBbbbbbBBBBB",
          "gggggGGGGGgggggGGGGGgggggGGGGG",
          "oooooOOOOOoooooOOOOOoooooOOOOO",
          "yyyyyYYYYYyyyyyYYYYYyyyyyYYYYY",
          "pppppPPPPPpppppPPPPPpppppPPPPP",
          "bbbbbBBBBBbbbbbBBBBBbbbbbBBBBB",
          "gggggGGGGGgggggGGGGGgggggGGGGG",
          "oooooOOOOOoooooOOOOOoooooOOOOO",
          "yyyyyYYYYYyyyyyYYYYYyyyyyYYYYY",
          "pppppPPPPPpppppPPPPPpppppPPPPP",
          "bbbbbBBBBBbbbbbBBBBBbbbbbBBBBB",
          "gggggGGGGGgggggGGGGGgggggGGGGG",
          "oooooOOOOOoooooOOOOOoooooOOOOO",
          "yyyyyYYYYYyyyyyYYYYYyyyyyYYYYY",
          "pppppPPPPPpppppPPPPPpppppPPPPP",
          "bbbbbBBBBBbbbbbBBBBBbbbbbBBBBB"
      ]
    }, 
    { colors: Breakout.Colors.pastel,
      bricks: [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "", "","", "y"
      ]
    },*/



];
/*function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLabcdefghijkl";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    var space = 0;
    var text2 = "";
    for( var i=0; i < 15; i++){
        if(Math.random() > .8 && space < 5){
            space++;
            text2 += " ";
        }
        else{
            text2 += text.charAt(i-space);
	}
    }
    return text2;
};

function makeLevel()
{
   var lvl = {colors:{
        a: "#EFD279", // yellow
        b: "#95CBE9", // light blue
        c: "#024769", // dark blue
        d: "#AFD775", // light green
        e: "#2C5700", // grass
        f: "#DE9D7F", // red
        g: "#7F9DDE", // purple
        h: "#00572C", // dark green
        i: "#75D7AF", // mint
        j: "#694702", // brown
        k: "#E9CB95", // peach
        l: "#79D2EF"  // blue
    },
    bricks: new Array(),
   };
   
   for(var i = 0; i<10; i++)
      if(Math.random() > 0.2)
          lvl.bricks[i] = makeid();
      else
          lvl.bricks[i] = "";

   return lvl;
};
Breakout.Levels = new Array(15);
for(var i =0; i<15; i++)
    Breakout.Levels[i] = makeLevel();
*/