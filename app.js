// King AI — Prompt Builder
(function(){
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  const tabs = $$('.tab');
  const voBlock = $('#voBlock');
  const logoBlock = $('#logoBlock');
  const outputs = $('#outputs');

  const modeInputs = $$('input[name="mode"]');
  const yearSpan = $('#year');
  yearSpan.textContent = new Date().getFullYear();

  // Theme toggle
  const themeToggle = $('#themeToggle');
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
  });

  // Helper to escape quotes in VO line
  const esc = (s) => (s || '').replace(/"/g, '\"');

  // Tabs (visual only; real switch by radio)
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.target;
      if(target === '#videoTab'){ $('#modeVideo').checked = true; showBlocks('video'); }
      if(target === '#imageTab'){ $('#modeImage').checked = true; showBlocks('image'); }
      if(target === '#logoTab'){ $('#modeLogo').checked = true; showBlocks('logo'); }
      window.location.hash = '#builder';
    });
  });

  // Radio change
  modeInputs.forEach(r => r.addEventListener('change', e => showBlocks(e.target.value)));

  function showBlocks(mode){
    if(mode === 'video'){
      voBlock.classList.remove('hidden');
      logoBlock.classList.add('hidden');
    } else if(mode === 'image'){
      voBlock.classList.add('hidden');
      logoBlock.classList.add('hidden');
    } else {
      voBlock.classList.add('hidden');
      logoBlock.classList.remove('hidden');
    }
  }
  showBlocks('video');

  // Presets
  const presetData = {
    cinematicNight: {
      scene: "A cinematic night street in Cairo with neon reflections on wet asphalt, passing cars, moody atmosphere",
      style: "cinematic, hyperrealistic, gritty",
      lighting: "neon glow, rim light, volumetric fog",
      camera: "50mm lens, shallow depth of field, handheld feel",
      ratio: "9:16",
      quality: "4K, high bitrate",
      arabicVO: "يا مساء الفل! في الفيديو ده هنشوف جمال القاهرة بليل وإزاي النيون عامل أجواء خطيرة.",
      dialect: "Egyptian Arabic",
      duration: 30,
      beat: 8,
      brandName: "KING AI",
      brandTraits: "bold, modern, premium",
      brandColors: "black, white, royal gold",
      brandUses: "social media avatar, intro bumper"
    },
    productStudio: {
      scene: "A premium product on a glossy reflective surface with soft gradient background and subtle fog",
      style: "studio, premium, minimal",
      lighting: "softbox lighting, edge light",
      camera: "85mm lens, macro details",
      ratio: "1:1",
      quality: "UHD, crisp details"
    },
    docInterview: {
      scene: "A calm documentary interview setup with a person centered, soft background bokeh, subtle camera movement",
      style: "documentary, realistic",
      lighting: "soft key, fill light, warm practicals",
      camera: "35mm lens, slow dolly",
      ratio: "16:9",
      quality: "4K",
      arabicVO: "هنتكلم ببساطة عن الفكرة وخطوات التنفيذ، واحدة واحدة لحد ما نوصل لنتيجة احترافية.",
      dialect: "Modern Standard Arabic",
      duration: 60,
      beat: 8
    },
    flatLogo: {
      scene: "A clean flat logomark built from geometric shapes, high contrast, easily readable at small sizes",
      style: "flat, minimal, geometric",
      lighting: "n/a",
      camera: "n/a",
      ratio: "1:1",
      quality: "vector-friendly",
      brandName: "KING AI",
      brandTraits: "bold, modern, tech-forward",
      brandColors: "black, white, royal gold",
      brandUses: "app icon, social avatar, website header"
    }
  };

  $('#fillPreset').addEventListener('click', () => {
    const key = $('#preset').value;
    if(!key || !presetData[key]) return;
    const p = presetData[key];
    for(const k in p){
      const el = document.getElementById(k);
      if(!el) continue;
      if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'){
        el.value = p[k];
      }
    }
  });

  // Generate prompts
  $('#generate').addEventListener('click', () => {
    const mode = $$('input[name="mode"]').find(r => r.checked).value;
    const scene = $('#scene').value.trim();
    const negative = $('#negative').value.trim();
    const style = $('#style').value.trim();
    const lighting = $('#lighting').value.trim();
    const camera = $('#camera').value.trim();
    const ratio = $('#ratio').value.trim();
    const quality = $('#quality').value.trim();

    const arabicVO = $('#arabicVO').value.trim();
    const dialect = $('#dialect').value.trim();
    const duration = $('#duration').value.trim();
    const beat = $('#beat').value.trim();

    const brandName = $('#brandName').value.trim();
    const brandTraits = $('#brandTraits').value.trim();
    const brandColors = $('#brandColors').value.trim();
    const brandUses = $('#brandUses').value.trim();

    if(!scene){
      alert('من فضلك اكتب وصف المشهد/الفكرة بالإنجليزية.');
      return;
    }

    // Universal core
    const parts = [];
    parts.push(scene);
    if(style) parts.push(`style: ${style}`);
    if(lighting) parts.push(`lighting: ${lighting}`);
    if(camera) parts.push(`camera: ${camera}`);
    if(ratio) parts.push(`aspect ratio: ${ratio}`);
    if(quality) parts.push(`quality: ${quality}`);
    if(negative) parts.push(`NEGATIVE: ${negative}`);

    let universal = parts.join(' | ');

    // Mode-specific enrichments
    if(mode === 'video'){
      const videoMeta = [];
      if(duration) videoMeta.push(`duration ~${duration}s`);
      if(beat) videoMeta.push(`cut every ${beat}s`);
      if(videoMeta.length) universal += ` | ${videoMeta.join(' | ')}`;
      if(arabicVO){
        const voline = `Voice-over in Arabic (${dialect || 'Egyptian'}): "${esc(arabicVO)}"`;
        universal += ` | ${voline}`;
      }
    } else if(mode === 'logo'){
      const logoMeta = [];
      if(brandName) logoMeta.push(`brand: ${brandName}`);
      if(brandTraits) logoMeta.push(`traits: ${brandTraits}`);
      if(brandColors) logoMeta.push(`colors: ${brandColors}`);
      if(brandUses) logoMeta.push(`use cases: ${brandUses}`);
      if(logoMeta.length) universal += ` | ${logoMeta.join(' | ')}`;
      universal += " | vector, clean edges, high contrast, legible at small size";
    }

    // Platform variants
    let mj = universal;
    if(mode !== 'logo'){
      mj += " --stylize 300 --v 6.0";
      if(ratio) mj += ` --ar ${ratio.replace(/\s/g,'')}`;
    } else {
      mj += " --v 6.0 --no background photo, mockups";
      if(ratio) mj += ` --ar ${ratio.replace(/\s/g,'')}`;
    }

    let runway = "";
    if(mode === 'video'){
      runway = [
        "VIDEO PROMPT (Runway/Pika):",
        universal,
        "Motion: natural camera movement, smooth transitions",
        "Output: high bitrate, clean edges"
      ].join("\n");
    } else {
      runway = "For video tools: switch mode to 'Video' to include motion and VO directives.";
    }

    let logoOut = "";
    if(mode === 'logo'){
      logoOut = [
        "LOGO PROMPT (Vector-first):",
        universal,
        "Deliverables: SVG/AI vector, transparent background, mono + full-color variants"
      ].join("\n");
    } else {
      logoOut = "For logo tools: switch mode to 'Logo' to include brand directives.";
    }

    // Write to DOM
    $('#universalOut').value = universal;
    $('#mjOut').value = mj;
    $('#runwayOut').value = runway;
    $('#logoOut').value = logoOut;

    outputs.classList.remove('hidden');
  });

  // Copy buttons
  $$('.copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const area = document.querySelector(btn.dataset.copy);
      area.select();
      document.execCommand('copy');
      btn.textContent = 'تم النسخ ✓';
      setTimeout(()=> btn.textContent = 'نسخ', 1200);
    });
  });

  // Export ZIP (informational only for this static bundle)
  $('#exportBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    alert('استخدم الملف king-ai-prompt-builder.zip المرفق للتحميل المباشر.');
  });

})();