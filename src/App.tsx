import React, { useState, useCallback, useRef, useEffect, useMemo, createContext, useContext } from "react";

// ═══════════════════════════════════════════════════════════════════
// SEASONS  —  each ante maps to a season
// Candy type indices 0–6 map to the candies array in order.
// The 7th candy (index 6) is only active in the finale (7-color).
// ═══════════════════════════════════════════════════════════════════
const SEASONS = {
  spring: {
    label:"Spring", motif:"✿",
    chapter:"Meadow",
    candies:[
      {id:"rose",   name:"Cherry Blossom", base:"#f0b8c4", deep:"#c98292", light:"#fbd9e1"},
      {id:"sage",   name:"New Sage",       base:"#b8d6a4", deep:"#85a86a", light:"#d8ebcb"},
      {id:"lav",    name:"Wisteria",       base:"#c2b1dd", deep:"#8d7ab3", light:"#dfd1ed"},
      {id:"butter", name:"Daffodil",       base:"#f6dd86", deep:"#cdb054", light:"#faeab2"},
      {id:"sky",    name:"Robin's Egg",    base:"#a4d2da", deep:"#6fa0aa", light:"#cde6eb"},
      {id:"peach",  name:"Apricot",        base:"#f4c098", deep:"#cd8e63", light:"#f9d7be"},
      {id:"fox",    name:"Foxglove",       base:"#c890c4", deep:"#9a5e9e", light:"#e4b8e8"},
    ],
    chrome:{
      pageWash:`radial-gradient(ellipse at 15% 10%,#fbe4ec 0%,transparent 45%),radial-gradient(ellipse at 90% 25%,#e8def0 0%,transparent 50%),radial-gradient(ellipse at 70% 90%,#dcecd2 0%,transparent 55%),radial-gradient(ellipse at 10% 80%,#f7eeba 0%,transparent 50%),linear-gradient(180deg,#fbf2e6 0%,#f1e6ce 100%)`,
      boardTop:"#fcf8ee", boardBot:"#f5ebd6",
      frame:"#dac9aa", innerHi:"#ffffffaa", innerSh:"#d9c9ad55",
      ink:"#5a4a3a", inkSoft:"#8a7a64",
      dotColor:"#c9879b", dotsOpacity:0.18,
      accent:"#c9879b",
      progressFill:"linear-gradient(90deg,#f4c098 0%,#f0b8c4 50%,#c2b1dd 100%)",
      progressTrack:"#ece0c8", progressBorder:"#d9c9ad",
      pillBg:"#fcf8ee", pillBorder:"#dac9aa",
      starFill:"#f6dd86", starStroke:"#cdb054",
    },
    relicTints:["#f6dd86","#f4c098","#f0b8c4","#a4d2da"],
  },

  summer: {
    label:"Summer", motif:"☀",
    chapter:"Orchard",
    candies:[
      {id:"rose",   name:"Watermelon",  base:"#ec8a90", deep:"#b85258", light:"#f5b9bd"},
      {id:"sage",   name:"Meadow",      base:"#9bc77e", deep:"#6a994f", light:"#c2dfae"},
      {id:"lav",    name:"Hydrangea",   base:"#a6b4e6", deep:"#7282be", light:"#cbd4ef"},
      {id:"butter", name:"Sunflower",   base:"#f3c84f", deep:"#c89a25", light:"#f8dc8c"},
      {id:"sky",    name:"Pool",        base:"#7ec5e4", deep:"#4a93b8", light:"#abdcef"},
      {id:"peach",  name:"Sunset",      base:"#f3a26e", deep:"#c97338", light:"#f8c6a0"},
      {id:"teal",   name:"Turquoise",   base:"#68bab0", deep:"#3e8878", light:"#96d2c8"},
    ],
    chrome:{
      pageWash:`radial-gradient(ellipse at 18% 8%,#ffd8a8 0%,transparent 45%),radial-gradient(ellipse at 88% 30%,#c0e0f0 0%,transparent 50%),radial-gradient(ellipse at 70% 90%,#d8edb8 0%,transparent 55%),radial-gradient(ellipse at 10% 82%,#f7d885 0%,transparent 50%),linear-gradient(180deg,#fcf0d2 0%,#f0deb0 100%)`,
      boardTop:"#fff7e2", boardBot:"#f5e6c0",
      frame:"#d4b777", innerHi:"#ffffffbb", innerSh:"#d4b77744",
      ink:"#5a3a1a", inkSoft:"#876a3e",
      dotColor:"#e57b3a", dotsOpacity:0.16,
      accent:"#e57b3a",
      progressFill:"linear-gradient(90deg,#f3a26e 0%,#f3c84f 50%,#7ec5e4 100%)",
      progressTrack:"#eed9a6", progressBorder:"#d4b777",
      pillBg:"#fff7e2", pillBorder:"#d4b777",
      starFill:"#f3c84f", starStroke:"#c89a25",
    },
    relicTints:["#f3c84f","#f3a26e","#ec8a90","#7ec5e4"],
  },

  fall: {
    label:"Autumn", motif:"🍂",
    chapter:"Harvest",
    candies:[
      {id:"rose",   name:"Crabapple",   base:"#c83848", deep:"#882030", light:"#e49090"},
      {id:"sage",   name:"Lichen",      base:"#86a248", deep:"#567030", light:"#b4c880"},
      {id:"lav",    name:"Heather",     base:"#9060b0", deep:"#603880", light:"#c098d4"},
      {id:"butter", name:"Pumpkin",     base:"#d88828", deep:"#9c5a08", light:"#eab870"},
      {id:"sky",    name:"Slate Rain",  base:"#4888a8", deep:"#306080", light:"#88bcd4"},
      {id:"peach",  name:"Goldenrod",   base:"#c0b010", deep:"#887808", light:"#dcd060"},
      {id:"plum",   name:"Elderberry",  base:"#6830a8", deep:"#441878", light:"#a070cc"},
    ],
    chrome:{
      pageWash:`radial-gradient(ellipse at 18% 10%,#f0c294 0%,transparent 50%),radial-gradient(ellipse at 90% 28%,#d8b894 0%,transparent 50%),radial-gradient(ellipse at 72% 88%,#c89870 0%,transparent 55%),radial-gradient(ellipse at 8% 80%,#e6a070 0%,transparent 50%),linear-gradient(180deg,#f1dfba 0%,#d8b88a 100%)`,
      boardTop:"#f7eacc", boardBot:"#e8d2a4",
      frame:"#a8814a", innerHi:"#ffffff88", innerSh:"#a8814a55",
      ink:"#3e2814", inkSoft:"#7a5832",
      dotColor:"#a04a18", dotsOpacity:0.18,
      accent:"#a04a18",
      progressFill:"linear-gradient(90deg,#c83848 0%,#d88828 50%,#86a248 100%)",
      progressTrack:"#dcc28a", progressBorder:"#a8814a",
      pillBg:"#f7eacc", pillBorder:"#a8814a",
      starFill:"#d88828", starStroke:"#9c5a08",
    },
    relicTints:["#d88828","#c83848","#9060b0","#4888a8"],
  },

  winter: {
    label:"Winter", motif:"❄",
    chapter:"Hollow",
    candies:[
      {id:"rose",   name:"Frostberry",  base:"#c89098", deep:"#886068", light:"#e4b8c0"},
      {id:"sage",   name:"Pine",        base:"#6a9880", deep:"#3e6858", light:"#9ac4a8"},
      {id:"lav",    name:"Ice Iris",    base:"#8888cc", deep:"#5050a0", light:"#b8b8e4"},
      {id:"butter", name:"Candlelight", base:"#d4c068", deep:"#9a8830", light:"#e8d898"},
      {id:"sky",    name:"Glacier",     base:"#68a8c4", deep:"#3e7890", light:"#9ccce0"},
      {id:"peach",  name:"Spiced Pear", base:"#c87860", deep:"#906040", light:"#e4a888"},
      {id:"moon",   name:"Moonstone",   base:"#b89040", deep:"#7a6020", light:"#d8b870"},
    ],
    chrome:{
      pageWash:`radial-gradient(ellipse at 14% 8%,#e0e8f0 0%,transparent 50%),radial-gradient(ellipse at 90% 28%,#d4dde8 0%,transparent 55%),radial-gradient(ellipse at 70% 92%,#c8d6dc 0%,transparent 55%),radial-gradient(ellipse at 8% 80%,#dde2e8 0%,transparent 50%),linear-gradient(180deg,#ecf0f5 0%,#d4dce4 100%)`,
      boardTop:"#f5f7fa", boardBot:"#dfe5ec",
      frame:"#b6c0cc", innerHi:"#ffffffcc", innerSh:"#b6c0cc55",
      ink:"#324554", inkSoft:"#6a7a8a",
      dotColor:"#7892a8", dotsOpacity:0.14,
      accent:"#7892a8",
      progressFill:"linear-gradient(90deg,#c89098 0%,#8888cc 50%,#68a8c4 100%)",
      progressTrack:"#dde4ec", progressBorder:"#b6c0cc",
      pillBg:"#f5f7fa", pillBorder:"#b6c0cc",
      starFill:"#d4c068", starStroke:"#9a8830",
    },
    relicTints:["#d4c068","#c89098","#8888cc","#68a8c4"],
  },
};

// Season helpers
const getSeason  = ante => (['spring','summer','fall','winter'][ante-1] ?? 'spring');
const getCandy   = (typeIndex, season) => SEASONS[season].candies[typeIndex] ?? SEASONS[season].candies[0];
const getCh      = season => SEASONS[season].chrome;

// ═══════════════════════════════════════════════════════════════════
// SPECIAL REGISTRY
// ═══════════════════════════════════════════════════════════════════
const SPECIAL = { NONE:"none", STRIPED_H:"striped_h", STRIPED_V:"striped_v", WRAPPED:"wrapped", COLOR_BOMB:"color_bomb" };
// Font family constants — avoids mixed quote nesting inside JSX props
const FF_SERIF = "Fraunces,Georgia,serif";
const FF_SANS  = "Nunito,Trebuchet MS,sans-serif";

const ROWS = 8, COLS = 8;

const SPECIAL_REGISTRY = {
  [SPECIAL.STRIPED_H]:{
    activate(grid,r){const c2=[];for(let c=0;c<COLS;c++)if(grid[r][c])c2.push(`${r},${c}`);return c2;},
  },
  [SPECIAL.STRIPED_V]:{
    activate(grid,_r,c){const c2=[];for(let r=0;r<ROWS;r++)if(grid[r][c])c2.push(`${r},${c}`);return c2;},
  },
  [SPECIAL.WRAPPED]:{
    activate(grid,r,c,_t,radius=1){
      const c2=[];
      for(let dr=-radius;dr<=radius;dr++)for(let dc=-radius;dc<=radius;dc++){
        const nr=r+dr,nc=c+dc;
        if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&grid[nr][nc])c2.push(`${nr},${nc}`);
      }
      return c2;
    },
  },
  [SPECIAL.COLOR_BOMB]:{
    activate(grid,_r,_c,targetType){const c2=[];for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(grid[r][c]?.type===targetType)c2.push(`${r},${c}`);return c2;},
  },
};

// ═══════════════════════════════════════════════════════════════════
// LEVEL DEFINITIONS
// ═══════════════════════════════════════════════════════════════════
const LEVEL_DEFS = [
  {level:1,  ante:1, colors:4, type:"standard", objective:{type:"score",  target:2500}},
  {level:2,  ante:1, colors:4, type:"standard", objective:{type:"score",  target:3000}},
  {level:3,  ante:1, colors:4, type:"boss",     objective:{type:"score",  target:3800}, modifier:"color_lock"},
  {level:4,  ante:2, colors:5, type:"standard", objective:{type:"quota",  target:20  }},
  {level:5,  ante:2, colors:5, type:"standard", objective:{type:"score",  target:2200}},
  {level:6,  ante:2, colors:5, type:"boss",     objective:{type:"score",  target:2800}, modifier:"creeping_frost"},
  {level:7,  ante:3, colors:6, type:"standard", objective:{type:"score",  target:1700}},
  {level:8,  ante:3, colors:6, type:"standard", objective:{type:"cascade",target:3  }},
  {level:9,  ante:3, colors:6, type:"boss",     objective:{type:"score",  target:2200}, modifier:"weighted_board"},
  {level:10, ante:4, colors:7, type:"finale",   objective:{type:"score",  target:1400}, modifier:"creeping_frost"},
];

const MODIFIER_INFO = {
  color_lock:     {label:"Colour Lock",    desc:"One colour locked for first 10 moves.", icon:"🔒"},
  creeping_frost: {label:"Creeping Frost", desc:"A new frosted tile every 5 moves.",     icon:"❄️"},
  weighted_board: {label:"Weighted Board", desc:"One colour spawns twice as often.",      icon:"⚖️"},
};

const ANTE_LABELS = {1:"Ante I",2:"Ante II",3:"Ante III",4:"Finale"};

// ═══════════════════════════════════════════════════════════════════
// OBSTACLE CONSTANTS  (v2.2 — Jelly and Chocolate retired)
// frosted:2 = frozen (blocks matching, cracks on adjacent match)
// frosted:1 = cracked (can be matched; clears on match)
// stone:true = immovable barrier, special-clearable only
// locked:true = matchable in-place but not swappable
// ═══════════════════════════════════════════════════════════════════
const OBS={FROSTED:"frosted",STONE:"stone",LOCKED:"locked"};

// Base obstacle counts per level — placement is now exposure-based (see placeObstacles).
// Jelly and Chocolate retired per design principles (nuisance paradigm).
const LEVEL_OBSTACLE_CONFIGS=[
  {},                                 // L1  — no obstacles
  {},                                 // L2  — no obstacles
  {frosted:4},                        // L3  boss — 4c, exposure band 40-60%
  {frosted:3, stone:1},               // L4  — introducing stone
  {frosted:4, stone:2},               // L5
  {stone:4, frosted:2},               // L6  boss — stone-heavy; colour count doing difficulty work
  {stone:3, frosted:4},               // L7
  {stone:3, frosted:4},               // L8
  {stone:4, frosted:4},               // L9  boss
  {stone:4, frosted:4, locked:2},     // L10 finale
];

// ═══════════════════════════════════════════════════════════════════
// BOON POOL  — one-level items  (b6 Jelly Feast retired with Jelly)
// ═══════════════════════════════════════════════════════════════════
const BOON_POOL=[
  {id:"b1",name:"Head Start",   icon:"✨",type:"boon",effect:"Begin next level with 2 random specials pre-placed on the board."},
  {id:"b2",name:"Extra Time",   icon:"🕰️",type:"boon",effect:"Next level: +5 bonus moves."},
  {id:"b3",name:"Colour Focus", icon:"🎨",type:"boon",effect:"Next level: one fewer colour on the board."},
  {id:"b4",name:"Bomb Drop",    icon:"💣",type:"boon",effect:"Next level: begin with a colour bomb pre-placed in the centre."},
  {id:"b5",name:"Frost Thaw",   icon:"🌤️",type:"boon",effect:"Next level: all frosted tiles begin pre-cracked (one hit to clear)."},
  {id:"b7",name:"Swept Clean",  icon:"🧹",type:"boon",effect:"Next level: no obstacles placed on the board."},
];

// ═══════════════════════════════════════════════════════════════════
// RELIC POOL  — candy-specific relics updated for new type indices:
//   type 0 = rose, type 3 = butter (was lemon)
// ═══════════════════════════════════════════════════════════════════
const RELIC_CATEGORIES = {
  cascade:    {label:"Cascade",    color:"#FF9500"},
  special:    {label:"Special",    color:"#BF5AF2"},
  color:      {label:"Colour",     color:"#FF2D55"},
  economy:    {label:"Economy",    color:"#c89a25"},
  positional: {label:"Positional", color:"#6a994f"},
  sequential: {label:"Sequential", color:"#4a93b8"},
  obstacle:   {label:"Obstacle",   color:"#8a7464"},
};

