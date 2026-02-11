/* =========================================================
   KOREN MASTER PANEL - 6 TABS VERSION (COMPACT ROWS)
   ✅ Tab 1: מוצרים (20 products - COMPACT + scroll fixed)
   📍 Tab 2: מוצרי מבצעים (EMPTY - ready for your code)
   ✅ Tab 3: הגדרות כלליות (dates + talach)
   ✅ Tab 4: ייבוא/ייצוא
   📍 Tab 5: (EMPTY - for future use)
   📍 Tab 6: (EMPTY - for future use)
========================================================= */

(function KorenMasterPanel(thisObj) {

// -------------------------
// SETTINGS (UPDATED - PREV PRICE + FINE TUNING + COLORS + DEAL + STYLE_CTRL + BG OVERRIDE + SALE BG)
// -------------------------
var MAX_PRODUCTS = 20;
var DATA_COMP_PREFIX = "PRODUCT_DATA_";
var LYR_MAIN = "DATA_MAIN_TEXT";
var LYR_SUB  = "DATA_SUB_TEXT";
var LYR_ADD  = "DATA_ADDITION_TEXT";
var LYR_CTRL = "DATA_CTRL";

// ✅ TAB 5: COLOR PALETTE (PRODUCT_DATA_i > COLOR_CTRL)
var LYR_COLOR_CTRL = "COLOR_CTRL";

// Color Control effect names inside COLOR_CTRL layer
var PAL_1 = "PAL_1";
var PAL_2 = "PAL_2";
var PAL_3 = "PAL_3";
var PAL_4 = "PAL_4";

var PALETTE_EFFECTS = [PAL_1, PAL_2, PAL_3, PAL_4];

// DATA_CTRL effect names (existing)
var E_PRICE_TYPE      = "Price_Type";
var E_PRICE_VALUE     = "Price Value";
var E_DEAL_QTY        = "Deal Quantity";
var E_DEAL_PRICE      = "Deal Price";
var E_SHOW_UNIT       = "Show_Unit";
var E_SHOW_DEAL_UNIT  = "Show_Deal_Unit";
var E_USE_DEFAULT_BG  = "Use_Default_BG";
var E_PRODUCT_INDEX   = "Product_Index";
var E_BG_SIDE_MANUAL  = "BG_Side_Manual";
var E_BG_COLOR_MANUAL = "BG_Color_Manual";
var E_USE_AUTO_WHITE  = "Use_Auto_White";
var E_WHITE_WIDTH_MANUAL = "White_Width_Manual";

// ✅ NEW: Previous Price controls (DATA_CTRL)
var E_SHOW_PREVPRICE  = "Show_PrevPrice";
var E_PREVPRICE_VALUE = "PrevPrice_Value";
var E_PREV_X_OFFSET   = "Prev_X_Offset";

// ✅ ✅ ✅ NEW: Background Override (DATA_CTRL)
var E_THEME_OVERRIDE = "Theme_Override";
var E_PRICE_BG_SELECTION = "Price_BG_Selection";
var E_PRICE_DIRECTION_OVERRIDE = "Price_Direction_Override";

// ✅ ✅ ✅ NEW: Sale BG Controls (PRICE Sale-X > CTRL)
var E_SALE_USE_AUTO_WHITE = "Use_Auto_White";
var E_SALE_WHITE_WIDTH = "White_Width_Manual";
var E_SALE_PREV_X_OFFSET = "Prev_X_SALE_Offset";
var E_SALE_BG_SELECTION = "Sale_BG_Selection";
var E_SALE_DIRECTION = "Sale_Direction";

// ✅ Fine Tuning lives inside each PRICE comp under Null layer "CONTROLS"
var PRICE_REGULAR_PREFIX = "PRICE_REGULAR_";
var PRICE_PREV_PREFIX    = "Previous_Price_";
var PRICE_DEAL_PREFIX    = "PRICE_TYPE_DEAL_";
var LYR_PRICE_CONTROLS   = "CONTROLS";
var LYR_DEAL_CONTROLS    = "DEAL_CTRL";

// Controls effect names inside PRICE_REGULAR_X & Previous_Price_X
var C_DECIMAL_OFFSET  = "Decimal Offset";
var C_CURRENCY_OFFSET = "Currency Offset";
var C_UNIT_OFFSET     = "Unit Offset";

// ✅ Controls effect names inside PRICE_TYPE_DEAL_X > DEAL_CTRL
var C_DEAL_CUR_GAP = "Gap Price → Currency";
var C_DEAL_SEP_GAP = "Gap Price → Separator";
var C_DEAL_QTY_GAP = "Gap Separator → Quantity";

var CHAR_LIMIT = 33;

var colWidths = {
  main: { current: 340, min: 170, expanded: true },
  sub: { current: 150, min: 150, expanded: false },
  add: { current: 180, min: 180, expanded: false }
};

var colWidthsSales = {
  main: { current: 340, min: 170, expanded: true },
  sub: { current: 150, min: 150, expanded: false },
  add: { current: 180, min: 180, expanded: false }
};

// ✅ ✅ ✅ NEW: STYLE_CTRL (TAB 0 - Project Styling)
var STYLE_MASTER_COMP = "STYLE_MASTER";
var STYLE_CTRL_LAYER = "STYLE_CTRL";

// Products (4 screens)
var E_STYLE_MODE = "Style_Mode";
var E_GLOBAL_THEME = "Global_Theme";
var E_GROUP_1_4 = "Group_1_4";
var E_GROUP_5_8 = "Group_5_8";
var E_GROUP_9_12 = "Group_9_12";
var E_GROUP_13_16 = "Group_13_16";
var E_GROUP_17_20 = "Group_17_20";
var E_MAIN_BG_OVERRIDE = "Main_BG_Override";

// Sales (3 groups)
var E_SALE_STYLE_MODE = "Sale_Style_Mode";
var E_SALE_GLOBAL_THEME = "Sale_Global_Theme";
var E_SALE_GROUP_1_3 = "Sale_Group_1_3";
var E_SALE_GROUP_4_6 = "Sale_Group_4_6";
var E_SALE_GROUP_7_9 = "Sale_Group_7_9";
var E_SALE_GROUP_10_12 = "Sale_Group_10_12";
var E_SALE_GROUP_13_15 = "Sale_Group_13_15";
var E_SALE_GROUP_16_18 = "Sale_Group_16_18";
var E_SALE_GROUP_19_21 = "Sale_Group_19_21";
var E_SALE_MAIN_BG_OVERRIDE = "Sale_Main_BG_Override";


// -------------------------
// Helpers
// -------------------------
function getCompByName(name) {
  var p = app.project;
  if (!p) return null;
  for (var i = 1; i <= p.numItems; i++) {
    var it = p.item(i);
    if (it instanceof CompItem && it.name === name) return it;
  }
  return null;
}

function getLayer(comp, name) {
  if (!comp) return null;
  try { return comp.layer(name); } catch (_) { return null; }
}

function getEffect(ctrlLayer, effName) {
  if (!ctrlLayer) return null;
  try { return ctrlLayer.effect(effName); } catch (_) { return null; }
}

function getEffectValue(ctrlLayer, effName) {
  var e = getEffect(ctrlLayer, effName);
  if (!e) return null;
  try { return e(1).value; } catch (_) { return null; }
}

function setEffectValue(ctrlLayer, effName, v) {
  var e = getEffect(ctrlLayer, effName);
  if (!e) return false;
  try { 
    e(1).setValue(v); 
    return true; 
  } catch (_) { 
    return false; 
  }
}

function getTextValue(comp, layerName) {
  var lyr = getLayer(comp, layerName);
  if (!lyr) return "";
  try { return lyr.property("Source Text").value.text; } catch (_) { return ""; }
}

function setTextValue(comp, layerName, text) {
  var lyr = getLayer(comp, layerName);
  if (!lyr) return false;
  try {
    var prop = lyr.property("Source Text");
    var doc = prop.value;
    doc.text = text;
    prop.setValue(doc);
    return true;
  } catch (_) { return false; }
}

function uiToAeText(str) {
  if (str === null || str === undefined) return "";
  var s = ("" + str).replace(/\\n/g, "\r");
  s = s.replace(/\r\n/g, "\r").replace(/\n/g, "\r");
  return s;
}

function aeToUiText(str) {
  if (str === null || str === undefined) return "";
  return ("" + str).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function trimString(str) {
  if (!str) return "";
  return ("" + str).replace(/^\s+|\s+$/g, "");
}

function clampInt(v, minV, maxV, fallback) {
  var n = parseInt(v, 10);
  if (isNaN(n)) n = fallback;
  if (n < minV) n = minV;
  if (n > maxV) n = maxV;
  return n;
}

function clampNum(v, minV, maxV, fallback) {
  var n = parseFloat(v);
  if (isNaN(n)) n = fallback;
  if (n < minV) n = minV;
  if (n > maxV) n = maxV;
  return n;
}

function toBool(v) { return v ? 1 : 0; }

function formatPrice(val) {
  var n = parseFloat(val);
  if (isNaN(n)) n = 0;
  return n.toFixed(2);
}

function formatInteger(val) {
  var n = parseInt(val, 10);
  if (isNaN(n)) n = 0;
  return "" + n;
}



function padField(field, minWidth) {
  var s = String(field || "");
  while (s.length < minWidth) {
    s += " ";
  }
  return s;
}

function getPriceCompRegular(i) {
  return getCompByName(PRICE_REGULAR_PREFIX + i);
}

function getPriceCompPrev(i) {
  return getCompByName(PRICE_PREV_PREFIX + i);
}

function getPriceCompDeal(i) {
  return getCompByName(PRICE_DEAL_PREFIX + i);
}

// ✅ ✅ ✅ NEW: Sale BG Helpers
function readSaleConfigFromAE(saleIndex) {
  var compName = "PRICE Sale -" + saleIndex;
  var c = getCompByName(compName);
  if (!c) return null;
  var ctrl = getLayer(c, "CTRL");
  if (!ctrl) return null;
  
  var config = {
    saleUseAutoWhite: true,
    saleWhiteWidth: 2,
    salePrevXOffset: 0,
    saleBgSelection: 1,
    saleDirection: 1
  };
  
  var v;
  v = getEffectValue(ctrl, E_SALE_USE_AUTO_WHITE);  if (v !== null) config.saleUseAutoWhite = (v > 0);
  v = getEffectValue(ctrl, E_SALE_WHITE_WIDTH);     if (v !== null) config.saleWhiteWidth = Math.round(v);
  v = getEffectValue(ctrl, E_SALE_PREV_X_OFFSET);   if (v !== null) config.salePrevXOffset = v;
  v = getEffectValue(ctrl, E_SALE_BG_SELECTION);    if (v !== null) config.saleBgSelection = Math.round(v);
  v = getEffectValue(ctrl, E_SALE_DIRECTION);       if (v !== null) config.saleDirection = Math.round(v);
  
  return config;
}

function applySaleConfigToAE(saleIndex, config) {
  var compName = "PRICE Sale -" + saleIndex;
  var c = getCompByName(compName);
  if (!c) return false;
  var ctrl = getLayer(c, "CTRL");
  if (!ctrl) return false;
  
  setEffectValue(ctrl, E_SALE_USE_AUTO_WHITE, config.saleUseAutoWhite ? 1 : 0);
  setEffectValue(ctrl, E_SALE_WHITE_WIDTH, config.saleWhiteWidth);
  setEffectValue(ctrl, E_SALE_PREV_X_OFFSET, config.salePrevXOffset);
  setEffectValue(ctrl, E_SALE_BG_SELECTION, config.saleBgSelection);
  setEffectValue(ctrl, E_SALE_DIRECTION, config.saleDirection);
  
  return true;
}

// =========================
// ✅ TAB 5 HELPERS: Palette
// =========================
function clamp01(v){
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

function rgbIntToRGBA01(rgbInt){
  var r = (rgbInt >> 16) & 255;
  var g = (rgbInt >> 8) & 255;
  var b = (rgbInt) & 255;
  return [r/255, g/255, b/255, 1];
}

function rgba01ToHex(rgba){
  var r = Math.round(clamp01(rgba[0]) * 255);
  var g = Math.round(clamp01(rgba[1]) * 255);
  var b = Math.round(clamp01(rgba[2]) * 255);

  function to2(n){
    var s = n.toString(16).toUpperCase();
    return (s.length === 1) ? ("0" + s) : s;
  }
  return "#" + to2(r) + to2(g) + to2(b);
}

function hexToRgba01(hex){
  if (!hex) return null;
  hex = ("" + hex).replace(/\s+/g, "");
  if (hex.charAt(0) === "#") hex = hex.substring(1);
  if (hex.length !== 6) return null;

  var r = parseInt(hex.substring(0,2), 16);
  var g = parseInt(hex.substring(2,4), 16);
  var b = parseInt(hex.substring(4,6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;

  return [r/255, g/255, b/255, 1];
}

function getColorCtrlLayer(prodIndex){
  var comp = getCompByName(DATA_COMP_PREFIX + prodIndex);
  if (!comp) return null;
  return getLayer(comp, LYR_COLOR_CTRL);
}

function getPaletteColor(prodIndex, palName){
  var lyr = getColorCtrlLayer(prodIndex);
  if (!lyr) return null;
  try {
    var fx = lyr.effect(palName);
    if (!fx) return null;
    return fx.property("Color").value;
  } catch(e){
    return null;
  }
}

function setPaletteColor(prodIndex, palName, rgba01){
  var lyr = getColorCtrlLayer(prodIndex);
  if (!lyr) return false;
  try {
    var fx = lyr.effect(palName);
    if (!fx) return false;
    fx.property("Color").setValue(rgba01);
    return true;
  } catch(e){
    return false;
  }
}

function applyPaletteToAllProducts(paletteRgbaArr){
  for (var i = 1; i <= MAX_PRODUCTS; i++){
    for (var p = 0; p < PALETTE_EFFECTS.length; p++){
      setPaletteColor(i, PALETTE_EFFECTS[p], paletteRgbaArr[p]);
    }
  }
}

// =========================
// ✅ STYLE_CTRL HELPERS (TAB 1 - Project Styling)
// =========================
function getStyleCtrlLayer() {
  var comp = getCompByName(STYLE_MASTER_COMP);
  if (!comp) return null;
  return getLayer(comp, STYLE_CTRL_LAYER);
}

function readStyleCtrlFromProject() {
  var ctrl = getStyleCtrlLayer();
  if (!ctrl) return { ok: false, err: "Missing STYLE_CTRL layer" };

  var data = {
    styleMode: 1,
    globalTheme: 1,
    group1_4: 1,
    group5_8: 1,
    group9_12: 1,
    group13_16: 1,
    group17_20: 1,
    mainBgOverride: 1,
    
    saleStyleMode: 1,
    saleGlobalTheme: 1,
    saleGroup1_3: 1,
    saleGroup4_6: 1,
    saleGroup7_9: 1,
    saleGroup10_12: 1,
    saleGroup13_15: 1,
    saleGroup16_18: 1,
    saleGroup19_21: 1,
    saleMainBgOverride: 1
  };

  var v;
  
  v = getEffectValue(ctrl, E_STYLE_MODE);        if (v !== null) data.styleMode = v;
  v = getEffectValue(ctrl, E_GLOBAL_THEME);      if (v !== null) data.globalTheme = v;
  v = getEffectValue(ctrl, E_GROUP_1_4);         if (v !== null) data.group1_4 = v;
  v = getEffectValue(ctrl, E_GROUP_5_8);         if (v !== null) data.group5_8 = v;
  v = getEffectValue(ctrl, E_GROUP_9_12);        if (v !== null) data.group9_12 = v;
  v = getEffectValue(ctrl, E_GROUP_13_16);       if (v !== null) data.group13_16 = v;
  v = getEffectValue(ctrl, E_GROUP_17_20);       if (v !== null) data.group17_20 = v;
  v = getEffectValue(ctrl, E_MAIN_BG_OVERRIDE);  if (v !== null) data.mainBgOverride = v;
  
  v = getEffectValue(ctrl, E_SALE_STYLE_MODE);       if (v !== null) data.saleStyleMode = v;
  v = getEffectValue(ctrl, E_SALE_GLOBAL_THEME);     if (v !== null) data.saleGlobalTheme = v;
  v = getEffectValue(ctrl, E_SALE_GROUP_1_3);        if (v !== null) data.saleGroup1_3 = v;
  v = getEffectValue(ctrl, E_SALE_GROUP_4_6);        if (v !== null) data.saleGroup4_6 = v;
  v = getEffectValue(ctrl, E_SALE_GROUP_7_9);        if (v !== null) data.saleGroup7_9 = v;
  v = getEffectValue(ctrl, E_SALE_GROUP_10_12);      if (v !== null) data.saleGroup10_12 = v;
  v = getEffectValue(ctrl, E_SALE_GROUP_13_15);      if (v !== null) data.saleGroup13_15 = v;
  v = getEffectValue(ctrl, E_SALE_GROUP_16_18);      if (v !== null) data.saleGroup16_18 = v;
  v = getEffectValue(ctrl, E_SALE_GROUP_19_21);      if (v !== null) data.saleGroup19_21 = v;
  v = getEffectValue(ctrl, E_SALE_MAIN_BG_OVERRIDE); if (v !== null) data.saleMainBgOverride = v;

  return { ok: true, data: data, err: null };
}

function applyStyleCtrlToProject(data) {
  var ctrl = getStyleCtrlLayer();
  if (!ctrl) return { ok: false, err: "Missing STYLE_CTRL layer" };

  setEffectValue(ctrl, E_STYLE_MODE, data.styleMode);
  setEffectValue(ctrl, E_GLOBAL_THEME, data.globalTheme);
  setEffectValue(ctrl, E_GROUP_1_4, data.group1_4);
  setEffectValue(ctrl, E_GROUP_5_8, data.group5_8);
  setEffectValue(ctrl, E_GROUP_9_12, data.group9_12);
  setEffectValue(ctrl, E_GROUP_13_16, data.group13_16);
  setEffectValue(ctrl, E_GROUP_17_20, data.group17_20);
  setEffectValue(ctrl, E_MAIN_BG_OVERRIDE, data.mainBgOverride);
  
  setEffectValue(ctrl, E_SALE_STYLE_MODE, data.saleStyleMode);
  setEffectValue(ctrl, E_SALE_GLOBAL_THEME, data.saleGlobalTheme);
  setEffectValue(ctrl, E_SALE_GROUP_1_3, data.saleGroup1_3);
  setEffectValue(ctrl, E_SALE_GROUP_4_6, data.saleGroup4_6);
  setEffectValue(ctrl, E_SALE_GROUP_7_9, data.saleGroup7_9);
  setEffectValue(ctrl, E_SALE_GROUP_10_12, data.saleGroup10_12);
  setEffectValue(ctrl, E_SALE_GROUP_13_15, data.saleGroup13_15);
  setEffectValue(ctrl, E_SALE_GROUP_16_18, data.saleGroup16_18);
  setEffectValue(ctrl, E_SALE_GROUP_19_21, data.saleGroup19_21);
  setEffectValue(ctrl, E_SALE_MAIN_BG_OVERRIDE, data.saleMainBgOverride);

  return { ok: true, err: null };
}
// =========================
// ✅ ✅ ✅ NEW: COLOR_BANK HELPERS (TAB 5 - Colors)
// =========================
function getColorBankLayer() {
  var comp = getCompByName(STYLE_MASTER_COMP);
  if (!comp) return null;
  return getLayer(comp, "COLOR_BANK");
}

function getAllColorControlsFromBank() {
  var lyr = getColorBankLayer();
  if (!lyr) return [];
  
  var colors = [];
  try {
    var numEffects = lyr.property("Effects").numProperties;
    for (var i = 1; i <= numEffects; i++) {
      var fx = lyr.property("Effects").property(i);
      if (fx.matchName === "ADBE Color Control") {
        colors.push({
          name: fx.name,
          color: fx.property("Color").value
        });
      }
    }
  } catch (e) {
    return [];
  }
  return colors;
}

function getColorControlsByPrefix(prefix) {
  var allColors = getAllColorControlsFromBank();
  var filtered = [];
  for (var i = 0; i < allColors.length; i++) {
    if (allColors[i].name.indexOf(prefix) === 0) {
      filtered.push(allColors[i]);
    }
  }
  return filtered;
}

function getColorFromBank(effectName) {
  var lyr = getColorBankLayer();
  if (!lyr) return null;
  try {
    var fx = lyr.effect(effectName);
    if (!fx) return null;
    return fx.property("Color").value;
  } catch (e) {
    return null;
  }
}

function setColorInBank(effectName, rgba01) {
  var lyr = getColorBankLayer();
  if (!lyr) return false;
  try {
    var fx = lyr.effect(effectName);
    if (!fx) return false;
    fx.property("Color").setValue(rgba01);
    return true;
  } catch (e) {
    return false;
  }
}

// =========================
// ✅ ✅ ✅ RENDER HELPERS (TAB 6)
// =========================

// Work Area timing tables (in frames)
var RENDER_TIMING = {
  "1_Sale": {
    3: 715, 6: 1220, 9: 1725, 12: 2230, 15: 2728, 18: 3243, 21: 3742
  },
  "2_Entrance Main": {
    4: 818, 8: 1437, 12: 2062, 16: 2687, 20: 3313
  },
  "3_Pardes Outside": {
    4: 873, 8: 1474, 12: 2117, 16: 2749, 20: 3363
  },
  "4_Outside_M": {
    4: 809, 8: 1430, 12: 2048, 16: 2668, 20: 3286
  },
  "5_Drinks": {
    4: 924, 8: 1646, 12: 2364, 16: 3073, 20: 3782
  }
};

// Layer patterns for each comp
var RENDER_LAYER_PATTERNS = {
  "1_Sale": {
    prefix: "Sale ",
    groups: [[1,3], [4,6], [7,9], [10,12], [13,15], [16,18], [19,21]],
    groupSize: 3,
    hasDoubleSpace: true  // ✅ רווח כפול ל-19-21, 16-18 וכו'
  },
  "2_Entrance Main": {
    prefix: "Entrance ",
    groups: [[1,4], [5,8], [9,12], [13,16], [17,20]],
    groupSize: 4
  },
  "3_Pardes Outside": {
    prefix: "Pardes ",
    groups: [[1,4], [5,8], [9,12], [13,16], [17,20]],
    groupSize: 4
  },
  "4_Outside_M": {
    prefix: "Outside Mishor ",
    groups: [[1,4], [5,8], [9,12], [13,16], [17,20]],
    groupSize: 4
  },
  "5_Drinks": {
    prefix: "Drinks ",
    groups: [[1,4], [5,8], [9,12], [13,16], [17,20]],
    groupSize: 4
  }
};


function getMainComp(compName) {
  return getCompByName(compName);
}

function disableLayersByPattern(comp, pattern, productCount) {
  if (!comp) return 0;
  
  var prefix = pattern.prefix;
  var groups = pattern.groups;
  var groupSize = pattern.groupSize;
  var hasDoubleSpace = pattern.hasDoubleSpace || false;
  
  var maxNeededGroup = Math.ceil(productCount / groupSize);
  var disabled = 0;
  
  for (var i = 1; i <= comp.numLayers; i++) {
    var layer = comp.layer(i);
    var layerName = layer.name;
    
    for (var g = 0; g < groups.length; g++) {
      var groupRange = groups[g];
      var expectedName;
      
      if (hasDoubleSpace && groupRange[0] >= 4) {
        // Sale 19-21, Sale 16-18, etc. (רווח כפול)
        expectedName = prefix + " " + groupRange[0] + "-" + groupRange[1];
      } else {
        // Sale 1-3, Entrance 1-4, etc. (רווח רגיל)
        expectedName = prefix + groupRange[0] + "-" + groupRange[1];
      }
      
      if (layerName === expectedName) {
        var groupIndex = g + 1;
        if (groupIndex > maxNeededGroup) {
          layer.enabled = false;
          disabled++;
        } else {
          layer.enabled = true;
        }
        break;
      }
    }
  }
  
  return disabled;
}

function setCompWorkArea(comp, startFrame, endFrame) {
  if (!comp) return false;
  
  var fps = comp.frameRate;
  var startTime = startFrame / fps;
  var duration = (endFrame - startFrame) / fps;
  
  comp.workAreaStart = startTime;
  comp.workAreaDuration = duration;
  
  return true;
}

function getOutputModules() {
  var modules = [];
  var tempComp = app.project.items.addComp("__temp__", 100, 100, 1, 1, 25);
  var rqItem = app.project.renderQueue.items.add(tempComp);
  var om = rqItem.outputModule(1);
  
  try {
    var templates = om.templates;
    for (var i = 0; i < templates.length; i++) {
      modules.push(templates[i]);
    }
  } catch(e) {
    modules = ["Best Settings", "H.264", "Lossless"];
  }
  
  rqItem.remove();
  tempComp.remove();
  
  return modules;
}

function addToRenderQueue(comp, outputPath, outputModule) {
  if (!comp) return null;
  
  var rqItem = app.project.renderQueue.items.add(comp);
  var om = rqItem.outputModule(1);
  
  try {
    om.applyTemplate(outputModule);
  } catch(e) {
    // If template fails, continue with default
  }
  
  try {
    om.file = new File(outputPath);
  } catch(e) {
    return null;
  }
  
  return rqItem;
}
function detectActiveProducts() {
  var report = {
    success: true,
    message: "",
    productCount: 0,
    saleCount: 0,
    details: ""
  };
  
  // Detect regular products by checking layers in main comps
  var testComp = getMainComp("2_Entrance Main");
  if (!testComp) {
    testComp = getMainComp("3_Pardes Outside");
  }
  if (!testComp) {
    testComp = getMainComp("4_Outside_M");
  }
  if (!testComp) {
    testComp = getMainComp("5_Drinks");
  }
  
  if (testComp) {
    var pattern = RENDER_LAYER_PATTERNS[testComp.name];
    if (pattern) {
      var activeGroups = 0;
      var groups = pattern.groups;
      
      for (var g = 0; g < groups.length; g++) {
        var groupRange = groups[g];
        var expectedName = pattern.prefix + groupRange[0] + "-" + groupRange[1];
        
        // Try to find the layer
        for (var i = 1; i <= testComp.numLayers; i++) {
          var layer = testComp.layer(i);
          if (layer.name === expectedName) {
            if (layer.enabled) {
              activeGroups++;
            }
            break;
          }
        }
      }
      
      // Calculate product count from active groups
      if (activeGroups > 0) {
        report.productCount = activeGroups * pattern.groupSize;
        report.details += "Regular Products: " + report.productCount + " (from " + testComp.name + ")\n";
      }
    }
  }
  
  // Detect sale products
  var saleComp = getMainComp("1_Sale");
  if (saleComp) {
    var salePattern = RENDER_LAYER_PATTERNS["1_Sale"];
    if (salePattern) {
      var activeSaleGroups = 0;
      var saleGroups = salePattern.groups;
      
      for (var sg = 0; sg < saleGroups.length; sg++) {
        var saleGroupRange = saleGroups[sg];
        var expectedSaleName;
        
        if (salePattern.hasDoubleSpace && saleGroupRange[0] >= 4) {
          expectedSaleName = salePattern.prefix + " " + saleGroupRange[0] + "-" + saleGroupRange[1];
        } else {
          expectedSaleName = salePattern.prefix + saleGroupRange[0] + "-" + saleGroupRange[1];
        }
        
        for (var si = 1; si <= saleComp.numLayers; si++) {
          var saleLayer = saleComp.layer(si);
          if (saleLayer.name === expectedSaleName) {
            if (saleLayer.enabled) {
              activeSaleGroups++;
            }
            break;
          }
        }
      }
      
      if (activeSaleGroups > 0) {
        report.saleCount = activeSaleGroups * salePattern.groupSize;
        report.details += "Sale Products: " + report.saleCount + " (from 1_Sale)\n";
      }
    }
  }
  
  if (report.productCount === 0 && report.saleCount === 0) {
    report.success = false;
    report.message = "❌ Could not detect active products.\nPlease check if layers are properly named.";
  } else {
    report.message = "✅ Detected Active Products!\n\n" + report.details;
  }
  
  return report;
}


function applyRenderSettings(config) {
  var report = {
    success: true,
    message: "",
    compsProcessed: 0,
    layersDisabled: 0,
    workAreasSet: 0
  };
  
  var compsToProcess = [];
  
  if (config.renderSale && config.saleCount > 0) {
    compsToProcess.push({
      name: "1_Sale",
      count: config.saleCount,
      isSale: true
    });
  }
  
  if (config.productCount > 0) {
    if (config.renderEntrance) compsToProcess.push({name: "2_Entrance Main", count: config.productCount, isSale: false});
    if (config.renderPardes) compsToProcess.push({name: "3_Pardes Outside", count: config.productCount, isSale: false});
    if (config.renderOutside) compsToProcess.push({name: "4_Outside_M", count: config.productCount, isSale: false});
    if (config.renderDrinks) compsToProcess.push({name: "5_Drinks", count: config.productCount, isSale: false});
  }
  
  if (compsToProcess.length === 0) {
    report.success = false;
    report.message = "No compositions selected";
    return report;
  }
  
  for (var i = 0; i < compsToProcess.length; i++) {
    var compInfo = compsToProcess[i];
    var comp = getMainComp(compInfo.name);
    
    if (!comp) {
      report.message += "⚠️ Comp not found: " + compInfo.name + "\n";
      continue;
    }
    
    var pattern = RENDER_LAYER_PATTERNS[compInfo.name];
    if (pattern) {
      var disabled = disableLayersByPattern(comp, pattern, compInfo.count);
      report.layersDisabled += disabled;
    }
    
    var timing = RENDER_TIMING[compInfo.name];
    if (timing && timing[compInfo.count]) {
      var endFrame = timing[compInfo.count];
      if (setCompWorkArea(comp, 0, endFrame)) {
        report.workAreasSet++;
      }
    }
    
    report.compsProcessed++;
  }
  
  report.message = "✅ Settings Applied!\n\n" +
                   "Compositions processed: " + report.compsProcessed + "\n" +
                   "Layers disabled: " + report.layersDisabled + "\n" +
                   "Work areas set: " + report.workAreasSet + "\n\n" +
                   "Now you can add to Render Queue!";
  
  return report;
}

function addCompsToRenderQueue(config) {
  var report = {
    success: true,
    message: "",
    renderItemsAdded: 0
  };
  
  var compsToRender = [];
  
  if (config.renderSale && config.saleCount > 0) {
    compsToRender.push("1_Sale");
  }
  
  if (config.productCount > 0) {
    if (config.renderEntrance) compsToRender.push("2_Entrance Main");
    if (config.renderPardes) compsToRender.push("3_Pardes Outside");
    if (config.renderOutside) compsToRender.push("4_Outside_M");
    if (config.renderDrinks) compsToRender.push("5_Drinks");
  }
  
  if (compsToRender.length === 0) {
    report.success = false;
    report.message = "No compositions selected for render";
    return report;
  }
  
  for (var i = 0; i < compsToRender.length; i++) {
    var compName = compsToRender[i];
    var comp = getMainComp(compName);
    
    if (!comp) {
      report.message += "⚠️ Comp not found: " + compName + "\n";
      continue;
    }
    
    var outputFileName = config.fileNameBase + compName + ".mov";
    var outputPath = config.outputFolder + "/" + outputFileName;
    
    var rqItem = addToRenderQueue(comp, outputPath, config.outputModule);
    if (rqItem) {
      report.renderItemsAdded++;
    }
  }
  
  report.message = "✅ Added to Render Queue!\n\n" +
                   "Render items added: " + report.renderItemsAdded + "\n\n" +
                   "Press RENDER to start!";
  
  return report;
}


// ========================================
// DATE REPLACEMENT HELPER FOR TALACH (CORRECT FORMATS)
// ========================================
function replaceDatesInTalach(talachText, newDate) {
  if (!talachText || !newDate) return talachText;
  
  var result = talachText;
  
  // Pattern 1: "בין התאריכים" + תאריך מלא
  result = result.replace(/בין התאריכים?\s+\d{1,2}[\-\.]\d{1,2}[\-\.]\d{1,2}[\-\.]\d{2,4}/gi, "בין התאריכים " + newDate);
  result = result.replace(/בין התאריכים?\s+\d{1,2}\-\d{1,2}\.\d{1,2}\.\d{2,4}/gi, "בין התאריכים " + newDate);
  
  // Pattern 2: חודשים שונים - 1.2-1.3.2026
  result = result.replace(/\b\d{1,2}\.\d{1,2}\-\d{1,2}\.\d{1,2}\.\d{2,4}\b/g, newDate);
  
  // Pattern 3: אותו חודש - 1-15.2.2026
  result = result.replace(/\b\d{1,2}\-\d{1,2}\.\d{1,2}\.\d{2,4}\b/g, newDate);
  
  // Pattern 4: "עד" + תאריך
  result = result.replace(/עד\s+\d{1,2}[\-\.]\d{1,2}[\-\.]\d{1,2}[\-\.]\d{2,4}/gi, "עד " + newDate);
  result = result.replace(/עד\s+\d{1,2}\-\d{1,2}\.\d{1,2}\.\d{2,4}/gi, "עד " + newDate);
  
  return result;
}

// ============================================================================
// ✅ EXPORT/IMPORT HELPERS
// ============================================================================

function pad2(n){ return (n < 10 ? "0" : "") + n; }

function formatDateForFile(d){ 
  return d.getFullYear() + "-" + pad2(d.getMonth()+1) + "-" + pad2(d.getDate()); 
}

function dateToISOString(d){
  function pad(n){ return (n < 10 ? "0" : "") + n; }
  return d.getFullYear() + "-" + 
         pad(d.getMonth() + 1) + "-" + 
         pad(d.getDate()) + "T" + 
         pad(d.getHours()) + ":" + 
         pad(d.getMinutes()) + ":" + 
         pad(d.getSeconds()) + "Z";
}

function csvEscapeField(field) {
  var s = String(field || "");
  if (s.indexOf(",") !== -1 || s.indexOf('"') !== -1 || s.indexOf("\n") !== -1 || s.indexOf("\r") !== -1) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function parseCSVContent(text){
  var rows = [];
  var row = [];
  var field = "";
  var inQuotes = false;

  for (var i = 0; i < text.length; i++){
    var ch = text.charAt(i);

    if (inQuotes){
      if (ch === '"'){
        if (i + 1 < text.length && text.charAt(i + 1) === '"'){
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"'){
        inQuotes = true;
      } else if (ch === ','){
        row.push(field);
        field = "";
      } else if (ch === '\n'){
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (ch === '\r'){
        if (i + 1 < text.length && text.charAt(i + 1) === '\n') i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += ch;
      }
    }
  }

  row.push(field);
  rows.push(row);
  return rows;
}

function writeTextFileUTF8_BOM(file, content){
  try{
    file.encoding = "UTF-8";
    file.lineFeed = "Unix";
    file.open("w");
    file.write("\uFEFF" + content);
    file.close();
    return { ok:true };
  }catch(e){
    try{ if(file && file.opened) file.close(); }catch(_){}
    return { ok:false, err:e.toString() };
  }
}

function readTextFileUTF8(file){
  try{
    file.encoding = "UTF-8";
    file.open("r");
    var s = file.read();
    file.close();
    if (s && s.length && s.charCodeAt(0) === 0xFEFF) s = s.substring(1);
    return { ok:true, text:s };
  }catch(e){
    try{ if(file && file.opened) file.close(); }catch(_){}
    return { ok:false, err:e.toString() };
  }
}

function parseCSVLine(line){
  var result = [];
  var current = "";
  var inQuotes = false;
  
  for (var i = 0; i < line.length; i++){
    var ch = line.charAt(i);
    
    if (inQuotes){
      if (ch === '"'){
        if (i+1 < line.length && line.charAt(i+1) === '"'){
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"'){
        inQuotes = true;
      } else if (ch === ','){
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}

function normalizeCsvHeaderKey(key){
  var s = trimString(String(key || ""));
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function buildCsvHeaderMap(headers){
  var m = {};
  for (var i = 0; i < headers.length; i++){
    m[normalizeCsvHeaderKey(headers[i])] = i;
  }
  return m;
}

function getCsvCellByKeys(cells, map, keys){
  for (var i = 0; i < keys.length; i++){
    var idx = map[normalizeCsvHeaderKey(keys[i])];
    if (idx !== undefined && idx < cells.length) return cells[idx];
  }
  return "";
}

// ------------------------------
// Export Complete Project to CSV
// ------------------------------
function exportCompleteProjectToCSV(){
  var d = new Date();
  var defName = "Campaign_Backup_" + formatDateForFile(d) + ".csv";
  
  var file = File.saveDialog("Save Complete Project (CSV)", "*.csv");
  if (!file) return;
  
  if (file.name.indexOf(".csv") === -1) {
    file = new File(file.fullName + ".csv");
  }
  
  var lines = [];
  var productCount = state.productCount;
  var saleCount = 21;
  
  lines.push("SECTION,META");
  lines.push("Property,Value");
  lines.push("Version,1.0");
  lines.push("ExportDate," + dateToISOString(d));
  lines.push("ProductCount," + productCount);
  lines.push("SaleCount," + saleCount);
  lines.push("");
  
  lines.push("SECTION,PRODUCTS");
  
  var productHeaders = [
    "Index","MainText","SubText","AddText",
    "PriceType","Price","PrevPrice",
    "DealQty","DealPrice","ShowUnit","ShowDealUnit",
    "UseDefaultBG","ProductIndex","BGSideManual","BGColorManual",
    "UseAutoWhite","WhiteWidth","ShowPrevPrice","PrevXOffset",
    "ThemeOverride","PriceBGSelection","PriceDirectionOverride",
    "RegDecimalOffset","RegCurrencyOffset","RegUnitOffset",
    "PrevDecimalOffset","PrevCurrencyOffset","PrevUnitOffset",
    "DealQtyGap","DealSepGap","DealCurGap"
  ];
  lines.push(productHeaders.join(","));
  
  for (var i = 1; i <= productCount; i++){
    var res = readRowFromProject(i);
    var r = (res && res.ok) ? res.row : state.rows[i-1];
    
    var productRow = [
      i,
      csvEscapeField(r.mainText || ""),
      csvEscapeField(r.subText || ""),
      csvEscapeField(r.addText || ""),
      r.priceType || 1,
      (r.priceValue || 0).toFixed(2),
      (r.prevPriceValue || 0).toFixed(2),
      r.dealQty || 0,
      (r.dealPrice || 0).toFixed(2),
      r.showUnit || 0,
      r.showDealUnit || 0,
      r.useDefaultBG || 1,
      r.productIndex || i,
      r.bgSideManual || 1,
      r.bgColorManual || 1,
      r.useAutoWhite || 1,
      r.whiteWidth || 2,
      r.showPrevPrice || 0,
      r.prevXOffset || 0,
      r.themeOverride || 1,
      r.priceBgSelection || 1,
      r.priceDirectionOverride || 1,
      r.regDecimalOffset || 0,
      r.regCurrencyOffset || 0,
      r.regUnitOffset || 0,
      r.prevDecimalOffset || 0,
      r.prevCurrencyOffset || 0,
      r.prevUnitOffset || 0,
      r.dealQtyGap || 0,
      r.dealSepGap || 0,
      r.dealCurGap || 0
    ];
    lines.push(productRow.join(","));
  }
  lines.push("");
  
  lines.push("SECTION,SALES");
  lines.push("Slot,SourceProductIndex,UseAutoWhite,WhiteWidth,PrevXOffset,BGSelection,Direction");
  
  for (var s = 1; s <= saleCount; s++){
    var saleConfig = readSaleConfigFromAE(s);
    if (!saleConfig){
      saleConfig = {
        saleUseAutoWhite: true,
        saleWhiteWidth: 2,
        salePrevXOffset: 0,
        saleBgSelection: 1,
        saleDirection: 1
      };
    }
    
    var src = 0;
    try{
      var srcVal = getSaleSliderValue("PRICE Sale -" + s);
      if (srcVal !== null) src = Math.max(0, Math.min(MAX_PRODUCTS, Math.round(srcVal)));
    }catch(_){ src = 0; }
    if (!src && sharedSalesSlots && sharedSalesSlots[s-1]) src = sharedSalesSlots[s-1].sourceProductIndex || 0;

    var saleRow = [
      s,
      src,
      saleConfig.saleUseAutoWhite ? 1 : 0,
      saleConfig.saleWhiteWidth,
      saleConfig.salePrevXOffset || 0,
      saleConfig.saleBgSelection,
      saleConfig.saleDirection
    ];
    lines.push(saleRow.join(","));
  }
  lines.push("");
  
  lines.push("SECTION,STYLING");
  lines.push("Property,Value");
  
  var styleRes = readStyleCtrlFromProject();
  if (styleRes && styleRes.ok){
    var st = styleRes.data;
    lines.push("StyleMode," + st.styleMode);
    lines.push("GlobalTheme," + st.globalTheme);
    lines.push("Group1_4," + st.group1_4);
    lines.push("Group5_8," + st.group5_8);
    lines.push("Group9_12," + st.group9_12);
    lines.push("Group13_16," + st.group13_16);
    lines.push("Group17_20," + st.group17_20);
    lines.push("MainBGOverride," + st.mainBgOverride);
    lines.push("SaleStyleMode," + st.saleStyleMode);
    lines.push("SaleGlobalTheme," + st.saleGlobalTheme);
    lines.push("SaleGroup1_3," + st.saleGroup1_3);
    lines.push("SaleGroup4_6," + st.saleGroup4_6);
    lines.push("SaleGroup7_9," + st.saleGroup7_9);
    lines.push("SaleGroup10_12," + st.saleGroup10_12);
    lines.push("SaleGroup13_15," + st.saleGroup13_15);
    lines.push("SaleGroup16_18," + st.saleGroup16_18);
    lines.push("SaleGroup19_21," + st.saleGroup19_21);
    lines.push("SaleMainBGOverride," + st.saleMainBgOverride);
  }
  lines.push("");
  
  lines.push("SECTION,TALACH");
  lines.push("Property,Value");
  
  try{
    var compT = getCompByName("TALACH_DATA");
    if (compT){
      var t1 = aeToUiText(getTextValue(compT, "TALACH_LINE_1"));
      var t2 = aeToUiText(getTextValue(compT, "TALACH_LINE_2"));
      var t3 = aeToUiText(getTextValue(compT, "TALACH_LINE_3"));
      var campaignDates = aeToUiText(getTextValue(compT, "CAMPAIGN_DATE_TEXT"));
      
      lines.push("Talach1," + csvEscapeField(t1));
      lines.push("Talach2," + csvEscapeField(t2));
      lines.push("Talach3," + csvEscapeField(t3));
      lines.push("CampaignDates," + csvEscapeField(campaignDates));
    }
  }catch(e){}
  lines.push("");
  
  lines.push("SECTION,COLORS");
  lines.push("ColorName,HEX");
  
  try{
    var allColors = getAllColorControlsFromBank();
    for (var c = 0; c < allColors.length; c++){
      var colorName = allColors[c].name;
      var hex = rgba01ToHex(allColors[c].color);
      lines.push(csvEscapeField(colorName) + "," + hex);
    }
  }catch(e){}
  lines.push("");
  
  lines.push("SECTION,RENDER");
  lines.push("Property,Value");
  
  try {
    if (state && state.renderConfig) {
      lines.push("ProductCount," + (state.renderConfig.productCount || productCount));
      lines.push("SaleCount," + (state.renderConfig.saleCount || 0));
      lines.push("RenderSale," + (state.renderConfig.renderSale ? 1 : 0));
      lines.push("RenderEntrance," + (state.renderConfig.renderEntrance ? 1 : 0));
      lines.push("RenderPardes," + (state.renderConfig.renderPardes ? 1 : 0));
      lines.push("RenderOutside," + (state.renderConfig.renderOutside ? 1 : 0));
      lines.push("RenderDrinks," + (state.renderConfig.renderDrinks ? 1 : 0));
      lines.push("OutputFolder," + csvEscapeField(state.renderConfig.outputFolder || ""));
      lines.push("FileNameBase," + csvEscapeField(state.renderConfig.fileNameBase || ""));
      lines.push("OutputModule," + csvEscapeField(state.renderConfig.outputModule || ""));
    } else {
      lines.push("ProductCount," + productCount);
      lines.push("SaleCount,0");
    }
  } catch(e) {
    lines.push("ProductCount," + productCount);
    lines.push("SaleCount,0");
  }
  lines.push("");
  
  var content = lines.join("\n");
  var w = writeTextFileUTF8_BOM(file, content);
  
  if (!w.ok){
    alert("❌ Export failed:\n" + w.err);
    return;
  }
  
  var colorCount = 0;
  try{ colorCount = getAllColorControlsFromBank().length; }catch(_){}
  
  alert("✅ Export Complete!\n\n" +
        file.fsName + "\n\n" +
        "Exported:\n" +
        "• Products: " + productCount + "\n" +
        "• Sales: " + saleCount + "\n" +
        "• Styling: 18 settings\n" +
        "• Talach: 4 fields\n" +
        "• Colors: " + colorCount);
}

// ------------------------------
// Import Complete Project from CSV
// ------------------------------
function importCompleteProjectFromCSV(){
  var file = File.openDialog("Select Complete Project (CSV)", "*.csv");
  if (!file) return;
  
  var r = readTextFileUTF8(file);
  if (!r.ok){
    alert("❌ Read failed:\n" + r.err);
    return;
  }
  
  var text = r.text;
  var allRows = parseCSVContent(text);
  
  var sections = {};
  var currentSection = null;
  var currentRows = [];
  
  for (var i = 0; i < allRows.length; i++){
    var row = allRows[i];
    if (!row || !row.length) continue;

    var isEmpty = true;
    for (var ec = 0; ec < row.length; ec++){
      if (trimString(row[ec]) !== "") { isEmpty = false; break; }
    }
    if (isEmpty) continue;

    if (trimString(row[0]) === "SECTION"){
      if (currentSection && currentRows.length > 0){
        sections[currentSection] = currentRows;
      }
      currentSection = trimString(row.length > 1 ? row[1] : "");
      currentRows = [];
    } else {
      currentRows.push(row);
    }
  }
  
  if (currentSection && currentRows.length > 0){
    sections[currentSection] = currentRows;
  }
  
  var report = {
    products: 0,
    sales: 0,
    styling: false,
    talach: false,
    colors: 0,
    renderImported: false,
    errors: []
  };
  
  app.beginUndoGroup("Import Complete Project");
  
  try{
    
    // ═══════════════════════════════════════════════════════════════
    // Import PRODUCTS
    // ═══════════════════════════════════════════════════════════════
    if (sections.PRODUCTS){
      var prodLines = sections.PRODUCTS;
      if (prodLines.length > 1){
        var headers = prodLines[0];
        var headerMap = buildCsvHeaderMap(headers);
        
        for (var p = 1; p < prodLines.length; p++){
          var cells = prodLines[p];
          var idx = parseInt(getCsvCellByKeys(cells, headerMap, ["Index"]), 10) || 0;
          if (idx < 1 || idx > state.productCount) continue;
          
          var base = state.rows[idx-1];
          
          function getCellRaw(key){
            return String(getCsvCellByKeys(cells, headerMap, [key]) || "");
          }
          function isValidNumber(v){
            if (v === null || v === undefined) return false;
            if (trimString(v) === "") return false;
            return !isNaN(Number(v));
          }
          function parseNumericCell(key, currentValue, fallbackValue, isInt){
            var raw = getCellRaw(key);
            var t = trimString(raw);
            if (t === "") return fallbackValue;
            if (!isValidNumber(raw)){
              report.errors.push("PRODUCTS row " + p + " invalid numeric value for " + key + ": '" + raw + "'");
              return currentValue;
            }
            return isInt ? parseInt(t, 10) : parseFloat(t);
          }
          
          var main = getCellRaw("MainText");
          var sub = getCellRaw("SubText");
          var add = getCellRaw("AddText");
          
          base.mainText = main;
          base.subText = sub;
          base.addText = add;
          
          base.priceType = parseNumericCell("PriceType", base.priceType, 1, true);
          base.priceValue = parseNumericCell("Price", base.priceValue, 0, false);
          base.prevPriceValue = parseNumericCell("PrevPrice", base.prevPriceValue, 0, false);
          base.dealQty = parseNumericCell("DealQty", base.dealQty, 0, true);
          base.dealPrice = parseNumericCell("DealPrice", base.dealPrice, 0, false);
          base.showUnit = parseNumericCell("ShowUnit", base.showUnit, 0, true);
          base.showDealUnit = parseNumericCell("ShowDealUnit", base.showDealUnit, 0, true);
          base.useDefaultBG = parseNumericCell("UseDefaultBG", base.useDefaultBG, 1, true);
          base.productIndex = parseNumericCell("ProductIndex", base.productIndex, idx, true);
          base.bgSideManual = parseNumericCell("BGSideManual", base.bgSideManual, 1, true);
          base.bgColorManual = parseNumericCell("BGColorManual", base.bgColorManual, 1, true);
          base.useAutoWhite = parseNumericCell("UseAutoWhite", base.useAutoWhite, 1, true);
          base.whiteWidth = parseNumericCell("WhiteWidth", base.whiteWidth, 2, true);
          base.showPrevPrice = parseNumericCell("ShowPrevPrice", base.showPrevPrice, 0, true);
          base.prevXOffset = parseNumericCell("PrevXOffset", base.prevXOffset, 0, false);
          base.themeOverride = parseNumericCell("ThemeOverride", base.themeOverride, 1, true);
          base.priceBgSelection = parseNumericCell("PriceBGSelection", base.priceBgSelection, 1, true);
          base.priceDirectionOverride = parseNumericCell("PriceDirectionOverride", base.priceDirectionOverride, 1, true);
          base.regDecimalOffset = parseNumericCell("RegDecimalOffset", base.regDecimalOffset, 0, false);
          base.regCurrencyOffset = parseNumericCell("RegCurrencyOffset", base.regCurrencyOffset, 0, false);
          base.regUnitOffset = parseNumericCell("RegUnitOffset", base.regUnitOffset, 0, false);
          base.prevDecimalOffset = parseNumericCell("PrevDecimalOffset", base.prevDecimalOffset, 0, false);
          base.prevCurrencyOffset = parseNumericCell("PrevCurrencyOffset", base.prevCurrencyOffset, 0, false);
          base.prevUnitOffset = parseNumericCell("PrevUnitOffset", base.prevUnitOffset, 0, false);
          base.dealQtyGap = parseNumericCell("DealQtyGap", base.dealQtyGap, 0, false);
          base.dealSepGap = parseNumericCell("DealSepGap", base.dealSepGap, 0, false);
          base.dealCurGap = parseNumericCell("DealCurGap", base.dealCurGap, 0, false);
          
          try { base.warnOverflow = calcOverflowWarn(base.mainText); } catch(_){}
          
          report.products++;
        }
      }
    }
    
    // ═══════════════════════════════════════════════════════════════
    // Import SALES
    // ═══════════════════════════════════════════════════════════════
    if (sections.SALES){
      var saleLines = sections.SALES;
      if (saleLines.length > 1){
        var saleHeaders = saleLines[0];
        var saleMap = buildCsvHeaderMap(saleHeaders);
        
        for (var sl = 1; sl < saleLines.length; sl++){
          var saleCells = saleLines[sl];
          var slot = parseInt(getCsvCellByKeys(saleCells, saleMap, ["Slot"]), 10) || 0;
          if (slot < 1 || slot > 21) continue;
          
          function getSaleCell(keys){
            var raw = getCsvCellByKeys(saleCells, saleMap, keys);
            return trimString(raw);
          }
          
          var saleConfig = {
            saleUseAutoWhite: parseInt(getSaleCell(["UseAutoWhite"]), 10) === 1,
            saleWhiteWidth: parseInt(getSaleCell(["WhiteWidth"]), 10) || 2,
            salePrevXOffset: parseFloat(getSaleCell(["PrevXOffset", "PrevXOffset\\n", "PrevX"] )) || 0,
            saleBgSelection: parseInt(getSaleCell(["BGSelection", "BG Color", "BGColor"]), 10) || 1,
            saleDirection: parseInt(getSaleCell(["Direction", "Side"]), 10) || 1
          };

          var srcValue = getSaleCell(["SourceProductIndex", "SourceProduct", "Source"]);
          if (srcValue === "" && sharedSalesSlots && sharedSalesSlots[slot - 1]) {
            srcValue = String(sharedSalesSlots[slot - 1].sourceProductIndex || 0);
          }
          var srcIdx = parseInt(srcValue, 10);
          if (isNaN(srcIdx)) {
            report.errors.push("SALES row " + sl + " invalid numeric value for SourceProductIndex: '" + srcValue + "'");
            if (sharedSalesSlots && sharedSalesSlots[slot - 1]) {
              srcIdx = sharedSalesSlots[slot - 1].sourceProductIndex || 0;
            } else {
              srcIdx = 0;
            }
          }
          srcIdx = Math.max(0, Math.min(MAX_PRODUCTS, srcIdx));
          if (sharedSalesSlots && sharedSalesSlots[slot - 1]) {
            sharedSalesSlots[slot - 1].sourceProductIndex = srcIdx;
          }

          if (sharedRowsSalesUI && slot <= sharedRowsSalesUI.length) {
            sharedRowsSalesUI[slot - 1].source.selection = sharedRowsSalesUI[slot - 1].source.items[srcIdx];
            sharedRowsSalesUI[slot - 1].updateFromSource();
          }

          if (sharedSalesSlots && sharedSalesSlots[slot - 1]) {
            sharedSalesSlots[slot - 1].saleUseAutoWhite = saleConfig.saleUseAutoWhite;
            sharedSalesSlots[slot - 1].saleWhiteWidth = saleConfig.saleWhiteWidth;
            sharedSalesSlots[slot - 1].salePrevXOffset = saleConfig.salePrevXOffset;
            sharedSalesSlots[slot - 1].saleBgSelection = saleConfig.saleBgSelection;
            sharedSalesSlots[slot - 1].saleDirection = saleConfig.saleDirection;
          }
          report.sales++;
        }
      }
    }
    
    // ═══════════════════════════════════════════════════════════════
    // Import STYLING
    // ═══════════════════════════════════════════════════════════════
    if (sections.STYLING){
      var styleLines = sections.STYLING;
      var styleData = {};
      
      for (var stl = 1; stl < styleLines.length; stl++){
        var styleCells = styleLines[stl];
        if (styleCells.length >= 2){
          var prop = trimString(styleCells[0]);
          var val = parseInt(styleCells[1], 10) || 1;
          
          if (prop === "StyleMode") styleData.styleMode = val;
          else if (prop === "GlobalTheme") styleData.globalTheme = val;
          else if (prop === "Group1_4") styleData.group1_4 = val;
          else if (prop === "Group5_8") styleData.group5_8 = val;
          else if (prop === "Group9_12") styleData.group9_12 = val;
          else if (prop === "Group13_16") styleData.group13_16 = val;
          else if (prop === "Group17_20") styleData.group17_20 = val;
          else if (prop === "MainBGOverride") styleData.mainBgOverride = val;
          else if (prop === "SaleStyleMode") styleData.saleStyleMode = val;
          else if (prop === "SaleGlobalTheme") styleData.saleGlobalTheme = val;
          else if (prop === "SaleGroup1_3") styleData.saleGroup1_3 = val;
          else if (prop === "SaleGroup4_6") styleData.saleGroup4_6 = val;
          else if (prop === "SaleGroup7_9") styleData.saleGroup7_9 = val;
          else if (prop === "SaleGroup10_12") styleData.saleGroup10_12 = val;
          else if (prop === "SaleGroup13_15") styleData.saleGroup13_15 = val;
          else if (prop === "SaleGroup16_18") styleData.saleGroup16_18 = val;
          else if (prop === "SaleGroup19_21") styleData.saleGroup19_21 = val;
          else if (prop === "SaleMainBGOverride") styleData.saleMainBgOverride = val;
        }
      }
      
      var stRes = applyStyleCtrlToProject(styleData);
      report.styling = (stRes && stRes.ok);
    }
    
    // ═══════════════════════════════════════════════════════════════
    // Import TALACH
    // ═══════════════════════════════════════════════════════════════
    if (sections.TALACH){
      var talachLines = sections.TALACH;
      var talachData = {};
      
      for (var tl = 1; tl < talachLines.length; tl++){
        var talachCells = talachLines[tl];
        if (talachCells.length >= 2){
          var tProp = trimString(talachCells[0]);
          var tVal = talachCells[1];
          
          if (tProp === "Talach1") talachData.talach1 = tVal;
          else if (tProp === "Talach2") talachData.talach2 = tVal;
          else if (tProp === "Talach3") talachData.talach3 = tVal;
          else if (tProp === "CampaignDates") talachData.campaignDates = tVal;
        }
      }
      
      try{
        var compT = getCompByName("TALACH_DATA");
        if (compT){
          setTextValue(compT, "TALACH_LINE_1", uiToAeText(talachData.talach1 || ""));
          setTextValue(compT, "TALACH_LINE_2", uiToAeText(talachData.talach2 || ""));
          setTextValue(compT, "TALACH_LINE_3", uiToAeText(talachData.talach3 || ""));
          setTextValue(compT, "CAMPAIGN_DATE_TEXT", uiToAeText(talachData.campaignDates || ""));
          report.talach = true;
        }
      }catch(e){}
    }
    
    // ═══════════════════════════════════════════════════════════════
    // Import COLORS
    // ═══════════════════════════════════════════════════════════════
    if (sections.COLORS){
      var colorLines = sections.COLORS;
      
      for (var cl = 1; cl < colorLines.length; cl++){
        var colorCells = colorLines[cl];
        if (colorCells.length >= 2){
          var colorName = trimString(colorCells[0]);
          var hex = trimString(colorCells[1]);
          var rgba = hexToRgba01(hex);
          
          if (rgba && setColorInBank(colorName, rgba)){
            report.colors++;
          }
        }
      }
    }
    
    // ═══════════════════════════════════════════════════════════════
    // Import RENDER
    // ═══════════════════════════════════════════════════════════════
    if (sections.RENDER){
      var renderLines = sections.RENDER;
      var renderData = {};
      
      for (var rl = 1; rl < renderLines.length; rl++){
        var renderCells = renderLines[rl];
        if (renderCells.length >= 2){
          var rProp = trimString(renderCells[0]);
          var rVal = trimString(renderCells[1]);
          
          if (rProp === "ProductCount") renderData.productCount = parseInt(rVal, 10) || 0;
          else if (rProp === "SaleCount") renderData.saleCount = parseInt(rVal, 10) || 0;
          else if (rProp === "RenderSale") renderData.renderSale = (parseInt(rVal, 10) === 1);
          else if (rProp === "RenderEntrance") renderData.renderEntrance = (parseInt(rVal, 10) === 1);
          else if (rProp === "RenderPardes") renderData.renderPardes = (parseInt(rVal, 10) === 1);
          else if (rProp === "RenderOutside") renderData.renderOutside = (parseInt(rVal, 10) === 1);
          else if (rProp === "RenderDrinks") renderData.renderDrinks = (parseInt(rVal, 10) === 1);
          else if (rProp === "OutputFolder") renderData.outputFolder = rVal;
          else if (rProp === "FileNameBase") renderData.fileNameBase = rVal;
          else if (rProp === "OutputModule") renderData.outputModule = rVal;
        }
      }
      
      if (!state.renderConfig) state.renderConfig = {};
      for (var key in renderData) {
        if (renderData.hasOwnProperty(key)) state.renderConfig[key] = renderData[key];
      }
      report.renderImported = true;
    }
    
  }catch(e){
    report.errors.push(e.toString());
  }finally{
    app.endUndoGroup();
  }
  
  // Refresh UI
  try{
    if (sharedRowsUI) {
      for (var j = 1; j <= state.productCount && j <= sharedRowsUI.length; j++){
        rowToUi(state.rows[j-1], sharedRowsUI[j-1]);
      }
    }
    if (sharedRowsSalesUI && sharedSalesSlots) {
      var sharedSalesCount = sharedGetSalesCount ? sharedGetSalesCount() : sharedRowsSalesUI.length;
      for (var sru = 1; sru <= Math.min(sharedSalesCount, sharedRowsSalesUI.length); sru++){
        var ui = sharedRowsSalesUI[sru - 1];
        var slotCfg = sharedSalesSlots[sru - 1];
        if (!ui || !slotCfg) continue;
        if (slotCfg.sourceProductIndex >= 0 && slotCfg.sourceProductIndex < ui.source.items.length) {
          ui.source.selection = ui.source.items[slotCfg.sourceProductIndex];
        }
        ui.autoW.value = !!slotCfg.saleUseAutoWhite;
        ui.white.selection = Math.max(0, Math.min(2, (slotCfg.saleWhiteWidth || 1) - 1));
        ui.bgColor.selection = Math.max(0, Math.min(16, (slotCfg.saleBgSelection || 1) - 1));
        ui.side.selection = Math.max(0, Math.min(2, (slotCfg.saleDirection || 1) - 1));
        ui.prevX.value = slotCfg.salePrevXOffset || 0;
        ui.refreshEnabled();
      }
    }
    if (sharedStyleLoad && sharedStyleLoad.onClick) sharedStyleLoad.onClick();
    if (sharedTalachLoad && sharedTalachLoad.onClick) sharedTalachLoad.onClick();
    if (sharedColorsLoad && sharedColorsLoad.onClick) sharedColorsLoad.onClick();
    if (report.renderImported && sharedRenderApplyUI) sharedRenderApplyUI();
  }catch(_){}
  
  alert("✅ Import Complete!\n\n" +
        "Products: " + report.products + "\n" +
        "Sales: " + report.sales + "\n" +
        "Styling: " + (report.styling ? "✅" : "—") + "\n" +
        "Talach: " + (report.talach ? "✅" : "—") + "\n" +
        "Colors: " + report.colors + "\n" +
        "Render: " + (report.renderImported ? "✅" : "—") + "\n\n" +
        (report.errors.length ? ("⚠️ Errors:\n" + report.errors.join("\n")) : "No errors"));
}

// ============================================================================
// END: COMPLETE PROJECT EXPORT/IMPORT
// ============================================================================

// -------------------------
// Data model (UPDATED - PREV PRICE + FINE TUNING + BG OVERRIDE + DEAL)
// -------------------------
function ProductRow(i) {
  this.i = i;

  this.mainText = "";
  this.subText  = "";
  this.addText  = "";

  this.priceType   = 1;
  this.priceValue  = 0;
  this.dealQty     = 0;
  this.dealPrice   = 0;

  this.showUnit     = 0;
  this.showDealUnit = 0;

  this.useDefaultBG = 1;
  this.productIndex = i;

  this.bgColorManual = 1;
  this.bgSideManual  = 1;

  this.useAutoWhite = 1;
  this.whiteWidth   = 2;

  // ✅ Previous price (DATA_CTRL)
  this.showPrevPrice  = 0;
  this.prevPriceValue = 0;
  this.prevXOffset    = 0;

  // ✅ ✅ ✅ Background Override (DATA_CTRL)
  this.themeOverride = 1;           // 1=NONE, 2=2W, 3=B, 4=P50, 5=ALT
  this.priceBgSelection = 1;        // 1=AUTO, 2=2W-BG-1, 3=2W-BG-2... (17 total)
  this.priceDirectionOverride = 1;  // 1=AUTO, 2=Right, 3=Left

  // ✅ Fine tuning - Regular (PRICE_REGULAR_i > CONTROLS)
  this.regDecimalOffset  = 0;
  this.regCurrencyOffset = 0;
  this.regUnitOffset     = 0;

  // ✅ Fine tuning - Previous (Previous_Price_i > PC-i > CONTROLS)
  this.prevDecimalOffset  = 0;
  this.prevCurrencyOffset = 0;
  this.prevUnitOffset     = 0;

  // ✅ ✅ ✅ Fine tuning - DEAL (PRICE_TYPE_DEAL_i > DEAL_CTRL)
  this.dealQtyGap  = 0;  // Gap Separator → Quantity
  this.dealSepGap  = 0;  // Gap Price → Separator
  this.dealCurGap  = 0;  // Gap Price → Currency

  this.warnOverflow = false;
}

var state = {
  productCount: 20,
  rows: (function() {
    var a = [];
    for (var i = 1; i <= MAX_PRODUCTS; i++) a.push(new ProductRow(i));
    return a;
  })()
};

// Shared references for complete import/export helpers (Tab 2 data)
var sharedSalesSlots = null;
var sharedRowsSalesUI = null;
var sharedGetSalesCount = function(){ return 21; };
var sharedRowsUI = null;
var sharedStyleLoad = null;
var sharedTalachLoad = null;
var sharedColorsLoad = null;
var sharedRenderDetect = null;
var sharedRenderApplyUI = null;

function readRowFromProject(i) {
  var row = new ProductRow(i);

  var c = getCompByName(DATA_COMP_PREFIX + i);
  if (!c) return { ok:false, row:row, err:"Missing comp " + DATA_COMP_PREFIX + i };

  // Text layers
  row.mainText = aeToUiText(getTextValue(c, LYR_MAIN));
  row.subText  = aeToUiText(getTextValue(c, LYR_SUB));
  row.addText  = aeToUiText(getTextValue(c, LYR_ADD));

  // DATA_CTRL
  var ctrl = getLayer(c, LYR_CTRL);
  if (!ctrl) return { ok:false, row:row, err:"Missing layer " + LYR_CTRL + " in " + c.name };

  var v;

  // Existing DATA_CTRL
  v = getEffectValue(ctrl, E_PRICE_TYPE);             if (v !== null) row.priceType = v;
  v = getEffectValue(ctrl, E_PRICE_VALUE);            if (v !== null) row.priceValue = v;
  v = getEffectValue(ctrl, E_DEAL_QTY);               if (v !== null) row.dealQty = v;
  v = getEffectValue(ctrl, E_DEAL_PRICE);             if (v !== null) row.dealPrice = v;
  v = getEffectValue(ctrl, E_SHOW_UNIT);              if (v !== null) row.showUnit = v;
  v = getEffectValue(ctrl, E_SHOW_DEAL_UNIT);         if (v !== null) row.showDealUnit = v;
  v = getEffectValue(ctrl, E_USE_DEFAULT_BG);         if (v !== null) row.useDefaultBG = v;
  v = getEffectValue(ctrl, E_PRODUCT_INDEX);          if (v !== null) row.productIndex = v;
  v = getEffectValue(ctrl, E_BG_SIDE_MANUAL);         if (v !== null) row.bgSideManual = v;
  v = getEffectValue(ctrl, E_BG_COLOR_MANUAL);        if (v !== null) row.bgColorManual = v;
  v = getEffectValue(ctrl, E_USE_AUTO_WHITE);         if (v !== null) row.useAutoWhite = v;
  v = getEffectValue(ctrl, E_WHITE_WIDTH_MANUAL);     if (v !== null) row.whiteWidth = v;

  // ✅ Prev Price (DATA_CTRL)
  v = getEffectValue(ctrl, E_SHOW_PREVPRICE);         if (v !== null) row.showPrevPrice = v;
  v = getEffectValue(ctrl, E_PREVPRICE_VALUE);        if (v !== null) row.prevPriceValue = v;
  v = getEffectValue(ctrl, E_PREV_X_OFFSET);          if (v !== null) row.prevXOffset = v;

  // ✅ ✅ ✅ Background Override (DATA_CTRL)
  v = getEffectValue(ctrl, E_THEME_OVERRIDE);         if (v !== null) row.themeOverride = v;
  v = getEffectValue(ctrl, E_PRICE_BG_SELECTION);     if (v !== null) row.priceBgSelection = v;
  v = getEffectValue(ctrl, E_PRICE_DIRECTION_OVERRIDE); if (v !== null) row.priceDirectionOverride = v;

  // ✅ Fine tuning - Regular (PRICE_REGULAR_i > CONTROLS)
  var regComp = getPriceCompRegular(i);
  if (regComp) {
    var regCtrl = getLayer(regComp, LYR_PRICE_CONTROLS);
    if (regCtrl) {
      v = getEffectValue(regCtrl, C_DECIMAL_OFFSET);   if (v !== null) row.regDecimalOffset = v;
      v = getEffectValue(regCtrl, C_CURRENCY_OFFSET);  if (v !== null) row.regCurrencyOffset = v;
      v = getEffectValue(regCtrl, C_UNIT_OFFSET);      if (v !== null) row.regUnitOffset = v;
    }
  }

  // ✅ 🔧 Fine tuning - Previous (Previous_Price_i > PC-i > CONTROLS)
  var prevComp = getPriceCompPrev(i);
  if (prevComp) {
    var pcLayer = getLayer(prevComp, "PC-" + i);
    var prevCtrl = null;
    
    if (pcLayer && pcLayer.source) {
      // מבנה חדש: Previous_Price_i > PC-i > CONTROLS
      prevCtrl = getLayer(pcLayer.source, LYR_PRICE_CONTROLS);
    } else {
      // מבנה ישן: Previous_Price_i > CONTROLS (fallback)
      prevCtrl = getLayer(prevComp, LYR_PRICE_CONTROLS);
    }
    
    if (prevCtrl) {
      v = getEffectValue(prevCtrl, C_DECIMAL_OFFSET);   if (v !== null) row.prevDecimalOffset = v;
      v = getEffectValue(prevCtrl, C_CURRENCY_OFFSET);  if (v !== null) row.prevCurrencyOffset = v;
      v = getEffectValue(prevCtrl, C_UNIT_OFFSET);      if (v !== null) row.prevUnitOffset = v;
    }
  }

  // ✅ ✅ ✅ Fine tuning - DEAL (PRICE_TYPE_DEAL_i > DEAL_CTRL)
  var dealComp = getPriceCompDeal(i);
  if (dealComp) {
    var dealCtrl = getLayer(dealComp, LYR_DEAL_CONTROLS);
    if (dealCtrl) {
      v = getEffectValue(dealCtrl, C_DEAL_CUR_GAP);   if (v !== null) row.dealCurGap = v;
      v = getEffectValue(dealCtrl, C_DEAL_SEP_GAP);   if (v !== null) row.dealSepGap = v;
      v = getEffectValue(dealCtrl, C_DEAL_QTY_GAP);   if (v !== null) row.dealQtyGap = v;
    }
  }

  return { ok:true, row:row, err:null };
}

function applyRowToProject(i, row) {
  var c = getCompByName(DATA_COMP_PREFIX + i);
  if (!c) return { ok:false, err:"Missing comp " + DATA_COMP_PREFIX + i };

  var ctrl = getLayer(c, LYR_CTRL);
  if (!ctrl) return { ok:false, err:"Missing layer " + LYR_CTRL + " in " + c.name };

  // Text layers
  setTextValue(c, LYR_MAIN, uiToAeText(row.mainText));
  setTextValue(c, LYR_SUB,  uiToAeText(row.subText));
  setTextValue(c, LYR_ADD,  uiToAeText(row.addText));

  // Existing DATA_CTRL
  setEffectValue(ctrl, E_PRICE_TYPE, row.priceType);
  setEffectValue(ctrl, E_PRICE_VALUE, row.priceValue);
  setEffectValue(ctrl, E_DEAL_QTY, row.dealQty);
  setEffectValue(ctrl, E_DEAL_PRICE, row.dealPrice);
  setEffectValue(ctrl, E_SHOW_UNIT, row.showUnit);
  setEffectValue(ctrl, E_SHOW_DEAL_UNIT, row.showDealUnit);
  setEffectValue(ctrl, E_USE_DEFAULT_BG, row.useDefaultBG);
  setEffectValue(ctrl, E_PRODUCT_INDEX, row.productIndex);
  setEffectValue(ctrl, E_BG_SIDE_MANUAL, row.bgSideManual);
  setEffectValue(ctrl, E_BG_COLOR_MANUAL, row.bgColorManual);
  setEffectValue(ctrl, E_USE_AUTO_WHITE, row.useAutoWhite);
  setEffectValue(ctrl, E_WHITE_WIDTH_MANUAL, row.whiteWidth);

  // ✅ Prev Price (DATA_CTRL)
  setEffectValue(ctrl, E_SHOW_PREVPRICE, row.showPrevPrice);
  setEffectValue(ctrl, E_PREVPRICE_VALUE, row.prevPriceValue);
  setEffectValue(ctrl, E_PREV_X_OFFSET, row.prevXOffset);

  // ✅ ✅ ✅ Background Override (DATA_CTRL)
  setEffectValue(ctrl, E_THEME_OVERRIDE, row.themeOverride);
  setEffectValue(ctrl, E_PRICE_BG_SELECTION, row.priceBgSelection);
  setEffectValue(ctrl, E_PRICE_DIRECTION_OVERRIDE, row.priceDirectionOverride);

  // ✅ Fine tuning - Regular
  var regComp = getPriceCompRegular(i);
  if (regComp) {
    var regCtrl = getLayer(regComp, LYR_PRICE_CONTROLS);
    if (regCtrl) {
      setEffectValue(regCtrl, C_DECIMAL_OFFSET, row.regDecimalOffset);
      setEffectValue(regCtrl, C_CURRENCY_OFFSET, row.regCurrencyOffset);
      setEffectValue(regCtrl, C_UNIT_OFFSET, row.regUnitOffset);
    }
  }

  // ✅ 🔧 Fine tuning - Previous (Previous_Price_i > PC-i > CONTROLS)
  var prevComp = getPriceCompPrev(i);
  if (prevComp) {
    var pcLayer = getLayer(prevComp, "PC-" + i);
    var prevCtrl = null;
    
    if (pcLayer && pcLayer.source) {
      // מבנה חדש: Previous_Price_i > PC-i > CONTROLS
      prevCtrl = getLayer(pcLayer.source, LYR_PRICE_CONTROLS);
    } else {
      // מבנה ישן: Previous_Price_i > CONTROLS (fallback)
      prevCtrl = getLayer(prevComp, LYR_PRICE_CONTROLS);
    }
    
    if (prevCtrl) {
      setEffectValue(prevCtrl, C_DECIMAL_OFFSET, row.prevDecimalOffset);
      setEffectValue(prevCtrl, C_CURRENCY_OFFSET, row.prevCurrencyOffset);
      setEffectValue(prevCtrl, C_UNIT_OFFSET, row.prevUnitOffset);
    }
  }

  // ✅ ✅ ✅ Fine tuning - DEAL
  var dealComp = getPriceCompDeal(i);
  if (dealComp) {
    var dealCtrl = getLayer(dealComp, LYR_DEAL_CONTROLS);
    if (dealCtrl) {
      setEffectValue(dealCtrl, C_DEAL_CUR_GAP, row.dealCurGap);
      setEffectValue(dealCtrl, C_DEAL_SEP_GAP, row.dealSepGap);
      setEffectValue(dealCtrl, C_DEAL_QTY_GAP, row.dealQtyGap);
    }
  }

  return { ok:true, err:null };
}

function calcOverflowWarn(text) {
  if (!text || text === "") return false;
  var charCount = String(text).length;
  return charCount >= CHAR_LIMIT;
}

function exportToCSV() {
  var file = File.saveDialog("Save CSV file", "*.csv");
  if (!file) return;

  if (file.name.indexOf(".csv") === -1) {
    file = new File(file.fullName + ".csv");
  }

  var csvLines = [];
  csvLines.push([
    padField("White Width", 15),
    padField("Auto White", 12),
    padField("BG Side", 10),
    padField("BG Color", 10),
    padField("BG Default", 12),
    padField("Deal Unit", 12),
    padField("Unit", 8),
    padField("Deal Price", 12),
    padField("Deal Qty", 10),
    padField("Price", 10),
    padField("סוג", 8),
    padField("תוספת", 300),
    padField("משני", 300),
    padField("שם", 300),
    padField("Index", 8)
  ].map(csvEscapeField).join(","));

  for (var i = 0; i < state.productCount; i++) {
    var r = state.rows[i];
    csvLines.push([
      r.whiteWidth,
      r.useAutoWhite,
      r.bgSideManual,
      r.bgColorManual,
      r.useDefaultBG,
      r.showDealUnit,
      r.showUnit,
      r.dealPrice,
      r.dealQty,
      r.priceValue,
      r.priceType,
      padField(r.addText, 300),
      padField(r.subText, 300),
      padField(r.mainText, 300),
      i + 1
    ].map(csvEscapeField).join(","));
  }

  var csvContent = csvLines.join("\n");

  try {
    file.open("w", "TEXT");
    file.write(csvContent);
    file.close();
    alert("✅ Exported successfully!\n\n" + file.fsName + "\n\n(" + state.productCount + " products)");
  } catch (e) {
    alert("❌ Export failed:\n" + e.toString());
  }
}

function importFromCSV() {
  var file = File.openDialog("Select CSV file to import", "*.csv");
  if (!file) return;

  try {
    file.open("r", "TEXT");
    var content = file.read();
    file.close();

    var lines = content.split(/\r\n|\r|\n/);
    if (lines.length < 2) {
      alert("❌ CSV file is empty or has no data rows");
      return;
    }

    var importedCount = 0;

    for (var i = 1; i < lines.length && i <= MAX_PRODUCTS; i++) {
      var line = lines[i];
      if (!line || trimString(line) === "") continue;

      var fields = [];
      var current = "";
      var inQuotes = false;

      for (var j = 0; j < line.length; j++) {
        var ch = line.charAt(j);
        if (ch === '"') {
          if (inQuotes && line.charAt(j + 1) === '"') {
            current += '"';
            j++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === "," && !inQuotes) {
          fields.push(trimString(current));
          current = "";
        } else {
          current += ch;
        }
      }
      fields.push(trimString(current));

      var rowIndex = i - 1;
      if (rowIndex < MAX_PRODUCTS && fields.length >= 15) {
        var r = state.rows[rowIndex];
        r.whiteWidth = parseInt(fields[0]) || 2;
        r.useAutoWhite = parseInt(fields[1]) || 1;
        r.bgSideManual = parseInt(fields[2]) || 1;
        r.bgColorManual = parseInt(fields[3]) || 1;
        r.useDefaultBG = parseInt(fields[4]) || 1;
        r.showDealUnit = parseInt(fields[5]) || 0;
        r.showUnit = parseInt(fields[6]) || 0;
        r.dealPrice = parseFloat(fields[7]) || 0;
        r.dealQty = parseInt(fields[8]) || 0;
        r.priceValue = parseFloat(fields[9]) || 0;
        r.priceType = parseInt(fields[10]) || 1;
        r.addText = fields[11] || "";
        r.subText = fields[12] || "";
        r.mainText = fields[13] || "";
        r.warnOverflow = calcOverflowWarn(r.mainText);
        importedCount++;
      }
    }

    alert("✅ Imported " + importedCount + " rows from:\n\n" + file.fsName);
  } catch (e) {
    alert("❌ Import failed:\n" + e.toString());
  }
}

function buildUI(thisObj) {
  var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Koren Campaign Panel", undefined, { resizeable:true });
  pal.orientation = "column";
  pal.alignChildren = ["fill","top"];
  pal.margins = 10;
  pal.spacing = 8;

  var tabs = pal.add("tabbedpanel");
  tabs.alignChildren = ["fill","fill"];
  tabs.preferredSize = [1100, 500];


// ========================================
// TAB 0: PROJECT STYLING
// ========================================
var tabStyle = tabs.add("tab", undefined, "סגנון פרוייקט");
tabStyle.orientation = "column";
tabStyle.alignChildren = ["fill", "top"];
tabStyle.margins = 10;
tabStyle.spacing = 12;

// State for Style tab
var styleData = {
  styleMode: 1,
  globalTheme: 1,
  group1_4: 1,
  group5_8: 1,
  group9_12: 1,
  group13_16: 1,
  group17_20: 1,
  mainBgOverride: 1,
  saleStyleMode: 1,
  saleGlobalTheme: 1,
  saleGroup1_3: 1,
  saleGroup4_6: 1,
  saleGroup7_9: 1,
  saleGroup10_12: 1,
  saleGroup13_15: 1,
  saleGroup16_18: 1,
  saleGroup19_21: 1,
  saleMainBgOverride: 1,
  linkGlobalThemes: true  // ✅ NEW: Link checkbox state
};

// Top buttons
var styleTopRow = tabStyle.add("group");
styleTopRow.orientation = "row";
styleTopRow.alignChildren = ["left", "center"];
styleTopRow.spacing = 10;

var btnStyleLoad = styleTopRow.add("button", undefined, "📂 Load");
btnStyleLoad.preferredSize.width = 100;

var btnStyleApply = styleTopRow.add("button", undefined, "✅ Apply");
btnStyleApply.preferredSize.width = 100;

tabStyle.add("panel", undefined, "").preferredSize.height = 2;

// ✅ NEW: Link Global Themes Checkbox
var linkRow = tabStyle.add("group");
linkRow.orientation = "row";
linkRow.alignChildren = ["left", "center"];
linkRow.spacing = 10;

var cbLinkGlobal = linkRow.add("checkbox", undefined, "🔗 שרשר Global Theme (Products = Sales)");
cbLinkGlobal.value = true;

tabStyle.add("panel", undefined, "").preferredSize.height = 2;

// ========================================
// SECTION 1: PRODUCTS (4 screens - 1-20)
// ========================================
var productsPanel = tabStyle.add("panel", undefined, "מסכי מוצרים (1-20)");
productsPanel.orientation = "column";
productsPanel.alignChildren = ["fill", "top"];
productsPanel.margins = 10;
productsPanel.spacing = 8;

// Style Mode
var rowStyleMode = productsPanel.add("group");
rowStyleMode.orientation = "row";
rowStyleMode.alignChildren = ["left", "center"];
rowStyleMode.spacing = 10;

rowStyleMode.add("statictext", undefined, "Style Mode:").preferredSize.width = 120;
var ddStyleMode = rowStyleMode.add("dropdownlist", undefined, ["GLOBAL", "GROUP", "PRODUCT"]);
ddStyleMode.preferredSize.width = 150;
ddStyleMode.selection = 0;

// Global Theme (visible only when GLOBAL)
var rowGlobalTheme = productsPanel.add("group");
rowGlobalTheme.orientation = "row";
rowGlobalTheme.alignChildren = ["left", "center"];
rowGlobalTheme.spacing = 10;

rowGlobalTheme.add("statictext", undefined, "Global Theme:").preferredSize.width = 120;
var ddGlobalTheme = rowGlobalTheme.add("dropdownlist", undefined, ["2W", "B", "P50", "ALT"]);
ddGlobalTheme.preferredSize.width = 150;
ddGlobalTheme.selection = 0;

// Group Themes (visible only when GROUP or PRODUCT)
var rowGroup1_4 = productsPanel.add("group");
rowGroup1_4.orientation = "row";
rowGroup1_4.alignChildren = ["left", "center"];
rowGroup1_4.spacing = 10;
rowGroup1_4.add("statictext", undefined, "Group 1-4:").preferredSize.width = 120;
var ddGroup1_4 = rowGroup1_4.add("dropdownlist", undefined, ["2W", "B", "P50", "ALT"]);
ddGroup1_4.preferredSize.width = 150;
ddGroup1_4.selection = 0;

var rowGroup5_8 = productsPanel.add("group");
rowGroup5_8.orientation = "row";
rowGroup5_8.alignChildren = ["left", "center"];
rowGroup5_8.spacing = 10;
rowGroup5_8.add("statictext", undefined, "Group 5-8:").preferredSize.width = 120;
var ddGroup5_8 = rowGroup5_8.add("dropdownlist", undefined, ["2W", "B", "P50", "ALT"]);
ddGroup5_8.preferredSize.width = 150;
ddGroup5_8.selection = 0;

var rowGroup9_12 = productsPanel.add("group");
rowGroup9_12.orientation = "row";
rowGroup9_12.alignChildren = ["left", "center"];
rowGroup9_12.spacing = 10;
rowGroup9_12.add("statictext", undefined, "Group 9-12:").preferredSize.width = 120;
var ddGroup9_12 = rowGroup9_12.add("dropdownlist", undefined, ["2W", "B", "P50", "ALT"]);
ddGroup9_12.preferredSize.width = 150;
ddGroup9_12.selection = 0;

var rowGroup13_16 = productsPanel.add("group");
rowGroup13_16.orientation = "row";
rowGroup13_16.alignChildren = ["left", "center"];
rowGroup13_16.spacing = 10;
rowGroup13_16.add("statictext", undefined, "Group 13-16:").preferredSize.width = 120;
var ddGroup13_16 = rowGroup13_16.add("dropdownlist", undefined, ["2W", "B", "P50", "ALT"]);
ddGroup13_16.preferredSize.width = 150;
ddGroup13_16.selection = 0;

var rowGroup17_20 = productsPanel.add("group");
rowGroup17_20.orientation = "row";
rowGroup17_20.alignChildren = ["left", "center"];
rowGroup17_20.spacing = 10;
rowGroup17_20.add("statictext", undefined, "Group 17-20:").preferredSize.width = 120;
var ddGroup17_20 = rowGroup17_20.add("dropdownlist", undefined, ["2W", "B", "P50", "ALT"]);
ddGroup17_20.preferredSize.width = 150;
ddGroup17_20.selection = 0;

// Main BG Override (always visible)
var rowMainBG = productsPanel.add("group");
rowMainBG.orientation = "row";
rowMainBG.alignChildren = ["left", "center"];
rowMainBG.spacing = 10;
rowMainBG.add("statictext", undefined, "Main BG Override:").preferredSize.width = 120;
var ddMainBG = rowMainBG.add("dropdownlist", undefined, ["AUTO (Global)", "2W", "B", "P50", "ALT"]);
ddMainBG.preferredSize.width = 150;
ddMainBG.selection = 0;

// Dynamic visibility logic
function updateProductsVisibility() {
  var mode = ddStyleMode.selection ? ddStyleMode.selection.index : 0;
  
  if (mode === 0) {
    // GLOBAL
    rowGlobalTheme.visible = true;
    rowGroup1_4.visible = false;
    rowGroup5_8.visible = false;
    rowGroup9_12.visible = false;
    rowGroup13_16.visible = false;
    rowGroup17_20.visible = false;
  } else {
    // GROUP or PRODUCT
    rowGlobalTheme.visible = false;
    rowGroup1_4.visible = true;
    rowGroup5_8.visible = true;
    rowGroup9_12.visible = true;
    rowGroup13_16.visible = true;
    rowGroup17_20.visible = true;
  }
  
  productsPanel.layout.layout(true);
}

ddStyleMode.onChange = updateProductsVisibility;
updateProductsVisibility();

tabStyle.add("panel", undefined, "").preferredSize.height = 2;

// ========================================
// SECTION 2: SALES (3 groups - 1-21)
// ========================================
var salesPanel = tabStyle.add("panel", undefined, "מסכי מבצעים (1-21)");
salesPanel.orientation = "column";
salesPanel.alignChildren = ["fill", "top"];
salesPanel.margins = 10;
salesPanel.spacing = 8;

// Sale Style Mode
var rowSaleStyleMode = salesPanel.add("group");
rowSaleStyleMode.orientation = "row";
rowSaleStyleMode.alignChildren = ["left", "center"];
rowSaleStyleMode.spacing = 10;

rowSaleStyleMode.add("statictext", undefined, "Sale Style Mode:").preferredSize.width = 120;
var ddSaleStyleMode = rowSaleStyleMode.add("dropdownlist", undefined, ["GLOBAL", "GROUP"]);
ddSaleStyleMode.preferredSize.width = 150;
ddSaleStyleMode.selection = 0;

// Sale Global Theme (visible only when GLOBAL)
var rowSaleGlobalTheme = salesPanel.add("group");
rowSaleGlobalTheme.orientation = "row";
rowSaleGlobalTheme.alignChildren = ["left", "center"];
rowSaleGlobalTheme.spacing = 10;

rowSaleGlobalTheme.add("statictext", undefined, "Sale Global Theme:").preferredSize.width = 120;
var ddSaleGlobalTheme = rowSaleGlobalTheme.add("dropdownlist", undefined, ["2W", "B", "P50", "ALT"]);
ddSaleGlobalTheme.preferredSize.width = 150;
ddSaleGlobalTheme.selection = 0;

// Sale Group Themes (visible only when GROUP)
var rowSaleGroup1_3 = salesPanel.add("group");
rowSaleGroup1_3.orientation = "row";
rowSaleGroup1_3.alignChildren = ["left", "center"];
rowSaleGroup1_3.spacing = 10;
rowSaleGroup1_3.add("statictext", undefined, "Sale Group 1-3:").preferredSize.width = 120;
var ddSaleGroup1_3 = rowSaleGroup1_3.add("dropdownlist", undefined, ["2W", "B", "P50", "ALT"]);
ddSaleGroup1_3.preferredSize.width = 150;
ddSaleGroup1_3.selection = 0;

var rowSaleGroup4_6 = salesPanel.add("group");
rowSaleGroup4_6.orientation = "row";
rowSaleGroup4_6.alignChildren = ["left", "center"];
rowSaleGroup4_6.spacing = 10;
rowSaleGroup4_6.add("statictext", undefined, "Sale Group 4-6:").preferredSize.width = 120;
var ddSaleGroup4_6 = rowSaleGroup4_6.add("dropdownlist", undefined, ["2W", "B", "P50", "ALT"]);
ddSaleGroup4_6.preferredSize.width = 150;
ddSaleGroup4_6.selection = 0;

var rowSaleGroup7_9 = salesPanel.add("group");
rowSaleGroup7_9.orientation = "row";
rowSaleGroup7_9.alignChildren = ["left", "center"];
rowSaleGroup7_9.spacing = 10;
rowSaleGroup7_9.add("statictext", undefined, "Sale Group 7-9:").preferredSize.width = 120;
var ddSaleGroup7_9 = rowSaleGroup7_9.add("dropdownlist", undefined, ["2W", "B", "P50", "ALT"]);
ddSaleGroup7_9.preferredSize.width = 150;
ddSaleGroup7_9.selection = 0;

var rowSaleGroup10_12 = salesPanel.add("group");
rowSaleGroup10_12.orientation = "row";
rowSaleGroup10_12.alignChildren = ["left", "center"];
rowSaleGroup10_12.spacing = 10;
rowSaleGroup10_12.add("statictext", undefined, "Sale Group 10-12:").preferredSize.width = 120;
var ddSaleGroup10_12 = rowSaleGroup10_12.add("dropdownlist", undefined, ["2W", "B", "P50", "ALT"]);
ddSaleGroup10_12.preferredSize.width = 150;
ddSaleGroup10_12.selection = 0;

var rowSaleGroup13_15 = salesPanel.add("group");
rowSaleGroup13_15.orientation = "row";
rowSaleGroup13_15.alignChildren = ["left", "center"];
rowSaleGroup13_15.spacing = 10;
rowSaleGroup13_15.add("statictext", undefined, "Sale Group 13-15:").preferredSize.width = 120;
var ddSaleGroup13_15 = rowSaleGroup13_15.add("dropdownlist", undefined, ["2W", "B", "P50", "ALT"]);
ddSaleGroup13_15.preferredSize.width = 150;
ddSaleGroup13_15.selection = 0;

var rowSaleGroup16_18 = salesPanel.add("group");
rowSaleGroup16_18.orientation = "row";
rowSaleGroup16_18.alignChildren = ["left", "center"];
rowSaleGroup16_18.spacing = 10;
rowSaleGroup16_18.add("statictext", undefined, "Sale Group 16-18:").preferredSize.width = 120;
var ddSaleGroup16_18 = rowSaleGroup16_18.add("dropdownlist", undefined, ["2W", "B", "P50", "ALT"]);
ddSaleGroup16_18.preferredSize.width = 150;
ddSaleGroup16_18.selection = 0;

var rowSaleGroup19_21 = salesPanel.add("group");
rowSaleGroup19_21.orientation = "row";
rowSaleGroup19_21.alignChildren = ["left", "center"];
rowSaleGroup19_21.spacing = 10;
rowSaleGroup19_21.add("statictext", undefined, "Sale Group 19-21:").preferredSize.width = 120;
var ddSaleGroup19_21 = rowSaleGroup19_21.add("dropdownlist", undefined, ["2W", "B", "P50", "ALT"]);
ddSaleGroup19_21.preferredSize.width = 150;
ddSaleGroup19_21.selection = 0;

// Sale Main BG Override (always visible)
var rowSaleMainBG = salesPanel.add("group");
rowSaleMainBG.orientation = "row";
rowSaleMainBG.alignChildren = ["left", "center"];
rowSaleMainBG.spacing = 10;
rowSaleMainBG.add("statictext", undefined, "Sale Main BG Override:").preferredSize.width = 120;
var ddSaleMainBG = rowSaleMainBG.add("dropdownlist", undefined, ["AUTO (Global)", "2W", "B", "P50", "ALT"]);
ddSaleMainBG.preferredSize.width = 150;
ddSaleMainBG.selection = 0;

// Dynamic visibility logic for Sales
function updateSalesVisibility() {
  var mode = ddSaleStyleMode.selection ? ddSaleStyleMode.selection.index : 0;
  var isLinked = cbLinkGlobal.value;
  
  if (mode === 0) {
    // GLOBAL
    rowSaleGlobalTheme.visible = !isLinked;  // ✅ Hide if linked
    rowSaleGroup1_3.visible = false;
    rowSaleGroup4_6.visible = false;
    rowSaleGroup7_9.visible = false;
    rowSaleGroup10_12.visible = false;
    rowSaleGroup13_15.visible = false;
    rowSaleGroup16_18.visible = false;
    rowSaleGroup19_21.visible = false;
  } else {
    // GROUP
    rowSaleGlobalTheme.visible = false;
    rowSaleGroup1_3.visible = true;
    rowSaleGroup4_6.visible = true;
    rowSaleGroup7_9.visible = true;
    rowSaleGroup10_12.visible = true;
    rowSaleGroup13_15.visible = true;
    rowSaleGroup16_18.visible = true;
    rowSaleGroup19_21.visible = true;
  }
  
  salesPanel.layout.layout(true);
}

ddSaleStyleMode.onChange = updateSalesVisibility;
cbLinkGlobal.onClick = updateSalesVisibility;  // ✅ Update when checkbox changes
updateSalesVisibility();

// ✅ Sync Global Themes when checkbox is ON
ddGlobalTheme.onChange = function() {
  if (cbLinkGlobal.value && ddSaleStyleMode.selection.index === 0) {
    ddSaleGlobalTheme.selection = ddGlobalTheme.selection;
  }
};

// Load button
btnStyleLoad.onClick = function() {
  var result = readStyleCtrlFromProject();
  if (!result.ok) {
    alert("❌ Failed to load:\n" + result.err);
    return;
  }
  
  var d = result.data;
  styleData = d;
  
  // Products
  ddStyleMode.selection = ddStyleMode.items[Math.max(0, Math.min(2, d.styleMode - 1))];
  ddGlobalTheme.selection = ddGlobalTheme.items[Math.max(0, Math.min(3, d.globalTheme - 1))];
  ddGroup1_4.selection = ddGroup1_4.items[Math.max(0, Math.min(3, d.group1_4 - 1))];
  ddGroup5_8.selection = ddGroup5_8.items[Math.max(0, Math.min(3, d.group5_8 - 1))];
  ddGroup9_12.selection = ddGroup9_12.items[Math.max(0, Math.min(3, d.group9_12 - 1))];
  ddGroup13_16.selection = ddGroup13_16.items[Math.max(0, Math.min(3, d.group13_16 - 1))];
  ddGroup17_20.selection = ddGroup17_20.items[Math.max(0, Math.min(3, d.group17_20 - 1))];
  ddMainBG.selection = ddMainBG.items[Math.max(0, Math.min(4, d.mainBgOverride - 1))];
  
  // Sales
  ddSaleStyleMode.selection = ddSaleStyleMode.items[Math.max(0, Math.min(1, d.saleStyleMode - 1))];
  ddSaleGlobalTheme.selection = ddSaleGlobalTheme.items[Math.max(0, Math.min(3, d.saleGlobalTheme - 1))];
  ddSaleGroup1_3.selection = ddSaleGroup1_3.items[Math.max(0, Math.min(3, d.saleGroup1_3 - 1))];
  ddSaleGroup4_6.selection = ddSaleGroup4_6.items[Math.max(0, Math.min(3, d.saleGroup4_6 - 1))];
  ddSaleGroup7_9.selection = ddSaleGroup7_9.items[Math.max(0, Math.min(3, d.saleGroup7_9 - 1))];
  ddSaleGroup10_12.selection = ddSaleGroup10_12.items[Math.max(0, Math.min(3, d.saleGroup10_12 - 1))];
  ddSaleGroup13_15.selection = ddSaleGroup13_15.items[Math.max(0, Math.min(3, d.saleGroup13_15 - 1))];
  ddSaleGroup16_18.selection = ddSaleGroup16_18.items[Math.max(0, Math.min(3, d.saleGroup16_18 - 1))];
  ddSaleGroup19_21.selection = ddSaleGroup19_21.items[Math.max(0, Math.min(3, d.saleGroup19_21 - 1))];
  ddSaleMainBG.selection = ddSaleMainBG.items[Math.max(0, Math.min(4, d.saleMainBgOverride - 1))];
  
  // ✅ Check if themes are linked
  cbLinkGlobal.value = (d.globalTheme === d.saleGlobalTheme);
  
  updateProductsVisibility();
  updateSalesVisibility();
  alert("✅ Loaded from AE!");
};
sharedStyleLoad = btnStyleLoad;

// Apply button
btnStyleApply.onClick = function() {
  // Products
  styleData.styleMode = (ddStyleMode.selection ? ddStyleMode.selection.index : 0) + 1;
  styleData.globalTheme = (ddGlobalTheme.selection ? ddGlobalTheme.selection.index : 0) + 1;
  styleData.group1_4 = (ddGroup1_4.selection ? ddGroup1_4.selection.index : 0) + 1;
  styleData.group5_8 = (ddGroup5_8.selection ? ddGroup5_8.selection.index : 0) + 1;
  styleData.group9_12 = (ddGroup9_12.selection ? ddGroup9_12.selection.index : 0) + 1;
  styleData.group13_16 = (ddGroup13_16.selection ? ddGroup13_16.selection.index : 0) + 1;
  styleData.group17_20 = (ddGroup17_20.selection ? ddGroup17_20.selection.index : 0) + 1;
  styleData.mainBgOverride = (ddMainBG.selection ? ddMainBG.selection.index : 0) + 1;
  
  // Sales
  styleData.saleStyleMode = (ddSaleStyleMode.selection ? ddSaleStyleMode.selection.index : 0) + 1;
  
  // ✅ If linked, copy Global Theme
  if (cbLinkGlobal.value && ddSaleStyleMode.selection.index === 0) {
    styleData.saleGlobalTheme = styleData.globalTheme;
  } else {
    styleData.saleGlobalTheme = (ddSaleGlobalTheme.selection ? ddSaleGlobalTheme.selection.index : 0) + 1;
  }
  
  styleData.saleGroup1_3 = (ddSaleGroup1_3.selection ? ddSaleGroup1_3.selection.index : 0) + 1;
  styleData.saleGroup4_6 = (ddSaleGroup4_6.selection ? ddSaleGroup4_6.selection.index : 0) + 1;
  styleData.saleGroup7_9 = (ddSaleGroup7_9.selection ? ddSaleGroup7_9.selection.index : 0) + 1;
  styleData.saleGroup10_12 = (ddSaleGroup10_12.selection ? ddSaleGroup10_12.selection.index : 0) + 1;
  styleData.saleGroup13_15 = (ddSaleGroup13_15.selection ? ddSaleGroup13_15.selection.index : 0) + 1;
  styleData.saleGroup16_18 = (ddSaleGroup16_18.selection ? ddSaleGroup16_18.selection.index : 0) + 1;
  styleData.saleGroup19_21 = (ddSaleGroup19_21.selection ? ddSaleGroup19_21.selection.index : 0) + 1;
  styleData.saleMainBgOverride = (ddSaleMainBG.selection ? ddSaleMainBG.selection.index : 0) + 1;
  
  app.beginUndoGroup("Apply Project Styling");
  try {
    var result = applyStyleCtrlToProject(styleData);
    if (!result.ok) {
      alert("❌ Failed:\n" + result.err);
    } else {
      alert("✅ Applied to AE!");
    }
  } catch (e) {
    alert("❌ Error:\n" + e.toString());
  } finally {
    app.endUndoGroup();
  }
};
// ========================================
// TAB 1: PRODUCTS TABLE (20 ROWS - COMPACT!)
// ========================================

var tabProducts = tabs.add("tab", undefined, "מוצרים");
tabProducts.orientation = "column";
tabProducts.alignChildren = ["fill","top"];
tabProducts.margins = 10;
tabProducts.spacing = 8;

var top = tabProducts.add("group");
top.orientation = "row";
top.alignChildren = ["left","center"];
top.spacing = 10;
top.add("statictext", undefined, "Products:");
var etCount = top.add("edittext", undefined, "" + state.productCount);
etCount.characters = 3;

top.add("statictext", undefined, "טווח:");
var ddProductRange = top.add("dropdownlist", undefined, ["הכל (1-20)", "1-4", "5-8", "9-12", "13-16", "17-20", "טווח מותאם..."]);
ddProductRange.preferredSize.width = 120;
ddProductRange.selection = 0;

var etRangeFrom = top.add("edittext", undefined, "1");
etRangeFrom.characters = 3;
etRangeFrom.enabled = false;
top.add("statictext", undefined, "-");
var etRangeTo = top.add("edittext", undefined, "20");
etRangeTo.characters = 3;
etRangeTo.enabled = false;

// ✅ NEW: MEGA LOAD button
var btnMegaLoad = top.add("button", undefined, "🚀 MEGA LOAD");
btnMegaLoad.helpTip = "טוען הכל מהפרויקט בלחיצה אחת:\n• מוצרים (TAB 1)\n• סטיילינג (TAB 0)\n• טלח + תאריכים (TAB 3)\n• צבעים (TAB 5)\n• הגדרות רנדר (TAB 6)";
btnMegaLoad.preferredSize.width = 120;

var btnLoad = top.add("button", undefined, "📂 Load");
btnLoad.helpTip = "מושך נתונים מקובץ האפטר אפקטס - מוצרים בלבד";

var btnApply = top.add("button", undefined, "✅ Apply");
btnApply.helpTip = "מטמיע נתונים בקובץ האפטר אפקטס - מוצרים בלבד";

// ✅ ✅ ✅ NEW ORDER (Right to Left):
var btnResetAllBG = top.add("button", undefined, "🔄 Reset BG");
btnResetAllBG.preferredSize.width = 80;
btnResetAllBG.helpTip = "ריסט לכל רקעי המחיר, כיווני הצבעים וגודל הלבן לאוטומטי";

var btnClear = top.add("button", undefined, "Clear");
btnClear.preferredSize.width = 70;
btnClear.helpTip = "מנקה נתונים למוצרים הנבחרים";

var btnSelNone = top.add("button", undefined, "Un Select");
btnSelNone.preferredSize.width = 80;

var btnSelAll = top.add("button", undefined, "Select All");
btnSelAll.preferredSize.width = 80;


var header = tabProducts.add("group");
header.orientation = "row";
header.alignChildren = ["left","center"];
header.spacing = 6;


function H(txt, w) {
  var st = header.add("statictext", undefined, txt, { truncate:"end" });
  st.preferredSize.width = w;
  return st;
}


H("    ⚠️", 30);
H("     🔄 BG", 55);
H("        F.T BG", 60);
H("         F.T Price", 70);
H("   AutoW", 50);
H("    מחיר קודם", 70);
H("    Prev", 45);
H("    לק\"ג", 45);
H("           X.00", 60);
H("      'יח", 55);
H("             Y", 55);
H("        -ב X", 45);
H("        מבצע", 55);


var btnAdd, btnSub, btnMain;
var hdrIdx = header.add("statictext", undefined, "#");
hdrIdx.preferredSize.width = 25;
var hdrSel = header.add("statictext", undefined, "בחר");
hdrSel.preferredSize.width = 35;


var sc = tabProducts.add("group");
sc.orientation = "column";
sc.alignChildren = ["fill","top"];


var viewport = sc.add("panel", undefined, "");
viewport.margins = 6;
viewport.alignChildren = ["fill","top"];
viewport.preferredSize.height = 280;


var rowsHolder = viewport.add("group");
rowsHolder.orientation = "column";
rowsHolder.alignChildren = ["fill","top"];
rowsHolder.spacing = 2;


var sb = sc.add("scrollbar");
sb.minvalue = 0;
sb.maxvalue = 0;
sb.value = 0;


var rowsUI = [];
sharedRowsUI = rowsUI;


var currentRangeFrom = 1;
var currentRangeTo = 20;


function rebuildHeaderButtons() {
  if (btnAdd) { header.remove(btnAdd); btnAdd = null; }
  if (btnSub) { header.remove(btnSub); btnSub = null; }
  if (btnMain) { header.remove(btnMain); btnMain = null; }
  header.remove(hdrIdx);
  header.remove(hdrSel);


  btnAdd = header.add("button", undefined, "אותיות קטנות ↔");
  btnAdd.preferredSize.width = colWidths.add.current;
  btnSub = header.add("button", undefined, "משני ↔");
  btnSub.preferredSize.width = colWidths.sub.current;
  btnMain = header.add("button", undefined, "שם ↔");
  btnMain.preferredSize.width = colWidths.main.current;


  hdrIdx = header.add("statictext", undefined, "#");
  hdrIdx.preferredSize.width = 25;
  hdrSel = header.add("statictext", undefined, "בחר");
  hdrSel.preferredSize.width = 35;


  btnMain.onClick = function() { resizeColumn("main"); };
  btnSub.onClick = function() { resizeColumn("sub"); };
  btnAdd.onClick = function() { resizeColumn("add"); };


  header.layout.layout(true);
}


function makeRow(i) {
  var g = rowsHolder.add("group");
  g.orientation = "row";
  g.alignChildren = ["left","top"];
  g.spacing = 6;


  var stWarn = g.add("statictext", undefined, "");
  stWarn.preferredSize.width = 40;


  // ✅ ✅ ✅ MOVED: Reset BG button (between ⚠️ and F.T BG)
  var btnResetBG = g.add("button", undefined, "🔄");
  btnResetBG.preferredSize.width = 55;
  btnResetBG.helpTip = "ריסט רקע מחיר למוצר זה לאוטומטי";


  var btnFineBG = g.add("button", undefined, "F.T BG");
  btnFineBG.preferredSize.width = 60;
  btnFineBG.helpTip = "כוונון עדין של רקע המחיר למוצר זה";


  var btnFine = g.add("button", undefined, "F.T Price");
  btnFine.preferredSize.width = 70;
  btnFine.helpTip = "כוונון עדין של מיקומי המחירים למוצר זה";


  var cbAutoW = g.add("checkbox", undefined, "");
  cbAutoW.preferredSize.width = 50;
  cbAutoW.value = true;


  // ✅ ✅ ✅ REMOVED: cbDefBG


  var etPrevVal = g.add("edittext", undefined, "0.00");
  etPrevVal.preferredSize.width = 70;


  var cbPrev = g.add("checkbox", undefined, "");
  cbPrev.preferredSize.width = 45;


  var cbUnit = g.add("checkbox", undefined, "");
  cbUnit.preferredSize.width = 45;


  var etPrice = g.add("edittext", undefined, "0.00");
  etPrice.preferredSize.width = 60;


  var cbDealUnit = g.add("checkbox", undefined, "");
  cbDealUnit.preferredSize.width = 55;


  var etDealPrice = g.add("edittext", undefined, "0");
  etDealPrice.preferredSize.width = 55;


  var etDealQty = g.add("edittext", undefined, "0");
  etDealQty.preferredSize.width = 45;


  var ddType = g.add("dropdownlist", undefined, ["Regular","Deal"]);
  ddType.preferredSize.width = 55;
  ddType.selection = 0;


  var etAdd = g.add("edittext", undefined, "", { multiline:true, scrolling:true });
  etAdd.preferredSize.width = colWidths.add.current;
  etAdd.preferredSize.height = 32;


  var etSub = g.add("edittext", undefined, "", { multiline:true, scrolling:true });
  etSub.preferredSize.width = colWidths.sub.current;
  etSub.preferredSize.height = 32;


  var etMain = g.add("edittext", undefined, "", { multiline:true, scrolling:true });
  etMain.preferredSize.width = colWidths.main.current;
  etMain.preferredSize.height = 32;


  var stIdx = g.add("statictext", undefined, "" + i);
  stIdx.preferredSize.width = 25;


  var cbSel = g.add("checkbox", undefined, "");
  cbSel.preferredSize.width = 35;


  etPrice.onDeactivate = function() { this.text = formatPrice(this.text); };
  etPrice.onChange = function() { this.text = formatPrice(this.text); };
  etDealPrice.onDeactivate = function() { this.text = formatInteger(this.text); };
  etDealQty.onDeactivate = function() { this.text = formatInteger(this.text); };
  etPrevVal.onDeactivate = function() { this.text = formatPrice(this.text); };
  etPrevVal.onChange = function() { this.text = formatPrice(this.text); };


  etMain.onChanging = function() { stWarn.text = calcOverflowWarn(this.text) ? "⚠️" : ""; };
  etMain.onChange = function() { stWarn.text = calcOverflowWarn(this.text) ? "⚠️" : ""; };


  function refreshEnabled() {
    var isDeal = (ddType.selection && ddType.selection.index === 1);


    etDealQty.enabled = isDeal;
    etDealPrice.enabled = isDeal;
    cbDealUnit.enabled = isDeal;
    etPrice.enabled = !isDeal;
    cbUnit.enabled = !isDeal;


    etPrevVal.enabled = cbPrev.value;


    if (ddType.selection) {
      if (ddType.selection.index === 0) {
        if (!cbPrev.manuallySet) cbPrev.value = true;
      } else {
        if (!cbPrev.manuallySet) cbPrev.value = false;
      }
      etPrevVal.enabled = cbPrev.value;
    }
  }


  cbAutoW.onClick = refreshEnabled;
  ddType.onChange = refreshEnabled;
  cbPrev.onClick = function() {
    cbPrev.manuallySet = true;
    refreshEnabled();
  };


  // ========================================
  // 🔄 RESET BG BUTTON (Individual Product)
  // ========================================
  btnResetBG.onClick = function() {
    var c = getCompByName(DATA_COMP_PREFIX + i);
    if (!c) {
      alert("❌ Missing comp: " + DATA_COMP_PREFIX + i);
      return;
    }


    var ctrl = getLayer(c, LYR_CTRL);
    if (!ctrl) {
      alert("❌ Missing DATA_CTRL layer");
      return;
    }


    app.beginUndoGroup("Reset BG to AUTO - Product " + i);
    try {
      setEffectValue(ctrl, E_THEME_OVERRIDE, 1);           // NONE
      setEffectValue(ctrl, E_PRICE_BG_SELECTION, 1);       // AUTO
      setEffectValue(ctrl, E_PRICE_DIRECTION_OVERRIDE, 1); // AUTO
      alert("✅ Product " + i + " BG reset to AUTO!");
    } catch (e) {
      alert("❌ Error: " + e.toString());
    } finally {
      app.endUndoGroup();
    }
  };


  // ========================================
  // F.T BG PALETTE (UPDATED)
  // ========================================
  btnFineBG.onClick = function() {
    var palBG = new Window("palette", "Fine Tuning - Product " + i + " - Background", undefined, { resizeable:false });
    palBG.orientation = "column";
    palBG.alignChildren = ["fill","top"];
    palBG.margins = 12;
    palBG.spacing = 10;


    var topGroup = palBG.add("group");
    topGroup.orientation = "row";
    topGroup.alignChildren = ["fill","center"];
    topGroup.spacing = 8;


    var btnApplyBG = topGroup.add("button", undefined, "✅ APPLY Product " + i);
    btnApplyBG.preferredSize.width = 160;


    var btnLoadBG = topGroup.add("button", undefined, "📂 Load");
    btnLoadBG.preferredSize.width = 80;


    var btnResetBGPal = topGroup.add("button", undefined, "🔄 Reset");
    btnResetBGPal.preferredSize.width = 80;


    palBG.add("panel", undefined, "").preferredSize.height = 2;


    palBG.add("statictext", undefined, "━━━ רקע - מוצר " + i + " ━━━");


    var gTheme = palBG.add("group");
    gTheme.orientation = "row";
    gTheme.alignChildren = ["left","center"];
    var stTheme = gTheme.add("statictext", undefined, "Theme Override:");
    stTheme.preferredSize.width = 120;
    var ddTheme = gTheme.add("dropdownlist", undefined, ["NONE", "2W", "B", "P50", "ALT"]);
    ddTheme.preferredSize.width = 120;
    ddTheme.selection = 0;


    var warningGroup = palBG.add("group");
    warningGroup.orientation = "column";
    warningGroup.alignChildren = ["right","top"];
    warningGroup.spacing = 2;


    var warnLine1 = warningGroup.add("statictext", undefined, "⚠️ הערה:");
    warnLine1.graphics.foregroundColor = warnLine1.graphics.newPen(warnLine1.graphics.PenType.SOLID_COLOR, [0.5, 0.5, 0.5], 1);


    var warnLine2 = warningGroup.add("statictext", undefined, "פועל רק כאשר בטאב סגנון פרוייקט  Theme Override");
    warnLine2.graphics.foregroundColor = warnLine2.graphics.newPen(warnLine2.graphics.PenType.SOLID_COLOR, [0.5, 0.5, 0.5], 1);


    var warnLine3 = warningGroup.add("statictext", undefined, " (GLOBAL או GROUP) ולא PRODUCT Mode מוגדר");
    warnLine3.graphics.foregroundColor = warnLine3.graphics.newPen(warnLine3.graphics.PenType.SOLID_COLOR, [0.5, 0.5, 0.5], 1);


    var warnLine4 = warningGroup.add("statictext", undefined, " NONE אחרת - בחר ב");
    warnLine4.graphics.foregroundColor = warnLine4.graphics.newPen(warnLine4.graphics.PenType.SOLID_COLOR, [0.5, 0.5, 0.5], 1);


    palBG.add("panel", undefined, "").preferredSize.height = 2;


    var gBGSel = palBG.add("group");
    gBGSel.orientation = "row";
    gBGSel.alignChildren = ["left","center"];
    var stBGSel = gBGSel.add("statictext", undefined, "Price BG Selection:");
    stBGSel.preferredSize.width = 120;
    
    var bgOptions = ["AUTO", "2W - BG 1", "2W - BG 2", "2W - BG 3", "2W - BG 4", 
                     "B - BG 1", "B - BG 2", "B - BG 3", "B - BG 4",
                     "P50 - BG 1", "P50 - BG 2", "P50 - BG 3", "P50 - BG 4",
                     "ALT - BG 1", "ALT - BG 2", "ALT - BG 3", "ALT - BG 4"];
    
    var ddBGSel = gBGSel.add("dropdownlist", undefined, bgOptions);
    ddBGSel.preferredSize.width = 120;
    ddBGSel.selection = 0;


    var gDir = palBG.add("group");
    gDir.orientation = "row";
    gDir.alignChildren = ["left","center"];
    var stDir = gDir.add("statictext", undefined, "Price Direction:");
    stDir.preferredSize.width = 120;
    var ddDir = gDir.add("dropdownlist", undefined, ["AUTO", "Right", "Left"]);
    ddDir.preferredSize.width = 120;
    ddDir.selection = 0;


    palBG.add("panel", undefined, "").preferredSize.height = 2;


    var gAutoW = palBG.add("group");
    gAutoW.orientation = "row";
    gAutoW.alignChildren = ["left","center"];
    var stAutoW = gAutoW.add("statictext", undefined, "Auto White:");
    stAutoW.preferredSize.width = 120;
    var cbAutoWFine = gAutoW.add("checkbox", undefined, "");
    cbAutoWFine.value = cbAutoW.value;


    var gWhite = palBG.add("group");
    gWhite.orientation = "row";
    gWhite.alignChildren = ["left","center"];
    var stWhite = gWhite.add("statictext", undefined, "White Width:");
    stWhite.preferredSize.width = 120;
    var ddWhiteFine = gWhite.add("dropdownlist", undefined, ["Narrow","Regular","Wide"]);
    ddWhiteFine.preferredSize.width = 120;
    ddWhiteFine.selection = state.rows[i-1].whiteWidth - 1;


    palBG.add("panel", undefined, "").preferredSize.height = 2;


    function refreshEnabledFine() {
      ddWhiteFine.enabled = !cbAutoWFine.value;
    }


    cbAutoWFine.onClick = refreshEnabledFine;
    refreshEnabledFine();


    btnLoadBG.onClick = function() {
      var res = readRowFromProject(i);
      if (res.ok) {
        var row = res.row;
        state.rows[i-1] = row;
        
        ddTheme.selection = ddTheme.items[Math.max(0, Math.min(4, row.themeOverride - 1))];
        ddBGSel.selection = ddBGSel.items[Math.max(0, Math.min(16, row.priceBgSelection - 1))];
        ddDir.selection = ddDir.items[Math.max(0, Math.min(2, row.priceDirectionOverride - 1))];
        
        cbAutoWFine.value = !!row.useAutoWhite;
        ddWhiteFine.selection = ddWhiteFine.items[Math.max(0, Math.min(2, row.whiteWidth - 1))];
        refreshEnabledFine();
        alert("✅ Loaded from AE!");
      } else {
        alert("❌ Failed to load:\n" + res.err);
      }
    };


    btnResetBGPal.onClick = function() {
      ddTheme.selection = 0;
      ddBGSel.selection = 0;
      ddDir.selection = 0;
      cbAutoWFine.value = true;
      ddWhiteFine.selection = 1;
      refreshEnabledFine();
    };


    btnApplyBG.onClick = function() {
      var tempRow = uiToRow(rowsUI[i-1], state.rows[i-1]);
      tempRow.themeOverride = (ddTheme.selection ? ddTheme.selection.index : 0) + 1;
      tempRow.priceBgSelection = (ddBGSel.selection ? ddBGSel.selection.index : 0) + 1;
      tempRow.priceDirectionOverride = (ddDir.selection ? ddDir.selection.index : 0) + 1;
      tempRow.useAutoWhite = toBool(cbAutoWFine.value);
      tempRow.whiteWidth = (ddWhiteFine.selection ? ddWhiteFine.selection.index : 1) + 1;


      app.beginUndoGroup("Apply Fine Tuning BG - Product " + i);
      try {
        var result = applyRowToProject(i, tempRow);
        if (!result.ok) {
          alert("❌ Failed: " + result.err);
        } else {
          alert("✅ Applied to AE!");
        }
      } catch (e) {
        alert("❌ Error: " + e.toString());
      } finally {
        app.endUndoGroup();
      }
    };


    var bottomGroup = palBG.add("group");
    bottomGroup.orientation = "row";
    bottomGroup.alignChildren = ["fill","center"];
    bottomGroup.spacing = 8;


    var btnSaveCloseBG = bottomGroup.add("button", undefined, "💾 Save & Close");
    btnSaveCloseBG.preferredSize.width = 150;


    var btnCloseBG = bottomGroup.add("button", undefined, "❌ Close");
    btnCloseBG.preferredSize.width = 150;


    btnSaveCloseBG.onClick = function() {
      state.rows[i-1].themeOverride = (ddTheme.selection ? ddTheme.selection.index : 0) + 1;
      state.rows[i-1].priceBgSelection = (ddBGSel.selection ? ddBGSel.selection.index : 0) + 1;
      state.rows[i-1].priceDirectionOverride = (ddDir.selection ? ddDir.selection.index : 0) + 1;
      state.rows[i-1].useAutoWhite = toBool(cbAutoWFine.value);
      state.rows[i-1].whiteWidth = (ddWhiteFine.selection ? ddWhiteFine.selection.index : 1) + 1;
      cbAutoW.value = cbAutoWFine.value;
      palBG.close();
    };


    btnCloseBG.onClick = function() {
      palBG.close();
    };


    palBG.show();
  };


  // ========================================
  // F.T PRICE PALETTE (unchanged)
  // ========================================
  btnFine.onClick = function() {
    var pal = new Window("palette", "Fine Tuning - Product " + i + " - Price", undefined, { resizeable:false });
    pal.orientation = "column";
    pal.alignChildren = ["fill","top"];
    pal.margins = 12;
    pal.spacing = 10;


    var topGroup = pal.add("group");
    topGroup.orientation = "row";
    topGroup.alignChildren = ["fill","center"];
    topGroup.spacing = 8;


    var btnApplyFine = topGroup.add("button", undefined, "✅ APPLY Product " + i);
    btnApplyFine.preferredSize.width = 160;


    var btnLoadFine = topGroup.add("button", undefined, "📂 Load");
    btnLoadFine.preferredSize.width = 80;


    var btnResetAll = topGroup.add("button", undefined, "🔄 Reset");
    btnResetAll.preferredSize.width = 80;


    pal.add("panel", undefined, "").preferredSize.height = 2;


    function rowFieldWithSlider(label, initVal, minVal, maxVal) {
      var grp = pal.add("group");
      grp.orientation = "column";
      grp.alignChildren = ["fill","top"];
      grp.spacing = 4;


      var labelRow = grp.add("group");
      labelRow.orientation = "row";
      labelRow.alignChildren = ["left","center"];
      var stLabel = labelRow.add("statictext", undefined, label);
      stLabel.preferredSize.width = 240;


      var controlRow = grp.add("group");
      controlRow.orientation = "row";
      controlRow.alignChildren = ["fill","center"];
      controlRow.spacing = 8;


      var slider = controlRow.add("slider", undefined, initVal, minVal, maxVal);
      slider.preferredSize.width = 180;


      var et = controlRow.add("edittext", undefined, initVal.toFixed(1));
      et.characters = 6;


      var btnReset = controlRow.add("button", undefined, "↺");
      btnReset.preferredSize.width = 30;


      slider.onChanging = function() {
        et.text = slider.value.toFixed(1);
      };


      et.onChange = function() {
        var val = parseFloat(et.text);
        if (!isNaN(val)) {
          val = Math.max(minVal, Math.min(maxVal, val));
          slider.value = val;
          et.text = val.toFixed(1);
        }
      };


      btnReset.onClick = function() {
        slider.value = 0;
        et.text = "0.0";
      };


      return { slider: slider, edit: et, reset: btnReset };
    }


    pal.add("statictext", undefined, "━━━ מחיר רגיל - מוצר " + i + " ━━━");


    var regDec = rowFieldWithSlider("אגורות Offset (Decimal)", state.rows[i-1].regDecimalOffset || 0, -100, 100);
    var regCur = rowFieldWithSlider("ש\"ח Offset (Currency)", state.rows[i-1].regCurrencyOffset || 0, -100, 100);
    var regUnit = rowFieldWithSlider("ש\"ח/ק\"ג Offset (Unit)", state.rows[i-1].regUnitOffset || 0, -100, 100);


    pal.add("panel", undefined, "").preferredSize.height = 2;


    pal.add("statictext", undefined, "━━━ מחיר מוצר קודם - מוצר " + i + " ━━━");


    var prevDec = rowFieldWithSlider("אגורות מוצר קודם Offset", state.rows[i-1].prevDecimalOffset || 0, -100, 100);
    var prevCur = rowFieldWithSlider("ש\"ח מוצר קודם Offset", state.rows[i-1].prevCurrencyOffset || 0, -100, 100);
    var prevUnit = rowFieldWithSlider("ש\"ח/ק\"ג מוצר קודם Offset", state.rows[i-1].prevUnitOffset || 0, -100, 100);


    pal.add("panel", undefined, "").preferredSize.height = 1;


    var prevLoc = rowFieldWithSlider("מיקום מוצר קודם (ציר X בלבד)", state.rows[i-1].prevXOffset || 0, -500, 500);


    pal.add("panel", undefined, "").preferredSize.height = 2;


    pal.add("statictext", undefined, "━━━ מחיר מבצע (Deal) - מוצר " + i + " ━━━");


    var dealQtyGap = rowFieldWithSlider("\"ב-\" ימינה (Separator→Qty)", state.rows[i-1].dealQtyGap || 0, -100, 100);
    var dealSepGap = rowFieldWithSlider("\"ב-\" שמאלה (Price→Separator)", state.rows[i-1].dealSepGap || 0, -100, 100);
    var dealCurGap = rowFieldWithSlider("ש\"ח Offset (Price→Currency)", state.rows[i-1].dealCurGap || 0, -100, 100);


    pal.add("panel", undefined, "").preferredSize.height = 2;


    var bottomGroup = pal.add("group");
    bottomGroup.orientation = "row";
    bottomGroup.alignChildren = ["fill","center"];
    bottomGroup.spacing = 8;


    var btnSaveClose = bottomGroup.add("button", undefined, "💾 Save & Close");
    btnSaveClose.preferredSize.width = 150;


    var btnClose = bottomGroup.add("button", undefined, "❌ Close");
    btnClose.preferredSize.width = 150;


    btnLoadFine.onClick = function() {
      var res = readRowFromProject(i);
      if (res.ok) {
        var row = res.row;
        state.rows[i-1] = row;
        regDec.slider.value = row.regDecimalOffset || 0;
        regDec.edit.text = (row.regDecimalOffset || 0).toFixed(1);
        regCur.slider.value = row.regCurrencyOffset || 0;
        regCur.edit.text = (row.regCurrencyOffset || 0).toFixed(1);
        regUnit.slider.value = row.regUnitOffset || 0;
        regUnit.edit.text = (row.regUnitOffset || 0).toFixed(1);
        prevDec.slider.value = row.prevDecimalOffset || 0;
        prevDec.edit.text = (row.prevDecimalOffset || 0).toFixed(1);
        prevCur.slider.value = row.prevCurrencyOffset || 0;
        prevCur.edit.text = (row.prevCurrencyOffset || 0).toFixed(1);
        prevUnit.slider.value = row.prevUnitOffset || 0;
        prevUnit.edit.text = (row.prevUnitOffset || 0).toFixed(1);
        prevLoc.slider.value = row.prevXOffset || 0;
        prevLoc.edit.text = (row.prevXOffset || 0).toFixed(1);
        dealQtyGap.slider.value = row.dealQtyGap || 0;
        dealQtyGap.edit.text = (row.dealQtyGap || 0).toFixed(1);
        dealSepGap.slider.value = row.dealSepGap || 0;
        dealSepGap.edit.text = (row.dealSepGap || 0).toFixed(1);
        dealCurGap.slider.value = row.dealCurGap || 0;
        dealCurGap.edit.text = (row.dealCurGap || 0).toFixed(1);
        alert("✅ Loaded from AE!");
      } else {
        alert("❌ Failed to load:\n" + res.err);
      }
    };


    btnResetAll.onClick = function() {
      regDec.slider.value = 0; regDec.edit.text = "0.0";
      regCur.slider.value = 0; regCur.edit.text = "0.0";
      regUnit.slider.value = 0; regUnit.edit.text = "0.0";
      prevDec.slider.value = 0; prevDec.edit.text = "0.0";
      prevCur.slider.value = 0; prevCur.edit.text = "0.0";
      prevUnit.slider.value = 0; prevUnit.edit.text = "0.0";
      prevLoc.slider.value = 0; prevLoc.edit.text = "0.0";
      dealQtyGap.slider.value = 0; dealQtyGap.edit.text = "0.0";
      dealSepGap.slider.value = 0; dealSepGap.edit.text = "0.0";
      dealCurGap.slider.value = 0; dealCurGap.edit.text = "0.0";
    };


    btnApplyFine.onClick = function() {
      var tempRow = uiToRow(rowsUI[i-1], state.rows[i-1]);
      tempRow.regDecimalOffset = parseFloat(regDec.edit.text) || 0;
      tempRow.regCurrencyOffset = parseFloat(regCur.edit.text) || 0;
      tempRow.regUnitOffset = parseFloat(regUnit.edit.text) || 0;
      tempRow.prevDecimalOffset = parseFloat(prevDec.edit.text) || 0;
      tempRow.prevCurrencyOffset = parseFloat(prevCur.edit.text) || 0;
      tempRow.prevUnitOffset = parseFloat(prevUnit.edit.text) || 0;
      tempRow.prevXOffset = parseFloat(prevLoc.edit.text) || 0;
      tempRow.dealQtyGap = parseFloat(dealQtyGap.edit.text) || 0;
      tempRow.dealSepGap = parseFloat(dealSepGap.edit.text) || 0;
      tempRow.dealCurGap = parseFloat(dealCurGap.edit.text) || 0;


      app.beginUndoGroup("Apply Fine Tuning - Product " + i);
      try {
        var result = applyRowToProject(i, tempRow);
        if (!result.ok) {
          alert("❌ Failed: " + result.err);
        } else {
          alert("✅ Applied to AE!");
        }
      } catch (e) {
        alert("❌ Error: " + e.toString());
      } finally {
        app.endUndoGroup();
      }
    };


    btnSaveClose.onClick = function() {
      state.rows[i-1].regDecimalOffset = parseFloat(regDec.edit.text) || 0;
      state.rows[i-1].regCurrencyOffset = parseFloat(regCur.edit.text) || 0;
      state.rows[i-1].regUnitOffset = parseFloat(regUnit.edit.text) || 0;
      state.rows[i-1].prevDecimalOffset = parseFloat(prevDec.edit.text) || 0;
      state.rows[i-1].prevCurrencyOffset = parseFloat(prevCur.edit.text) || 0;
      state.rows[i-1].prevUnitOffset = parseFloat(prevUnit.edit.text) || 0;
      state.rows[i-1].prevXOffset = parseFloat(prevLoc.edit.text) || 0;
      state.rows[i-1].dealQtyGap = parseFloat(dealQtyGap.edit.text) || 0;
      state.rows[i-1].dealSepGap = parseFloat(dealSepGap.edit.text) || 0;
      state.rows[i-1].dealCurGap = parseFloat(dealCurGap.edit.text) || 0;
      pal.close();
    };


    btnClose.onClick = function() {
      pal.close();
    };


    pal.show();
  };


  var tabOrder = [
    cbSel, stIdx, etMain, etSub, etAdd,
    ddType, etDealQty, etDealPrice, etPrice,
    cbUnit, cbDealUnit,
    cbAutoW,
    btnResetBG,
    cbPrev, etPrevVal, btnFine, btnFineBG
  ];


  for (var t = 0; t < tabOrder.length; t++) {
    (function(currentIndex) {
      var ctrl = tabOrder[currentIndex];
      if (ctrl && ctrl.addEventListener) {
        ctrl.addEventListener("keydown", function(e) {
          if (e.keyName === "Tab") {
            e.preventDefault();
            var nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
            if (nextIndex >= 0 && nextIndex < tabOrder.length) {
              var nextCtrl = tabOrder[nextIndex];
              if (nextCtrl && nextCtrl.enabled && nextCtrl.visible) {
                try { nextCtrl.active = true; } catch(_) {}
              }
            }
          }
        });
      }
    })(t);
  }


  refreshEnabled();


  return {
    i:i, group:g, warn:stWarn,
    showPrev: cbPrev,
    prevVal: etPrevVal,
    fineBtn: btnFine,
    fineBtnBG: btnFineBG,
    resetBGBtn: btnResetBG,
    useAutoWhite:cbAutoW,
    showDealUnit:cbDealUnit, showUnit:cbUnit,
    priceValue:etPrice, dealPrice:etDealPrice, dealQty:etDealQty,
    priceType:ddType, add:etAdd, sub:etSub, main:etMain,
    idx:stIdx, sel:cbSel, refreshEnabled:refreshEnabled
  };
}


function rebuildRows() {
  for (var i = 0; i < rowsUI.length; i++) {
    if (i < MAX_PRODUCTS && rowsUI[i]) {
      state.rows[i] = uiToRow(rowsUI[i], state.rows[i]);
    }
  }
  for (var j = rowsUI.length - 1; j >= 0; j--) {
    rowsHolder.remove(rowsUI[j].group);
  }
  rowsUI = [];
  sharedRowsUI = rowsUI;
  for (var k = 1; k <= MAX_PRODUCTS; k++) {
    rowsUI.push(makeRow(k));
  }
  for (var m = 0; m < rowsUI.length; m++) {
    rowToUi(state.rows[m], rowsUI[m]);
  }
  applyProductRangeFilter();
  rowsHolder.layout.layout(true);
  viewport.layout.layout(true);
  tabProducts.layout.layout(true);
  updateScrollbar();
}


function resizeColumn(colName) {
  var col = colWidths[colName];
  if (col.expanded) {
    col.current = col.min;
    col.expanded = false;
  } else {
    col.current = col.min * 2;
    col.expanded = true;
  }
  rebuildHeaderButtons();
  rebuildRows();
}


for (var i = 1; i <= MAX_PRODUCTS; i++) rowsUI.push(makeRow(i));
rebuildHeaderButtons();


function updateScrollbar() {
  var contentH = rowsHolder.size.height;
  var viewH = viewport.size.height - 20;
  var max = Math.max(0, contentH - viewH);
  sb.maxvalue = max;
  sb.value = Math.min(sb.value, max);
}


sb.onChanging = function() { rowsHolder.location = [rowsHolder.location[0], 6 - sb.value]; };


function applyProductRangeFilter() {
  for (var i = 0; i < rowsUI.length; i++) {
    var u = rowsUI[i];
    var productNum = u.i;
    var inRange = (productNum >= currentRangeFrom && productNum <= currentRangeTo);
    var inCount = (productNum <= state.productCount);
    var visible = inRange && inCount;
    u.group.visible = visible;
    u.group.enabled = visible;
  }
  tabProducts.layout.layout(true);
  updateScrollbar();
}


ddProductRange.onChange = function() {
  var sel = ddProductRange.selection ? ddProductRange.selection.index : 0;
  if (sel === 0) {
    currentRangeFrom = 1;
    currentRangeTo = 20;
    etRangeFrom.enabled = false;
    etRangeTo.enabled = false;
  } else if (sel === 1) {
    currentRangeFrom = 1;
    currentRangeTo = 4;
    etRangeFrom.enabled = false;
    etRangeTo.enabled = false;
  } else if (sel === 2) {
    currentRangeFrom = 5;
    currentRangeTo = 8;
    etRangeFrom.enabled = false;
    etRangeTo.enabled = false;
  } else if (sel === 3) {
    currentRangeFrom = 9;
    currentRangeTo = 12;
    etRangeFrom.enabled = false;
    etRangeTo.enabled = false;
  } else if (sel === 4) {
    currentRangeFrom = 13;
    currentRangeTo = 16;
    etRangeFrom.enabled = false;
    etRangeTo.enabled = false;
  } else if (sel === 5) {
    currentRangeFrom = 17;
    currentRangeTo = 20;
    etRangeFrom.enabled = false;
    etRangeTo.enabled = false;
  } else if (sel === 6) {
    etRangeFrom.enabled = true;
    etRangeTo.enabled = true;
    currentRangeFrom = clampInt(etRangeFrom.text, 1, MAX_PRODUCTS, 1);
    currentRangeTo = clampInt(etRangeTo.text, 1, MAX_PRODUCTS, 20);
  }
  etRangeFrom.text = "" + currentRangeFrom;
  etRangeTo.text = "" + currentRangeTo;
  applyProductRangeFilter();
};


etRangeFrom.onChange = function() {
  currentRangeFrom = clampInt(this.text, 1, MAX_PRODUCTS, 1);
  if (currentRangeFrom > currentRangeTo) currentRangeFrom = currentRangeTo;
  this.text = "" + currentRangeFrom;
  applyProductRangeFilter();
};


etRangeTo.onChange = function() {
  currentRangeTo = clampInt(this.text, 1, MAX_PRODUCTS, 20);
  if (currentRangeTo < currentRangeFrom) currentRangeTo = currentRangeFrom;
  this.text = "" + currentRangeTo;
  applyProductRangeFilter();
};


function uiToRow(u, existingRow) {
  var r = existingRow || new ProductRow(u.i);
  r.mainText = u.main.text;
  r.subText = u.sub.text;
  r.addText = u.add.text;
  r.priceType = (u.priceType.selection ? u.priceType.selection.index : 0) + 1;
  r.priceValue = clampNum(u.priceValue.text, 0, 99999, r.priceValue);
  r.dealQty = clampNum(u.dealQty.text, 0, 999, r.dealQty);
  r.dealPrice = clampNum(u.dealPrice.text, 0, 99999, r.dealPrice);
  r.showUnit = toBool(u.showUnit.value);
  r.showDealUnit = toBool(u.showDealUnit.value);
  r.useAutoWhite = toBool(u.useAutoWhite.value);
  r.showPrevPrice = toBool(u.showPrev.value);
  r.prevPriceValue = clampNum(u.prevVal.text, 0, 99999, r.prevPriceValue);
  r.warnOverflow = calcOverflowWarn(r.mainText);
  return r;
}


function rowToUi(r, u) {
  u.main.text = r.mainText || "";
  u.sub.text = r.subText || "";
  u.add.text = r.addText || "";
  u.priceType.selection = u.priceType.items[Math.max(0, Math.min(1, r.priceType - 1))];
  u.priceValue.text = formatPrice(r.priceValue);
  u.dealQty.text = formatInteger(r.dealQty);
  u.dealPrice.text = formatInteger(r.dealPrice);
  u.showUnit.value = !!r.showUnit;
  u.showDealUnit.value = !!r.showDealUnit;
  u.useAutoWhite.value = !!r.useAutoWhite;
  u.showPrev.value = !!r.showPrevPrice;
  u.prevVal.text = formatPrice(r.prevPriceValue);
  u.warn.text = r.warnOverflow ? "⚠️" : "";
  u.refreshEnabled();
}


function applyProductCountToUI() {
  var cnt = state.productCount;
  for (var i = 0; i < rowsUI.length; i++) {
    var u = rowsUI[i];
    var visible = (u.i <= cnt);
    u.group.visible = visible;
    u.group.enabled = visible;
  }
  applyProductRangeFilter();
}


function onCountChanged() {
  state.productCount = clampInt(etCount.text, 1, MAX_PRODUCTS, 20);
  etCount.text = "" + state.productCount;
  applyProductCountToUI();
  for (var i = 1; i <= state.productCount; i++) {
    rowToUi(state.rows[i-1], rowsUI[i-1]);
  }
}
etCount.onChange = onCountChanged;
etCount.onDeactivate = onCountChanged;


btnSelAll.onClick = function() {
  for (var i = 0; i < state.productCount; i++) {
    if (rowsUI[i].group.visible) rowsUI[i].sel.value = true;
  }
};


btnSelNone.onClick = function() {
  for (var i = 0; i < MAX_PRODUCTS; i++) rowsUI[i].sel.value = false;
};


// ✅ ✅ ✅ NEW: Clear button (clears data for selected products)
btnClear.onClick = function() {
  var selectedCount = 0;
  for (var i = 0; i < state.productCount; i++) {
    if (rowsUI[i].sel.value) selectedCount++;
  }
  
  var msg = "";
  if (selectedCount === 0) {
    msg = "🗑️ Clear all " + state.productCount + " products?\n\nThis will:\n- Clear all text fields\n- Reset prices to 0.00\n- Set to Regular price\n- Reset checkboxes to default\n\nContinue?";
  } else {
    msg = "🗑️ Clear " + selectedCount + " selected products?\n\nThis will:\n- Clear all text fields\n- Reset prices to 0.00\n- Set to Regular price\n- Reset checkboxes to default\n\nContinue?";
  }
  
  var confirm = Window.confirm(msg);
  if (!confirm) return;
  
  var clearedCount = 0;
  
  for (var i = 0; i < state.productCount; i++) {
    var shouldClear = (selectedCount === 0) || rowsUI[i].sel.value;
    
    if (shouldClear) {
      rowsUI[i].main.text = "";
      rowsUI[i].sub.text = "";
      rowsUI[i].add.text = "";
      rowsUI[i].priceType.selection = 0; // Regular
      rowsUI[i].priceValue.text = "0.00";
      rowsUI[i].dealQty.text = "0";
      rowsUI[i].dealPrice.text = "0";
      rowsUI[i].prevVal.text = "0.00";
      rowsUI[i].showUnit.value = false;
      rowsUI[i].showDealUnit.value = false;
      rowsUI[i].showPrev.value = true;
      rowsUI[i].useAutoWhite.value = true;
      rowsUI[i].warn.text = "";
      rowsUI[i].refreshEnabled();
      clearedCount++;
    }
  }
  
  alert("✅ Cleared " + clearedCount + " products!");
};


// ✅ ✅ ✅ NEW: Reset BG for ALL products
btnResetAllBG.onClick = function() {
  var confirm = Window.confirm("🔄 Reset BG to AUTO for all 20 products?\n\nThis will set:\n- Theme Override → NONE\n- Price BG Selection → AUTO\n- Price Direction → AUTO\n\nContinue?");
  
  if (!confirm) return;
  
  app.beginUndoGroup("Reset BG to AUTO - All Products");
  try {
    var successCount = 0;
    var failCount = 0;
    
    for (var i = 1; i <= MAX_PRODUCTS; i++) {
      var c = getCompByName(DATA_COMP_PREFIX + i);
      if (!c) {
        failCount++;
        continue;
      }
      
      var ctrl = getLayer(c, LYR_CTRL);
      if (!ctrl) {
        failCount++;
        continue;
      }
      
      setEffectValue(ctrl, E_THEME_OVERRIDE, 1);           // NONE
      setEffectValue(ctrl, E_PRICE_BG_SELECTION, 1);       // AUTO
      setEffectValue(ctrl, E_PRICE_DIRECTION_OVERRIDE, 1); // AUTO
      successCount++;
    }
    
    alert("✅ Reset complete!\n\nSuccess: " + successCount + " products\nFailed: " + failCount + " products");
  } catch (e) {
    alert("❌ Error: " + e.toString());
  } finally {
    app.endUndoGroup();
  }
};


btnLoad.onClick = function() {
  app.beginUndoGroup("Load Campaign Data");
  try {
    for (var i = 1; i <= MAX_PRODUCTS; i++) {
      var res = readRowFromProject(i);
      if (res.ok) {
        state.rows[i-1] = res.row;
        state.rows[i-1].warnOverflow = calcOverflowWarn(state.rows[i-1].mainText);
      }
    }
    for (var v = 1; v <= state.productCount; v++) {
      rowToUi(state.rows[v-1], rowsUI[v-1]);
    }
  } catch (e) {
    alert("❌ Load failed:\n" + e.toString());
  } finally {
    app.endUndoGroup();
  }
};


btnApply.onClick = function() {
  app.beginUndoGroup("Apply Campaign Data");
  try {
    var appliedCount = 0;
    for (var i = 1; i <= state.productCount; i++) {
      if (rowsUI[i-1].sel.value) {
        state.rows[i-1] = uiToRow(rowsUI[i-1], state.rows[i-1]);
        rowsUI[i-1].warn.text = state.rows[i-1].warnOverflow ? "⚠️" : "";
        applyRowToProject(i, state.rows[i-1]);
        appliedCount++;
      }
    }
    if (appliedCount === 0) {
      for (var a = 1; a <= state.productCount; a++) {
        state.rows[a-1] = uiToRow(rowsUI[a-1], state.rows[a-1]);
        rowsUI[a-1].warn.text = state.rows[a-1].warnOverflow ? "⚠️" : "";
        applyRowToProject(a, state.rows[a-1]);
      }
    }
  } catch (e) {
    alert("❌ Apply failed:\n" + e.toString());
  } finally {
    app.endUndoGroup();
  }
};

// ========================================
// 🚀 MEGA LOAD - Load everything from project
// ========================================
btnMegaLoad.onClick = function() {
  var confirmMsg = "🚀 MEGA LOAD - Load ALL data from project?\n\n";
  confirmMsg += "This will load:\n";
  confirmMsg += "✅ 20 Products (TAB 1)\n";
  confirmMsg += "✅ Sale Slots (TAB 2)\n";
  confirmMsg += "✅ Project Styling (TAB 0)\n";
  confirmMsg += "✅ Talach + Dates (TAB 3)\n";
  confirmMsg += "✅ Color Palette (TAB 5)\n";
  confirmMsg += "✅ Render Settings (TAB 6)\n\n";
  confirmMsg += "Continue?";
  
  if (!confirm(confirmMsg)) return;
  
  app.beginUndoGroup("MEGA LOAD - All Data");
  try {
    var report = "🚀 MEGA LOAD Results:\n\n";
    
    // TAB 1: Products
    try {
      for (var i = 1; i <= MAX_PRODUCTS; i++) {
        var res = readRowFromProject(i);
        if (res.ok) {
          state.rows[i-1] = res.row;
          state.rows[i-1].warnOverflow = calcOverflowWarn(state.rows[i-1].mainText);
        }
      }
      for (var v = 1; v <= state.productCount; v++) {
        rowToUi(state.rows[v-1], rowsUI[v-1]);
      }
      report += "✅ Products loaded (TAB 1)\n";
    } catch (e) {
      report += "❌ Products failed: " + e.toString() + "\n";
    }
    
    // TAB 0: Styling
    try {
      btnStyleLoad.onClick();
      report += "✅ Styling loaded (TAB 0)\n";
    } catch (e) {
      report += "⚠️ Styling failed (TAB 0 may not exist)\n";
    }

    // TAB 2: Sales
    try {
      if (typeof btnLoadSales !== 'undefined' && btnLoadSales && btnLoadSales.onClick) {
        btnLoadSales.onClick();
        report += "✅ Sale slots loaded (TAB 2)\n";
      } else {
        report += "⚠️ Sales button not found (TAB 2)\n";
      }
    } catch (e) {
      report += "❌ Sales failed: " + e.toString() + "\n";
    }
    
    // TAB 3: Talach + Dates
    try {
      btnLoadTalach.onClick();
      report += "✅ Talach + Dates loaded (TAB 3)\n";
    } catch (e) {
      report += "❌ Talach failed: " + e.toString() + "\n";
    }
    
    // TAB 5: Colors  ✅ FIX: btnColorsLoad (not btnLoadColors)
    try {
      if (typeof btnColorsLoad !== 'undefined' && btnColorsLoad && btnColorsLoad.onClick) {
        btnColorsLoad.onClick();
        report += "✅ Colors loaded (TAB 5)\n";
      } else {
        report += "⚠️ Colors button not found (TAB 5)\n";
      }
    } catch (e) {
      report += "⚠️ Colors failed (TAB 5 may not exist)\n";
    }
    
    // TAB 6: Render  ✅ ✅ ✅ FIX: btnDetect (not btnDetectProducts)
    try {
      if (typeof btnDetect !== 'undefined' && btnDetect && btnDetect.onClick) {
        btnDetect.onClick();
        report += "✅ Render settings detected (TAB 6)\n";
      } else {
        report += "⚠️ Render button not found (TAB 6)\n";
      }
    } catch (e) {
      report += "⚠️ Render failed (TAB 6 may not exist)\n";
    }
    
    alert(report);
  } catch (e) {
    alert("❌ MEGA LOAD failed:\n" + e.toString());
  } finally {
    app.endUndoGroup();
  }
};


// ========================================
// TAB 2: 21 SALE SLOTS (WITH BG CONTROLS)
// ========================================
var tabSales = tabs.add("tab", undefined, "מוצרי מבצעים");
tabSales.orientation = "column";
tabSales.alignChildren = ["fill","top"];
tabSales.margins = 10;
tabSales.spacing = 8;


// ✅ salesSlots - מורחב עם BG controls
var salesSlots = [];
for (var s = 1; s <= 21; s++) {
  salesSlots.push({
    slotIndex: s,
    sourceProductIndex: (s <= 20) ? s : 0,
    saleUseAutoWhite: true,
    saleWhiteWidth: 2,
    salePrevXOffset: 0,
    saleBgSelection: 1,
    saleDirection: 1
  });
}

// expose Tab 2 data for complete import/export helpers
sharedSalesSlots = salesSlots;


// ✅ TOP CONTROLS - עם כפתורים מחודשים + TOOLTIPS
var topSales = tabSales.add("group");
topSales.orientation = "row";
topSales.alignChildren = ["left","center"];
topSales.spacing = 10;


topSales.add("statictext", undefined, "Sale Slots:");
var etSalesCount = topSales.add("edittext", undefined, "21");
etSalesCount.characters = 3;


// ✅ טווח תצוגה
topSales.add("statictext", undefined, "טווח:");
var ddSalesRange = topSales.add("dropdownlist", undefined, ["הכל (1-21)", "1-3", "4-6", "7-9", "10-12", "13-15", "16-18", "19-21", "טווח מותאם..."]);
ddSalesRange.preferredSize.width = 120;
ddSalesRange.selection = 0;


// ✅ שדות טווח מותאם
var etSalesRangeFrom = topSales.add("edittext", undefined, "1");
etSalesRangeFrom.characters = 3;
etSalesRangeFrom.enabled = false;
topSales.add("statictext", undefined, "-");
var etSalesRangeTo = topSales.add("edittext", undefined, "21");
etSalesRangeTo.characters = 3;
etSalesRangeTo.enabled = false;


var btnRefreshFromProducts = topSales.add("button", undefined, "🔁 Refresh from Products");
btnRefreshFromProducts.helpTip = "מעדכן נתונים מטאב 'מוצרים' - ללא הטמעה בקובץ";

var btnLoadSales = topSales.add("button", undefined, "📂 Load");
btnLoadSales.helpTip = "מושך נתונים מקובץ האפטר אפקטס - מבצעים בלבד";

var btnApplySales = topSales.add("button", undefined, "✅ Apply");
btnApplySales.helpTip = "מטמיע נתונים בקובץ האפטר אפקטס - מבצעים בלבד";


// ✅ ✅ ✅ NEW ORDER (Right to Left):
var btnResetAllSalesBG = topSales.add("button", undefined, "🔄 Reset BG");
btnResetAllSalesBG.preferredSize.width = 80;
btnResetAllSalesBG.helpTip = "ריסט לכל רקעי המחיר של מוצרי מבצעים בלבד לאוטומטי";


var btnResetSalesPr = topSales.add("button", undefined, "Reset_Pr");
btnResetSalesPr.preferredSize.width = 80;
btnResetSalesPr.helpTip = "ריסט למוצרי המקור";


var btnClearSales = topSales.add("button", undefined, "Clear");
btnClearSales.preferredSize.width = 70;
btnClearSales.helpTip = "מנקה את כל הסלוטים של מוצרי מבצעים";


var btnSelNoneSales = topSales.add("button", undefined, "Un Select");
btnSelNoneSales.preferredSize.width = 80;


var btnSelAllSales = topSales.add("button", undefined, "Select All");
btnSelAllSales.preferredSize.width = 80;


// Header
var headerSales = tabSales.add("group");
headerSales.orientation = "row";
headerSales.alignChildren = ["left","center"];
headerSales.spacing = 6;


function HS(txt, w) {
  var st = headerSales.add("statictext", undefined, txt, { truncate:"end" });
  st.preferredSize.width = w;
  return st;
}


// ✅ ✅ ✅ REMOVED: ⚠️ column
HS("     🔄 BG", 55);
HS("White", 60);
HS("AutoW", 60);
HS("Side", 60);
HS("BG Color", 100);
HS("Prev X", 70);
HS("Y", 70);
HS("X ב-", 60);
HS("מחיר קודם", 80);
HS("X.00", 70);
HS("מבצע", 60);


var btnSalesAdd, btnSalesSub, btnSalesMain;
var hdrSalesSel = headerSales.add("statictext", undefined, "בחר");
hdrSalesSel.preferredSize.width = 35;
var hdrSalesIdx = headerSales.add("statictext", undefined, "Slot");
hdrSalesIdx.preferredSize.width = 35;
var hdrSalesSource = headerSales.add("statictext", undefined, "מקור");
hdrSalesSource.preferredSize.width = 70;


var scSales = tabSales.add("group");
scSales.orientation = "column";
scSales.alignChildren = ["fill","top"];


var viewportSales = scSales.add("panel", undefined, "");
viewportSales.margins = 6;
viewportSales.alignChildren = ["fill","top"];
viewportSales.preferredSize.height = 280;


var rowsHolderSales = viewportSales.add("group");
rowsHolderSales.orientation = "column";
rowsHolderSales.alignChildren = ["fill","top"];
rowsHolderSales.spacing = 2;


var sbSales = scSales.add("scrollbar");
sbSales.minvalue = 0;
sbSales.maxvalue = 0;
sbSales.value = 0;


var rowsSalesUI = [];
var salesCount = 21;

sharedRowsSalesUI = rowsSalesUI;
sharedGetSalesCount = function(){ return salesCount; };
var MAX_SALES = 21;


// ✅ משתני טווח
var currentSalesRangeFrom = 1;
var currentSalesRangeTo = 21;


function rebuildHeaderButtonsSales() {
  if (btnSalesAdd) { headerSales.remove(btnSalesAdd); btnSalesAdd = null; }
  if (btnSalesSub) { headerSales.remove(btnSalesSub); btnSalesSub = null; }
  if (btnSalesMain) { headerSales.remove(btnSalesMain); btnSalesMain = null; }
  headerSales.remove(hdrSalesSel);
  headerSales.remove(hdrSalesIdx);
  headerSales.remove(hdrSalesSource);


  btnSalesAdd = headerSales.add("button", undefined, "אותיות קטנות ↔");
  btnSalesAdd.preferredSize.width = colWidthsSales.add.current;
  btnSalesSub = headerSales.add("button", undefined, "משני ↔");
  btnSalesSub.preferredSize.width = colWidthsSales.sub.current;
  btnSalesMain = headerSales.add("button", undefined, "שם ↔");
  btnSalesMain.preferredSize.width = colWidthsSales.main.current;


  hdrSalesSel = headerSales.add("statictext", undefined, "בחר");
  hdrSalesSel.preferredSize.width = 35;
  hdrSalesIdx = headerSales.add("statictext", undefined, "Slot");
  hdrSalesIdx.preferredSize.width = 35;
  hdrSalesSource = headerSales.add("statictext", undefined, "מקור");
  hdrSalesSource.preferredSize.width = 70;


  btnSalesMain.onClick = function() { resizeColumnSales("main"); };
  btnSalesSub.onClick = function() { resizeColumnSales("sub"); };
  btnSalesAdd.onClick = function() { resizeColumnSales("add"); };


  headerSales.layout.layout(true);
}


function makeSalesRow(slotIndex) {
  var g = rowsHolderSales.add("group");
  g.orientation = "row";
  g.alignChildren = ["left","top"];
  g.spacing = 6;


  // ✅ ✅ ✅ MOVED: Reset BG button (now FIRST, replacing ⚠️)
  var btnResetBG = g.add("button", undefined, "🔄");
  btnResetBG.preferredSize.width = 55;
  btnResetBG.helpTip = "ריסט רקע מחיר למבצע זה לאוטומטי";


  // ✅ ✅ ✅ REMOVED: stWarn


  // ✅ ✅ ✅ BG Controls
  var ddWhite = g.add("dropdownlist", undefined, ["Narrow", "Regular", "Wide"]);
  ddWhite.preferredSize.width = 60;
  ddWhite.selection = 1; // Regular


  var cbAutoW = g.add("checkbox", undefined, "");
  cbAutoW.preferredSize.width = 60;
  cbAutoW.value = true;


  var ddSide = g.add("dropdownlist", undefined, ["AUTO", "Right", "Left"]);
  ddSide.preferredSize.width = 60;
  ddSide.selection = 0;


  var bgOptions = ["AUTO", "2W - BG 1", "2W - BG 2", "2W - BG 3", "2W - BG 4", 
                   "B - BG 1", "B - BG 2", "B - BG 3", "B - BG 4",
                   "P50 - BG 1", "P50 - BG 2", "P50 - BG 3", "P50 - BG 4",
                   "ALT - BG 1", "ALT - BG 2", "ALT - BG 3", "ALT - BG 4"];
  var ddBGColor = g.add("dropdownlist", undefined, bgOptions);
  ddBGColor.preferredSize.width = 100;
  ddBGColor.selection = 0;


  var slPrevX = g.add("slider", undefined, 0, -500, 500);
  slPrevX.preferredSize.width = 70;


  // ✅ Existing fields
  var etDealPrice = g.add("edittext", undefined, "");
  etDealPrice.preferredSize.width = 70;
  etDealPrice.enabled = false;


  var etDealQty = g.add("edittext", undefined, "");
  etDealQty.preferredSize.width = 60;
  etDealQty.enabled = false;


  var etPrevPrice = g.add("edittext", undefined, "");
  etPrevPrice.preferredSize.width = 80;
  etPrevPrice.enabled = false;


  var etPrice = g.add("edittext", undefined, "");
  etPrice.preferredSize.width = 70;
  etPrice.enabled = false;


  var etPriceType = g.add("edittext", undefined, "");
  etPriceType.preferredSize.width = 60;
  etPriceType.enabled = false;


  var etAdd = g.add("edittext", undefined, "", { multiline:true, scrolling:true });
  etAdd.preferredSize.width = colWidthsSales.add.current;
  etAdd.preferredSize.height = 32;
  etAdd.enabled = false;


  var etSub = g.add("edittext", undefined, "", { multiline:true, scrolling:true });
  etSub.preferredSize.width = colWidthsSales.sub.current;
  etSub.preferredSize.height = 32;
  etSub.enabled = false;


  var etMain = g.add("edittext", undefined, "", { multiline:true, scrolling:true });
  etMain.preferredSize.width = colWidthsSales.main.current;
  etMain.preferredSize.height = 32;
  etMain.enabled = false;


  var cbSel = g.add("checkbox", undefined, "");
  cbSel.preferredSize.width = 35;


  var stIdx = g.add("statictext", undefined, "" + slotIndex);
  stIdx.preferredSize.width = 35;


  var sourceOpts = ["--"];
  for (var p = 1; p <= MAX_PRODUCTS; p++) {
    sourceOpts.push("" + p);
  }
  var ddSource = g.add("dropdownlist", undefined, sourceOpts);
  ddSource.preferredSize.width = 70;
  var defaultSrc = (slotIndex <= MAX_PRODUCTS) ? slotIndex : 0;
  ddSource.selection = defaultSrc;


  // ✅ Refresh enabled state
  function refreshEnabled() {
    ddWhite.enabled = !cbAutoW.value;
  }


  cbAutoW.onClick = refreshEnabled;
  refreshEnabled();


  // ✅ ✅ ✅ Reset BG (Individual)
  btnResetBG.onClick = function() {
    cbAutoW.value = true;
    ddWhite.selection = 1; // Regular
    ddBGColor.selection = 0; // AUTO
    ddSide.selection = 0; // AUTO
    slPrevX.value = 0;
    
    salesSlots[slotIndex - 1].saleUseAutoWhite = true;
    salesSlots[slotIndex - 1].saleWhiteWidth = 2;
    salesSlots[slotIndex - 1].saleBgSelection = 1;
    salesSlots[slotIndex - 1].saleDirection = 1;
    salesSlots[slotIndex - 1].salePrevXOffset = 0;
    
    refreshEnabled();
  };


  // ✅ תצוגה לפי REGULAR/DEAL
  function updateFromSource() {
    var srcIdx = ddSource.selection ? ddSource.selection.index : 0;
    salesSlots[slotIndex - 1].sourceProductIndex = srcIdx;


    if (srcIdx > 0 && srcIdx <= MAX_PRODUCTS) {
      var srcRow = state.rows[srcIdx - 1];


      etMain.text = srcRow.mainText || "";
      etSub.text = srcRow.subText || "";
      etAdd.text = srcRow.addText || "";


      var priceTypeNames = ["Regular", "Deal"];
      etPriceType.text = priceTypeNames[srcRow.priceType - 1] || "";


      if (srcRow.priceType === 1) {
        // REGULAR: X.00 + מחיר קודם
        etPrice.text = formatPrice(srcRow.priceValue);
        etPrevPrice.text = formatPrice(srcRow.prevPriceValue);
        etDealQty.text = "";
        etDealPrice.text = "";
      } else {
        // DEAL: X ב- + Y
        etDealQty.text = (srcRow.dealQty > 0) ? ("" + srcRow.dealQty) : "";
        etDealPrice.text = (srcRow.dealPrice > 0) ? formatPrice(srcRow.dealPrice) : "";
        etPrice.text = "";
        etPrevPrice.text = "";
      }
    } else {
      etMain.text = "";
      etSub.text = "";
      etAdd.text = "";
      etPrice.text = "";
      etPrevPrice.text = "";
      etPriceType.text = "";
      etDealQty.text = "";
      etDealPrice.text = "";
    }
  }


  ddSource.onChange = updateFromSource;
  
  // ✅ Save to salesSlots on change
  cbAutoW.onClick = function() {
    salesSlots[slotIndex - 1].saleUseAutoWhite = cbAutoW.value;
    refreshEnabled();
  };
  
  ddWhite.onChange = function() {
    if (ddWhite.selection) {
      salesSlots[slotIndex - 1].saleWhiteWidth = ddWhite.selection.index + 1;
    }
  };
  
  ddBGColor.onChange = function() {
    if (ddBGColor.selection) {
      salesSlots[slotIndex - 1].saleBgSelection = ddBGColor.selection.index + 1;
    }
  };
  
  ddSide.onChange = function() {
    if (ddSide.selection) {
      salesSlots[slotIndex - 1].saleDirection = ddSide.selection.index + 1;
    }
  };
  
  slPrevX.onChanging = function() {
    salesSlots[slotIndex - 1].salePrevXOffset = Math.round(slPrevX.value);
  };


  updateFromSource();


  return {
    i: slotIndex,
    group: g,
    autoW: cbAutoW,
    white: ddWhite,
    side: ddSide,
    bgColor: ddBGColor,
    prevX: slPrevX,
    resetBG: btnResetBG,
    price: etPrice,
    prevPrice: etPrevPrice,
    priceType: etPriceType,
    dealQty: etDealQty,
    dealPrice: etDealPrice,
    add: etAdd,
    sub: etSub,
    main: etMain,
    sel: cbSel,
    idx: stIdx,
    source: ddSource,
    updateFromSource: updateFromSource,
    refreshEnabled: refreshEnabled
  };
}


function resizeColumnSales(colName) {
  var col = colWidthsSales[colName];
  if (col.expanded) {
    col.current = col.min;
    col.expanded = false;
  } else {
    col.current = col.min * 2;
    col.expanded = true;
  }
  rebuildHeaderButtonsSales();
  rebuildSalesRows();
}


function rebuildSalesRows() {
  var savedSelections = [];
  var savedConfigs = [];
  
  for (var j = 0; j < rowsSalesUI.length; j++) {
    savedSelections.push(rowsSalesUI[j].source.selection ? rowsSalesUI[j].source.selection.index : 0);
    savedConfigs.push({
      autoW: rowsSalesUI[j].autoW.value,
      white: rowsSalesUI[j].white.selection ? rowsSalesUI[j].white.selection.index : 1,
      side: rowsSalesUI[j].side.selection ? rowsSalesUI[j].side.selection.index : 0,
      bgColor: rowsSalesUI[j].bgColor.selection ? rowsSalesUI[j].bgColor.selection.index : 0,
      prevX: rowsSalesUI[j].prevX.value
    });
  }
  
  for (var k = rowsSalesUI.length - 1; k >= 0; k--) {
    rowsHolderSales.remove(rowsSalesUI[k].group);
  }
  
  rowsSalesUI = [];
  sharedRowsSalesUI = rowsSalesUI;
  
  for (var m = 1; m <= MAX_SALES; m++) {
    rowsSalesUI.push(makeSalesRow(m));
  }
  
  for (var n = 0; n < savedSelections.length && n < rowsSalesUI.length; n++) {
    if (savedSelections[n] >= 0 && savedSelections[n] < rowsSalesUI[n].source.items.length) {
      rowsSalesUI[n].source.selection = rowsSalesUI[n].source.items[savedSelections[n]];
      rowsSalesUI[n].updateFromSource();
    }
    
    if (n < savedConfigs.length) {
      rowsSalesUI[n].autoW.value = savedConfigs[n].autoW;
      rowsSalesUI[n].white.selection = rowsSalesUI[n].white.items[savedConfigs[n].white];
      rowsSalesUI[n].side.selection = rowsSalesUI[n].side.items[savedConfigs[n].side];
      rowsSalesUI[n].bgColor.selection = rowsSalesUI[n].bgColor.items[savedConfigs[n].bgColor];
      rowsSalesUI[n].prevX.value = savedConfigs[n].prevX;
      rowsSalesUI[n].refreshEnabled();
    }
  }
  
  applySalesRangeFilter();
  rowsHolderSales.layout.layout(true);
  viewportSales.layout.layout(true);
  tabSales.layout.layout(true);
  updateScrollbarSales();
}


for (var i = 1; i <= MAX_SALES; i++) {
  rowsSalesUI.push(makeSalesRow(i));
}
rebuildHeaderButtonsSales();


function updateScrollbarSales() {
  var contentH = rowsHolderSales.size.height;
  var viewH = viewportSales.size.height - 20;
  var max = Math.max(0, contentH - viewH);
  sbSales.maxvalue = max;
  sbSales.value = Math.min(sbSales.value, max);
}


sbSales.onChanging = function() { rowsHolderSales.location = [rowsHolderSales.location[0], 6 - sbSales.value]; };


// ✅ סינון טווחים
function applySalesRangeFilter() {
  for (var i = 0; i < rowsSalesUI.length; i++) {
    var u = rowsSalesUI[i];
    var slotNum = u.i;
    var inRange = (slotNum >= currentSalesRangeFrom && slotNum <= currentSalesRangeTo);
    var inCount = (slotNum <= salesCount);
    var visible = inRange && inCount;
    u.group.visible = visible;
    u.group.enabled = visible;
  }
  tabSales.layout.layout(true);
  updateScrollbarSales();
}


function applySalesCountToUI() {
  var cnt = salesCount;
  for (var i = 0; i < rowsSalesUI.length; i++) {
    var u = rowsSalesUI[i];
    var visible = (u.i <= cnt);
    u.group.visible = visible;
    u.group.enabled = visible;
  }
  applySalesRangeFilter();
}


// ✅ Dropdown סינון טווחים
ddSalesRange.onChange = function() {
  var sel = ddSalesRange.selection ? ddSalesRange.selection.index : 0;
  if (sel === 0) {
    currentSalesRangeFrom = 1;
    currentSalesRangeTo = 21;
    etSalesRangeFrom.enabled = false;
    etSalesRangeTo.enabled = false;
  } else if (sel === 1) {
    currentSalesRangeFrom = 1;
    currentSalesRangeTo = 3;
    etSalesRangeFrom.enabled = false;
    etSalesRangeTo.enabled = false;
  } else if (sel === 2) {
    currentSalesRangeFrom = 4;
    currentSalesRangeTo = 6;
    etSalesRangeFrom.enabled = false;
    etSalesRangeTo.enabled = false;
  } else if (sel === 3) {
    currentSalesRangeFrom = 7;
    currentSalesRangeTo = 9;
    etSalesRangeFrom.enabled = false;
    etSalesRangeTo.enabled = false;
  } else if (sel === 4) {
    currentSalesRangeFrom = 10;
    currentSalesRangeTo = 12;
    etSalesRangeFrom.enabled = false;
    etSalesRangeTo.enabled = false;
  } else if (sel === 5) {
    currentSalesRangeFrom = 13;
    currentSalesRangeTo = 15;
    etSalesRangeFrom.enabled = false;
    etSalesRangeTo.enabled = false;
  } else if (sel === 6) {
    currentSalesRangeFrom = 16;
    currentSalesRangeTo = 18;
    etSalesRangeFrom.enabled = false;
    etSalesRangeTo.enabled = false;
  } else if (sel === 7) {
    currentSalesRangeFrom = 19;
    currentSalesRangeTo = 21;
    etSalesRangeFrom.enabled = false;
    etSalesRangeTo.enabled = false;
  } else if (sel === 8) {
    etSalesRangeFrom.enabled = true;
    etSalesRangeTo.enabled = true;
    currentSalesRangeFrom = clampInt(etSalesRangeFrom.text, 1, MAX_SALES, 1);
    currentSalesRangeTo = clampInt(etSalesRangeTo.text, 1, MAX_SALES, 21);
  }
  etSalesRangeFrom.text = "" + currentSalesRangeFrom;
  etSalesRangeTo.text = "" + currentSalesRangeTo;
  applySalesRangeFilter();
};


etSalesRangeFrom.onChange = function() {
  currentSalesRangeFrom = clampInt(this.text, 1, MAX_SALES, 1);
  if (currentSalesRangeFrom > currentSalesRangeTo) currentSalesRangeFrom = currentSalesRangeTo;
  this.text = "" + currentSalesRangeFrom;
  applySalesRangeFilter();
};


etSalesRangeTo.onChange = function() {
  currentSalesRangeTo = clampInt(this.text, 1, MAX_SALES, 21);
  if (currentSalesRangeTo < currentSalesRangeFrom) currentSalesRangeTo = currentSalesRangeFrom;
  this.text = "" + currentSalesRangeTo;
  applySalesRangeFilter();
};


function onSalesCountChanged() {
  salesCount = clampInt(etSalesCount.text, 1, MAX_SALES, 21);
  etSalesCount.text = "" + salesCount;
  applySalesCountToUI();
}
etSalesCount.onChange = onSalesCountChanged;
etSalesCount.onDeactivate = onSalesCountChanged;


btnSelAllSales.onClick = function() {
  for (var i = 0; i < salesCount; i++) {
    if (rowsSalesUI[i].group.visible) rowsSalesUI[i].sel.value = true;
  }
};


btnSelNoneSales.onClick = function() {
  for (var i = 0; i < MAX_SALES; i++) rowsSalesUI[i].sel.value = false;
};


// ✅ ✅ ✅ NEW: Clear button (clears source selection)
btnClearSales.onClick = function() {
  var selectedCount = 0;
  for (var i = 0; i < salesCount; i++) {
    if (rowsSalesUI[i].sel.value) selectedCount++;
  }
  
  var msg = "";
  if (selectedCount === 0) {
    msg = "🗑️ Clear all " + salesCount + " sale slots?\n\nThis will set all sources to '--' (no product)\n\nContinue?";
  } else {
    msg = "🗑️ Clear " + selectedCount + " selected sale slots?\n\nThis will set sources to '--' (no product)\n\nContinue?";
  }
  
  var confirm = Window.confirm(msg);
  if (!confirm) return;
  
  var clearedCount = 0;
  
  for (var i = 0; i < salesCount; i++) {
    var shouldClear = (selectedCount === 0) || rowsSalesUI[i].sel.value;
    
    if (shouldClear) {
      rowsSalesUI[i].source.selection = 0; // "--"
      salesSlots[i].sourceProductIndex = 0;
      rowsSalesUI[i].updateFromSource();
      clearedCount++;
    }
  }
  
  alert("✅ Cleared " + clearedCount + " sale slots!");
};


// ✅ ✅ ✅ NEW: Reset to Original Product (Reset_Pr)
btnResetSalesPr.onClick = function() {
  var selectedCount = 0;
  for (var i = 0; i < salesCount; i++) {
    if (rowsSalesUI[i].sel.value) selectedCount++;
  }
  
  var msg = "";
  if (selectedCount === 0) {
    msg = "🔄 Reset all sale slots to original products?\n\n- Slot 1 → Product 1\n- Slot 2 → Product 2\n- ...\n- Slot 20 → Product 20\n- Slot 21 → -- (no product)\n\nContinue?";
  } else {
    msg = "🔄 Reset " + selectedCount + " selected slots to original products?\n\nEach slot will be set to its matching product number.\n\nContinue?";
  }
  
  var confirm = Window.confirm(msg);
  if (!confirm) return;
  
  var resetCount = 0;
  
  for (var i = 0; i < salesCount; i++) {
    var shouldReset = (selectedCount === 0) || rowsSalesUI[i].sel.value;
    
    if (shouldReset) {
      var slotNum = i + 1;
      var defaultSrc = (slotNum <= MAX_PRODUCTS) ? slotNum : 0;
      
      rowsSalesUI[i].source.selection = defaultSrc;
      salesSlots[i].sourceProductIndex = defaultSrc;
      rowsSalesUI[i].updateFromSource();
      resetCount++;
    }
  }
  
  alert("✅ Reset " + resetCount + " sale slots to original products!");
};


btnRefreshFromProducts.onClick = function() {
  for (var i = 0; i < salesCount; i++) {
    rowsSalesUI[i].updateFromSource();
  }
  alert("✅ Refreshed all sale slots from product data!");
};


// ✅ ✅ ✅ Reset All BG
btnResetAllSalesBG.onClick = function() {
  var confirm = Window.confirm("🔄 Reset BG to AUTO for all 21 sale slots?\n\nThis will set:\n- Sale_BG_Selection → AUTO\n- Sale_Direction → AUTO\n- Use_Auto_White → ✅\n\nContinue?");
  
  if (!confirm) return;
  
  app.beginUndoGroup("Reset BG to AUTO - All Sales");
  try {
    var successCount = 0;
    var failCount = 0;
    
    for (var i = 1; i <= MAX_SALES; i++) {
      var config = {
        saleUseAutoWhite: true,
        saleWhiteWidth: 2,
        salePrevXOffset: 0,
        saleBgSelection: 1,
        saleDirection: 1
      };
      
      if (applySaleConfigToAE(i, config)) {
        salesSlots[i - 1].saleUseAutoWhite = true;
        salesSlots[i - 1].saleWhiteWidth = 2;
        salesSlots[i - 1].saleBgSelection = 1;
        salesSlots[i - 1].saleDirection = 1;
        salesSlots[i - 1].salePrevXOffset = 0;
        
        if (i <= rowsSalesUI.length) {
          rowsSalesUI[i - 1].autoW.value = true;
          rowsSalesUI[i - 1].white.selection = 1;
          rowsSalesUI[i - 1].bgColor.selection = 0;
          rowsSalesUI[i - 1].side.selection = 0;
          rowsSalesUI[i - 1].prevX.value = 0;
          rowsSalesUI[i - 1].refreshEnabled();
        }
        
        successCount++;
      } else {
        failCount++;
      }
    }
    
    alert("✅ Reset complete!\n\nSuccess: " + successCount + " sale slots\nFailed: " + failCount + " sale slots");
  } catch (e) {
    alert("❌ Error: " + e.toString());
  } finally {
    app.endUndoGroup();
  }
};


function setSaleSliderValue(compName, value) {
  var c = getCompByName(compName);
  if (!c) return false;
  var ctrl = getLayer(c, "CTRL");
  if (!ctrl) return false;
  return setEffectValue(ctrl, "Product_Index", value);
}


function getSaleSliderValue(compName) {
  var c = getCompByName(compName);
  if (!c) return null;
  var ctrl = getLayer(c, "CTRL");
  if (!ctrl) return null;
  return getEffectValue(ctrl, "Product_Index");
}


// ✅ ✅ ✅ Load - מעודכן לכלול BG controls
btnLoadSales.onClick = function() {
  app.beginUndoGroup("Load Sales Configuration");
  try {
    var loadedCount = 0;
    for (var i = 1; i <= MAX_SALES; i++) {
      var compName = "PRICE Sale -" + i;
      
      // Load Product_Index
      var idx = getSaleSliderValue(compName);
      if (idx !== null) {
        idx = Math.max(0, Math.min(MAX_PRODUCTS, Math.round(idx)));
        salesSlots[i - 1].sourceProductIndex = idx;
        
        if (i <= rowsSalesUI.length) {
          rowsSalesUI[i - 1].source.selection = rowsSalesUI[i - 1].source.items[idx];
          rowsSalesUI[i - 1].updateFromSource();
        }
      }
      
      // ✅ Load BG Config
      var config = readSaleConfigFromAE(i);
      if (config) {
        salesSlots[i - 1].saleUseAutoWhite = config.saleUseAutoWhite;
        salesSlots[i - 1].saleWhiteWidth = config.saleWhiteWidth;
        salesSlots[i - 1].salePrevXOffset = config.salePrevXOffset;
        salesSlots[i - 1].saleBgSelection = config.saleBgSelection;
        salesSlots[i - 1].saleDirection = config.saleDirection;
        
        if (i <= rowsSalesUI.length) {
          rowsSalesUI[i - 1].autoW.value = config.saleUseAutoWhite;
          rowsSalesUI[i - 1].white.selection = Math.max(0, Math.min(2, config.saleWhiteWidth - 1));
          rowsSalesUI[i - 1].bgColor.selection = Math.max(0, Math.min(16, config.saleBgSelection - 1));
          rowsSalesUI[i - 1].side.selection = Math.max(0, Math.min(2, config.saleDirection - 1));
          rowsSalesUI[i - 1].prevX.value = config.salePrevXOffset;
          rowsSalesUI[i - 1].refreshEnabled();
        }
      }
      
      loadedCount++;
    }
    alert("✅ Loaded " + loadedCount + " sale slots from AE!");
  } catch (e) {
    alert("❌ Load failed:\n" + e.toString());
  } finally {
    app.endUndoGroup();
  }
};


// ✅ ✅ ✅ Apply - מעודכן לכלול BG controls
btnApplySales.onClick = function() {
  app.beginUndoGroup("Apply Sales Configuration");
  try {
    var appliedCount = 0;
    var selectedOnly = false;
    
    for (var chk = 0; chk < salesCount; chk++) {
      if (rowsSalesUI[chk].sel.value) {
        selectedOnly = true;
        break;
      }
    }
    
    for (var i = 1; i <= salesCount; i++) {
      if (selectedOnly && !rowsSalesUI[i - 1].sel.value) continue;
      
      var srcIdx = rowsSalesUI[i - 1].source.selection ? rowsSalesUI[i - 1].source.selection.index : 0;
      
      // Apply Product_Index
      var comps = [
        "PRICE Sale -" + i,
        "Product " + i + " - Sale",
        "Text Addition - Sale - " + i,
        "Text Sale - " + i
      ];
      
      var success = 0;
      for (var c = 0; c < comps.length; c++) {
        if (setSaleSliderValue(comps[c], srcIdx)) success++;
      }
      
      // ✅ Apply BG Config
      var config = salesSlots[i - 1];
      if (applySaleConfigToAE(i, config)) {
        success++;
      }
      
      if (success > 0) appliedCount++;
    }
    
    if (selectedOnly) {
      alert("✅ Applied " + appliedCount + " selected sale slots!");
    } else {
      alert("✅ Applied all " + appliedCount + " sale slots!");
    }
  } catch (e) {
    alert("❌ Apply failed:\n" + e.toString());
  } finally {
    app.endUndoGroup();
  }
};


applySalesCountToUI();

// ========================================
// TAB 3: הגדרות כלליות
// ========================================

// ========================================
// TAB 3: הגדרות כלליות
// ========================================
var tabGlobal = tabs.add("tab", undefined, "הגדרות כלליות");
tabGlobal.orientation = "column";
tabGlobal.alignChildren = ["fill","top"];
tabGlobal.margins = 20;
tabGlobal.spacing = 15;


// ========================================
// TALACH SECTION
// ========================================
var panelTalach = tabGlobal.add("panel", undefined, "טלחים - 3 שורות");
panelTalach.orientation = "column";
panelTalach.alignChildren = ["fill","top"];
panelTalach.margins = 10;
panelTalach.spacing = 8;

panelTalach.add("statictext", undefined, "טלח 1:");
var etTalach1 = panelTalach.add("edittext", undefined, "", { multiline: true, scrolling: true });
etTalach1.characters = 80;
etTalach1.preferredSize.height = 60;

panelTalach.add("statictext", undefined, "טלח 2 (2 שורות):");
var etTalach2 = panelTalach.add("edittext", undefined, "", { multiline: true, scrolling: true });
etTalach2.characters = 80;
etTalach2.preferredSize.height = 70;

panelTalach.add("statictext", undefined, "טלח 3 (3 שורות):");
var etTalach3 = panelTalach.add("edittext", undefined, "", { multiline: true, scrolling: true });
etTalach3.characters = 80;
etTalach3.preferredSize.height = 80;

panelTalach.add("statictext", undefined, "לשורה חדשה הקש Enter.");

var gTalachButtons = panelTalach.add("group");
gTalachButtons.orientation = "row";
gTalachButtons.spacing = 10;
var btnLoadTalach = gTalachButtons.add("button", undefined, "טען ט.ל.ח מקובץ");

// ========================================
// DATES SECTION
// ========================================
var panelDates = tabGlobal.add("panel", undefined, "תאריכי מבצע");
panelDates.orientation = "column";
panelDates.alignChildren = ["fill","top"];
panelDates.margins = 10;
panelDates.spacing = 8;

var gDateRange = panelDates.add("group");
gDateRange.orientation = "row";
gDateRange.alignChildren = ["left","center"];
gDateRange.add("statictext", undefined, "תאריכים:");
var etCampaignDates = gDateRange.add("edittext", undefined, "");
etCampaignDates.characters = 25;
panelDates.add("statictext", undefined, "דוגמה: 6-19.7.25 או 1-15.12.25");

var gDateButtons = panelDates.add("group");
gDateButtons.orientation = "row";
gDateButtons.spacing = 10;
var btnUpdateDates = gDateButtons.add("button", undefined, "עדכן תאריכים בטלחים ✅");
btnUpdateDates.helpTip = "מחליף תאריכים ישנים בטלחים (ללא הטמעה בקובץ).\nפורמטים:\n• אותו חודש: 1-15.2.2026\n• חודשים שונים: 1.2-1.3.2026\n\nלהחלה בקובץ לחץ 'החל תאריכים בקובץ'";
var btnApplyDateText = gDateButtons.add("button", undefined, "החל תאריכים בקובץ");

var gPSDButtons = panelDates.add("group");
gPSDButtons.orientation = "row";
gPSDButtons.spacing = 10;
var btnRevealPSD = gPSDButtons.add("button", undefined, "פתח תיקיית PSD");
btnRevealPSD.helpTip = "פתח את התיקייה ושם ערוך את קובץ הפוטושופ לפי תאריכי הקמפיין";
var btnEditPSD = gPSDButtons.add("button", undefined, "ערוך PSD");
btnEditPSD.helpTip = "ערוך את קובץ הפוטושופ לפי תאריכי הקמפיין";

// ========================================
// FORCE REFRESH SECTION
// ========================================
var panelRefresh = tabGlobal.add("panel", undefined, "🔄 Force Refresh");
panelRefresh.orientation = "column";
panelRefresh.alignChildren = ["fill","top"];
panelRefresh.margins = 10;
panelRefresh.spacing = 8;

panelRefresh.add("statictext", undefined, "Use this if sale prices don't update correctly.", {alignment: "left"});
panelRefresh.add("statictext", undefined, "This forces After Effects to re-render all sale comps.", {alignment: "left"});

var gRefreshButtons = panelRefresh.add("group");
gRefreshButtons.orientation = "row";
gRefreshButtons.spacing = 10;

var btnForceRefreshSales = gRefreshButtons.add("button", undefined, "🔄 Refresh Sale Comps");
var btnPurgeCache = gRefreshButtons.add("button", undefined, "🗑️ Purge All Cache");

// ========================================
// BUTTON HANDLERS (UPDATED - SMART DATE REPLACEMENT)
// ========================================
btnUpdateDates.onClick = function() {
  var dates = trimString(etCampaignDates.text);
  if (!dates) {
    alert("נא להזין תאריכים! דוגמה: 6-19.7.25");
    return;
  }
  
  var oldTalach1 = etTalach1.text;
  var oldTalach2 = etTalach2.text;
  var oldTalach3 = etTalach3.text;
  
  etTalach1.text = replaceDatesInTalach(oldTalach1, dates);
  etTalach2.text = replaceDatesInTalach(oldTalach2, dates);
  etTalach3.text = replaceDatesInTalach(oldTalach3, dates);
  
  alert("✅ עודכנו התאריכים ל-" + dates + " בכל 3 שורות הטלחים!\n\nדוגמה:\n" + 
        oldTalach1.substring(0, 50) + "... → " + 
        etTalach1.text.substring(0, 50) + "...");
};

btnApplyDateText.onClick = function() {
  var dates = trimString(etCampaignDates.text);
  if (!dates) {
    alert("נא להזין תאריכים!");
    return;
  }
  app.beginUndoGroup("Apply Campaign Date and Talach");
  try {
    var comp = getCompByName("TALACH_DATA");
    if (!comp) {
      alert("❌ לא נמצא TALACH_DATA");
      return;
    }
    
    // החל תאריכים
    var dateSuccess = setTextValue(comp, "CAMPAIGN_DATE_TEXT", dates);
    
    // החל טלחים
    setTextValue(comp, "TALACH_LINE_1", uiToAeText(etTalach1.text));
    setTextValue(comp, "TALACH_LINE_2", uiToAeText(etTalach2.text));
    setTextValue(comp, "TALACH_LINE_3", uiToAeText(etTalach3.text));
    
    if (dateSuccess) {
      alert("✅ הוחל בהצלחה!\n- תאריכים: " + dates + "\n- Talach 1 Line\n- Talach 2 Lines\n- Talach 3 Lines");
    } else {
      alert("⚠️ הוחל חלקית!\n- Talach 1, 2, 3 הוחלו\n- CAMPAIGN_DATE_TEXT לא נמצא");
    }
  } catch (e) {
    alert("❌ " + e.toString());
  } finally {
    app.endUndoGroup();
  }
};

btnRevealPSD.onClick = function() {
  try {
    var comp = getCompByName("TALACH_DATA");
    if (!comp) {
      alert("❌ לא נמצא TALACH_DATA");
      return;
    }
    var psdLayer = null;
    for (var i = 1; i <= comp.numLayers; i++) {
      var lyr = comp.layer(i);
      if (lyr.name.indexOf("Opening Date") !== -1 || lyr.name.indexOf(".psd") !== -1) {
        psdLayer = lyr;
        break;
      }
    }
    if (!psdLayer) {
      alert("❌ לא נמצאה שכבה Opening Date.psd ב-TALACH_DATA");
      return;
    }
    if (!psdLayer.source || !(psdLayer.source instanceof FootageItem)) {
      alert("❌ " + psdLayer.name + " אינו footage");
      return;
    }
    var psdItem = psdLayer.source;
    if (!psdItem.file || !psdItem.file.exists) {
      alert("❌ קובץ PSD לא נמצא: " + (psdItem.file ? psdItem.file.fsName : ""));
      return;
    }
    var folder = psdItem.file.parent;
    if (folder && folder.exists) {
      folder.execute();
      alert("✅ נפתחה התיקייה:\n" + folder.fsName);
    } else {
      alert("❌ התיקייה לא נמצאה");
    }
  } catch (e) {
    alert("❌ " + e.toString());
  }
};

btnEditPSD.onClick = function() {
  try {
    var comp = getCompByName("TALACH_DATA");
    if (!comp) {
      alert("❌ לא נמצא TALACH_DATA");
      return;
    }
    var psdLayer = null;
    for (var i = 1; i <= comp.numLayers; i++) {
      var lyr = comp.layer(i);
      if (lyr.name.indexOf("Opening Date") !== -1 || lyr.name.indexOf(".psd") !== -1) {
        psdLayer = lyr;
        break;
      }
    }
    if (!psdLayer) {
      alert("❌ לא נמצאה שכבה Opening Date.psd ב-TALACH_DATA");
      return;
    }
    if (!psdLayer.source || !(psdLayer.source instanceof FootageItem)) {
      alert("❌ " + psdLayer.name + " אינו footage");
      return;
    }
    var psdItem = psdLayer.source;
    if (!psdItem.file || !psdItem.file.exists) {
      alert("❌ קובץ PSD לא נמצא: " + (psdItem.file ? psdItem.file.fsName : ""));
      return;
    }
    var psdFile = psdItem.file;
    var currentDate = trimString(etCampaignDates.text);
    var confirmMsg = "";
    if (currentDate) confirmMsg += "תאריך נוכחי: " + currentDate + "\n\n";
    confirmMsg += "פותח את Photoshop:\n" + psdFile.fsName + "\n\n";
    confirmMsg += "1. ערוך את התאריך\n";
    confirmMsg += "2. שמור (Ctrl+S)\n";
    confirmMsg += "3. חזור ל-After Effects\n\n";
    confirmMsg += "להמשיך?";
    if (!confirm(confirmMsg)) return;
    psdFile.execute();
  } catch (e) {
    alert("❌ " + e.toString());
  }
};

btnLoadTalach.onClick = function() {
  try {
    var comp = getCompByName("TALACH_DATA");
    if (!comp) {
      alert("❌ לא נמצא TALACH_DATA");
      return;
    }
    etTalach1.text = aeToUiText(getTextValue(comp, "TALACH_LINE_1"));
    etTalach2.text = aeToUiText(getTextValue(comp, "TALACH_LINE_2"));
    etTalach3.text = aeToUiText(getTextValue(comp, "TALACH_LINE_3"));
    var dateText = getTextValue(comp, "CAMPAIGN_DATE_TEXT");
    if (dateText && trimString(dateText) !== "") {
      etCampaignDates.text = aeToUiText(dateText);
    } else {
      etCampaignDates.text = "";
    }
    alert("✅ נטען מוצלח!");
  } catch (e) {
    alert("❌ " + e.toString());
  }
};
sharedTalachLoad = btnLoadTalach;

btnForceRefreshSales.onClick = function() {
  app.beginUndoGroup("Force Refresh Sales");
  try {
    var refreshedCount = 0;
    for (var i = 1; i <= 21; i++) {
      var comp = getCompByName("PRICE Sale -" + i);
      if (comp) {
        comp.displayStartTime = comp.displayStartTime;
        refreshedCount++;
      }
    }
    alert("✅ Refreshed " + refreshedCount + " sale comps!\nPrices should now display correctly.");
  } catch (e) {
    alert("❌ Refresh failed:\n" + e.toString());
  } finally {
    app.endUndoGroup();
  }
};

btnPurgeCache.onClick = function() {
  if (confirm("This will clear ALL cache and may slow down the next preview.\n\nContinue?")) {
    try {
      app.purge(PurgeTarget.ALL_CACHES);
      alert("✅ Cache purged!\nAll comps will re-render on next preview.");
    } catch (e) {
      alert("❌ Purge failed:\n" + e.toString());
    }
  }
};
// ============================================================================
// TAB 4: ייבוא/ייצוא
// ============================================================================
var tab4 = tabs.add("tab", undefined, "ייבוא/ייצוא");
tab4.orientation = "column";
tab4.alignChildren = ["fill", "top"];
tab4.spacing = 10;
tab4.margins = [10, 10, 10, 10];

// Title
var tab4Title = tab4.add("statictext", undefined, "ייבוא/ייצוא מלא");
tab4Title.graphics.font = ScriptUI.newFont(tab4Title.graphics.font.name, "Bold", 14);

// Separator
tab4.add("panel", undefined, "", { borderStyle: "black" }).maximumSize.height = 2;

// Instructions
var tab4Info = tab4.add("group");
tab4Info.orientation = "column";
tab4Info.alignChildren = ["right", "top"];
tab4Info.spacing = 5;

tab4Info.add("statictext", undefined, "ייצוא: שומר את כל הפרויקט (מוצרים, מבצעים, סטיילינג, תלח, צבעים, רינדור)");
tab4Info.add("statictext", undefined, "ייבוא: טוען את כל הנתונים מקובץ CSV");
tab4Info.add("statictext", undefined, "הקובץ תומך בעברית ונפתח באקסל (מומלץ UTF-8 with BOM)");

// Separator
tab4.add("panel", undefined, "", { borderStyle: "black" }).maximumSize.height = 1;

// Export Section
var exportGroup = tab4.add("group");
exportGroup.orientation = "column";
exportGroup.alignChildren = ["fill", "top"];
exportGroup.spacing = 8;

var exportTitle = exportGroup.add("statictext", undefined, "ייצוא פרויקט");
exportTitle.graphics.font = ScriptUI.newFont(exportTitle.graphics.font.name, "Bold", 12);

var exportInfo = exportGroup.add("group");
exportInfo.orientation = "column";
exportInfo.alignChildren = ["right", "top"];
exportInfo.spacing = 3;
exportInfo.add("statictext", undefined, "הקובץ יכלול:");
exportInfo.add("statictext", undefined, "• 20 מוצרים + כל ההגדרות");
exportInfo.add("statictext", undefined, "• 21 מבצעים + רקעים");
exportInfo.add("statictext", undefined, "• סטיילינג גלובלי (18 הגדרות)");
exportInfo.add("statictext", undefined, "• תלח + תאריכי קמפיין");
exportInfo.add("statictext", undefined, "• כל הצבעים מה-COLOR_BANK");
exportInfo.add("statictext", undefined, "• הגדרות רינדור (TAB 6)");

var btnExport = exportGroup.add("button", undefined, "ייצוא לקובץ CSV");
btnExport.preferredSize.height = 35;

btnExport.onClick = function () {
  try {
    exportCompleteProjectToCSV();
  } catch (e) {
    alert("Error:\n" + e.toString() + "\n\nLine: " + e.line);
  }
};

// Separator
tab4.add("panel", undefined, "", { borderStyle: "black" }).maximumSize.height = 1;

// Import Section
var importGroup = tab4.add("group");
importGroup.orientation = "column";
importGroup.alignChildren = ["fill", "top"];
importGroup.spacing = 8;

var importTitle = importGroup.add("statictext", undefined, "ייבוא פרויקט");
importTitle.graphics.font = ScriptUI.newFont(importTitle.graphics.font.name, "Bold", 12);

var importInfo = importGroup.add("group");
importInfo.orientation = "column";
importInfo.alignChildren = ["right", "top"];
importInfo.spacing = 3;
importInfo.add("statictext", undefined, "לפני ייבוא:");
importInfo.add("statictext", undefined, "• ודא שהקובץ CSV תקין");
importInfo.add("statictext", undefined, "• ניתן לערוך באקסל (שמור כ-CSV UTF-8)");
importInfo.add("statictext", undefined, "• הייבוא ידרוס את כל הנתונים הקיימים!");

var btnImport = importGroup.add("button", undefined, "ייבוא מקובץ CSV");
btnImport.preferredSize.height = 35;

btnImport.onClick = function () {
  var userConfirm = confirm(
    "אזהרה!\n\n" +
      "הייבוא ידרוס את כל הנתונים הנוכחיים בפרויקט:\n" +
      "• כל המוצרים (1-20)\n" +
      "• כל המבצעים (1-21)\n" +
      "• סטיילינג\n" +
      "• תלח\n" +
      "• צבעים\n" +
      "• הגדרות רינדור\n\n" +
      "האם להמשיך?"
  );

  if (!userConfirm) return;

  try {
    importCompleteProjectFromCSV();
  } catch (e) {
    alert("Import Error:\n" + e.toString() + "\n\nLine: " + e.line);
  }
};

// Spacer + footer
tab4.add("statictext", undefined, "");

var tab4Footer = tab4.add("group");
tab4Footer.orientation = "column";
tab4Footer.alignChildren = ["center", "top"];
tab4Footer.spacing = 3;

tab4Footer.add("statictext", undefined, "───────────────────────────────────");
tab4Footer.add("statictext", undefined, "טיפ: שמור גיבויים לפני שינויים גדולים!");
tab4Footer.add("statictext", undefined, "פורמט: CSV (UTF-8 with BOM)");

// ========================================
    // 📍 TAB 5: (EMPTY - FOR FUTURE USE)
    // ========================================

    var tabColors = tabs.add("tab", undefined, "צבעים");
    tabColors.orientation = "column";
    tabColors.alignChildren = ["fill", "top"];
    tabColors.margins = 10;
    tabColors.spacing = 10;

    // Top buttons
    var colorsTopRow = tabColors.add("group");
    colorsTopRow.orientation = "row";
    colorsTopRow.alignChildren = ["left", "center"];
    colorsTopRow.spacing = 10;

    var btnColorsLoad = colorsTopRow.add("button", undefined, "📂 Load from AE");
    btnColorsLoad.preferredSize.width = 120;

    var btnColorsRefresh = colorsTopRow.add("button", undefined, "🔄 Refresh");
    btnColorsRefresh.preferredSize.width = 100;

    tabColors.add("panel", undefined, "").preferredSize.height = 2;

    // Sub-tabs for color groups
    var colorSubTabs = tabColors.add("tabbedpanel");
    colorSubTabs.alignChildren = ["fill", "fill"];
    colorSubTabs.preferredSize = [1050, 400];

    // State for colors
    var colorBankData = {
      "2W": [],
      "B": [],
      "P50": [],
      "ALT": []
    };

    var colorUIRefs = {
      "2W": [],
      "B": [],
      "P50": [],
      "ALT": []
    };

    // Function to build color table for a sub-tab
    function buildColorSubTab(prefix) {
      var subTab = colorSubTabs.add("tab", undefined, prefix);
      subTab.orientation = "column";
      subTab.alignChildren = ["fill", "top"];
      subTab.margins = 10;
      subTab.spacing = 5;

      // Scroll group
      var scrollGroup = subTab.add("group");
      scrollGroup.orientation = "column";
      scrollGroup.alignChildren = ["fill", "top"];
      scrollGroup.spacing = 3;

      // Header
      var header = scrollGroup.add("group");
      header.orientation = "row";
      header.alignChildren = ["left", "center"];
      header.spacing = 8;

      var hName = header.add("statictext", undefined, "Color Name");
      hName.preferredSize.width = 180;
      var hPreview = header.add("statictext", undefined, "Preview");
      hPreview.preferredSize.width = 60;
      var hHex = header.add("statictext", undefined, "HEX");
      hHex.preferredSize.width = 90;
      var hPicker = header.add("statictext", undefined, "");
      hPicker.preferredSize.width = 50;
      var hApply = header.add("statictext", undefined, "");
      hApply.preferredSize.width = 60;

      scrollGroup.add("panel", undefined, "").preferredSize.height = 1;

      return scrollGroup;
    }

    // Function to add color row
    function addColorRow(parentGroup, colorItem) {
      var row = parentGroup.add("group");
      row.orientation = "row";
      row.alignChildren = ["left", "center"];
      row.spacing = 8;

      // Color name
      var label = row.add("statictext", undefined, colorItem.name);
      label.preferredSize.width = 180;

      // Preview box
      var previewBox = row.add("group");
      previewBox.preferredSize = [60, 18];
      previewBox.graphics.backgroundColor = previewBox.graphics.newBrush(
        previewBox.graphics.BrushType.SOLID_COLOR,
        [colorItem.color[0], colorItem.color[1], colorItem.color[2], 1]
      );

      // HEX input
      var hexInput = row.add("edittext", undefined, rgba01ToHex(colorItem.color));
      hexInput.preferredSize.width = 90;
      hexInput.preferredSize.height = 20;

      // Color picker button
      var btnPicker = row.add("button", undefined, "🎨");
      btnPicker.preferredSize = [50, 20];

      // Apply button
      var btnApply = row.add("button", undefined, "Apply");
      btnApply.preferredSize = [60, 20];

      // Update preview on HEX change
      hexInput.onChange = function() {
        var newColor = hexToRgba01(this.text);
        if (newColor) {
          previewBox.graphics.backgroundColor = previewBox.graphics.newBrush(
            previewBox.graphics.BrushType.SOLID_COLOR,
            [newColor[0], newColor[1], newColor[2], 1]
          );
        }
      };

      // Color picker action
      btnPicker.onClick = function() {
        var currentColor = hexToRgba01(hexInput.text);
        if (!currentColor) currentColor = colorItem.color;
        
        try {
          var picked = $.colorPicker(Math.round(currentColor[0] * 255 * 65536 + currentColor[1] * 255 * 256 + currentColor[2] * 255));
          if (picked !== -1) {
            var newColor = rgbIntToRGBA01(picked);
            hexInput.text = rgba01ToHex(newColor);
            previewBox.graphics.backgroundColor = previewBox.graphics.newBrush(
              previewBox.graphics.BrushType.SOLID_COLOR,
              [newColor[0], newColor[1], newColor[2], 1]
            );
          }
        } catch(e) {
          alert("Color Picker not available: " + e.toString());
        }
      };

      // Apply action
      btnApply.onClick = function() {
        var newColor = hexToRgba01(hexInput.text);
        if (newColor) {
          app.beginUndoGroup("Update Color: " + colorItem.name);
          if (setColorInBank(colorItem.name, newColor)) {
            colorItem.color = newColor;
            previewBox.graphics.backgroundColor = previewBox.graphics.newBrush(
              previewBox.graphics.BrushType.SOLID_COLOR,
              [newColor[0], newColor[1], newColor[2], 1]
            );
            alert("✅ Applied: " + colorItem.name);
          } else {
            alert("❌ Failed to apply: " + colorItem.name);
          }
          app.endUndoGroup();
        } else {
          alert("❌ Invalid HEX color");
        }
      };

      return {
        row: row,
        previewBox: previewBox,
        hexInput: hexInput,
        colorItem: colorItem
      };
    }

    // Create 4 sub-tabs
    var subTabGroups = {
      "2W": buildColorSubTab("2W"),
      "B": buildColorSubTab("B"),
      "P50": buildColorSubTab("P50"),
      "ALT": buildColorSubTab("ALT")
    };

    // Load colors from AE
    function loadColorsFromAE() {
      var allColors = getAllColorControlsFromBank();
      if (allColors.length === 0) {
        alert("❌ No Color Controls found in STYLE_MASTER > COLOR_BANK");
        return;
      }

      // Clear previous rows
      for (var prefix in colorUIRefs) {
        var refs = colorUIRefs[prefix];
        for (var i = refs.length - 1; i >= 0; i--) {
          subTabGroups[prefix].remove(refs[i].row);
        }
        colorUIRefs[prefix] = [];
      }

      // Reset data
      colorBankData = {
        "2W": [],
        "B": [],
        "P50": [],
        "ALT": []
      };

      // Sort colors by prefix
      var prefixes = ["2W", "B", "P50", "ALT"];
      for (var i = 0; i < allColors.length; i++) {
        var colorItem = allColors[i];
        for (var p = 0; p < prefixes.length; p++) {
          if (colorItem.name.indexOf(prefixes[p] + "_") === 0) {
            colorBankData[prefixes[p]].push(colorItem);
            break;
          }
        }
      }

      // Build rows
      for (var p = 0; p < prefixes.length; p++) {
        var prefix = prefixes[p];
        var colors = colorBankData[prefix];
        for (var i = 0; i < colors.length; i++) {
          var rowRef = addColorRow(subTabGroups[prefix], colors[i]);
          colorUIRefs[prefix].push(rowRef);
        }
      }

      tabColors.layout.layout(true);
      alert("✅ Loaded " + allColors.length + " colors from COLOR_BANK");
    }

    btnColorsLoad.onClick = loadColorsFromAE;
    btnColorsRefresh.onClick = loadColorsFromAE;
    sharedColorsLoad = btnColorsLoad;


    // END TAB 5 CODE BLOCK
    // ========================================


        // ========================================
    // 📍 TAB 6: רינדור
    // ========================================
    // START TAB 6 CODE BLOCK
    var tabRender = tabs.add("tab", undefined, "רינדור");
    tabRender.orientation = "column";
    tabRender.alignChildren = ["fill", "top"];
    tabRender.margins = 20;
    tabRender.spacing = 15;

    // Title
    var renderTitle = tabRender.add("statictext", undefined, "🎬 Render Setup");
    renderTitle.graphics.font = ScriptUI.newFont(renderTitle.graphics.font.name, "BOLD", 14);

    tabRender.add("panel", undefined, "").preferredSize.height = 2;

    // Product counts section
    var countsGroup = tabRender.add("group");
    countsGroup.orientation = "column";
    countsGroup.alignChildren = ["fill", "top"];
    countsGroup.spacing = 10;

    var productsRow = countsGroup.add("group");
    productsRow.orientation = "row";
    productsRow.alignChildren = ["left", "center"];
    productsRow.spacing = 10;

    productsRow.add("statictext", undefined, "Products Count:").preferredSize.width = 120;
    var productCountDropdown = productsRow.add("dropdownlist", undefined, ["4", "8", "12", "16", "20"]);
    productCountDropdown.selection = 2; // ✅ Default 12 (index 2)
    productCountDropdown.preferredSize.width = 80;
    productCountDropdown.helpTip = "מספר המוצרים הרגילים (רביעיות)\nלפי זה ייקבע אילו שכבות להשאיר פעילות";

    var salesRow = countsGroup.add("group");
    salesRow.orientation = "row";
    salesRow.alignChildren = ["left", "center"];
    salesRow.spacing = 10;

    salesRow.add("statictext", undefined, "Sales Count:").preferredSize.width = 120;
    var saleCountDropdown = salesRow.add("dropdownlist", undefined, ["0", "3", "6", "9", "12", "15", "18", "21"]);
    saleCountDropdown.selection = 4; // ✅ Default 12 (index 4)
    saleCountDropdown.preferredSize.width = 80;
    saleCountDropdown.helpTip = "מספר מוצרי המבצעים (שלישיות)\n0 = אין מסך מבצעים";

    // ✅ ✅ ✅ NEW: Detect button
    var detectRow = countsGroup.add("group");
    detectRow.orientation = "row";
    detectRow.alignChildren = ["left", "center"];
    detectRow.spacing = 10;

    var btnDetect = detectRow.add("button", undefined, "🔍 Detect from AE");
    btnDetect.preferredSize.width = 120;
    btnDetect.helpTip = "זיהוי אוטומטי של מספר המוצרים\n" +
                        "על פי השכבות הפעילות באפטר אפקט\n\n" +
                        "הכפתור יסרוק:\n" +
                        "• מוצרים רגילים (Entrance, Pardes, וכו')\n" +
                        "• מוצרי Sale (1_Sale)\n\n" +
                        "וימלא אוטומטית את הערכים בDropdowns";

    btnDetect.onClick = function() {
      var result = detectActiveProducts();
      
      if (result.success) {
        // Update dropdowns
        if (result.productCount > 0) {
          var productIndex = -1;
          if (result.productCount === 4) productIndex = 0;
          else if (result.productCount === 8) productIndex = 1;
          else if (result.productCount === 12) productIndex = 2;
          else if (result.productCount === 16) productIndex = 3;
          else if (result.productCount === 20) productIndex = 4;
          
          if (productIndex >= 0) {
            productCountDropdown.selection = productIndex;
          }
        }
        
        if (result.saleCount >= 0) {
          var saleIndex = -1;
          if (result.saleCount === 0) saleIndex = 0;
          else if (result.saleCount === 3) saleIndex = 1;
          else if (result.saleCount === 6) saleIndex = 2;
          else if (result.saleCount === 9) saleIndex = 3;
          else if (result.saleCount === 12) saleIndex = 4;
          else if (result.saleCount === 15) saleIndex = 5;
          else if (result.saleCount === 18) saleIndex = 6;
          else if (result.saleCount === 21) saleIndex = 7;
          
          if (saleIndex >= 0) {
            saleCountDropdown.selection = saleIndex;
          }
        }
        
        alert(result.message);
      } else {
        alert(result.message);
      }
    };
    sharedRenderDetect = btnDetect;

    tabRender.add("panel", undefined, "").preferredSize.height = 2;

    // Composition selection
    var compsPanel = tabRender.add("panel", undefined, "Select Compositions to Render");
    compsPanel.orientation = "column";
    compsPanel.alignChildren = ["left", "top"];
    compsPanel.spacing = 8;
    compsPanel.margins = 15;

    // Select All / Deselect All buttons
    var selectBtnsRow = compsPanel.add("group");
    selectBtnsRow.orientation = "row";
    selectBtnsRow.alignChildren = ["left", "center"];
    selectBtnsRow.spacing = 10;

    var btnSelectAll = selectBtnsRow.add("button", undefined, "Select All");
    btnSelectAll.preferredSize.width = 100;
    btnSelectAll.helpTip = "סמן את כל המסכים לרינדור";

    var btnDeselectAll = selectBtnsRow.add("button", undefined, "Deselect All");
    btnDeselectAll.preferredSize.width = 100;
    btnDeselectAll.helpTip = "בטל סימון של כל המסכים";

    compsPanel.add("panel", undefined, "").preferredSize.height = 1;

    var cbSale = compsPanel.add("checkbox", undefined, "☑ 1_Sale");
    cbSale.value = true;
    cbSale.helpTip = "מסך מבצעים - שלישיות";

    var cbEntrance = compsPanel.add("checkbox", undefined, "☑ 2_Entrance Main");
    cbEntrance.value = true;
    cbEntrance.helpTip = "מסך כניסה ראשית";

    var cbPardes = compsPanel.add("checkbox", undefined, "☑ 3_Pardes Outside");
    cbPardes.value = true;
    cbPardes.helpTip = "מסך פרדס חוץ";

    var cbOutside = compsPanel.add("checkbox", undefined, "☑ 4_Outside_M");
    cbOutside.value = true;
    cbOutside.helpTip = "מסך מישור חוץ";

    var cbDrinks = compsPanel.add("checkbox", undefined, "☑ 5_Drinks");
    cbDrinks.value = true;
    cbDrinks.helpTip = "מסך משקאות";

    btnSelectAll.onClick = function() {
      cbSale.value = true;
      cbEntrance.value = true;
      cbPardes.value = true;
      cbOutside.value = true;
      cbDrinks.value = true;
    };

    btnDeselectAll.onClick = function() {
      cbSale.value = false;
      cbEntrance.value = false;
      cbPardes.value = false;
      cbOutside.value = false;
      cbDrinks.value = false;
    };

    tabRender.add("panel", undefined, "").preferredSize.height = 2;

    // Output settings
    var outputGroup = tabRender.add("group");
    outputGroup.orientation = "column";
    outputGroup.alignChildren = ["fill", "top"];
    outputGroup.spacing = 10;

    var folderRow = outputGroup.add("group");
    folderRow.orientation = "row";
    folderRow.alignChildren = ["left", "center"];
    folderRow.spacing = 10;

    folderRow.add("statictext", undefined, "Output Folder:").preferredSize.width = 100;
    
    // ✅ Get user's Videos folder (Windows/Mac compatible)
    var userFolder = Folder.myDocuments.parent;
    var videosFolder = new Folder(userFolder.fsName + "/Videos");
    var defaultVideoFolder = videosFolder.fsName + "/";
    
    var folderPathEdit = folderRow.add("edittext", undefined, defaultVideoFolder);
    folderPathEdit.preferredSize.width = 300;
    folderPathEdit.helpTip = "תיקיית יעד לשמירת הקבצים המרונדרים";
    
    var btnBrowse = folderRow.add("button", undefined, "Browse...");
    btnBrowse.preferredSize.width = 80;
    btnBrowse.helpTip = "בחר תיקייה אחרת";

    btnBrowse.onClick = function() {
      var folder = Folder.selectDialog("Select output folder");
      if (folder) {
        folderPathEdit.text = folder.fsName;
      }
    };

    var fileNameRow = outputGroup.add("group");
    fileNameRow.orientation = "row";
    fileNameRow.alignChildren = ["left", "center"];
    fileNameRow.spacing = 10;

    fileNameRow.add("statictext", undefined, "File Name Base:").preferredSize.width = 100;
    var fileNameEdit = fileNameRow.add("edittext", undefined, "Campaign_");
    fileNameEdit.preferredSize.width = 300;
    fileNameEdit.helpTip = "קידומת לשם הקובץ\nשם מלא יהיה: Campaign_1_Sale.mov";

    var presetRow = outputGroup.add("group");
    presetRow.orientation = "row";
    presetRow.alignChildren = ["left", "center"];
    presetRow.spacing = 10;

    presetRow.add("statictext", undefined, "Render Preset:").preferredSize.width = 100;
    var presetDropdown = presetRow.add("dropdownlist", undefined, ["Loading..."]);
    presetDropdown.preferredSize.width = 300;
    presetDropdown.helpTip = "פריסט רינדור שיוחל על כל הקומפוזיציות";

    // Load output modules
    try {
      var modules = getOutputModules();
      presetDropdown.removeAll();
      for (var i = 0; i < modules.length; i++) {
        presetDropdown.add("item", modules[i]);
      }
      presetDropdown.selection = 0;
    } catch(e) {
      presetDropdown.removeAll();
      presetDropdown.add("item", "Best Settings");
      presetDropdown.selection = 0;
    }

    sharedRenderApplyUI = function() {
      if (!state || !state.renderConfig) return;
      var rc = state.renderConfig;

      function selectDropByText(dd, txt){
        if (!dd || !dd.items) return;
        var target = String(txt);
        for (var i = 0; i < dd.items.length; i++) {
          if (String(dd.items[i].text) === target) {
            dd.selection = i;
            return;
          }
        }
      }

      if (rc.productCount) selectDropByText(productCountDropdown, rc.productCount);
      if (rc.saleCount !== undefined && rc.saleCount !== null) selectDropByText(saleCountDropdown, rc.saleCount);

      if (rc.renderSale !== undefined) cbSale.value = !!rc.renderSale;
      if (rc.renderEntrance !== undefined) cbEntrance.value = !!rc.renderEntrance;
      if (rc.renderPardes !== undefined) cbPardes.value = !!rc.renderPardes;
      if (rc.renderOutside !== undefined) cbOutside.value = !!rc.renderOutside;
      if (rc.renderDrinks !== undefined) cbDrinks.value = !!rc.renderDrinks;

      if (rc.outputFolder !== undefined) folderPathEdit.text = rc.outputFolder;
      if (rc.fileNameBase !== undefined) fileNameEdit.text = rc.fileNameBase;
      if (rc.outputModule !== undefined) selectDropByText(presetDropdown, rc.outputModule);
    };

    tabRender.add("panel", undefined, "").preferredSize.height = 2;

    // Action buttons
    var actionBtnsGroup = tabRender.add("group");
    actionBtnsGroup.orientation = "column";
    actionBtnsGroup.alignChildren = ["center", "top"];
    actionBtnsGroup.spacing = 10;

    // Apply button
    var btnApply = actionBtnsGroup.add("button", undefined, "✅ Apply Settings (Disable Layers + Work Area)");
    btnApply.preferredSize.width = 380;
    btnApply.preferredSize.height = 35;
    btnApply.graphics.font = ScriptUI.newFont(btnApply.graphics.font.name, "BOLD", 11);
    btnApply.helpTip = "החל הגדרות באפטר אפקט:\n• כיבוי שכבות מיותרות\n• קיצור Work Area\n\nלחץ כאן קודם, בדוק שהכל תקין,\nורק אז לחץ על 'Add to Render Queue'";

    btnApply.onClick = function() {
      // Get counts
      var productCount = parseInt(productCountDropdown.selection.text, 10);
      var saleCountText = saleCountDropdown.selection.text;
      var saleCount = (saleCountText === "0") ? 0 : parseInt(saleCountText, 10);

      // Build config
      var config = {
        productCount: productCount,
        saleCount: saleCount,
        renderSale: cbSale.value,
        renderEntrance: cbEntrance.value,
        renderPardes: cbPardes.value,
        renderOutside: cbOutside.value,
        renderDrinks: cbDrinks.value
      };

      // Check if at least one comp selected
      if (!config.renderSale && !config.renderEntrance && !config.renderPardes && !config.renderOutside && !config.renderDrinks) {
        alert("❌ Please select at least one composition");
        return;
      }

      // Apply settings
      app.beginUndoGroup("Apply Render Settings");
      var report = applyRenderSettings(config);
      app.endUndoGroup();

      if (report.success) {
        alert(report.message);
      } else {
        alert("❌ Error: " + report.message);
      }
    };

    // Render Queue buttons row
    var rqBtnsRow = actionBtnsGroup.add("group");
    rqBtnsRow.orientation = "row";
    rqBtnsRow.alignChildren = ["center", "center"];
    rqBtnsRow.spacing = 10;

    var btnClearRQ = rqBtnsRow.add("button", undefined, "🗑️ Clear Render Queue");
    btnClearRQ.preferredSize.width = 185;
    btnClearRQ.preferredSize.height = 35;
    btnClearRQ.helpTip = "נקה את Render Queue מכל הפריטים\nשימושי כשרוצים להתחיל מחדש";

    var btnAddToRQ = rqBtnsRow.add("button", undefined, "🚀 Add to Render Queue");
    btnAddToRQ.preferredSize.width = 185;
    btnAddToRQ.preferredSize.height = 35;
    btnAddToRQ.graphics.font = ScriptUI.newFont(btnAddToRQ.graphics.font.name, "BOLD", 11);
    btnAddToRQ.helpTip = "הוסף את הקומפוזיציות ל-Render Queue\nעם כל ההגדרות שהוגדרו\n\n⚠️ לחץ על 'Apply Settings' לפני!";

    btnClearRQ.onClick = function() {
      var rq = app.project.renderQueue;
      var count = rq.numItems;
      
      if (count === 0) {
        alert("Render Queue is already empty");
        return;
      }

      var confirm = Window.confirm("למחוק את כל " + count + " הפריטים מ-Render Queue?", false, "Clear Render Queue");
      if (confirm) {
        app.beginUndoGroup("Clear Render Queue");
        for (var i = rq.numItems; i >= 1; i--) {
          rq.item(i).remove();
        }
        app.endUndoGroup();
        alert("✅ Render Queue נוקה!");
      }
    };

    btnAddToRQ.onClick = function() {
      // Validate inputs
      var outputFolder = folderPathEdit.text;
      if (!outputFolder || outputFolder === "") {
        alert("❌ Please select an output folder");
        return;
      }

      var fileNameBase = fileNameEdit.text;
      if (!fileNameBase || fileNameBase === "") {
        alert("❌ Please enter a file name base");
        return;
      }

      var outputModule = presetDropdown.selection ? presetDropdown.selection.text : "Best Settings";

      // Get counts
      var productCount = parseInt(productCountDropdown.selection.text, 10);
      var saleCountText = saleCountDropdown.selection.text;
      var saleCount = (saleCountText === "0") ? 0 : parseInt(saleCountText, 10);

      // Build config
      var config = {
        productCount: productCount,
        saleCount: saleCount,
        renderSale: cbSale.value,
        renderEntrance: cbEntrance.value,
        renderPardes: cbPardes.value,
        renderOutside: cbOutside.value,
        renderDrinks: cbDrinks.value,
        outputFolder: outputFolder,
        fileNameBase: fileNameBase,
        outputModule: outputModule
      };

      // Check if at least one comp selected
      if (!config.renderSale && !config.renderEntrance && !config.renderPardes && !config.renderOutside && !config.renderDrinks) {
        alert("❌ Please select at least one composition to render");
        return;
      }

      // Add to render queue
      app.beginUndoGroup("Add to Render Queue");
      var report = addCompsToRenderQueue(config);
      app.endUndoGroup();

      if (report.success) {
        alert(report.message);
      } else {
        alert("❌ Error: " + report.message);
      }
    };
    
    // END TAB 6 CODE BLOCK


    // ========================================
    // FINALIZE
    // ========================================
    onCountChanged();
    tabs.selection = 1;  // ✅ CHANGED: Open TAB 1 (מוצרים) by default
    pal.layout.layout(true);
    updateScrollbar();


    pal.onResizing = pal.onResize = function() {
      this.layout.resize();
      updateScrollbar();
    };


    return pal;
  }


  var win = buildUI(thisObj);
  if (win instanceof Window) {
    win.center();
    win.show();
  } else {
    win.layout.layout(true);
  }


})(this);
