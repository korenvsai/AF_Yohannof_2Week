/* =========================================================
   KOREN MASTER PANEL (ONE PANEL)
   - Product DATA sync (Load/Apply) with PRODUCT_DATA_1..20
   - ProductCount hides rows (does NOT delete & does NOT apply hidden rows)
   - RTL table + overflow warning (3+ lines only)
   - FIXES:
     * Prevent "Bad argument" crashes from dropdowns having null selection
     * Hard-guard selection reads/writes everywhere
     * Keep Use_Auto_White + White_Width logic exactly as in your AE project
   ========================================================= */

(function KorenMasterPanel(thisObj) {

  // -------------------------
  // SETTINGS (edit only if needed)
  // -------------------------
  var MAX_PRODUCTS = 20;

  // DATA comp structure (fixed names)
  var DATA_COMP_PREFIX = "PRODUCT_DATA_";
  var LYR_MAIN = "DATA_MAIN_TEXT";
  var LYR_SUB  = "DATA_SUB_TEXT";
  var LYR_ADD  = "DATA_ADDITION_TEXT";
  var LYR_CTRL = "DATA_CTRL";

  // Effect names (MUST match exactly)
  var E_PRICE_TYPE      = "Price_Type";       // 1 Regular, 2 Deal
  var E_PRICE_VALUE     = "Price Value";
  var E_DEAL_QTY        = "Deal Quantity";
  var E_DEAL_PRICE      = "Deal Price";
  var E_SHOW_UNIT       = "Show_Unit";
  var E_SHOW_DEAL_UNIT  = "Show_Deal_Unit";
  var E_USE_DEFAULT_BG  = "Use_Default_BG";
  var E_PRODUCT_INDEX   = "Product_Index";
  var E_BG_SIDE_MANUAL  = "BG_Side_Manual";   // 1 L, 2 R
  var E_BG_COLOR_MANUAL = "BG_Color_Manual";  // 1 ORANGE,2 RED,3 BROWN,4 YELLOW
  var E_USE_AUTO_WHITE  = "Use_Auto_White";
  var E_WHITE_WIDTH     = "White_Width";      // 1 NARROW,2 REGULAR,3 WIDE

  // Overflow warning check (3+ lines only)
  var OVERFLOW_LINE_HEIGHT = 100;
  var OVERFLOW_WARN_IF_LINES_GT = 2.3;
  var TEXT_COMP_PREFIX_1 = "Text ";
  var TEXT_COMP_PREFIX_2 = "Text";

  var MEASURE_MAIN_LAYER_CANDIDATES = ["טקסט_ראשי", "טקסט ראשי", "MAIN", "Main", "main"];

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
    try { e(1).setValue(v); return true; } catch (_) { return false; }
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
    var s = ("" + str).replace(/\\n/g, "\r"); // typed "\n" becomes AE linebreak
    s = s.replace(/\r\n/g, "\r").replace(/\n/g, "\r"); // normalize
    return s;
  }

  function aeToUiText(str) {
    if (str === null || str === undefined) return "";
    return ("" + str).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  }

  // ExtendScript-compatible trim function
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

  // ✅ CRITICAL FIX: dropdown selection can be null => Bad argument crash
  function safeDropdownIndex(dd, fallbackIndex) {
    if (!dd) return fallbackIndex;
    try {
      if (dd.selection) return dd.selection.index;
      var text = "";
      try { text = dd.text; } catch (_) { text = ""; }
      if (text && dd.items && dd.items.length) {
        for (var i = 0; i < dd.items.length; i++) {
          if (dd.items[i].text === text) return i;
        }
      }
      return fallbackIndex;
    } catch (_) {
      return fallbackIndex;
    }
  }

  function safeSetSelection(dd, idx) {
    if (!dd) return;
    try {
      if (!dd.items || dd.items.length === 0) return;
      if (idx < 0) idx = 0;
      if (idx > dd.items.length - 1) idx = dd.items.length - 1;
      dd.selection = dd.items[idx];
    } catch (_) {}
  }

  // -------------------------
  // Data model (always keep 1..20 in memory)
  // -------------------------
  function ProductRow(i) {
    this.i = i;

    this.mainText = "";
    this.subText  = "";
    this.addText  = "";

    this.priceType   = 1;  // 1 Regular / 2 Deal
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

  function readRowFromProject(i) {
    var row = new ProductRow(i);
    var c = getCompByName(DATA_COMP_PREFIX + i);
    if (!c) return { ok:false, row:row, err:"Missing comp " + DATA_COMP_PREFIX + i };

    row.mainText = aeToUiText(getTextValue(c, LYR_MAIN));
    row.subText  = aeToUiText(getTextValue(c, LYR_SUB));
    row.addText  = aeToUiText(getTextValue(c, LYR_ADD));

    var ctrl = getLayer(c, LYR_CTRL);
    if (!ctrl) return { ok:false, row:row, err:"Missing layer " + LYR_CTRL + " in " + c.name };

    var v;
    v = getEffectValue(ctrl, E_PRICE_TYPE);      if (v !== null) row.priceType = v;
    v = getEffectValue(ctrl, E_PRICE_VALUE);     if (v !== null) row.priceValue = v;
    v = getEffectValue(ctrl, E_DEAL_QTY);        if (v !== null) row.dealQty = v;
    v = getEffectValue(ctrl, E_DEAL_PRICE);      if (v !== null) row.dealPrice = v;

    v = getEffectValue(ctrl, E_SHOW_UNIT);       if (v !== null) row.showUnit = v;
    v = getEffectValue(ctrl, E_SHOW_DEAL_UNIT);  if (v !== null) row.showDealUnit = v;

    v = getEffectValue(ctrl, E_USE_DEFAULT_BG);  if (v !== null) row.useDefaultBG = v;
    v = getEffectValue(ctrl, E_PRODUCT_INDEX);   if (v !== null) row.productIndex = v;
    v = getEffectValue(ctrl, E_BG_COLOR_MANUAL); if (v !== null) row.bgColorManual = v;
    v = getEffectValue(ctrl, E_BG_SIDE_MANUAL);  if (v !== null) row.bgSideManual = v;

    v = getEffectValue(ctrl, E_USE_AUTO_WHITE);  if (v !== null) row.useAutoWhite = v;
    v = getEffectValue(ctrl, E_WHITE_WIDTH);     if (v !== null) row.whiteWidth = v;

    return { ok:true, row:row, err:null };
  }

  function applyRowToProject(i, row) {
    var c = getCompByName(DATA_COMP_PREFIX + i);
    if (!c) return { ok:false, err:"Missing comp " + DATA_COMP_PREFIX + i };

    var ctrl = getLayer(c, LYR_CTRL);
    if (!ctrl) return { ok:false, err:"Missing layer " + LYR_CTRL + " in " + c.name };

    setTextValue(c, LYR_MAIN, uiToAeText(row.mainText));
    setTextValue(c, LYR_SUB,  uiToAeText(row.subText));
    setTextValue(c, LYR_ADD,  uiToAeText(row.addText));

    setEffectValue(ctrl, E_PRICE_TYPE, row.priceType);
    setEffectValue(ctrl, E_PRICE_VALUE, row.priceValue);
    setEffectValue(ctrl, E_DEAL_QTY, row.dealQty);
    setEffectValue(ctrl, E_DEAL_PRICE, row.dealPrice);

    setEffectValue(ctrl, E_SHOW_UNIT, row.showUnit);
    setEffectValue(ctrl, E_SHOW_DEAL_UNIT, row.showDealUnit);

    setEffectValue(ctrl, E_USE_DEFAULT_BG, row.useDefaultBG);
    setEffectValue(ctrl, E_PRODUCT_INDEX, row.productIndex);
    setEffectValue(ctrl, E_BG_COLOR_MANUAL, row.bgColorManual);
    setEffectValue(ctrl, E_BG_SIDE_MANUAL, row.bgSideManual);

    setEffectValue(ctrl, E_USE_AUTO_WHITE, row.useAutoWhite);
    setEffectValue(ctrl, E_WHITE_WIDTH, row.whiteWidth);

    return { ok:true, err:null };
  }

  // -------------------------
  // Overflow warning (3+ lines)
  // -------------------------
  function findMeasureTextComp(i) {
    var c = getCompByName(TEXT_COMP_PREFIX_1 + i);
    if (c) return c;
    c = getCompByName(TEXT_COMP_PREFIX_2 + i);
    if (c) return c;
    return null;
  }

  function findMainTextLayerForMeasure(comp) {
    for (var k = 0; k < MEASURE_MAIN_LAYER_CANDIDATES.length; k++) {
      var lyr = getLayer(comp, MEASURE_MAIN_LAYER_CANDIDATES[k]);
      if (lyr && lyr.property && lyr.property("Source Text")) return lyr;
    }
    for (var i = 1; i <= comp.numLayers; i++) {
      var l = comp.layer(i);
      try {
        if (l.property("Source Text")) return l;
      } catch(_) {}
    }
    return null;
  }

  function calcOverflowWarnForRow(i, mainText) {
    // Return false if text is empty or whitespace only
    var trimmed = trimString(mainText);
    if (!trimmed || trimmed === "") return false;

    // First try geometry measurement in Text comp (best)
    var tc = findMeasureTextComp(i);
    if (tc) {
      var layer = findMainTextLayerForMeasure(tc);
      if (layer && layer.property("Source Text")) {
        try {
          var prop = layer.property("Source Text");
          var original = prop.value;

          var tmp = original;
          tmp.text = uiToAeText(mainText);
          prop.setValue(tmp);

          var r = layer.sourceRectAtTime(tc.time, false);

          // restore
          prop.setValue(original);

          var estLines = r.height / OVERFLOW_LINE_HEIGHT;
          return estLines > OVERFLOW_WARN_IF_LINES_GT;
        } catch (_) {
          // fall through
        }
      }
    }

    // Fallback: only explicit newlines (not perfect, but safe)
    var s = (mainText || "");
    var lines = s.split(/\r\n|\r|\n/).length;
    return lines > 2; // More than 2 lines = 3+ lines
  }

  // -------------------------
  // UI (RTL visual order by adding right-most columns last)
  // -------------------------
  function buildUI(thisObj) {
    var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Koren Campaign Panel (Master)", undefined, { resizeable:true });
    pal.orientation = "column";
    pal.alignChildren = ["fill","top"];
    pal.margins = 10;
    pal.spacing = 8;

    // Top controls
    var top = pal.add("group");
    top.orientation = "row";
    top.alignChildren = ["left","center"];
    top.spacing = 10;

    top.add("statictext", undefined, "Products:");
    var etCount = top.add("edittext", undefined, "" + state.productCount);
    etCount.characters = 3;

    var btnLoad = top.add("button", undefined, "Load");
    var btnApply = top.add("button", undefined, "Apply");

    // Header (RTL visual)
    var header = pal.add("group");
    header.orientation = "row";
    header.alignChildren = ["left","center"];
    header.spacing = 6;

    function H(txt, w) {
      var st = header.add("statictext", undefined, txt, { truncate:"end" });
      st.preferredSize.width = w;
      return st;
    }

    // Leftmost -> rightmost (RTL visual: product # on the right)
    H("⚠️", 40);
    H("White", 55);
    H("AutoW", 50);
    H("BG צד", 50);
    H("BG צבע", 55);
    H("BG דיפולט", 65);
    H("Deal יח׳", 55);
    H("Unit", 45);
    H("Price", 60);
    H("DealP", 55);
    H("Qty", 45);
    H("סוג", 55);
    H("תוספת", 150);
    H("משני", 120);
    H("שם", 140);
    H("#", 25);
    H("בחר", 35);

    // Scroll area
    var sc = pal.add("group");
    sc.orientation = "column";
    sc.alignChildren = ["fill","top"];

    var viewport = sc.add("panel", undefined, "");
    viewport.margins = 6;
    viewport.alignChildren = ["fill","top"];
    viewport.preferredSize.height = 420;

    var rowsHolder = viewport.add("group");
    rowsHolder.orientation = "column";
    rowsHolder.alignChildren = ["fill","top"];
    rowsHolder.spacing = 6;

    var sb = sc.add("scrollbar");
    sb.minvalue = 0;
    sb.maxvalue = 0;
    sb.value = 0;

    var rowsUI = [];

    function makeRow(i) {
      var g = rowsHolder.add("group");
      g.orientation = "row";
      g.alignChildren = ["left","top"];
      g.spacing = 6;

      var stWarn = g.add("statictext", undefined, "");
      stWarn.preferredSize.width = 40;

      var ddWhite = g.add("dropdownlist", undefined, ["N","R","W"]);
      ddWhite.preferredSize.width = 55;

      var cbAutoW = g.add("checkbox", undefined, "");
      cbAutoW.preferredSize.width = 50;

      var ddBgSide = g.add("dropdownlist", undefined, ["L","R"]);
      ddBgSide.preferredSize.width = 50;

      var ddBgColor = g.add("dropdownlist", undefined, ["OR","RE","BR","YE"]);
      ddBgColor.preferredSize.width = 55;

      var cbDefBG = g.add("checkbox", undefined, "");
      cbDefBG.preferredSize.width = 65;

      var cbDealUnit = g.add("checkbox", undefined, "");
      cbDealUnit.preferredSize.width = 55;

      var cbUnit = g.add("checkbox", undefined, "");
      cbUnit.preferredSize.width = 45;

      var etPrice = g.add("edittext", undefined, "0");
      etPrice.preferredSize.width = 60;

      var etDealPrice = g.add("edittext", undefined, "0");
      etDealPrice.preferredSize.width = 55;

      var etDealQty = g.add("edittext", undefined, "0");
      etDealQty.preferredSize.width = 45;

      var ddType = g.add("dropdownlist", undefined, ["Regular","Deal"]);
      ddType.preferredSize.width = 55;

      var etAdd = g.add("edittext", undefined, "", { multiline:true });
      etAdd.preferredSize.width = 150;
      etAdd.preferredSize.height = 40;

      var etSub = g.add("edittext", undefined, "", { multiline:false });
      etSub.preferredSize.width = 120;

      var etMain = g.add("edittext", undefined, "", { multiline:false });
      etMain.preferredSize.width = 140;

      var stIdx = g.add("statictext", undefined, "" + i);
      stIdx.preferredSize.width = 25;

      var cbSel = g.add("checkbox", undefined, "");
      cbSel.preferredSize.width = 35;

      // ✅ Force default selections to avoid null selections on some AE versions
      safeSetSelection(ddWhite, 1);  // R
      cbAutoW.value = true;
      safeSetSelection(ddBgSide, 0); // L
      safeSetSelection(ddBgColor, 0); // OR
      cbDefBG.value = true;
      safeSetSelection(ddType, 0); // Regular

      function refreshEnabled() {
        // Guard selection existence
        if (!ddType.selection) safeSetSelection(ddType, 0);
        if (!ddWhite.selection) safeSetSelection(ddWhite, 1);
        if (!ddBgSide.selection) safeSetSelection(ddBgSide, 0);
        if (!ddBgColor.selection) safeSetSelection(ddBgColor, 0);

        var manualBG = !cbDefBG.value;
        ddBgColor.enabled = manualBG;
        ddBgSide.enabled  = manualBG;

        ddWhite.enabled = !cbAutoW.value;

        var isDeal = (ddType.selection && ddType.selection.index === 1);
        etDealQty.enabled = isDeal;
        etDealPrice.enabled = isDeal;
        cbDealUnit.enabled = isDeal;

        etPrice.enabled = true;
        cbUnit.enabled = true;
      }

      cbDefBG.onClick = refreshEnabled;
      cbAutoW.onClick = refreshEnabled;
      ddType.onChange = refreshEnabled;
      refreshEnabled();

      return {
        i:i, group:g,
        warn:stWarn,
        whiteWidth:ddWhite, useAutoWhite:cbAutoW,
        bgSide:ddBgSide, bgColor:ddBgColor, useDefaultBG:cbDefBG,
        showDealUnit:cbDealUnit, showUnit:cbUnit,
        priceValue:etPrice,
        dealPrice:etDealPrice,
        dealQty:etDealQty,
        priceType:ddType,
        add:etAdd, sub:etSub, main:etMain,
        idx:stIdx, sel:cbSel,
        refreshEnabled:refreshEnabled
      };
    }

    for (var i = 1; i <= MAX_PRODUCTS; i++) rowsUI.push(makeRow(i));

    function updateScrollbar() {
      var contentH = rowsHolder.size.height;
      var viewH = viewport.size.height - 20;
      var max = Math.max(0, contentH - viewH);
      sb.maxvalue = max;
      sb.value = Math.min(sb.value, max);
    }

    sb.onChanging = function() { rowsHolder.location = [rowsHolder.location[0], 6 - sb.value]; };

    pal.onResizing = pal.onResize = function() {
      this.layout.resize();
      updateScrollbar();
    };

    function uiToRow(u, existingRow) {
      var r = existingRow || new ProductRow(u.i);

      r.mainText = u.main.text;
      r.subText  = u.sub.text;
      r.addText  = u.add.text;

      // dropdown safe (Regular/Deal)
      r.priceType  = safeDropdownIndex(u.priceType, 0) + 1; // 1..2
      r.priceValue = clampNum(u.priceValue.text, 0, 99999, r.priceValue);

      r.dealQty    = clampNum(u.dealQty.text, 0, 999, r.dealQty);
      r.dealPrice  = clampNum(u.dealPrice.text, 0, 99999, r.dealPrice);

      r.showUnit     = toBool(u.showUnit.value);
      r.showDealUnit = toBool(u.showDealUnit.value);

      r.useDefaultBG  = toBool(u.useDefaultBG.value);

      // ✅ CRITICAL FIX (no null selection crash)
      r.bgColorManual = safeDropdownIndex(u.bgColor, (r.bgColorManual|0) - 1) + 1; // 1..4
      r.bgSideManual  = safeDropdownIndex(u.bgSide,  (r.bgSideManual|0)  - 1) + 1; // 1..2

      r.useAutoWhite  = toBool(u.useAutoWhite.value);
      r.whiteWidth    = safeDropdownIndex(u.whiteWidth, (r.whiteWidth|0) - 1) + 1; // 1..3

      r.warnOverflow = calcOverflowWarnForRow(u.i, r.mainText);

      return r;
    }

    function rowToUi(r, u) {
      u.main.text = r.mainText || "";
      u.sub.text  = r.subText || "";
      u.add.text  = r.addText || "";

      safeSetSelection(u.priceType, (r.priceType === 2) ? 1 : 0);

      u.priceValue.text = "" + (Math.round(r.priceValue * 1000) / 1000);
      u.dealQty.text    = "" + (Math.round(r.dealQty * 1000) / 1000);
      u.dealPrice.text  = "" + (Math.round(r.dealPrice * 1000) / 1000);

      u.showUnit.value     = !!r.showUnit;
      u.showDealUnit.value = !!r.showDealUnit;

      u.useDefaultBG.value = !!r.useDefaultBG;

      // ✅ guarded selections
      safeSetSelection(u.bgColor, Math.max(0, Math.min((u.bgColor.items.length||1)-1, (r.bgColorManual|0) - 1)));
      safeSetSelection(u.bgSide,  Math.max(0, Math.min((u.bgSide.items.length||1)-1,  (r.bgSideManual|0)  - 1)));

      u.useAutoWhite.value = !!r.useAutoWhite;
      safeSetSelection(u.whiteWidth, Math.max(0, Math.min((u.whiteWidth.items.length||1)-1, (r.whiteWidth|0) - 1)));

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
      pal.layout.layout(true);
      updateScrollbar();
    }

    function refreshWarningsVisibleOnly() {
      for (var i = 0; i < state.productCount; i++) {
        var idx = i + 1;
        var row = state.rows[idx-1];
        row.warnOverflow = calcOverflowWarnForRow(idx, row.mainText);
        rowsUI[idx-1].warn.text = row.warnOverflow ? "⚠️" : "";
      }
    }

    function onCountChanged() {
      state.productCount = clampInt(etCount.text, 1, MAX_PRODUCTS, 20);
      etCount.text = "" + state.productCount;
      applyProductCountToUI();
      for (var i = 1; i <= state.productCount; i++) {
        rowToUi(state.rows[i-1], rowsUI[i-1]);
      }
      refreshWarningsVisibleOnly();
    }

    etCount.onChange = onCountChanged;
    etCount.onDeactivate = onCountChanged;

    btnLoad.onClick = function() {
      app.beginUndoGroup("Load Campaign Data");
      try {
        for (var i = 1; i <= MAX_PRODUCTS; i++) {
          var res = readRowFromProject(i);
          if (res.ok) {
            state.rows[i-1] = res.row;
            state.rows[i-1].warnOverflow = calcOverflowWarnForRow(i, state.rows[i-1].mainText);
          }
        }

        for (var v = 1; v <= state.productCount; v++) {
          rowToUi(state.rows[v-1], rowsUI[v-1]);
        }
        refreshWarningsVisibleOnly();
      } catch (e) {
        alert("Load failed:\n" + e.toString());
      } finally {
        app.endUndoGroup();
      }
    };

    btnApply.onClick = function() {
      app.beginUndoGroup("Apply Campaign Data");
      try {
        for (var i = 1; i <= state.productCount; i++) {
          state.rows[i-1] = uiToRow(rowsUI[i-1], state.rows[i-1]);
          rowsUI[i-1].warn.text = state.rows[i-1].warnOverflow ? "⚠️" : "";
        }

        for (var a = 1; a <= state.productCount; a++) {
          applyRowToProject(a, state.rows[a-1]);
        }

      } catch (e) {
        alert("Apply failed:\n" + e.toString());
      } finally {
        app.endUndoGroup();
      }
    };

    // initial paint
    onCountChanged();

    pal.layout.layout(true);
    updateScrollbar();
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