const RELIC_POOL = [
  // Cascade
  {id:"c1",name:"Chain Spark",    cat:"cascade",    rar:"common",   icon:"⚡", effect:"Cascade step 2+: cells score ×1.5."},
  {id:"c2",name:"Combo Rush",     cat:"cascade",    rar:"common",   icon:"🔥", effect:"Reaching a 3-step combo: +150 bonus score."},
  {id:"c3",name:"Momentum",       cat:"cascade",    rar:"uncommon", icon:"💨", effect:"Cascade step 3+: cells score ×2."},
  {id:"c4",name:"Avalanche",      cat:"cascade",    rar:"rare",     icon:"🏔️", effect:"First cascade of each level: score ×3."},
  // Special
  {id:"s1",name:"Power Stripe",   cat:"special",    rar:"common",   icon:"↔️", effect:"Striped candy clears an extra adjacent row or column."},
  {id:"s2",name:"Blast Radius",   cat:"special",    rar:"common",   icon:"💥", effect:"Wrapped candy burst expands to 5×5."},
  {id:"s3",name:"Lucky 4",        cat:"special",    rar:"uncommon", icon:"🍀", effect:"Match-4 striped: 30% chance to upgrade to wrapped."},
  {id:"s4",name:"Grand Finale",   cat:"special",    rar:"rare",     icon:"🎆", effect:"Activating a colour bomb also fires the nearest other special."},
  // Colour
  {id:"col1",name:"Rosepetal",    cat:"color",      rar:"common",   icon:"🌸", effect:"Each rose cleared scores +8 bonus."},
  {id:"col2",name:"Blossom Chain",cat:"color",      rar:"uncommon", icon:"🌺", effect:"Match-4+ rose run: spawn a striped rose nearby."},
  {id:"col3",name:"Butter Glaze", cat:"color",      rar:"common",   icon:"🧈", effect:"Each butter cleared: one extra butter added to the top refill."},
  {id:"col4",name:"Petal Merge",  cat:"color",      rar:"uncommon", icon:"👁️", effect:"Rose and sage count as the same colour for matching."},
  // Economy
  {id:"e1",name:"Thrifty",        cat:"economy",    rar:"common",   icon:"🎀", effect:"End level with 5+ moves remaining: guaranteed bonus draft pick."},
  {id:"e2",name:"Surplus",        cat:"economy",    rar:"common",   icon:"📦", effect:"Clear target at 120%+: next draft shows 4 options."},
  {id:"e3",name:"Efficiency",     cat:"economy",    rar:"uncommon", icon:"⚙️", effect:"Every 3 cascade steps in a level: +100 bonus score."},
  {id:"e4",name:"Leftovers",      cat:"economy",    rar:"rare",     icon:"🫙", effect:"Unused moves at level end each convert to +200 score."},
  // Positional
  {id:"p1",name:"Foundation",     cat:"positional", rar:"common",   icon:"🌱", effect:"Cells cleared in the bottom 2 rows score +5 each."},
  {id:"p2",name:"Cornerstone",    cat:"positional", rar:"uncommon", icon:"🍄", effect:"Clearing a corner cell triggers a free 2×2 burst around it."},
  {id:"p3",name:"Deep Roots",     cat:"positional", rar:"common",   icon:"🌿", effect:"Each vertical match run: +60 bonus score."},
  {id:"p4",name:"Heart of the Glade",cat:"positional",rar:"rare",   icon:"🌻", effect:"Clearing any centre 4×4 cell: spawn a wrapped on the nearest edge."},
  // Sequential
  {id:"q1",name:"Hot Streak",     cat:"sequential", rar:"common",   icon:"🕯️", effect:"3 consecutive cascade-triggering moves: next move scores ×2."},
  {id:"q2",name:"Rhythm",         cat:"sequential", rar:"common",   icon:"🎶", effect:"Match 4 different colours in a row: spawn a striped candy."},
  {id:"q3",name:"Focus",          cat:"sequential", rar:"uncommon", icon:"🔍", effect:"Every 5 completed moves: +200 bonus score."},
  {id:"q4",name:"Flow State",     cat:"sequential", rar:"rare",     icon:"🌊", effect:"5 consecutive cascade-triggering moves: spawn a colour bomb."},
  // Obstacle relics — active (o2 Choc Converter, o4 Jelly Bonus retired with obstacles)
  {id:"o1",name:"Frost Breaker",  cat:"obstacle", rar:"common",   icon:"🧊", effect:"Clearing a frosted tile: spawn a striped candy directly above it."},
  {id:"o3",name:"Stone Splitter", cat:"obstacle", rar:"uncommon", icon:"🪨", effect:"Wrapped explosions also permanently remove adjacent stone tiles."},
];

const RARITY_STYLE = {
  common:   {label:"Common",   color:"#9a8a74",  glow:"none"},
  uncommon: {label:"Uncommon", color:"#4a93b8",  glow:`0 0 8px rgba(74,147,184,0.4)`},
  rare:     {label:"Rare",     color:"#c89a25",  glow:`0 0 10px rgba(200,154,37,0.5)`},
};

// ═══════════════════════════════════════════════════════════════════
// RELIC CONTEXT
// ═══════════════════════════════════════════════════════════════════
function buildRelicContext(relics) {
  const ids = new Set(relics.map(r => r.id));
  const has = id => ids.has(id);
  let avalancheDone=false, levelCascadeSteps=0;
  let q1Streak=0, q4Streak=0, hotStreakReady=false;
  let moveColors=[], moveCount=0;

  return {
    resetLevel() { avalancheDone=false;levelCascadeSteps=0;q1Streak=0;q4Streak=0;hotStreakReady=false;moveColors=[];moveCount=0; },
    getTypeNorm() { if(!has("col4"))return null; return t=>(t===1?0:t); },
    hasPowerStripe() { return has("s1"); },
    getWrappedRadius() { return has("s2")?2:1; },
    hasGrandFinale() { return has("s4"); },

    modifyStepScore(baseGain, stepIdx, matched, runs, gridBeforeClear, obstacleClears={}) {
      let gain=baseGain; const events=[];
      if(has("c4")&&stepIdx===0&&!avalancheDone){gain=Math.round(gain*3);avalancheDone=true;events.push("🏔️ Avalanche ×3");}
      if(hotStreakReady&&stepIdx===0){gain=Math.round(gain*2);hotStreakReady=false;events.push("🕯️ Hot Streak ×2");}
      if(has("c1")&&stepIdx>=1)gain=Math.round(gain*1.5);
      if(has("c3")&&stepIdx>=2){gain=Math.round(gain*2);events.push("💨 Momentum ×2");}
      let bonus=0;
      if(has("c2")&&stepIdx===2){bonus+=150;events.push("🔥 Combo Rush +150");}
      if(has("p1")){let n=0;matched.forEach(k=>{const[r]=k.split(",").map(Number);if(r>=ROWS-2)n++;});bonus+=n*5;}
      if(has("p3")){const v=runs.filter(r=>r.dir==="v").length;bonus+=v*60;}
      // col1: rose = type 0
      if(has("col1")){let n=0;matched.forEach(k=>{const[r,c]=k.split(",").map(Number);if(gridBeforeClear[r]?.[c]?.type===0)n++;});bonus+=n*8;}
      levelCascadeSteps++;
      if(has("e3")&&levelCascadeSteps%3===0){bonus+=100;events.push("⚙️ Efficiency +100");}
      // o4 Jelly Bonus
      if(has("o4")&&obstacleClears.jelly>0){
        const mult=obstacleClears.jellyFeast?3:1;
        const jb=obstacleClears.jelly*80*mult;bonus+=jb;events.push(`🟣 Jelly Bonus +${jb}`);
      }
      return {adjustedGain:gain+bonus,events};
    },

    postCascadeMutations(allRuns, allMatched, currentGrid) {
      const spawns=[],extraClr=[],events=[];
      if(has("p2")){
        [[0,0],[0,COLS-1],[ROWS-1,0],[ROWS-1,COLS-1]].forEach(([cr,cc])=>{
          if(!allMatched.has(`${cr},${cc}`))return;
          events.push("🍄 Cornerstone!");
          const rDir=cr===0?1:-1,cDir=cc===0?1:-1;
          [[0,0],[0,1],[1,0],[1,1]].forEach(([dr,dc])=>{
            const nr=cr+dr*rDir,nc=cc+dc*cDir;
            if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&currentGrid[nr][nc])extraClr.push({r:nr,c:nc});
          });
        });
      }
      if(has("p4")){
        const cc2=[...allMatched].filter(k=>{const[r,c]=k.split(",").map(Number);return r>=2&&r<=5&&c>=2&&c<=5;});
        if(cc2.length>0){
          const edgeCells=[];
          for(let c=0;c<COLS;c++){if(currentGrid[0][c])edgeCells.push([0,c]);if(currentGrid[ROWS-1][c])edgeCells.push([ROWS-1,c]);}
          for(let r=1;r<ROWS-1;r++){if(currentGrid[r][0])edgeCells.push([r,0]);if(currentGrid[r][COLS-1])edgeCells.push([r,COLS-1]);}
          if(edgeCells.length>0){
            const[sr,sc]=cc2[0].split(",").map(Number);
            edgeCells.sort(([ar,ac],[br,bc])=>(Math.abs(ar-sr)+Math.abs(ac-sc))-(Math.abs(br-sr)+Math.abs(bc-sc)));
            const[er,ec]=edgeCells[0];
            spawns.push({r:er,c:ec,type:currentGrid[er][ec].type,special:SPECIAL.WRAPPED});
            events.push("🌻 Glade Bloom!");
          }
        }
      }
      if(has("col2")){
        const bigRose=allRuns.find(run=>run.cells.length>=4&&run.normType===0);
        if(bigRose){
          const[mr,mc]=bigRose.cells[Math.floor(bigRose.cells.length/2)];
          const cands=[[mr-1,mc],[mr+1,mc],[mr,mc-1],[mr,mc+1]];
          const tgt=cands.find(([r,c])=>r>=0&&r<ROWS&&c>=0&&c<COLS&&currentGrid[r]?.[c]&&currentGrid[r][c].special===SPECIAL.NONE);
          if(tgt){spawns.push({r:tgt[0],c:tgt[1],type:0,special:SPECIAL.STRIPED_H});events.push("🌺 Blossom Chain!");}
        }
      }
      return {spawns,extraClr,events};
    },

    onMoveEnd(hadCascade, primaryColor) {
      moveCount++; const spawns=[],events=[]; let bonusScore=0;
      if(has("q3")&&moveCount%5===0){bonusScore+=200;events.push("🔍 Focus +200");}
      if(hadCascade){
        q1Streak++;q4Streak++;
        if(has("q1")&&q1Streak>=3){hotStreakReady=true;q1Streak=0;events.push("🕯️ Hot Streak armed!");}
        if(has("q4")&&q4Streak>=5){
          const cands=[];for(let r=0;r<3;r++)for(let c=0;c<COLS;c++)cands.push([r,c]);
          cands.sort(()=>Math.random()-0.5);
          if(cands.length){const[r,c]=cands[0];spawns.push({r,c,type:Math.floor(Math.random()*6),special:SPECIAL.COLOR_BOMB});}
          q4Streak=0;events.push("🌊 Flow State! Colour bomb spawned.");
        }
      } else {q1Streak=0;q4Streak=0;}
      if(primaryColor!==undefined){
        moveColors=[...moveColors,primaryColor].slice(-4);
        if(has("q2")&&moveColors.length===4){
          const[a,b,c,d]=moveColors;
          if(a!==b&&b!==c&&c!==d&&a!==c&&a!==d&&b!==d){
            spawns.push({r:Math.floor(ROWS/2),c:Math.floor(COLS/2),type:primaryColor,special:SPECIAL.STRIPED_H});
            moveColors=[];events.push("🎶 Rhythm! Striped spawned.");
          }
        }
      }
      return {spawns,bonusScore,events};
    },

    onLevelEnd(movesRemaining) {
      let bonus=0;const events=[];
      if(has("e4")&&movesRemaining>0){bonus=movesRemaining*200;events.push(`🫙 Leftovers: ${movesRemaining} moves → +${bonus}`);}
      return {bonus,events};
    },

    hasThrifty()  { return has("e1"); },
    hasSurplus()  { return has("e2"); },
    hasPowerStripe() { return has("s1"); },
    getWrappedRadius() { return has("s2") ? 2 : 1; },
    hasGrandFinale() { return has("s4"); },
    hasStoneSplitter() { return has("o3"); },

    // o1 Frost Breaker — spawn striped above each cleared frosted cell
    onFrostedCleared(positions, currentGrid) {
      if(!has("o1")) return [];
      return positions.map(([r,c]) => {
        const ar = r - 1;
        if(ar < 0 || !currentGrid[ar]?.[c] || currentGrid[ar][c].stone || currentGrid[ar][c].chocolate) return null;
        return {r:ar, c, type:currentGrid[ar][c].type, special:SPECIAL.STRIPED_H};
      }).filter(Boolean);
    },

    // o2 Choc Converter — return rarest colour index on board
    getChocoConverterColor(grid) {
      if(!has("o2")) return null;
      const counts = new Array(7).fill(0);
      for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) { const t=grid[r]?.[c]?.type; if(t!=null) counts[t]++; }
      let rarest=0, minC=Infinity;
      counts.forEach((n,i) => { if(n>0 && n<minC) { minC=n; rarest=i; } });
      return rarest;
    },
  };
}

// ═══════════════════════════════════════════════════════════════════
// SEEDED RNG  +  DRAFT
// ═══════════════════════════════════════════════════════════════════
function makeSeedRNG(str) {
  let h=2166136261>>>0;
  for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}
  return ()=>{
    h=(h+0x6D2B79F5)>>>0;let t=Math.imul(h^(h>>>15),1|h);
    t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;
  };
}

const SEED_CHARS="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const generateSeed=()=>Array.from({length:6},()=>SEED_CHARS[Math.floor(Math.random()*SEED_CHARS.length)]).join("");

function seededShuffle(arr,rngFn){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(rngFn()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

function buildDraftOptions(seed,levelIndex,ante,heldIds,bonusPick,bossComplete,enabledCats=null){
  const rngFn=makeSeedRNG(`${seed}_draft_L${levelIndex}`);
  const held=new Set(heldIds);
  const weights=[
    {common:.70,uncommon:.25,rare:.05},{common:.70,uncommon:.25,rare:.05},
    {common:.50,uncommon:.35,rare:.15},{common:.50,uncommon:.35,rare:.15},
    {common:.30,uncommon:.40,rare:.30},{common:.30,uncommon:.40,rare:.30},
    {common:.20,uncommon:.40,rare:.40},{common:.20,uncommon:.40,rare:.40},
    {common:.10,uncommon:.35,rare:.55},{common:.10,uncommon:.30,rare:.60},
  ][levelIndex]??{common:.50,uncommon:.35,rare:.15};
  // Rare relics reserved exclusively for boss completions
  if(!bossComplete){const rv=weights.rare;weights.rare=0;weights.uncommon=Math.min(weights.uncommon+rv,0.60);weights.common=1-weights.uncommon;}
  const catFilter=enabledCats&&enabledCats.size>0?r=>!held.has(r.id)&&enabledCats.has(r.cat):r=>!held.has(r.id);
  const avail=RELIC_POOL.filter(catFilter);
  const pool=avail.length>=3?avail:RELIC_POOL.filter(r=>!held.has(r.id));
  const byR={common:pool.filter(r=>r.rar==="common"),uncommon:pool.filter(r=>r.rar==="uncommon"),rare:pool.filter(r=>r.rar==="rare")};
  const pickOne=excludeIds=>{
    const candidates=pool.filter(r=>!excludeIds.has(r.id));
    if(!candidates.length)return null;
    const roll=rngFn();
    let cands=roll<weights.rare&&byR.rare.length?byR.rare.filter(r=>!excludeIds.has(r.id)):
              roll<weights.rare+weights.uncommon&&byR.uncommon.length?byR.uncommon.filter(r=>!excludeIds.has(r.id)):
              byR.common.filter(r=>!excludeIds.has(r.id));
    if(!cands.length)cands=candidates;
    return cands[Math.floor(rngFn()*cands.length)];
  };
  const result=[];const usedIds=new Set();
  // Boss completion: guaranteed rare relic first
  if(bossComplete&&byR.rare.length){const rares=byR.rare.filter(r=>!usedIds.has(r.id));if(rares.length){const p=rares[Math.floor(rngFn()*rares.length)];result.push(p);usedIds.add(p.id);}}
  // Always include exactly one seeded boon
  const boonRng=makeSeedRNG(`${seed}_boon_L${levelIndex}`);
  const boon=BOON_POOL[Math.floor(boonRng()*BOON_POOL.length)];
  result.push(boon);usedIds.add(boon.id);
  // Fill remaining slots with relics
  while(result.length<(bonusPick?4:3)){const p=pickOne(usedIds);if(!p)break;result.push(p);usedIds.add(p.id);}
  return seededShuffle(result,rngFn);
}

function getQuotaColor(seed,levelIndex,numColors){
  const r=makeSeedRNG(`${seed}_quota_L${levelIndex}`);
  return Math.floor(r()*numColors);
}

// ═══════════════════════════════════════════════════════════════════
// MATCH-3 ENGINE
// ═══════════════════════════════════════════════════════════════════
const MAX_MOVES=30;
let _uid=0;
const newUid=()=>(++_uid).toString(36);
const rngN=n=>Math.floor(Math.random()*n);
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const clone=g=>g.map(row=>row.map(c=>c?{...c}:null));

function makeCell(type,special=SPECIAL.NONE){return{type,special,id:newUid()};}
function makeStoneCell(){return{type:null,special:SPECIAL.NONE,id:newUid(),stone:true};}
function makeChocolateCell(){return{type:null,special:SPECIAL.NONE,id:newUid(),chocolate:true};}
// A cell can participate in a match only if it has a candy type and is not blocked
const canMatch=cell=>cell&&cell.type!=null&&!cell.stone&&!cell.chocolate&&cell.frosted!==2;

function wouldMatch(grid,r,c,type){
  return(c>=2&&grid[r][c-1]?.type===type&&grid[r][c-2]?.type===type)||
         (r>=2&&grid[r-1]?.[c]?.type===type&&grid[r-2]?.[c]?.type===type);
}

function buildGrid(rows,cols,typeFn){
  const g=[];
  for(let r=0;r<rows;r++){g.push([]);for(let c=0;c<cols;c++)g[r].push(makeCell(typeFn(r,c,g)));}
  return g;
}

function findRuns(grid,typeNorm=null){
  const norm=typeNorm||(t=>t),runs=[];
  for(let r=0;r<ROWS;r++){
    let s=0;
    for(let c=1;c<=COLS;c++){
      const p=grid[r][c-1],cur=grid[r][c];
      const cont=c<COLS&&canMatch(p)&&canMatch(cur)&&norm(p.type)===norm(cur.type);
      if(!cont){
        if(c-s>=3&&canMatch(grid[r][s]))runs.push({cells:Array.from({length:c-s},(_,i)=>[r,s+i]),dir:"h",type:grid[r][s].type,normType:norm(grid[r][s].type)});
        s=c;
      }
    }
  }
  for(let c=0;c<COLS;c++){
    let s=0;
    for(let r=1;r<=ROWS;r++){
      const p=grid[r-1]?.[c],cur=grid[r]?.[c];
      const cont=r<ROWS&&canMatch(p)&&canMatch(cur)&&norm(p.type)===norm(cur.type);
      if(!cont){
        if(r-s>=3&&canMatch(grid[s]?.[c]))runs.push({cells:Array.from({length:r-s},(_,i)=>[s+i,c]),dir:"v",type:grid[s][c].type,normType:norm(grid[s][c].type)});
        s=r;
      }
    }
  }
  return runs;
}

function processMatches(grid,aR1=-1,aC1=-1,aR2=-1,aC2=-1,typeNorm=null,relicCtx=null){
  const runs=findRuns(grid,typeNorm);
  if(!runs.length)return null;
  const toRemove=new Set();
  runs.forEach(({cells})=>cells.forEach(([r,c])=>toRemove.add(`${r},${c}`)));
  const pickAnchor=cells=>cells.find(([r,c])=>r===aR2&&c===aC2)??cells.find(([r,c])=>r===aR1&&c===aC1)??cells[Math.floor(cells.length/2)];
  const specialCreations=new Map(),inLong=new Set();
  runs.forEach(run=>{
    if(run.cells.length>=5){
      run.cells.forEach(([r,c])=>inLong.add(`${r},${c}`));
      const[kr,kc]=pickAnchor(run.cells);
      specialCreations.set(`${kr},${kc}`,{type:run.type,special:SPECIAL.COLOR_BOMB});
    }
  });
  const runCount=new Map();
  runs.forEach(run=>{
    if(run.cells.length>=5)return;
    run.cells.forEach(([r,c])=>{const k=`${r},${c}`;if(!inLong.has(k))runCount.set(k,(runCount.get(k)||0)+1);});
  });
  runCount.forEach((count,k)=>{
    if(count>=2&&!specialCreations.has(k)){const[r,c]=k.split(",").map(Number);specialCreations.set(k,{type:grid[r][c].type,special:SPECIAL.WRAPPED});}
  });
  runs.forEach(run=>{
    if(run.cells.length!==4)return;
    if(run.cells.some(([r,c])=>specialCreations.has(`${r},${c}`)))return;
    const[kr,kc]=pickAnchor(run.cells);
    if(!specialCreations.has(`${kr},${kc}`)){
      let sp=run.dir==="h"?SPECIAL.STRIPED_H:SPECIAL.STRIPED_V;
      if(relicCtx&&relicCtx.ids&&relicCtx.ids.has("s3")&&Math.random()<0.3)sp=SPECIAL.WRAPPED;
      specialCreations.set(`${kr},${kc}`,{type:run.type,special:sp});
    }
  });

  // Frosted:2 cells adjacent to any matched cell get cracked (2→1)
  const frostedHits=new Map();
  toRemove.forEach(key=>{
    const[r,c]=key.split(",").map(Number);
    [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([ar,ac])=>{
      if(ar<0||ar>=ROWS||ac<0||ac>=COLS)return;
      if(grid[ar][ac]?.frosted===2&&!toRemove.has(`${ar},${ac}`))frostedHits.set(`${ar},${ac}`,1);
    });
  });

  // Chocolate cells adjacent to a matched cell get removed
  const chocolateHits=new Set();
  toRemove.forEach(key=>{
    const[r,c]=key.split(",").map(Number);
    [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([ar,ac])=>{
      if(ar>=0&&ar<ROWS&&ac>=0&&ac<COLS&&grid[ar][ac]?.chocolate)chocolateHits.add(`${ar},${ac}`);
    });
  });

  return{toRemove,specialCreations,runs,frostedHits,chocolateHits};
}

function expandWithSpecials(grid,matched,relicCtx=null){
  const expanded=new Set(matched),activated=new Set();
  let frontier=[...matched];
  while(frontier.length){
    const next=[];
    for(const key of frontier){
      if(activated.has(key))continue;
      activated.add(key);
      const[r,c]=key.split(",").map(Number);
      const cell=grid[r]?.[c];
      if(!cell)continue;
      if(cell.stone||cell.chocolate||cell.frosted===2)continue; // obstacles removed, no special to fire
      if(cell.special===SPECIAL.NONE)continue;
      const handler=SPECIAL_REGISTRY[cell.special];
      if(!handler)continue;
      const radius=(cell.special===SPECIAL.WRAPPED&&relicCtx?.getWrappedRadius)?relicCtx.getWrappedRadius():1;
      const cells=cell.special===SPECIAL.WRAPPED?handler.activate(grid,r,c,cell.type,radius):handler.activate(grid,r,c,cell.type);
      cells.forEach(k=>{if(!expanded.has(k)){expanded.add(k);next.push(k);}});
      // o3 Stone Splitter — wrapped also hits adjacent stones
      if(cell.special===SPECIAL.WRAPPED&&relicCtx?.hasStoneSplitter?.()){
        for(let dr=-(radius+1);dr<=radius+1;dr++)for(let dc=-(radius+1);dc<=radius+1;dc++){
          if(Math.abs(dr)!==radius+1&&Math.abs(dc)!==radius+1)continue;
          const nr=r+dr,nc=c+dc;
          if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&grid[nr][nc]?.stone){
            const sk=`${nr},${nc}`;if(!expanded.has(sk)){expanded.add(sk);next.push(sk);}
          }
        }
      }
      if(relicCtx?.hasPowerStripe?.()&&(cell.special===SPECIAL.STRIPED_H||cell.special===SPECIAL.STRIPED_V)){
        if(cell.special===SPECIAL.STRIPED_H){
          [r-1,r+1].forEach(ar=>{if(ar>=0&&ar<ROWS)for(let ac=0;ac<COLS;ac++){const k=`${ar},${ac}`;if(grid[ar][ac]&&!expanded.has(k)){expanded.add(k);next.push(k);}}});
        }else{
          [c-1,c+1].forEach(ac=>{if(ac>=0&&ac<COLS)for(let ar=0;ar<ROWS;ar++){const k=`${ar},${ac}`;if(grid[ar][ac]&&!expanded.has(k)){expanded.add(k);next.push(k);}}});
        }
      }
    }
    frontier=next;
  }
  return expanded;
}

// Apply butter bias — skip stone/chocolate cells
function applyButterBias(grid,count){
  if(count<=0)return grid;
  const g=clone(grid),topCells=[];
  for(let r=0;r<Math.min(3,ROWS);r++)for(let c=0;c<COLS;c++)
    if(g[r][c]&&!g[r][c].stone&&!g[r][c].chocolate&&g[r][c].special===SPECIAL.NONE&&g[r][c].type!==3)topCells.push([r,c]);
  topCells.sort(()=>Math.random()-0.5);
  topCells.slice(0,Math.min(count,4)).forEach(([r,c])=>{g[r][c]={...g[r][c],type:3};});
  return g;
}

// Gravity fill — stone and chocolate are fixed barriers; handle per-column segments
function gravityFill(grid,numTypes){
  const g=Array.from({length:ROWS},()=>Array(COLS).fill(null));
  for(let col=0;col<COLS;col++){
    const fixed=[];
    for(let r=0;r<ROWS;r++){if(grid[r][col]?.stone||grid[r][col]?.chocolate){fixed.push(r);g[r][col]={...grid[r][col]};}}
    const segments=[];let prev=-1;
    for(const fr of[...fixed,ROWS]){if(fr>prev+1)segments.push([prev+1,fr-1]);prev=fr;}
    for(const[top,bot]of segments){
      let fill=bot;
      for(let r=bot;r>=top;r--){const cell=grid[r][col];if(cell&&!cell.stone&&!cell.chocolate){g[fill--][col]={...cell};}}
      for(let r=fill;r>=top;r--)g[r][col]=makeCell(rngN(numTypes));
    }
  }
  return g;
}

// Chocolate spreading — cells not adjacent to any match attempt to spread each cascade
function spreadChocolate(grid,allMatchedKeys){
  const g=clone(grid);
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    if(!grid[r][c]?.chocolate)continue;
    const adj=[[r-1,c],[r+1,c],[r,c-1],[r,c+1]];
    const nearMatch=adj.some(([ar,ac])=>ar>=0&&ar<ROWS&&ac>=0&&ac<COLS&&allMatchedKeys.has(`${ar},${ac}`));
    if(nearMatch)continue;
    const cands=adj.filter(([ar,ac])=>ar>=0&&ar<ROWS&&ac>=0&&ac<COLS&&g[ar][ac]&&!g[ar][ac].stone&&!g[ar][ac].chocolate);
    if(cands.length){const[tr,tc]=cands[Math.floor(Math.random()*cands.length)];g[tr][tc]=makeChocolateCell();}
  }
  return g;
}

// Place obstacles on a seeded grid
function placeObstacles(grid,levelIndex,seed,skipObstacles=false){
  const cfg=LEVEL_OBSTACLE_CONFIGS[levelIndex]??{};
  if(skipObstacles||!Object.keys(cfg).length)return grid;
  const g=clone(grid);
  const rng=makeSeedRNG(`${seed}_obs_L${levelIndex}`);
  const used=new Set();
  const pick=candidates=>{
    const avail=candidates.filter(([r,c])=>!used.has(`${r},${c}`)&&g[r][c]&&!g[r][c].stone&&!g[r][c].chocolate);
    if(!avail.length)return null;
    const[r,c]=avail[Math.floor(rng()*avail.length)];
    used.add(`${r},${c}`);return[r,c];
  };
  const stoneCands=[];for(let r=1;r<ROWS-1;r++)for(let c=1;c<COLS-1;c++)stoneCands.push([r,c]);
  for(let i=0;i<(cfg.stone||0);i++){const p=pick(stoneCands);if(p){const[r,c]=p;g[r][c]=makeStoneCell();}}
  const frostedCands=[];for(let r=1;r<ROWS-1;r++)for(let c=2;c<COLS-2;c++)frostedCands.push([r,c]);
  for(let i=0;i<(cfg.frosted||0);i++){const p=pick(frostedCands);if(p){const[r,c]=p;g[r][c]={...g[r][c],frosted:2};}}
  const jellyCands=[];for(let r=ROWS-3;r<ROWS;r++)for(let c=0;c<COLS;c++)jellyCands.push([r,c]);
  for(let r=0;r<ROWS-3;r++)for(let c=0;c<COLS;c++)jellyCands.push([r,c]);
  for(let i=0;i<(cfg.jelly||0);i++){const p=pick(jellyCands);if(p){const[r,c]=p;g[r][c]={...g[r][c],jelly:true};}}
  const cornerOrder=[[0,0],[0,COLS-1],[ROWS-1,0],[ROWS-1,COLS-1]];
  for(let i=0;i<Math.min(cfg.chocolate||0,4);i++){
    const[r,c]=cornerOrder[i];if(!used.has(`${r},${c}`)){g[r][c]=makeChocolateCell();used.add(`${r},${c}`);}
  }
  const lockCands=[];for(let r=3;r<5;r++)for(let c=2;c<6;c++)lockCands.push([r,c]);
  const lockSpecials=[SPECIAL.STRIPED_H,SPECIAL.WRAPPED,SPECIAL.STRIPED_V];
  for(let i=0;i<(cfg.locked||0);i++){const p=pick(lockCands);if(p){const[r,c]=p;g[r][c]={...g[r][c],special:lockSpecials[i%3],locked:true};}}
  return g;
}

// Apply boon effects at level start
function applyBoonToGrid(grid,boon,numColors){
  if(!boon)return grid;
  const g=clone(grid);
  if(boon.id==="b1"){
    const specs=[SPECIAL.STRIPED_H,SPECIAL.WRAPPED,SPECIAL.STRIPED_V,SPECIAL.COLOR_BOMB];
    const cells=[];for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(g[r][c]&&!g[r][c].stone&&!g[r][c].chocolate&&g[r][c].special===SPECIAL.NONE)cells.push([r,c]);
    cells.sort(()=>Math.random()-0.5);
    cells.slice(0,2).forEach(([r,c],i)=>{g[r][c]={...g[r][c],special:specs[i%4]};});
  }
  if(boon.id==="b4"){const cr=Math.floor(ROWS/2),cc=Math.floor(COLS/2);if(g[cr][cc]&&!g[cr][cc].stone)g[cr][cc]={...g[cr][cc],special:SPECIAL.COLOR_BOMB};}
  if(boon.id==="b5"){for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(g[r][c]?.frosted===2)g[r][c]={...g[r][c],frosted:1};}
  return g;
}

function computeCascade(startGrid,aR1=-1,aC1=-1,aR2=-1,aC2=-1,numTypes=6,typeNorm=null,relicCtx=null){
  const steps=[];let g=startGrid,combo=1,first=true;
  while(true){
    const result=first?processMatches(g,aR1,aC1,aR2,aC2,typeNorm,relicCtx):processMatches(g,-1,-1,-1,-1,typeNorm,relicCtx);
    if(!result)break;
    const{toRemove,specialCreations,runs,frostedHits,chocolateHits}=result;
    const expanded=expandWithSpecials(g,toRemove,relicCtx);

    // Track per-step obstacle clears for relic scoring
    const jellyClears=[],frostedClears=[],stoneClears=[],chocoClears=[];
    expanded.forEach(k=>{const[r,c]=k.split(",").map(Number);const cell=g[r]?.[c];if(!cell)return;
      if(cell.jelly)jellyClears.push(k);
      if(cell.frosted)frostedClears.push([r,c]);
      if(cell.stone)stoneClears.push(k);
      if(cell.chocolate)chocoClears.push(k);
    });
    // Also count chocolate hits (adjacent clears)
    chocolateHits.forEach(k=>chocoClears.push(k));

    const rawGain=expanded.size*10*combo;
    const next=clone(g);
    expanded.forEach(k=>{const[r,c]=k.split(",").map(Number);next[r][c]=null;});
    // Apply chocolate hits as clears (they are adjacent, not in expanded)
    chocolateHits.forEach(k=>{const[r,c]=k.split(",").map(Number);next[r][c]=null;});
    // Apply frosted hits — crack (2→1) without clearing
    frostedHits.forEach((health,k)=>{const[r,c]=k.split(",").map(Number);if(next[r][c])next[r][c]={...next[r][c],frosted:health};});
    specialCreations.forEach(({type,special},k)=>{const[r,c]=k.split(",").map(Number);next[r][c]=makeCell(type,special);});
    const filled=gravityFill(next,numTypes);
    steps.push({matched:expanded,gridAfter:filled,rawGain,runs,gridBefore:g,
      jellyClears,frostedClears,stoneClears,chocoClears});
    g=filled;combo++;first=false;
  }
  return steps;
}

// Level generators
const LEVEL_GENERATORS={
  random:(rows,cols,n)=>buildGrid(rows,cols,(r,c,g)=>{let t,i=0;do{t=rngN(n);i++;}while(i<12&&wouldMatch(g,r,c,t));return t;}),
  wave:(rows,cols,n)=>buildGrid(rows,cols,(r,c,g)=>{const b=Math.round(Math.abs(Math.sin((r+c)*0.7))*(n-1));let t,i=0;do{t=Math.random()<0.5?b:rngN(n);i++;}while(i<12&&wouldMatch(g,r,c,t));return t;}),
  diagonal:(rows,cols,n)=>buildGrid(rows,cols,(r,c,g)=>{const b=(r+c)%n;let t,i=0;do{t=Math.random()<0.45?b:rngN(n);i++;}while(i<12&&wouldMatch(g,r,c,t));return t;}),
};

function makeLevelGrid(seed,levelIndex,numColors,boon=null){
  const genKeys=Object.keys(LEVEL_GENERATORS);
  const r=makeSeedRNG(`${seed}_gen_L${levelIndex}`);
  const raw=LEVEL_GENERATORS[genKeys[Math.floor(r()*genKeys.length)]](ROWS,COLS,numColors);
  const withObs=placeObstacles(raw,levelIndex,seed,boon?.id==="b7");
  return applyBoonToGrid(withObs,boon,numColors);
}

// ═══════════════════════════════════════════════════════════════════
// COTTAGE GEM VISUAL  (adapted from Claude Design output)
// ═══════════════════════════════════════════════════════════════════

// Map SPECIAL enum → design string
function specialKey(s){
  if(s===SPECIAL.STRIPED_H)return"hStripe";
  if(s===SPECIAL.STRIPED_V)return"vStripe";
  if(s===SPECIAL.WRAPPED)  return"wrapped";
  if(s===SPECIAL.COLOR_BOMB)return"bomb";
  return null;
}

// ═══════════════════════════════════════════════════════════════════
// GEM SHAPE ICONS  — one distinct silhouette per type index (0–6).
// Stored as plain descriptor objects (no JSX at module scope).
// GemShape (a normal component) renders them with JSX at call time.
// ═══════════════════════════════════════════════════════════════════
const GEM_SHAPES = [
  // 0: heart
  {type:"path", d:"M12 18C12 18 5.5 12.5 5.5 8.5C5.5 6 7.5 4.5 10 5.5L12 7.5L14 5.5C16.5 4.5 18.5 6 18.5 8.5C18.5 12.5 12 18 12 18Z", opacity:"0.48"},
  // 1: trefoil — three circles stored as cx,cy,r tuples
  {type:"circles", opacity:"0.45", circles:[{cx:"12",cy:"8.5",r:"3.4"},{cx:"8.2",cy:"14.5",r:"3.4"},{cx:"15.8",cy:"14.5",r:"3.4"}]},
  // 2: diamond
  {type:"path", d:"M12 3.5L20.5 12L12 20.5L3.5 12Z", opacity:"0.42"},
  // 3: sun — centre circle + 8 ray line endpoints
  {type:"sun",  opacity:"0.48", r:"3.8",
   rays:[0,45,90,135,180,225,270,315].map(deg=>{
     const rad=deg*Math.PI/180;
     return {x1:12+5.8*Math.cos(rad),y1:12+5.8*Math.sin(rad),x2:12+7.8*Math.cos(rad),y2:12+7.8*Math.sin(rad)};
   })},
  // 4: three bubbles
  {type:"circles", opacity:"0.46", circles:[{cx:"9.5",cy:"14.5",r:"3"},{cx:"14.5",cy:"14.5",r:"3"},{cx:"12",cy:"9.5",r:"3"}]},
  // 5: teardrop
  {type:"path", d:"M12 4.5C12 4.5 6.5 11 6.5 14.5C6.5 17.5 9 20 12 20C15 20 17.5 17.5 17.5 14.5C17.5 11 12 4.5 12 4.5Z", opacity:"0.46"},
  // 6: crescent moon
  {type:"path", d:"M16 5.5C11.5 5.5 8 9 8 13C8 17 11.5 20.5 16 20.5C13.2 20 11.2 17.5 11.2 14.5C11.2 11.5 13.2 9 16 8.5C17.5 8 18.5 6 16 5.5Z", opacity:"0.48"},
];

function GemShape({typeIndex, color, gemSize}) {
  const shape = GEM_SHAPES[Math.min(typeIndex, GEM_SHAPES.length - 1)];
  const s = gemSize * 0.65;
  const svgStyle = {position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"};

  if (shape.type === "path") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" style={svgStyle}>
        <path d={shape.d} fill={color} opacity={shape.opacity}/>
      </svg>
    );
  }
  if (shape.type === "circles") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" style={svgStyle}>
        <g fill={color} opacity={shape.opacity}>
          {shape.circles.map((c,i) => <circle key={i} cx={c.cx} cy={c.cy} r={c.r}/>)}
        </g>
      </svg>
    );
  }
  if (shape.type === "sun") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" style={svgStyle}>
        <g fill={color} stroke={color} strokeLinecap="round" opacity={shape.opacity}>
          <circle cx="12" cy="12" r={shape.r}/>
          {shape.rays.map((ray,i) => (
            <line key={i} x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2} strokeWidth="1.6"/>
          ))}
        </g>
      </svg>
    );
  }
  return null;
}

function cottageStripe(size,dir,color,offset){
  const t=Math.max(2,size*0.09);
  if(dir==="h")return{position:"absolute",left:2,right:2,top:`calc(50% + ${offset*size}px)`,transform:"translateY(-50%)",height:t,borderRadius:t,background:`repeating-linear-gradient(90deg,${color}cc 0 ${size*0.12}px,${color}55 ${size*0.12}px ${size*0.18}px)`,opacity:0.85};
  return{position:"absolute",top:2,bottom:2,left:`calc(50% + ${offset*size}px)`,transform:"translateX(-50%)",width:t,borderRadius:t,background:`repeating-linear-gradient(0deg,${color}cc 0 ${size*0.12}px,${color}55 ${size*0.12}px ${size*0.18}px)`,opacity:0.85};
}

function CottageBurst({size,color}){
  const s=size*0.55;
  return(
    <svg width={s} height={s} viewBox="0 0 24 24" style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
      <g fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
        <line x1="12" y1="3"  x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/>
        <line x1="3"  y1="12" x2="9"  y2="12"/><line x1="15" y1="12" x2="21" y2="12"/>
        <line x1="5.5" y1="5.5"  x2="9"  y2="9"/><line x1="15" y1="15"  x2="18.5" y2="18.5"/>
        <line x1="18.5" y1="5.5" x2="15" y2="9"/><line x1="9"  y1="15"  x2="5.5"  y2="18.5"/>
      </g>
      <circle cx="12" cy="12" r="2.2" fill={color} opacity="0.7"/>
    </svg>
  );
}

function CottageStar({size,color}){
  const s=size*0.62;
  return(
    <svg width={s} height={s} viewBox="0 0 24 24" style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
      <path d="M12 2.5l2.7 6.4 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.9 20.9l1.6-6.8L2.4 9.5l6.9-.6z" fill="#ffffffaa" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Obstacle Visuals ────────────────────────────────────────────
function FrostedOverlay({health,size}){
  const op=health===2?0.72:0.38;
  return(
    <div style={{position:"absolute",inset:0,borderRadius:"50%",
      background:`rgba(200,225,255,${op})`,border:`${health===2?2:1.5}px solid rgba(150,190,255,${op*0.9})`,
      display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",zIndex:10}}>
      <svg width={size*0.45} height={size*0.45} viewBox="0 0 24 24" opacity={0.8}>
        <g stroke="rgba(160,200,255,1)" strokeWidth="1.6" strokeLinecap="round">
          <line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="5.6" y1="5.6" x2="18.4" y2="18.4"/><line x1="18.4" y1="5.6" x2="5.6" y2="18.4"/>
        </g>
        <circle cx="12" cy="12" r="2.5" fill="rgba(200,225,255,0.8)"/>
      </svg>
      {health===1&&<svg style={{position:"absolute",inset:0}} width={size} height={size} viewBox="0 0 24 24">
        <path d="M8 3 L10 8 L7 11 L12 20 L14 14 L17 16" stroke="rgba(180,210,255,0.6)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      </svg>}
    </div>
  );
}

function LockedOverlay({size}){
  return(
    <div style={{position:"absolute",top:"3%",right:"5%",zIndex:11,pointerEvents:"none"}}>
      <svg width={size*0.3} height={size*0.3} viewBox="0 0 24 24">
        <rect x="5" y="11" width="14" height="11" rx="2" fill="rgba(80,60,40,0.75)" stroke="rgba(210,185,145,0.9)" strokeWidth="1.5"/>
        <path d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11" fill="none" stroke="rgba(210,185,145,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="15.5" r="1.8" fill="rgba(210,185,145,0.8)"/>
      </svg>
    </div>
  );
}

function StoneCell({size,ch}){
  return(
    <div style={{width:size,height:size,borderRadius:"50%",
      background:`radial-gradient(circle at 40% 35%,${ch?.inkSoft??"#9a8a74"} 0%,${ch?.ink??"#5a4a3a"} 75%)`,
      border:`2px solid ${ch?.ink??"#3e2814"}66`,
      boxShadow:"inset 0 -2px 4px rgba(0,0,0,0.35),0 2px 4px rgba(80,60,40,0.2)",
      position:"relative",overflow:"hidden"}}>
      <svg width={size} height={size} viewBox="0 0 24 24" style={{position:"absolute",inset:0,opacity:0.3}}>
        <path d="M7 8 L12 6 L16 9 M9 14 L15 12 L18 15 M5 18 L11 16" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function ChocolateCell({size}){
  return(
    <div style={{width:size,height:size,borderRadius:9,
      background:`radial-gradient(circle at 40% 35%,#8b5e3c 0%,#4a2810 100%)`,
      border:"2px solid #2a1408",
      boxShadow:"inset 0 -2px 3px rgba(0,0,0,0.35),0 2px 4px rgba(60,30,10,0.3)",
      display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <svg width={size} height={size} viewBox="0 0 24 24" style={{position:"absolute",inset:0,opacity:0.45}}>
        <line x1="0" y1="8"  x2="24" y2="8"  stroke="#c0844a" strokeWidth="1"/>
        <line x1="0" y1="16" x2="24" y2="16" stroke="#c0844a" strokeWidth="1"/>
        <line x1="8"  y1="0" x2="8"  y2="24" stroke="#c0844a" strokeWidth="1"/>
        <line x1="16" y1="0" x2="16" y2="24" stroke="#c0844a" strokeWidth="1"/>
      </svg>
      <span style={{fontSize:size*0.38,position:"relative",zIndex:1}}>🍫</span>
    </div>
  );
}

function CottageGem({typeIndex, season, size=38, special=null, selected=false}){
  const c=getCandy(typeIndex,season);
  const sk=special&&special!==SPECIAL.NONE?
    (special===SPECIAL.STRIPED_H?"hStripe":special===SPECIAL.STRIPED_V?"vStripe":special===SPECIAL.WRAPPED?"wrapped":special===SPECIAL.COLOR_BOMB?"bomb":null):null;

  // Layered box-shadow: selected ring → special type ring → base gem shadows
  const selectedRing = selected ? `0 0 0 5px rgba(255,255,255,0.92)` : null;
  const specialRing  =
    (special===SPECIAL.STRIPED_H||special===SPECIAL.STRIPED_V)
      ? `0 0 0 2.5px rgba(255,255,255,0.90), 0 0 8px rgba(255,255,255,0.40)`
      : special===SPECIAL.WRAPPED
      ? `0 0 0 2.5px #c89a25, 0 0 10px rgba(200,154,37,0.65)`
      : special===SPECIAL.COLOR_BOMB
      ? `0 0 0 3px #c89a25, 0 0 12px rgba(200,154,37,0.75), 0 0 22px rgba(200,154,37,0.30)`
      : null;
  const boxShadow = [
    selectedRing,
    specialRing,
    `inset 0 -2px 3px ${c.deep}40`,
    `inset 0 1px 1px #ffffff70`,
    `0 2px 4px rgba(80,60,40,0.18)`,
  ].filter(Boolean).join(", ");

  return(
    <div style={{width:size,height:size,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{
        width:size,height:size,borderRadius:"50%",
        background:`radial-gradient(circle at 38% 34%,${c.light} 0%,${c.base} 55%,${c.deep} 100%)`,
        boxShadow,
        border:`1.2px solid ${c.deep}55`,
        position:"relative",overflow:"hidden",transition:"box-shadow 0.15s",
      }}>
        {/* Primary shine */}
        <div style={{position:"absolute",top:size*0.16,left:size*0.21,width:size*0.14,height:size*0.09,borderRadius:"50%",background:"#ffffff85",filter:"blur(0.6px)"}}/>
        {/* Secondary glint */}
        <div style={{position:"absolute",top:size*0.52,right:size*0.18,width:size*0.08,height:size*0.06,borderRadius:"50%",background:"#ffffff40"}}/>
        {/* Shape icon — only when no special */}
        {!sk && <GemShape typeIndex={typeIndex} color={c.deep} gemSize={size}/>}
        {sk==="hStripe"&&<><div style={cottageStripe(size,"h",c.deep,-0.2)}/><div style={cottageStripe(size,"h",c.deep,0.2)}/></>}
        {sk==="vStripe"&&<><div style={cottageStripe(size,"v",c.deep,-0.2)}/><div style={cottageStripe(size,"v",c.deep,0.2)}/></>}
        {sk==="wrapped"&&<CottageBurst size={size} color={c.deep}/>}
        {sk==="bomb"&&   <CottageStar  size={size} color={c.deep}/>}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════
// VIEWPORT HOOK — returns live window dimensions, updates on resize.
// Cell size is computed per-device: max 46px (tablet/desktop), min 30px (tiny phone).
// Formula: fill available width minus 40px side padding and 8px board frame.
// ═══════════════════════════════════════════════════════════════════
function useViewport() {
  const[size,setSize]=useState(()=>({vw:window.innerWidth,vh:window.innerHeight}));
  useEffect(()=>{
    const fn=()=>setSize({vw:window.innerWidth,vh:window.innerHeight});
    window.addEventListener('resize',fn);
    return ()=>window.removeEventListener('resize',fn);
  },[]);
  return size;
}
function computeCell(vw){ return Math.min(46,Math.max(30,Math.floor((vw-40)/COLS))); }

// ═══════════════════════════════════════════════════════════════════
// TOOLTIP SYSTEM — hover (desktop) + 400ms long-press (mobile)
// One TooltipProvider at the AppRoot level renders a single floating
// card; RelicBadge instances anywhere in the tree can trigger it.
// ═══════════════════════════════════════════════════════════════════
const TooltipCtx = createContext(null);

function TooltipOverlay({item,x,y}){
  if(!item)return null;
  const isBoon=item.type==="boon";
  const cat=!isBoon?(RELIC_CATEGORIES[item.cat]??{label:item.cat,color:"#9a8a74"}):null;
  const rar=!isBoon?RARITY_STYLE[item.rar]:null;
  const cx=Math.max(128,Math.min(x,(window?.innerWidth??390)-128));
  const above=y>220;
  const caretBase={position:"absolute",left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"7px solid transparent",borderRight:"7px solid transparent"};
  return(
    <div style={{position:"fixed",left:cx,top:above?y-10:y+10,
      transform:above?"translate(-50%,-100%)":"translate(-50%,0)",
      zIndex:3000,pointerEvents:"none",width:240,
      background:"rgba(252,248,238,0.98)",border:"1.5px solid #dac9aa",borderRadius:14,
      boxShadow:"0 10px 28px rgba(80,60,40,0.28),inset 0 1px 0 rgba(255,255,255,0.85)",
      padding:"12px 14px",fontFamily:FF_SANS}}>
      <div style={{...caretBase,...(above?{bottom:-7,borderTop:"7px solid #dac9aa"}:{top:-7,borderBottom:"7px solid #dac9aa"})}}/>
      <div style={{...caretBase,...(above?{bottom:-5.5,borderTop:"6px solid rgba(252,248,238,0.98)",borderLeftWidth:6,borderRightWidth:6}:{top:-5.5,borderBottom:"6px solid rgba(252,248,238,0.98)",borderLeftWidth:6,borderRightWidth:6})}}/>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
        <span style={{fontSize:24,lineHeight:1}}>{item.icon}</span>
        <div>
          <div style={{fontFamily:FF_SERIF,fontWeight:600,fontSize:14,color:"#5a4a3a",lineHeight:1.2}}>{item.name}</div>
          <div style={{display:"flex",alignItems:"center",gap:5,marginTop:3}}>
            {isBoon
              ?<span style={{fontSize:9,color:"#c89a25",fontWeight:700,border:"1px solid #c89a2555",borderRadius:6,padding:"1px 5px"}}>ONE LEVEL</span>
              :<><span style={{fontSize:9,color:rar.color,fontWeight:700,border:`1px solid ${rar.color}55`,borderRadius:6,padding:"1px 5px"}}>{"★".repeat({common:1,uncommon:2,rare:3}[item.rar])} {rar.label}</span>
                <span style={{fontSize:9,color:cat.color,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>{cat.label}</span></>}
          </div>
        </div>
      </div>
      <div style={{fontSize:12,color:"#8a7a64",lineHeight:1.55}}>{item.effect}</div>
    </div>
  );
}

function TooltipProvider({children}){
  const[tip,setTip]=useState(null);
  return(
    <TooltipCtx.Provider value={setTip}>
      {children}
      {tip&&<TooltipOverlay {...tip}/>}
    </TooltipCtx.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════════════════════════════
function RelicBadge({relic,size=32,ch}){
  const setTip=useContext(TooltipCtx);
  const timerRef=useRef(null);
  const cat=RELIC_CATEGORIES[relic.cat]??{color:"#9a8a74"};
  const rar=RARITY_STYLE[relic.rar];
  const bg=ch?`linear-gradient(180deg,${ch.boardTop} 0%,${cat.color}33 100%)`:`linear-gradient(180deg,#fcf8ee,${cat.color}33)`;
  const border=`1.5px solid ${cat.color}88`;

  const showTip=useCallback(el=>{
    if(!setTip)return;
    const r=el.getBoundingClientRect();
    setTip({item:relic,x:r.left+r.width/2,y:r.top});
  },[relic,setTip]);
  const hideTip=useCallback(()=>{if(setTip)setTip(null);},[setTip]);

  return(
    <div
      onMouseEnter={e=>showTip(e.currentTarget)}
      onMouseLeave={hideTip}
      onTouchStart={e=>{const el=e.currentTarget;timerRef.current=setTimeout(()=>showTip(el),400);}}
      onTouchEnd={()=>{clearTimeout(timerRef.current);hideTip();}}
      onTouchMove={()=>{clearTimeout(timerRef.current);hideTip();}}
      onTouchCancel={()=>{clearTimeout(timerRef.current);hideTip();}}
      style={{width:size,height:size,borderRadius:Math.round(size*0.28),
        background:bg,border,boxShadow:rar.glow,
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        fontSize:size*0.46,cursor:"default",gap:1}}>
      <span style={{lineHeight:1}}>{relic.icon}</span>
      {size>=40&&<span style={{fontSize:7,fontFamily:FF_SANS,fontWeight:700,letterSpacing:0.3,color:ch?.inkSoft??"#8a7a64",textTransform:"uppercase"}}>{relic.name.split(" ")[0]}</span>}
    </div>
  );
}

// Warm paper button
function Btn({children,onClick,style={}}){
  return(
    <button onClick={onClick} style={{
      padding:"12px 24px",borderRadius:999,border:"none",cursor:"pointer",
      fontFamily:FF_SANS,fontSize:14,fontWeight:700,
      letterSpacing:0.5,...style,
    }}>{children}</button>
  );
}

// Paper card
function Card({children,style={},ch,onClick}){
  const bg=ch?`linear-gradient(180deg,${ch.boardTop} 0%,${ch.boardBot} 100%)`:"rgba(252,248,238,0.9)";
  const border=ch?`1.5px solid ${ch.frame}`:"1.5px solid #dac9aa";
  return(
    <div onClick={onClick} style={{
      background:bg,borderRadius:16,border,
      boxShadow:`inset 0 1px 0 #ffffffaa, 0 2px 8px rgba(80,60,40,0.12)`,
      padding:"14px 16px",...style,
    }}>{children}</div>
  );
}

// Season dot decoration (shared background element)
function SeasonDots({ch,width=390,height=844}){
  return(
    <svg width={width} height={height} style={{position:"absolute",inset:0,pointerEvents:"none",opacity:ch.dotsOpacity}}>
      {Array.from({length:18}).map((_,i)=>(
        <circle key={i} cx={(i*73)%width} cy={(i*113)%height} r={6+(i%3)*3} fill={ch.dotColor}/>
      ))}
    </svg>
  );
}

function Title({text,ch,size=30}){
  return(
    <div style={{
      fontFamily:FF_SERIF,fontWeight:600,fontStyle:"italic",
      fontSize:size,lineHeight:1.1,color:ch.ink,
      textAlign:"center",letterSpacing:0.5,
    }}>{text}</div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════════════════════════
function HomeScreen({onNewRun,onResume,hasActiveRun,highScores,runSeed,enabledCats,onToggleCat}){
  const[showScores,setShowScores]=useState(false);
  const[showSettings,setShowSettings]=useState(false);
  const ch=getCh("spring");
  const allCats=Object.entries(RELIC_CATEGORIES);
  return(
    <div style={{fontFamily:FF_SANS,background:ch.pageWash,minHeight:"100vh",
      display:"flex",flexDirection:"column",alignItems:"center",padding:"0 20px 40px",
      color:ch.ink,userSelect:"none",WebkitUserSelect:"none",position:"relative",overflow:"hidden"}}>
      <SeasonDots ch={ch}/>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400;1,9..144,600&family=Nunito:wght@400;600;700&display=swap');`}</style>

      <div style={{height:64}}/>
      <div style={{fontSize:36,marginBottom:4}}>✿</div>
      <Title text="Minzy Match" ch={ch} size={36}/>
      <div style={{fontSize:12,color:ch.inkSoft,letterSpacing:3,textTransform:"uppercase",marginBottom:52,fontFamily:FF_SANS,fontWeight:600}}>A Cosy Roguelike</div>

      <div style={{display:"flex",flexDirection:"column",gap:12,width:260,position:"relative",zIndex:1}}>
        <Btn onClick={onNewRun} style={{background:`linear-gradient(135deg,${ch.accent},#c9879b)`,color:"white",boxShadow:`0 6px 20px ${ch.accent}55`,fontSize:16,padding:"16px 24px"}}>
          ✿ New Run
        </Btn>
        <Btn onClick={hasActiveRun?onResume:undefined} style={{
          background:hasActiveRun?ch.pillBg:"rgba(252,248,238,0.4)",
          color:hasActiveRun?ch.ink:`${ch.ink}55`,
          border:`1.5px solid ${hasActiveRun?ch.frame:"#dac9aa88"}`,
          cursor:hasActiveRun?"pointer":"default",
        }}>
          {hasActiveRun?`▶ Resume · ${runSeed}`:"▶ No Active Run"}
        </Btn>
        <Btn onClick={()=>setShowScores(true)} style={{background:ch.pillBg,border:`1.5px solid ${ch.frame}`,color:ch.ink}}>🏆 High Scores</Btn>
        <Btn onClick={()=>setShowSettings(s=>!s)} style={{background:ch.pillBg,border:`1.5px solid ${ch.frame}`,color:ch.ink}}>⚙️ Draft Settings</Btn>
      </div>

      {showSettings&&(
        <div style={{width:260,marginTop:14,position:"relative",zIndex:1}}>
          <Card ch={ch} style={{padding:"14px 16px"}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,color:ch.inkSoft,marginBottom:10,textTransform:"uppercase",textAlign:"center"}}>Relic Categories</div>
            {allCats.map(([key,cat])=>{
              const on=enabledCats.has(key);
              return(
                <div key={key} onClick={()=>onToggleCat(key)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${ch.frame}55`,cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:10,height:10,borderRadius:3,background:on?cat.color:`${ch.frame}aa`,transition:"background 0.2s",border:`1px solid ${cat.color}66`}}/>
                    <span style={{fontSize:13,fontFamily:FF_SANS,color:on?ch.ink:`${ch.ink}55`,transition:"color 0.2s"}}>{cat.label}</span>
                  </div>
                  <span style={{fontSize:11,fontWeight:700,color:on?cat.color:`${ch.ink}33`}}>{on?"ON":"OFF"}</span>
                </div>
              );
            })}
            <div style={{fontSize:10,color:ch.inkSoft,marginTop:8,textAlign:"center"}}>Changes apply to next run's drafts</div>
          </Card>
        </div>
      )}

      <div style={{position:"absolute",bottom:24,fontSize:11,color:ch.inkSoft,textAlign:"center",fontStyle:"italic"}}>
        Match 3+ · Collect relics · Beat the Hollow
      </div>

      {showScores&&(
        <div style={{position:"fixed",inset:0,background:"rgba(90,74,58,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={()=>setShowScores(false)}>
          <Card ch={ch} style={{minWidth:280,maxWidth:340,padding:24}} onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:FF_SERIF,fontWeight:600,fontStyle:"italic",fontSize:20,marginBottom:16,textAlign:"center",color:ch.ink}}>🏆 High Scores</div>
            {highScores.length===0&&<div style={{color:ch.inkSoft,textAlign:"center",fontSize:13}}>No runs completed yet.</div>}
            {highScores.map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${ch.frame}55`,fontSize:13,color:ch.ink}}>
                <span style={{color:ch.inkSoft,width:24}}>#{i+1}</span>
                <span style={{flex:1,fontWeight:700,fontFamily:"monospace",letterSpacing:1}}>{s.seed}</span>
                <span style={{fontSize:11,marginRight:8,color:s.outcome==="win"?"#6a994f":"#cd6a5e",fontWeight:700}}>{s.outcome==="win"?"WIN":"L"+s.levelsCleared}</span>
                <span style={{fontWeight:800,color:ch.starStroke}}>{s.totalScore.toLocaleString()}</span>
              </div>
            ))}
            <Btn onClick={()=>setShowScores(false)} style={{marginTop:16,width:"100%",background:ch.pillBg,color:ch.ink,border:`1.5px solid ${ch.frame}`}}>Close</Btn>
          </Card>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RUN MAP SCREEN
// ═══════════════════════════════════════════════════════════════════
function RunMapScreen({run,onPlay,onHome}){
  const{vw,vh}=useViewport();
  const isSmall=vw<375;
  const maxW=Math.min(vw-24,420);
  const currentIdx=run.levelResults.length;
  const nextDef=LEVEL_DEFS[currentIdx];
  const mapSeason=nextDef?getSeason(nextDef.ante):"spring";
  const ch=getCh(mapSeason);
  const totalScore=run.levelResults.reduce((s,r)=>s+r.score,0);
  const anteGroups=[1,2,3,4].map(a=>LEVEL_DEFS.filter(l=>l.ante===a));

  const objLabel=def=>{
    const season=getSeason(def.ante);
    if(def.objective.type==="score")   return `Score ${def.objective.target.toLocaleString()}`;
    if(def.objective.type==="cascade") return `Chain ×${def.objective.target}`;
    if(def.objective.type==="quota"){
      const ci=def.objective.colorIndex??getQuotaColor(run.seed,def.level-1,def.colors);
      return `Clear ${def.objective.target}× ${getCandy(ci,season).name}`;
    }
    return"???";
  };

  return(
    <div style={{fontFamily:FF_SANS,background:ch.pageWash,minHeight:"100vh",
      display:"flex",flexDirection:"column",alignItems:"center",padding:"14px 12px 32px",
      color:ch.ink,userSelect:"none",WebkitUserSelect:"none",position:"relative",overflow:"hidden"}}>
      <SeasonDots ch={ch}/>

      <div style={{width:"100%",maxWidth:maxW,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,position:"relative",zIndex:1}}>
        <button onClick={onHome} style={{background:"transparent",border:"none",color:ch.inkSoft,fontSize:13,cursor:"pointer",fontFamily:FF_SANS,fontWeight:600}}>← Home</button>
        <Title text="Your Run" ch={ch} size={20}/>
        <div style={{fontSize:12,fontFamily:"monospace",background:ch.pillBg,border:`1px solid ${ch.frame}`,padding:"3px 10px",borderRadius:20,letterSpacing:2,color:ch.ink}}>{run.seed}</div>
      </div>

      {/* Score summary */}
      <div style={{width:"100%",maxWidth:maxW,display:"flex",gap:12,marginBottom:12,position:"relative",zIndex:1}}>
        <Card ch={ch} style={{flex:1,padding:"10px 14px",textAlign:"center"}}>
          <div style={{fontSize:10,color:ch.inkSoft,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>Total Score</div>
          <div style={{fontFamily:FF_SERIF,fontSize:20,fontWeight:600,color:ch.starStroke}}>{totalScore.toLocaleString()}</div>
        </Card>
        <Card ch={ch} style={{flex:1,padding:"10px 14px",textAlign:"center"}}>
          <div style={{fontSize:10,color:ch.inkSoft,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>Relics</div>
          <div style={{fontFamily:FF_SERIF,fontSize:20,fontWeight:600,color:ch.accent}}>{run.relics.length}</div>
        </Card>
      </div>

      {/* Pending boon banner */}
      {run.pendingBoon&&(
        <div style={{width:"100%",maxWidth:maxW,marginBottom:10,position:"relative",zIndex:1}}>
          <Card ch={ch} style={{padding:"10px 14px",
            border:`1.5px solid ${ch.starFill}`,
            boxShadow:`0 0 10px ${ch.starFill}44`}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:22}}>{run.pendingBoon.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:FF_SERIF,fontWeight:600,fontSize:13,color:ch.ink}}>{run.pendingBoon.name}</div>
                <div style={{fontSize:11,color:ch.inkSoft,marginTop:1}}>{run.pendingBoon.effect}</div>
              </div>
              <span style={{fontSize:10,color:ch.starStroke,fontWeight:700,border:`1px solid ${ch.starFill}99`,borderRadius:8,padding:"2px 6px",whiteSpace:"nowrap"}}>NEXT LEVEL</span>
            </div>
          </Card>
        </div>
      )}

      {/* Level list */}
      <div style={{width:"100%",maxWidth:maxW,display:"flex",flexDirection:"column",gap:8,overflowY:"auto",maxHeight:`calc(${vh}px - 280px)`,paddingBottom:4,position:"relative",zIndex:1}}>
        {anteGroups.map((levels,anteI)=>{
          const ante=anteI+1;
          const s=SEASONS[getSeason(ante)];
          return(
            <div key={ante}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:ch.inkSoft,textTransform:"uppercase",marginBottom:4,marginTop:anteI>0?8:0,display:"flex",alignItems:"center",gap:6}}>
                <span>{s.motif}</span><span>{ANTE_LABELS[ante]} · {s.label}</span>
              </div>
              {levels.map(def=>{
                const idx=def.level-1,result=run.levelResults[idx];
                const isCurrent=idx===currentIdx,isFuture=idx>currentIdx,passed=result?.passed;
                const levelSeason=getSeason(def.ante),lch=getCh(levelSeason);
                const cfg=LEVEL_OBSTACLE_CONFIGS[idx]??{};
                const obsIcons=[
                  cfg.frosted&&{icon:"❄",tip:"Frosted"},
                  cfg.jelly&&{icon:"🟣",tip:"Jelly"},
                  cfg.stone&&{icon:"🪨",tip:"Stone"},
                  cfg.chocolate&&{icon:"🍫",tip:"Chocolate"},
                  cfg.locked&&{icon:"🔒",tip:"Locked"},
                ].filter(Boolean);
                return(
                  <Card key={def.level} ch={{boardTop:lch.boardTop,boardBot:lch.boardBot,frame:lch.frame}} style={{
                    padding:"10px 14px",opacity:isFuture?0.5:1,
                    border:isCurrent?`2px solid ${lch.accent}`:undefined,
                    boxShadow:isCurrent?`0 0 12px ${lch.accent}44, inset 1px 0 rgba(255,255,255,0.7), 0 2px 8px rgba(80,60,40,0.12)`:undefined,
                  }}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{fontSize:18,width:24,textAlign:"center"}}>{def.type==="boss"?"👑":def.type==="finale"?"🏆":isCurrent?"▶":passed?"✓":result?"✗":"○"}</div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                          <span style={{fontFamily:FF_SERIF,fontWeight:600,fontSize:14,color:lch.ink}}>Level {def.level}</span>
                          {def.type==="boss"&&<span style={{fontSize:9,background:`${lch.starFill}55`,color:lch.starStroke,padding:"1px 6px",borderRadius:8,fontWeight:700}}>BOSS</span>}
                          {def.type==="finale"&&<span style={{fontSize:9,background:`${lch.accent}22`,color:lch.accent,padding:"1px 6px",borderRadius:8,fontWeight:700}}>FINALE</span>}
                          <span style={{fontSize:10,color:lch.inkSoft}}>{def.colors}c</span>
                          {obsIcons.length>0&&<span style={{fontSize:11,letterSpacing:1}}>{obsIcons.map(o=>o.icon).join("")}</span>}
                        </div>
                        <div style={{fontSize:12,color:lch.inkSoft}}>{objLabel(def)}</div>
                        {def.modifier&&<div style={{fontSize:11,color:lch.accent,marginTop:2}}>{MODIFIER_INFO[def.modifier]?.icon} {MODIFIER_INFO[def.modifier]?.label}</div>}
                      </div>
                      {result&&<div style={{textAlign:"right"}}>
                        <div style={{fontFamily:FF_SERIF,fontWeight:600,fontSize:14,color:passed?"#6a994f":"#cd6a5e"}}>{result.score.toLocaleString()}</div>
                        <div style={{fontSize:10,color:lch.inkSoft}}>{result.movesRemaining}mv left</div>
                      </div>}
                    </div>
                  </Card>
                );
              })}
            </div>
          );
        })}
      </div>

      {run.relics.length>0&&(
        <div style={{width:"100%",maxWidth:maxW,marginTop:12,position:"relative",zIndex:1}}>
          <div style={{fontSize:10,color:ch.inkSoft,letterSpacing:1.5,marginBottom:6,textTransform:"uppercase",fontWeight:700}}>Relics Held</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{run.relics.map(r=><RelicBadge key={r.id} relic={r} ch={ch}/>)}</div>
        </div>
      )}

      {currentIdx<LEVEL_DEFS.length&&(
        <Btn onClick={onPlay} style={{
          marginTop:14,position:"relative",zIndex:1,
          background:`linear-gradient(135deg,${ch.accent},${ch.starStroke})`,
          color:"white",boxShadow:`0 6px 20px ${ch.accent}55`,
          fontSize:15,padding:"14px 48px",
        }}>
          {SEASONS[mapSeason].motif} Play Level {currentIdx+1}
        </Btn>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DRAFT SCREEN
// ═══════════════════════════════════════════════════════════════════
function DraftScreen({options,onPick,onSkip,levelResult,isBossComplete,bonusPick}){
  const[picked,setPicked]=useState(null);
  const season=getSeason(levelResult.levelDef?.ante??1);
  const ch=getCh(season);
  const doSelect=item=>{setPicked(item.id);setTimeout(()=>onPick(item),350);};

  return(
    <div style={{fontFamily:FF_SANS,background:ch.pageWash,minHeight:"100vh",
      display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 12px 32px",
      color:ch.ink,userSelect:"none",WebkitUserSelect:"none",position:"relative",overflow:"hidden"}}>
      <SeasonDots ch={ch}/>

      {/* Level clear banner */}
      <Card ch={ch} style={{width:"100%",maxWidth:380,marginBottom:16,textAlign:"center",padding:"16px 20px",
        border:`2px solid ${ch.starFill}`,boxShadow:`0 0 16px ${ch.starFill}55, inset 1px 0 rgba(255,255,255,0.8), 0 2px 8px rgba(80,60,40,0.12)`,
        position:"relative",zIndex:1}}>
        <div style={{fontSize:28,marginBottom:4}}>{SEASONS[season].motif}</div>
        <div style={{fontFamily:FF_SERIF,fontWeight:600,fontStyle:"italic",fontSize:20,color:ch.ink,marginBottom:4}}>Level {levelResult.level} Cleared!</div>
        <div style={{fontSize:13,color:ch.inkSoft}}>{levelResult.score.toLocaleString()} pts · {levelResult.movesRemaining} moves remaining</div>
        {isBossComplete&&<div style={{marginTop:6,fontSize:12,color:ch.starStroke,fontWeight:700}}>👑 Boss Cleared — rare relic guaranteed!</div>}
        {bonusPick&&<div style={{marginTop:4,fontSize:12,color:"#4a93b8",fontWeight:700}}>🎀 Bonus Pick — 4 options!</div>}
      </Card>

      <div style={{fontFamily:FF_SERIF,fontStyle:"italic",fontSize:18,marginBottom:12,color:ch.ink,position:"relative",zIndex:1}}>Choose a Relic or Boon</div>

      <div style={{width:"100%",maxWidth:380,display:"flex",flexDirection:"column",gap:10,position:"relative",zIndex:1}}>
        {options.map(item=>{
          const isBoon=item.type==="boon";
          const cat=!isBoon?(RELIC_CATEGORIES[item.cat]??{label:item.cat,color:"#9a8a74"}):null;
          const rar=!isBoon?RARITY_STYLE[item.rar]:null;
          const isSel=picked===item.id;
          const accentColor=isBoon?ch.starFill:(rar?.color??"#9a8a74");
          return(
            <Card key={item.id} ch={ch}
              onClick={()=>!picked&&doSelect(item)}
              style={{
                padding:"14px 16px",cursor:"pointer",
                background:isBoon
                  ?`linear-gradient(180deg,${ch.boardTop},${ch.starFill}22)`
                  :`linear-gradient(180deg,${ch.boardTop},${ch.boardBot})`,
                border:isSel?`2px solid ${accentColor}`:`1.5px solid ${isBoon?`${ch.starFill}88`:ch.frame}`,
                boxShadow:isSel
                  ?`0 0 16px ${accentColor}55, inset 1px 0 rgba(255,255,255,0.8), 0 2px 8px rgba(80,60,40,0.15)`
                  :isBoon?`0 0 8px ${ch.starFill}33, inset 1px 0 rgba(255,255,255,0.6)`
                  :`inset 1px 0 rgba(255,255,255,0.6), 0 2px 6px rgba(80,60,40,0.1)`,
                transform:isSel?"scale(0.98)":"scale(1)",transition:"all 0.2s",
              }}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{fontSize:26,lineHeight:1}}>{item.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                    <span style={{fontFamily:FF_SERIF,fontWeight:600,fontSize:15,color:ch.ink}}>{item.name}</span>
                    {isBoon
                      ?<span style={{fontSize:9,color:ch.starStroke,fontWeight:700,padding:"1px 6px",border:`1px solid ${ch.starFill}99`,borderRadius:8}}>ONE LEVEL</span>
                      :<span style={{fontSize:9,color:rar.color,fontWeight:700,padding:"1px 6px",border:`1px solid ${rar.color}66`,borderRadius:8}}>{"★".repeat({common:1,uncommon:2,rare:3}[item.rar])} {rar.label}</span>}
                  </div>
                  <div style={{fontSize:11,fontWeight:700,marginBottom:4,letterSpacing:0.5,textTransform:"uppercase",
                    color:isBoon?ch.starStroke:cat.color}}>
                    {isBoon?"Boon":cat.label}
                  </div>
                  <div style={{fontSize:12,color:ch.inkSoft,lineHeight:1.5}}>{item.effect}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <button onClick={onSkip} style={{marginTop:14,background:"transparent",border:"none",color:ch.inkSoft,fontSize:13,cursor:"pointer",fontFamily:FF_SANS,fontStyle:"italic",position:"relative",zIndex:1}}>
        Skip →
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RUN COMPLETE SCREEN
// ═══════════════════════════════════════════════════════════════════
function RunCompleteScreen({run,onHome}){
  const won=run.levelResults.length===LEVEL_DEFS.length&&run.levelResults[LEVEL_DEFS.length-1]?.passed;
  const totalScore=run.levelResults.reduce((s,r)=>s+r.score,0);
  const cleared=run.levelResults.filter(r=>r.passed).length;
  const season=won?"winter":"fall";
  const ch=getCh(season);

  return(
    <div style={{fontFamily:FF_SANS,background:ch.pageWash,minHeight:"100vh",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:"20px",color:ch.ink,userSelect:"none",position:"relative",overflow:"hidden"}}>
      <SeasonDots ch={ch}/>
      <div style={{fontSize:56,marginBottom:8}}>{won?"🏆":"🍂"}</div>
      <Title text={won?"Run Complete!":"Run Over"} ch={ch} size={28}/>
      <div style={{fontSize:13,color:ch.inkSoft,marginBottom:28,fontStyle:"italic"}}>Seed: {run.seed}</div>

      <Card ch={ch} style={{width:"100%",maxWidth:360,marginBottom:20,position:"relative",zIndex:1}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[["Total Score",ch.starStroke,totalScore.toLocaleString()],["Levels Cleared","#6a994f",`${cleared} / ${LEVEL_DEFS.length}`],
            ["Relics Held",ch.accent,run.relics.length],["Outcome",won?"#6a994f":"#cd6a5e",won?"Victory":"Defeat"]].map(([label,color,val])=>(
            <div key={label} style={{textAlign:"center",padding:"10px 0"}}>
              <div style={{fontSize:10,color:ch.inkSoft,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{label}</div>
              <div style={{fontFamily:FF_SERIF,fontSize:18,fontWeight:600,color}}>{val}</div>
            </div>
          ))}
        </div>
      </Card>

      {run.relics.length>0&&(
        <div style={{width:"100%",maxWidth:360,marginBottom:20,position:"relative",zIndex:1}}>
          <div style={{fontSize:10,color:ch.inkSoft,letterSpacing:1.5,marginBottom:8,textTransform:"uppercase",fontWeight:700}}>Relics Collected</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{run.relics.map(r=><RelicBadge key={r.id} relic={r} size={42} ch={ch}/>)}</div>
        </div>
      )}

      <Btn onClick={onHome} style={{background:`linear-gradient(135deg,${ch.accent},${ch.starStroke})`,color:"white",boxShadow:`0 6px 20px ${ch.accent}55`,fontSize:15,padding:"14px 48px",position:"relative",zIndex:1}}>
        {SEASONS[season].motif} Back to Home
      </Btn>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GAME SCREEN
// ═══════════════════════════════════════════════════════════════════
function GameScreen({levelDef,run,onComplete}){
  const{vw,vh}=useViewport();
  const cellSize=computeCell(vw);  // renamed from `cell` to avoid shadowing grid-cell map params
  const levelIdx=run.levelResults.length;
  const boon=run.pendingBoon??null;
  const season=getSeason(levelDef.ante);
  const ch=getCh(season);
  const s=SEASONS[season];
  // Boon-modified parameters
  const numColors=Math.max(4,levelDef.colors-(boon?.id==="b3"?1:0));
  const maxMovesBase=MAX_MOVES+(boon?.id==="b2"?5:0);
  const jellyFeastActive=boon?.id==="b6";

  const objective={
    ...levelDef.objective,
    colorIndex:levelDef.objective.type==="quota"?getQuotaColor(run.seed,levelIdx,numColors):undefined,
  };

  const relicCtx=useRef(null);
  if(!relicCtx.current){
    const ctx=buildRelicContext(run.relics);
    ctx.ids=new Set(run.relics.map(r=>r.id));
    ctx.resetLevel();
    relicCtx.current=ctx;
  }
  const ctx=relicCtx.current;

  const[grid,    setGrid]   =useState(()=>makeLevelGrid(run.seed,levelIdx,numColors,boon));
  const[selected,setSelected]=useState(null);
  const[score,   setScore]  =useState(0);
  const[moves,   setMoves]  =useState(maxMovesBase);
  const[popping, setPopping]=useState(new Set());
  const[comboMsg,setComboMsg]=useState(null);
  const[relicMsg,setRelicMsg]=useState(null);
  const[lastGain,setLastGain]=useState(null);
  const[phase,   setPhase]  =useState("play");
  const[quotaProgress,setQuotaProgress]=useState(0);
  const[maxCascade,setMaxCascade]=useState(0);

  const gridRef =useRef(grid);     gridRef.current=grid;
  const scoreRef=useRef(score);    scoreRef.current=score;
  const movesRef=useRef(moves);    movesRef.current=moves;
  const quotaRef=useRef(quotaProgress); quotaRef.current=quotaProgress;
  const maxCasRef=useRef(maxCascade);   maxCasRef.current=maxCascade;
  const busyRef =useRef(false);
  const touchRef=useRef(null);
  const phaseRef=useRef(phase);    phaseRef.current=phase;
  const completedRef=useRef(false);

  const showRelicMsg=useCallback(msgs=>{
    if(!msgs.length)return;
    setRelicMsg(msgs.join("  ·  "));
    setTimeout(()=>setRelicMsg(null),1800);
  },[]);

  const finishLevel=useCallback((passed,finalScore,finalMoves)=>{
    if(completedRef.current)return;
    completedRef.current=true;
    const{bonus,events}=ctx.onLevelEnd(finalMoves);
    const reportScore=finalScore+bonus;
    if(events.length)showRelicMsg(events);
    setTimeout(()=>onComplete({passed,score:reportScore,movesRemaining:finalMoves,level:levelDef.level}),900);
  },[onComplete,levelDef.level,ctx,showRelicMsg]);

  useEffect(()=>{
    if(phase==="win") finishLevel(true, scoreRef.current,movesRef.current);
    if(phase==="lose")finishLevel(false,scoreRef.current,0);
  },[phase,finishLevel]);

  const checkObjective=useCallback((ns,nq,nc,nm)=>{
    if(phaseRef.current!=="play")return;
    if(objective.type==="score"  &&ns>=objective.target){setPhase("win");return;}
    if(objective.type==="quota"  &&nq>=objective.target){setPhase("win");return;}
    if(objective.type==="cascade"&&nc>=objective.target){setPhase("win");return;}
    if(nm<=0)setPhase("lose");
  },[objective]);

  const applyMutations=useCallback(async(currentGrid,{spawns,extraClr,events})=>{
    if(!spawns.length&&!extraClr.length)return currentGrid;
    const g=clone(currentGrid);
    if(extraClr.length){
      const popKeys=new Set(extraClr.map(({r,c})=>`${r},${c}`));
      setPopping(popKeys);await delay(320);setPopping(new Set());
      extraClr.forEach(({r,c})=>{g[r][c]=null;});
      const filled=gravityFill(g,numColors);
      setGrid(filled);await delay(220);
      if(events.length)showRelicMsg(events);
      const g2=clone(filled);
      spawns.forEach(({r,c,type,special})=>{g2[r][c]=makeCell(type,special);});
      setGrid(g2);return g2;
    }
    spawns.forEach(({r,c,type,special})=>{g[r][c]=makeCell(type,special);});
    setGrid(g);if(events.length)showRelicMsg(events);return g;
  },[numColors,showRelicMsg]);

  const runSwap=useCallback(async(r1,c1,r2,c2)=>{
    if(busyRef.current||phaseRef.current!=="play")return;
    busyRef.current=true;setSelected(null);

    const typeNorm=ctx.getTypeNorm();
    const g=clone(gridRef.current);
    [g[r1][c1],g[r2][c2]]=[g[r2][c2],g[r1][c1]];

    const cbA=g[r1][c1]?.special===SPECIAL.COLOR_BOMB;
    const cbB=g[r2][c2]?.special===SPECIAL.COLOR_BOMB;
    const hasColorBomb=cbA||cbB;
    const firstResult=processMatches(g,r1,c1,r2,c2,typeNorm,ctx);

    if(!firstResult&&!hasColorBomb){
      setGrid(g);await delay(180);
      const back=clone(g);[back[r1][c1],back[r2][c2]]=[back[r2][c2],back[r1][c1]];setGrid(back);
      busyRef.current=false;return;
    }

    const newMoves=movesRef.current-1;setMoves(newMoves);

    // ── Color-bomb swap ───────────────────────────────────────────
    if(hasColorBomb){
      const cbPos=cbA?[r1,c1]:[r2,c2],otherPos=cbA?[r2,c2]:[r1,c1];
      const[cbR,cbC]=cbPos,[otherR,otherC]=otherPos;
      const otherCell=g[otherR][otherC];
      const otherIsCB=otherCell?.special===SPECIAL.COLOR_BOMB;
      g[cbR][cbC]={...g[cbR][cbC],special:SPECIAL.NONE};
      if(otherIsCB)g[otherR][otherC]={...otherCell,special:SPECIAL.NONE};
      const seed2=new Set([`${r1},${c1}`,`${r2},${c2}`]);
      if(otherIsCB){
        for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)seed2.add(`${r},${c}`);
      }else{
        const otherSpecial=otherCell?.special??SPECIAL.NONE,targetType=otherCell?.type;
        if(otherSpecial===SPECIAL.STRIPED_H||otherSpecial===SPECIAL.STRIPED_V){
          for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const cell=g[r][c];if(!cell||cell.type!==targetType)continue;const k=`${r},${c}`;if(!seed2.has(k)){g[r][c]={...cell,special:(r+c)%2===0?SPECIAL.STRIPED_H:SPECIAL.STRIPED_V};seed2.add(k);}}
        }else if(otherSpecial===SPECIAL.WRAPPED){
          for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const cell=g[r][c];if(!cell||cell.type!==targetType)continue;const k=`${r},${c}`;if(!seed2.has(k)){g[r][c]={...cell,special:SPECIAL.WRAPPED};seed2.add(k);}}
        }else if(targetType!==undefined){
          SPECIAL_REGISTRY[SPECIAL.COLOR_BOMB].activate(g,cbR,cbC,targetType).forEach(k=>seed2.add(k));
        }
      }
      const relicEvents=[];
      if(ctx.hasGrandFinale()){
        let nearest=null,bestDist=Infinity;
        for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
          const cell=g[r][c];
          if(cell&&cell.special!==SPECIAL.NONE&&!seed2.has(`${r},${c}`)){
            const dist=Math.abs(r-cbR)+Math.abs(c-cbC);
            if(dist<bestDist){bestDist=dist;nearest={r,c,cell};}
          }
        }
        if(nearest){const h=SPECIAL_REGISTRY[nearest.cell.special];if(h)h.activate(g,nearest.r,nearest.c,nearest.cell.type).forEach(k=>seed2.add(k));g[nearest.r][nearest.c]={...nearest.cell,special:SPECIAL.NONE};relicEvents.push("🎆 Grand Finale!");}
      }
      const expanded=expandWithSpecials(g,seed2,ctx);
      const gain=expanded.size*10;
      let newQuota=quotaRef.current;
      if(objective.type==="quota")expanded.forEach(k=>{const[r,c]=k.split(",").map(Number);if(g[r]?.[c]?.type===objective.colorIndex)newQuota++;});
      const next=clone(g);expanded.forEach(k=>{const[r,c]=k.split(",").map(Number);next[r][c]=null;});
      const filled=gravityFill(next,numColors);
      setGrid(g);await delay(120);setPopping(expanded);await delay(380);
      setPopping(new Set());setGrid(filled);
      const newScore=scoreRef.current+gain;setScore(newScore);
      setLastGain(gain);setTimeout(()=>setLastGain(null),700);
      if(objective.type==="quota")setQuotaProgress(newQuota);
      if(relicEvents.length)showRelicMsg(relicEvents);
      const{spawns:ms,bonusScore:mb,events:me}=ctx.onMoveEnd(true,otherCell?.type);
      let afterGrid=filled;
      if(ms.length||mb||me.length){afterGrid=await applyMutations(filled,{spawns:ms,extraClr:[],events:me});if(mb){setScore(ss=>ss+mb);setLastGain(mb);setTimeout(()=>setLastGain(null),700);}}
      busyRef.current=false;
      checkObjective(newScore+mb,newQuota,maxCasRef.current,newMoves);
      return;
    }

    // ── Normal cascade ────────────────────────────────────────────
    setGrid(g);
    const steps=computeCascade(g,r1,c1,r2,c2,numColors,typeNorm,ctx);
    let totalGain=0,newQuota=quotaRef.current,newMaxCas=maxCasRef.current;
    const allRuns=[],allMatched=new Set(),allRelicEvents=[];
    let butterCount=0,totalJelly=0,frostedClearedPos=[],totalChoco=0;

    if(steps.length>newMaxCas){newMaxCas=steps.length;setMaxCascade(newMaxCas);}

    for(let i=0;i<steps.length;i++){
      const{matched,gridAfter,rawGain,runs,gridBefore,jellyClears,frostedClears,stoneClears,chocoClears}=steps[i];
      runs.forEach(r=>allRuns.push(r));
      matched.forEach(k=>allMatched.add(k));
      totalJelly+=jellyClears?.length??0;
      frostedClears?.forEach(pos=>frostedClearedPos.push(pos));
      totalChoco+=(chocoClears?.length??0);
      if(ctx.ids.has("col3"))matched.forEach(k=>{const[r,c]=k.split(",").map(Number);if(gridBefore[r]?.[c]?.type===3)butterCount++;});
      if(objective.type==="quota")matched.forEach(k=>{const[r,c]=k.split(",").map(Number);if(gridBefore[r]?.[c]?.type===objective.colorIndex)newQuota++;});
      const{adjustedGain,events}=ctx.modifyStepScore(rawGain,i,matched,runs,gridBefore,{jelly:jellyClears?.length??0,jellyFeast:jellyFeastActive});
      if(events.length)allRelicEvents.push(...events);
      totalGain+=adjustedGain;

      setPopping(matched);
      if(i>=1){setComboMsg(`${i+1}× Combo!`);setTimeout(()=>setComboMsg(null),800);}
      await delay(360);setPopping(new Set());

      const displayGrid=(butterCount>0&&i===steps.length-1)?applyButterBias(gridAfter,butterCount):gridAfter;
      setGrid(displayGrid);
      setLastGain(adjustedGain);setTimeout(()=>setLastGain(null),700);
      await delay(240);
    }

    // Obstacle relic effects post-cascade
    const oRelicEvents=[];
    if(frostedClearedPos.length>0){
      const frostSpawns=ctx.onFrostedCleared(frostedClearedPos,gridRef.current);
      if(frostSpawns.length){
        const g2=clone(gridRef.current);
        frostSpawns.forEach(({r,c,type,special})=>{if(g2[r]?.[c]&&!g2[r][c].stone)g2[r][c]=makeCell(type,special);});
        setGrid(g2);oRelicEvents.push("🧊 Frost Breaker!");
      }
    }
    if(totalChoco>0&&ctx.getChocoConverterColor(gridRef.current)!=null)oRelicEvents.push("🍫 Choc Converter!");

    // Chocolate spreading — once after all cascade steps resolve
    if(steps.length>0){
      const postSpread=spreadChocolate(gridRef.current,allMatched);
      setGrid(postSpread);
    }

    if([...allRelicEvents,...oRelicEvents].length>0)showRelicMsg([...new Set([...allRelicEvents,...oRelicEvents])]);
    if(objective.type==="quota")setQuotaProgress(newQuota);
    const newScore=scoreRef.current+totalGain;setScore(newScore);

    const primaryColor=steps.length>0&&steps[0].runs.length>0?steps[0].runs.reduce((a,b)=>a.cells.length>=b.cells.length?a:b).type:undefined;
    const currentGrid=gridRef.current;
    const cascadeMuts=ctx.postCascadeMutations(allRuns,allMatched,currentGrid);
    let afterGrid=currentGrid;
    if(cascadeMuts.spawns.length||cascadeMuts.extraClr.length||cascadeMuts.events.length)
      afterGrid=await applyMutations(currentGrid,cascadeMuts);

    const hadCascade=steps.length>0;
    const{spawns:ms,bonusScore:mb,events:me}=ctx.onMoveEnd(hadCascade,primaryColor);
    if(ms.length||mb||me.length)afterGrid=await applyMutations(afterGrid,{spawns:ms,extraClr:[],events:me});

    const finalScore=newScore+mb;
    if(mb){setScore(finalScore);setLastGain(mb);setTimeout(()=>setLastGain(null),700);}
    busyRef.current=false;
    checkObjective(finalScore,newQuota,newMaxCas,newMoves);
  },[numColors,objective,checkObjective,ctx,applyMutations,showRelicMsg,jellyFeastActive]);

  const handleTap=useCallback((r,c)=>{
    if(busyRef.current||phaseRef.current!=="play")return;
    const cell=gridRef.current[r]?.[c];
    if(cell?.stone||cell?.chocolate||cell?.frosted===2)return; // unselectable obstacles
    if(!selected){setSelected({r,c});return;}
    if(selected.r===r&&selected.c===c){setSelected(null);return;}
    if(Math.abs(r-selected.r)+Math.abs(c-selected.c)===1)runSwap(selected.r,selected.c,r,c);
    else setSelected({r,c});
  },[selected,runSwap]);

  const onTouchStart=useCallback((e,r,c)=>{e.preventDefault();touchRef.current={r,c,x:e.touches[0].clientX,y:e.touches[0].clientY};},[]);
  const onTouchEnd=useCallback((e,r,c)=>{
    e.preventDefault();if(!touchRef.current)return;
    const dx=e.changedTouches[0].clientX-touchRef.current.x,dy=e.changedTouches[0].clientY-touchRef.current.y;
    const{r:sr,c:sc}=touchRef.current;touchRef.current=null;
    if(Math.sqrt(dx*dx+dy*dy)<14){handleTap(r,c);return;}
    if(Math.abs(dx)>=Math.abs(dy)){const tc=sc+(dx>0?1:-1);if(tc>=0&&tc<COLS)runSwap(sr,sc,sr,tc);}
    else{const tr=sr+(dy>0?1:-1);if(tr>=0&&tr<ROWS)runSwap(sr,sc,tr,sc);}
  },[handleTap,runSwap]);

  // Positional highlights — season-aware colours
  const positionalHighlights=useMemo(()=>{
    const ids=ctx.ids, map={};
    const sage=getCandy(1,season),sky=getCandy(4,season),butter=getCandy(3,season);
    if(ids.has("p1")){for(let c=0;c<COLS;c++){map[`${ROWS-2},${c}`]={border:`1.5px solid ${sage.base}bb`,shadow:`inset 0 0 5px ${sage.base}30`};map[`${ROWS-1},${c}`]={border:`1.5px solid ${sage.base}bb`,shadow:`inset 0 0 5px ${sage.base}30`};}}
    if(ids.has("p2")){[[0,0],[0,COLS-1],[ROWS-1,0],[ROWS-1,COLS-1]].forEach(([r,c])=>{map[`${r},${c}`]={border:`2px solid ${sky.base}`,shadow:`inset 0 0 6px ${sky.base}40`};});}
    if(ids.has("p4")){for(let r=2;r<=5;r++)for(let c=2;c<=5;c++)map[`${r},${c}`]={border:`1px solid ${butter.base}99`,shadow:`inset 0 0 4px ${butter.base}28`};}
    return map;
  },[ctx.ids,season]);

  // Objective progress bar
  const renderObjective=()=>{
    const{type,target,colorIndex}=objective;
    if(type==="score"){
      const prog=Math.min(score/target,1);
      return(<div style={{width:"100%",marginBottom:6}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:ch.inkSoft,marginBottom:4,fontFamily:FF_SANS,fontWeight:600}}>
          <span>{score.toLocaleString()} <span style={{color:ch.ink,fontWeight:700}}>pts</span></span>
          <span>Goal: {target.toLocaleString()}</span>
        </div>
        <div style={{height:10,borderRadius:999,background:ch.progressTrack,border:`1px solid ${ch.progressBorder}`,overflow:"hidden",position:"relative"}}>
          <div style={{width:`${prog*100}%`,height:"100%",background:ch.progressFill,borderRadius:999,boxShadow:"inset 0 1px 1px #ffffff80",transition:"width 0.5s ease"}}/>
          {[0.33,0.66].map((p,i)=>(
            <div key={i} style={{position:"absolute",top:-3,bottom:-3,left:`calc(${p*100}% - 6px)`,width:12,height:16,borderRadius:"50%",background:ch.starFill,border:`1.5px solid ${ch.starStroke}`,boxShadow:"0 1px 2px rgba(80,60,40,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:ch.starStroke}}>★</div>
          ))}
        </div>
      </div>);
    }
    if(type==="quota"){
      const cc=getCandy(colorIndex,season),prog=Math.min(quotaProgress/target,1);
      return(<div style={{width:"100%",marginBottom:6}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:ch.inkSoft,marginBottom:4,fontFamily:FF_SANS,fontWeight:600}}>
          <span style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:10,height:10,borderRadius:"50%",background:cc.base,display:"inline-block",border:`1px solid ${cc.deep}`}}/>
            {quotaProgress}/{target} {cc.name}
          </span>
          <span>{score.toLocaleString()} pts</span>
        </div>
        <div style={{height:10,borderRadius:999,background:ch.progressTrack,border:`1px solid ${ch.progressBorder}`,overflow:"hidden"}}>
          <div style={{width:`${prog*100}%`,height:"100%",background:`linear-gradient(90deg,${cc.light},${cc.base})`,borderRadius:999,transition:"width 0.5s ease"}}/>
        </div>
      </div>);
    }
    if(type==="cascade"){
      return(<div style={{width:"100%",marginBottom:6}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:ch.inkSoft,marginBottom:4,fontFamily:FF_SANS,fontWeight:600}}>
          <span>Best chain: <b style={{color:ch.accent}}>{maxCascade}×</b> / {target}×</span>
          <span>{score.toLocaleString()} pts</span>
        </div>
        <div style={{height:10,borderRadius:999,background:ch.progressTrack,border:`1px solid ${ch.progressBorder}`,overflow:"hidden"}}>
          <div style={{width:`${Math.min(maxCascade/target,1)*100}%`,height:"100%",background:`linear-gradient(90deg,${ch.accent},${ch.starStroke})`,borderRadius:999,transition:"width 0.5s ease"}}/>
        </div>
      </div>);
    }
  };

  const BW=COLS*cellSize+8,BH=ROWS*cellSize+8;
  const hPad=Math.max(4,Math.floor((vw-BW)/2)); // centre board with minimal side padding

  return(
    <div style={{fontFamily:FF_SANS,background:ch.pageWash,minHeight:"100vh",
      display:"flex",flexDirection:"column",alignItems:"center",padding:`${Math.min(14,Math.floor(vh*0.016))}px ${hPad}px 16px`,
      color:ch.ink,userSelect:"none",WebkitUserSelect:"none",WebkitTouchCallout:"none",position:"relative"}}>
      <SeasonDots ch={ch}/>

      {/* Level header */}
      <div style={{width:BW,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,position:"relative",zIndex:1}}>
        <div style={{fontFamily:FF_SERIF,fontSize:13,fontWeight:600,fontStyle:"italic",color:ch.ink}}>
          {s.motif} {s.label} · Level {levelDef.level}
        </div>
        <div style={{fontSize:11,color:ch.inkSoft,fontWeight:600,letterSpacing:0.5}}>{numColors} colours</div>
        {levelDef.modifier&&<div style={{fontSize:11,color:ch.accent,fontWeight:700}}>{MODIFIER_INFO[levelDef.modifier]?.icon} {MODIFIER_INFO[levelDef.modifier]?.label}</div>}
      </div>

      {/* Objective */}
      <div style={{width:BW,position:"relative",zIndex:1}}>{renderObjective()}</div>

      {/* Moves */}
      <div style={{
        display:"inline-flex",alignItems:"center",gap:8,marginBottom:8,
        background:ch.pillBg,border:`1.5px solid ${ch.pillBorder}`,
        borderRadius:999,padding:"4px 14px",position:"relative",zIndex:1,
      }}>
        <span style={{fontSize:11,color:ch.inkSoft,fontWeight:600,letterSpacing:0.5}}>MOVES</span>
        <span style={{fontFamily:FF_SERIF,fontWeight:600,fontSize:18,color:moves<=5?"#cd6a5e":ch.ink}}>{moves}</span>
      </div>

      {/* Board */}
      <div style={{position:"relative",width:BW,height:BH,
        background:`linear-gradient(180deg,${ch.boardTop} 0%,${ch.boardBot} 100%)`,
        borderRadius:18,border:`2px solid ${ch.frame}`,
        boxShadow:`inset 0 0 0 1px ${ch.innerHi},inset 0 2px 6px ${ch.innerSh},0 6px 18px rgba(80,60,40,0.18)`,
        overflow:"hidden",flexShrink:0,zIndex:1}}>

        {/* Cell backgrounds — jelly underlay + positional highlights */}
        {Array.from({length:ROWS},(_,r)=>Array.from({length:COLS},(_,c)=>{
          const cell=grid[r]?.[c];
          const hl=positionalHighlights[`${r},${c}`];
          const isJelly=cell?.jelly&&!popping.has(`${r},${c}`);
          return(
            <div key={`bg-${r}-${c}`} style={{
              position:"absolute",left:c*cellSize+4,top:r*cellSize+4,width:cellSize-2,height:cellSize-2,borderRadius:8,
              background:isJelly?`linear-gradient(180deg,rgba(160,80,200,0.22),rgba(120,50,170,0.14))`:(r+c)%2===0?`${ch.frame}22`:`${ch.frame}0e`,
              border:isJelly?`1.5px solid rgba(180,100,220,0.55)`:hl?hl.border:"1px solid transparent",
              boxShadow:hl?hl.shadow:"none",
              pointerEvents:"none",transition:"background 0.25s,border-color 0.25s",
            }}/>
          );
        }))}

        {/* Candy / obstacle cells */}
        {grid.map((row,r)=>row.map((cell,c)=>{
          if(!cell)return null;
          const key=`${r},${c}`,isPop=popping.has(key),isSel=selected?.r===r&&selected?.c===c;

          if(cell.stone)return <div key={cell.id} style={{position:"absolute",left:c*cellSize+4,top:r*cellSize+4,width:cellSize-4,height:cellSize-4,transition:"opacity 0.28s",opacity:isPop?0:1}}><StoneCell size={cellSize-4} ch={ch}/></div>;

          if(cell.chocolate)return <div key={cell.id} style={{position:"absolute",left:c*cellSize+4,top:r*cellSize+4,width:cellSize-4,height:cellSize-4,transition:"transform 0.22s,opacity 0.28s",transform:isPop?"scale(0) rotate(20deg)":"scale(1)",opacity:isPop?0:1}}><ChocolateCell size={cellSize-4}/></div>;

          return(
            <div key={cell.id} style={{position:"absolute",left:c*cellSize+4,top:r*cellSize+4,width:cellSize-4,height:cellSize-4,
              transition:"transform 0.22s cubic-bezier(0.34,1.56,0.64,1),opacity 0.28s ease",
              transform:isPop?"scale(0) rotate(30deg)":isSel?"scale(1.15)":"scale(1)",
              opacity:isPop?0:1,zIndex:isSel?20:1,cursor:cell.frosted===2||cell.stone?"default":"pointer"}}
              onClick={()=>handleTap(r,c)} onTouchStart={e=>onTouchStart(e,r,c)} onTouchEnd={e=>onTouchEnd(e,r,c)}>
              <CottageGem typeIndex={cell.type} season={season} size={cellSize-4} special={cell.special} selected={isSel&&cell.frosted!==2}/>
              {cell.frosted&&<FrostedOverlay health={cell.frosted} size={cellSize-4}/>}
              {cell.locked&&<LockedOverlay size={cellSize-4}/>}
            </div>
          );
        }))}

        {/* Combo */}
        {comboMsg&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",zIndex:50}}>
          <div style={{fontFamily:FF_SERIF,fontWeight:600,fontStyle:"italic",fontSize:30,color:ch.starStroke,textShadow:`0 0 16px ${ch.starFill}cc`}}>{comboMsg}</div>
        </div>}

        {/* Relic event */}
        {relicMsg&&<div style={{position:"absolute",bottom:10,left:0,right:0,display:"flex",justifyContent:"center",pointerEvents:"none",zIndex:50}}>
          <div style={{fontSize:12,fontWeight:700,color:ch.accent,background:ch.boardTop+"ee",padding:"5px 12px",borderRadius:20,border:`1px solid ${ch.frame}`,maxWidth:"90%",textAlign:"center"}}>{relicMsg}</div>
        </div>}

        {/* Score gain */}
        {lastGain&&<div style={{position:"absolute",top:10,right:12,pointerEvents:"none",zIndex:50}}>
          <div style={{fontFamily:FF_SERIF,fontWeight:600,fontSize:18,color:ch.starStroke,animation:"floatUp 0.7s ease-out both"}}>+{lastGain}</div>
        </div>}

        {/* Win / Lose overlay */}
        {phase!=="play"&&<div style={{position:"absolute",inset:0,background:`${ch.boardTop}f0`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,zIndex:100,borderRadius:16}}>
          <div style={{fontSize:48}}>{phase==="win"?s.motif:"🍂"}</div>
          <div style={{fontFamily:FF_SERIF,fontWeight:600,fontStyle:"italic",fontSize:24,color:phase==="win"?ch.starStroke:"#cd6a5e"}}>{phase==="win"?"Level Clear!":"Level Failed"}</div>
          <div style={{fontSize:14,color:ch.inkSoft}}>{score.toLocaleString()} pts</div>
          <div style={{fontSize:12,color:ch.inkSoft,fontStyle:"italic",marginTop:4}}>Continuing run…</div>
        </div>}
      </div>

      {/* Relic rack */}
      {run.relics.length>0&&(
        <div style={{width:BW,marginTop:10,display:"flex",gap:6,flexWrap:"wrap",position:"relative",zIndex:1}}>
          {run.relics.map(r=><RelicBadge key={r.id} relic={r} ch={ch} size={30}/>)}
        </div>
      )}

      {/* Active boon indicator */}
      {boon&&(
        <div style={{width:BW,marginTop:6,display:"flex",alignItems:"center",gap:6,position:"relative",zIndex:1}}>
          <span style={{fontSize:14}}>{boon.icon}</span>
          <span style={{fontSize:11,color:ch.starStroke,fontWeight:700}}>{boon.name}</span>
          <span style={{fontSize:10,color:ch.inkSoft,fontStyle:"italic"}}>active this level</span>
        </div>
      )}

      {/* Special + obstacle legend */}
      <div style={{marginTop:8,display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"3px 12px",maxWidth:BW,position:"relative",zIndex:1}}>
        {[["━━","striped h","#9a8a74"],["|","striped v","#9a8a74"],["✦","wrapped","#c89a25"],["★","colour bomb","#c89a25"]].map(([sym,label,col])=>(
          <div key={label} style={{fontSize:10,color:ch.inkSoft,display:"flex",alignItems:"center",gap:3}}>
            <span style={{fontWeight:900,fontSize:11,color:col}}>{sym}</span>
            <span style={{fontFamily:FF_SANS}}>{label}</span>
          </div>
        ))}
      </div>
      {/* Obstacle legend — only shown if any obstacles exist */}
      {(()=>{
        const obsOnBoard=grid.some(row=>row.some(c=>c?.stone||c?.chocolate||c?.frosted||c?.jelly||c?.locked));
        if(!obsOnBoard)return null;
        const items=[["❄","frozen"],["🟣","jelly"],["🪨","stone"],["🍫","choc"],["🔒","locked"]];
        return(
          <div style={{marginTop:3,display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"3px 12px",maxWidth:BW,position:"relative",zIndex:1}}>
            {items.map(([icon,label])=>(
              <div key={label} style={{fontSize:10,color:ch.inkSoft,display:"flex",alignItems:"center",gap:2}}>
                <span style={{fontSize:11}}>{icon}</span>
                <span style={{fontFamily:FF_SANS}}>{label}</span>
              </div>
            ))}
          </div>
        );
      })()}

      <style>{`@keyframes floatUp{0%{transform:translateY(0);opacity:1;}100%{transform:translateY(-32px);opacity:0;}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════
function App(){
  const[screen,     setScreen]    =useState("home");
  const[run,        setRun]       =useState(null);
  const[highScores, setHighScores]=useState([]);
  const[enabledCats,setEnabledCats]=useState(()=>new Set(Object.keys(RELIC_CATEGORIES)));
  const pendingResult=useRef(null);
  const enabledCatsRef=useRef(enabledCats); enabledCatsRef.current=enabledCats;

  const handleToggleCat=useCallback(cat=>{
    setEnabledCats(prev=>{const next=new Set(prev);if(next.has(cat))next.delete(cat);else next.add(cat);return next;});
  },[]);

  const startNewRun=useCallback(()=>{
    const seed=generateSeed();
    setRun({seed,levelResults:[],relics:[],pendingBoon:null});
    setScreen("map");
  },[]);

  const handlePlay=useCallback(()=>setScreen("game"),[]);

  const handleLevelComplete=useCallback((result)=>{
    setRun(prev=>{
      if(!prev)return prev;
      const levelIdx=prev.levelResults.length,def=LEVEL_DEFS[levelIdx];
      const newResults=[...prev.levelResults,{score:result.score,movesRemaining:result.movesRemaining,passed:result.passed,level:result.level}];
      const relicIds=new Set(prev.relics.map(r=>r.id));
      const surplusThresh=relicIds.has("e2")?1.20:1.50;
      const aboveThresh=def&&result.passed&&result.score>=def.objective.target*surplusThresh;
      const thriftyTrigger=relicIds.has("e1")&&result.passed&&result.movesRemaining>=5;
      const bonusPick=aboveThresh||thriftyTrigger;
      const isBossComplete=result.passed&&def&&def.type==="boss";
      pendingResult.current={
        ...result,levelDef:def,bonusPick,isBossComplete,
        draftOptions:result.passed&&levelIdx<LEVEL_DEFS.length-1
          ?buildDraftOptions(prev.seed,levelIdx,def.ante,prev.relics.map(r=>r.id),bonusPick,isBossComplete,enabledCatsRef.current)
          :null,
      };
      return{...prev,levelResults:newResults,pendingBoon:null};
    });

    setTimeout(()=>{
      const pr=pendingResult.current;if(!pr)return;
      const endRun=outcome=>{
        setRun(prev=>{
          if(!prev)return prev;
          const total=prev.levelResults.reduce((s,r)=>s+r.score,0);
          setHighScores(hs=>[...hs,{seed:prev.seed,totalScore:total,levelsCleared:prev.levelResults.filter(r=>r.passed).length,relicsCollected:prev.relics.length,outcome}].sort((a,b)=>b.totalScore-a.totalScore).slice(0,10));
          return prev;
        });
        setScreen("complete");
      };
      if(!pr.passed)endRun("loss");
      else if(!pr.draftOptions)endRun("win");
      else setScreen("draft");
    },1400);
  },[]);

  const handleDraftPick=useCallback(item=>{
    setRun(prev=>{
      if(!prev)return prev;
      if(item.type==="boon")return{...prev,pendingBoon:item};
      return{...prev,relics:[...prev.relics,item],pendingBoon:null};
    });
    setScreen("map");pendingResult.current=null;
  },[]);

  const handleDraftSkip=useCallback(()=>{setScreen("map");pendingResult.current=null;},[]);
  const handleHome=useCallback(()=>setScreen("home"),[]);
  const handleResume=useCallback(()=>setScreen("map"),[]);

  const hasActiveRun=!!run&&run.levelResults.length<LEVEL_DEFS.length&&!(run.levelResults.length>0&&!run.levelResults[run.levelResults.length-1]?.passed);

  if(screen==="home") return <HomeScreen onNewRun={startNewRun} onResume={handleResume} hasActiveRun={hasActiveRun} highScores={highScores} runSeed={run?.seed} enabledCats={enabledCats} onToggleCat={handleToggleCat}/>;
  if(screen==="map"&&run) return <RunMapScreen run={run} onPlay={handlePlay} onHome={handleHome}/>;
  if(screen==="game"&&run){
    const levelIdx=run.levelResults.length,def=LEVEL_DEFS[levelIdx];
    if(!def){setScreen("complete");return null;}
    return <GameScreen key={`level-${levelIdx}-${run.seed}`} levelDef={def} run={run} onComplete={handleLevelComplete}/>;
  }
  if(screen==="draft"&&pendingResult.current){
    const pr=pendingResult.current;
    return <DraftScreen options={pr.draftOptions} onPick={handleDraftPick} onSkip={handleDraftSkip} levelResult={pr} isBossComplete={pr.isBossComplete} bonusPick={pr.bonusPick}/>;
  }
  if(screen==="complete"&&run) return <RunCompleteScreen run={run} onHome={()=>{setRun(null);handleHome();}}/>;
  return <HomeScreen onNewRun={startNewRun} onResume={handleResume} hasActiveRun={false} highScores={highScores} enabledCats={enabledCats} onToggleCat={handleToggleCat}/>;
}

// Error boundary — catches render errors and shows them instead of a blank screen.
// Helps diagnose issues during development.
class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state={error:null}; }
  static getDerivedStateFromError(error){ return {error}; }
  render(){
    if(this.state.error){
      return(
        <div style={{padding:32,fontFamily:"monospace",fontSize:13,color:"#c83848",background:"#fcf8ee",minHeight:"100vh",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
          <div style={{fontWeight:700,fontSize:16,marginBottom:12}}>⚠️ Render Error</div>
          <div>{String(this.state.error)}</div>
          {this.state.error?.stack&&<div style={{marginTop:12,opacity:0.6,fontSize:11}}>{this.state.error.stack}</div>}
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AppRoot(){
  return <ErrorBoundary><TooltipProvider><App/></TooltipProvider></ErrorBoundary>;
}
