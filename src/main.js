import "./style.css";

const STORAGE_KEY = "russian-typing-settings-v4";

const DEFAULT_SETTINGS = {
  autoReplay: true,
  ignoreFormatting: true,
  practiceMode: "sentence",
  sentenceMode: "standard",
  alphabetMode: "random",
  soundEnabled: true,
  showGuide: true
};

const TIME_ATTACK = {
  maxGauge: 100,
  baseDrainPerSecond: 3.8,
  drainIncreasePerSentence: 0.9,
  recoverPerCorrect: 5.5,
  penaltyPerMistake: 12
};

const CYRILLIC_ALPHABET = [
  "а",
  "б",
  "в",
  "г",
  "д",
  "е",
  "ё",
  "ж",
  "з",
  "и",
  "й",
  "к",
  "л",
  "м",
  "н",
  "о",
  "п",
  "р",
  "с",
  "т",
  "у",
  "ф",
  "х",
  "ц",
  "ч",
  "ш",
  "щ",
  "ъ",
  "ы",
  "ь",
  "э",
  "ю",
  "я"
];

const KEYBOARD_ROWS = [
  {
    indent: 0,
    keys: [
      { code: "Backquote", primary: "ё", secondary: "`", width: 1 },
      { code: "Digit1", primary: "1", secondary: "!", width: 1 },
      { code: "Digit2", primary: "2", secondary: '"', width: 1 },
      { code: "Digit3", primary: "3", secondary: "№", width: 1 },
      { code: "Digit4", primary: "4", secondary: ";", width: 1 },
      { code: "Digit5", primary: "5", secondary: "%", width: 1 },
      { code: "Digit6", primary: "6", secondary: ":", width: 1 },
      { code: "Digit7", primary: "7", secondary: "?", width: 1 },
      { code: "Digit8", primary: "8", secondary: "*", width: 1 },
      { code: "Digit9", primary: "9", secondary: "(", width: 1 },
      { code: "Digit0", primary: "0", secondary: ")", width: 1 },
      { code: "Minus", primary: "-", secondary: "_", width: 1 },
      { code: "Equal", primary: "=", secondary: "+", width: 1 },
      { code: "Backspace", primary: "⌫", secondary: "削除", width: 2.1, special: true, action: "backspace" }
    ]
  },
  {
    indent: 18,
    keys: [
      { code: "Tab", primary: "Tab", width: 1.5, special: true, disabled: true },
      { code: "KeyQ", primary: "й", secondary: "Q", width: 1 },
      { code: "KeyW", primary: "ц", secondary: "W", width: 1 },
      { code: "KeyE", primary: "у", secondary: "E", width: 1 },
      { code: "KeyR", primary: "к", secondary: "R", width: 1 },
      { code: "KeyT", primary: "е", secondary: "T", width: 1 },
      { code: "KeyY", primary: "н", secondary: "Y", width: 1 },
      { code: "KeyU", primary: "г", secondary: "U", width: 1 },
      { code: "KeyI", primary: "ш", secondary: "I", width: 1 },
      { code: "KeyO", primary: "щ", secondary: "O", width: 1 },
      { code: "KeyP", primary: "з", secondary: "P", width: 1 },
      { code: "BracketLeft", primary: "х", secondary: "[", width: 1 },
      { code: "BracketRight", primary: "ъ", secondary: "]", width: 1 },
      { code: "Backslash", primary: "\\", secondary: "/", width: 1.4 }
    ]
  },
  {
    indent: 30,
    keys: [
      { code: "CapsLock", primary: "Caps", width: 1.7, special: true, disabled: true },
      { code: "KeyA", primary: "ф", secondary: "A", width: 1 },
      { code: "KeyS", primary: "ы", secondary: "S", width: 1 },
      { code: "KeyD", primary: "в", secondary: "D", width: 1 },
      { code: "KeyF", primary: "а", secondary: "F", width: 1 },
      { code: "KeyG", primary: "п", secondary: "G", width: 1 },
      { code: "KeyH", primary: "р", secondary: "H", width: 1 },
      { code: "KeyJ", primary: "о", secondary: "J", width: 1 },
      { code: "KeyK", primary: "л", secondary: "K", width: 1 },
      { code: "KeyL", primary: "д", secondary: "L", width: 1 },
      { code: "Semicolon", primary: "ж", secondary: ";", width: 1 },
      { code: "Quote", primary: "э", secondary: "'", width: 1 },
      { code: "Enter", primary: "↵", secondary: "次へ", width: 2.1, special: true, action: "next" }
    ]
  },
  {
    indent: 44,
    keys: [
      { code: "ShiftLeft", primary: "Shift", width: 2.2, special: true, action: "shift" },
      { code: "KeyZ", primary: "я", secondary: "Z", width: 1 },
      { code: "KeyX", primary: "ч", secondary: "X", width: 1 },
      { code: "KeyC", primary: "с", secondary: "C", width: 1 },
      { code: "KeyV", primary: "м", secondary: "V", width: 1 },
      { code: "KeyB", primary: "и", secondary: "B", width: 1 },
      { code: "KeyN", primary: "т", secondary: "N", width: 1 },
      { code: "KeyM", primary: "ь", secondary: "M", width: 1 },
      { code: "Comma", primary: "б", secondary: ",", width: 1 },
      { code: "Period", primary: "ю", secondary: ".", width: 1 },
      { code: "Slash", primary: ".", secondary: "/", width: 1 },
      { code: "ShiftRight", primary: "Shift", width: 2.6, special: true, action: "shift" }
    ]
  },
  {
    indent: 86,
    keys: [
      { code: "Space", primary: "空白", secondary: "␣", width: 8.2, special: true, action: "space" }
    ]
  }
];

const RUSSIAN_LAYOUT = {
  Backquote: { base: "ё", shift: "Ё" },
  Digit1: { base: "1", shift: "!" },
  Digit2: { base: "2", shift: '"' },
  Digit3: { base: "3", shift: "№" },
  Digit4: { base: "4", shift: ";" },
  Digit5: { base: "5", shift: "%" },
  Digit6: { base: "6", shift: ":" },
  Digit7: { base: "7", shift: "?" },
  Digit8: { base: "8", shift: "*" },
  Digit9: { base: "9", shift: "(" },
  Digit0: { base: "0", shift: ")" },
  Minus: { base: "-", shift: "_" },
  Equal: { base: "=", shift: "+" },
  KeyQ: { base: "й", shift: "Й" },
  KeyW: { base: "ц", shift: "Ц" },
  KeyE: { base: "у", shift: "У" },
  KeyR: { base: "к", shift: "К" },
  KeyT: { base: "е", shift: "Е" },
  KeyY: { base: "н", shift: "Н" },
  KeyU: { base: "г", shift: "Г" },
  KeyI: { base: "ш", shift: "Ш" },
  KeyO: { base: "щ", shift: "Щ" },
  KeyP: { base: "з", shift: "З" },
  BracketLeft: { base: "х", shift: "Х" },
  BracketRight: { base: "ъ", shift: "Ъ" },
  Backslash: { base: "\\", shift: "/" },
  KeyA: { base: "ф", shift: "Ф" },
  KeyS: { base: "ы", shift: "Ы" },
  KeyD: { base: "в", shift: "В" },
  KeyF: { base: "а", shift: "А" },
  KeyG: { base: "п", shift: "П" },
  KeyH: { base: "р", shift: "Р" },
  KeyJ: { base: "о", shift: "О" },
  KeyK: { base: "л", shift: "Л" },
  KeyL: { base: "д", shift: "Д" },
  Semicolon: { base: "ж", shift: "Ж" },
  Quote: { base: "э", shift: "Э" },
  KeyZ: { base: "я", shift: "Я" },
  KeyX: { base: "ч", shift: "Ч" },
  KeyC: { base: "с", shift: "С" },
  KeyV: { base: "м", shift: "М" },
  KeyB: { base: "и", shift: "И" },
  KeyN: { base: "т", shift: "Т" },
  KeyM: { base: "ь", shift: "Ь" },
  Comma: { base: "б", shift: "Б" },
  Period: { base: "ю", shift: "Ю" },
  Slash: { base: ".", shift: "," },
  Space: { base: " ", shift: " " }
};

function buildCharToKey(layout) {
  const result = new Map();
  for (const [code, value] of Object.entries(layout)) {
    result.set(value.base, { code, shift: false });
    if (value.shift && value.shift !== value.base) {
      result.set(value.shift, { code, shift: true });
    }
  }
  return result;
}

const RUSSIAN_CHAR_TO_KEY = buildCharToKey(RUSSIAN_LAYOUT);
class SoundEngine {
  constructor() {
    this.context = null;
  }

  ensureContext() {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) {
      return null;
    }
    if (!this.context) {
      this.context = new AudioContextCtor();
    }
    if (this.context.state === "suspended") {
      this.context.resume().catch(() => {});
    }
    return this.context;
  }

  pulse(type, settings) {
    if (!settings.soundEnabled) {
      return;
    }
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    const now = context.currentTime;
    const gain = context.createGain();
    gain.connect(context.destination);

    if (type === "wrong") {
      const osc = context.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.19);
      return;
    }

    const osc = context.createOscillator();
    osc.type = type === "complete" ? "sine" : "triangle";
    const startFreq = type === "complete" ? 900 : 420;
    const endFreq = type === "complete" ? 620 : 320;
    const duration = type === "complete" ? 0.12 : 0.045;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(type === "complete" ? 0.14 : 0.08, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }
}

function loadSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    const migrated = { ...parsed };
    if (!("ignoreFormatting" in migrated) && "caseSensitive" in migrated) {
      migrated.ignoreFormatting = !migrated.caseSensitive;
    }
    delete migrated.caseSensitive;
    return { ...DEFAULT_SETTINGS, ...migrated };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

const state = {
  settings: loadSettings(),
  datasetMeta: null,
  allSentences: [],
  alphabetEntries: [],
  availableSentenceSources: [],
  availableAlphabetSources: [],
  currentSource: null,
  currentChallenge: null,
  typedText: "",
  completedCount: 0,
  mistypedKeystrokes: 0,
  activeCodes: new Map(),
  settingsOpen: false,
  loading: true,
  flashMistake: false,
  virtualShift: false,
  lastMatchCode: "",
  lastMissCode: "",
  needsAudioUnlock: false,
  licenseOpen: false,
  timeAttack: {
    active: false,
    started: false,
    gameOver: false,
    gauge: TIME_ATTACK.maxGauge,
    elapsedMs: 0,
    sentencesCleared: 0,
    totalCorrectChars: 0,
    lastFrameTs: 0
  }
};

const audioPlayer = new Audio();
audioPlayer.preload = "none";
const audioPreloadCache = new Map();
const soundEngine = new SoundEngine();

const app = document.querySelector("#app");
app.innerHTML = `
  <div class="shell" id="captureSurface" tabindex="0">
    <header class="hud">
      <div class="hud-group hud-actions">
        <button id="replayButton" class="icon-button" type="button" aria-label="音声を再生">▶</button>
        <button id="nextButton" class="icon-button" type="button" aria-label="次の問題へ">↺</button>
        <button id="settingsButton" class="icon-button" type="button" aria-label="設定">⚙</button>
      </div>
      <div id="hudNotice" class="hud-notice" hidden>音声の自動再生を有効化するために再生ボタンを押してください</div>
      <div class="hud-group hud-stats">
        <div class="metric"><span id="datasetLabel">例文数</span><strong id="datasetCount">-</strong></div>
        <div class="metric"><span>完了</span><strong id="completedCount">0</strong></div>
        <div class="metric"><span>ミス</span><strong id="mistypedCount">0</strong></div>
      </div>
    </header>

    <aside id="settingsPanel" class="settings-panel" hidden>
      <div class="settings-head">
        <strong>設定</strong>
        <button id="closeSettingsButton" class="text-button" type="button">閉じる</button>
      </div>

      <label class="setting-row">
        <span>音声の自動再生</span>
        <input id="settingAutoReplay" type="checkbox" />
      </label>
      <label class="setting-row">
        <span>効果音</span>
        <input id="settingSoundEnabled" type="checkbox" />
      </label>
      <label class="setting-row">
        <span>文字の大小・句読点・スペースを無視</span>
        <input id="settingIgnoreFormatting" type="checkbox" />
      </label>
      <label class="setting-row">
        <span>キーガイドを表示</span>
        <input id="settingShowGuide" type="checkbox" />
      </label>

      <section class="setting-block">
        <span>練習モード</span>
        <div class="option-group" id="settingPracticeModeGroup">
          <button class="option-chip" type="button" data-setting-key="practiceMode" data-setting-value="sentence">例文入力</button>
          <button class="option-chip" type="button" data-setting-key="practiceMode" data-setting-value="alphabet">ロシア語アルファベット</button>
        </div>
      </section>

      <section class="setting-block" id="sentenceModeBlock">
        <span>例文モード</span>
        <div class="option-group" id="settingSentenceModeGroup">
          <button class="option-chip" type="button" data-setting-key="sentenceMode" data-setting-value="standard">通常</button>
          <button class="option-chip" type="button" data-setting-key="sentenceMode" data-setting-value="timeattack">タイムアタック</button>
        </div>
      </section>

      <section class="setting-block" id="alphabetModeBlock">
        <span>アルファベット順</span>
        <div class="option-group" id="settingAlphabetModeGroup">
          <button class="option-chip" type="button" data-setting-key="alphabetMode" data-setting-value="random">ランダム</button>
          <button class="option-chip" type="button" data-setting-key="alphabetMode" data-setting-value="ordered">順番</button>
        </div>
      </section>
    </aside>

    <main class="stage">
      <section class="sentence-panel">
        <div class="time-attack-strip" id="timeAttackStrip" hidden>
          <div class="gauge">
            <div class="gauge-fill" id="gaugeFill"></div>
          </div>
          <span class="timer-pill" id="timerInfo">00:00.0</span>
          <button id="timeAttackStartButton" class="start-button" type="button">開始</button>
        </div>
        <div class="sentence-scroll" id="sentenceScroll">
          <div id="sentenceTrack" class="sentence-track">
            <div id="sentenceDisplay" class="sentence-display"></div>
          </div>
          <p id="translation" class="translation"></p>
          <div class="stage-meta">
            <span id="progressInfo" class="meta-pill">0 / 0</span>
            <span id="modeInfo" class="meta-pill"></span>
            <button id="licenseButton" class="meta-pill meta-button" type="button">出典</button>
          </div>
        </div>
      </section>

      <section class="keyboard-panel">
        <div id="keyboard" class="keyboard"></div>
      </section>
    </main>

    <div id="gameOverOverlay" class="game-over-overlay" hidden>
      <div class="game-over-card">
        <strong>タイムアップ</strong>
        <p id="gameOverSummary" class="game-over-summary"></p>
        <button id="restartTimeAttackButton" class="restart-button" type="button">もう一度</button>
      </div>
    </div>

    <div id="licenseOverlay" class="license-overlay" hidden>
      <div id="licenseDialog" class="license-dialog" role="dialog" aria-modal="true" aria-labelledby="licenseDialogTitle">
        <div class="license-dialog-head">
          <strong id="licenseDialogTitle">ライセンス / 出典</strong>
          <button id="closeLicenseButton" class="text-button" type="button">閉じる</button>
        </div>
        <div id="licenseContent" class="license-content"></div>
      </div>
    </div>
  </div>
`;

const captureSurfaceNode = document.querySelector("#captureSurface");
const settingsPanelNode = document.querySelector("#settingsPanel");
const replayButtonNode = document.querySelector("#replayButton");
const nextButtonNode = document.querySelector("#nextButton");
const settingsButtonNode = document.querySelector("#settingsButton");
const closeSettingsButtonNode = document.querySelector("#closeSettingsButton");
const datasetLabelNode = document.querySelector("#datasetLabel");
const datasetCountNode = document.querySelector("#datasetCount");
const completedCountNode = document.querySelector("#completedCount");
const mistypedCountNode = document.querySelector("#mistypedCount");
const hudNoticeNode = document.querySelector("#hudNotice");
const sentenceScrollNode = document.querySelector("#sentenceScroll");
const sentenceTrackNode = document.querySelector("#sentenceTrack");
const sentenceDisplayNode = document.querySelector("#sentenceDisplay");
const translationNode = document.querySelector("#translation");
const progressInfoNode = document.querySelector("#progressInfo");
const modeInfoNode = document.querySelector("#modeInfo");
const licenseButtonNode = document.querySelector("#licenseButton");
const licenseOverlayNode = document.querySelector("#licenseOverlay");
const licenseDialogNode = document.querySelector("#licenseDialog");
const closeLicenseButtonNode = document.querySelector("#closeLicenseButton");
const licenseContentNode = document.querySelector("#licenseContent");
const keyboardNode = document.querySelector("#keyboard");
const settingAutoReplayNode = document.querySelector("#settingAutoReplay");
const settingSoundEnabledNode = document.querySelector("#settingSoundEnabled");
const settingIgnoreFormattingNode = document.querySelector("#settingIgnoreFormatting");
const settingShowGuideNode = document.querySelector("#settingShowGuide");
const sentenceModeBlockNode = document.querySelector("#sentenceModeBlock");
const alphabetModeBlockNode = document.querySelector("#alphabetModeBlock");
const timeAttackStripNode = document.querySelector("#timeAttackStrip");
const gaugeFillNode = document.querySelector("#gaugeFill");
const timerInfoNode = document.querySelector("#timerInfo");
const timeAttackStartButtonNode = document.querySelector("#timeAttackStartButton");
const gameOverOverlayNode = document.querySelector("#gameOverOverlay");
const gameOverSummaryNode = document.querySelector("#gameOverSummary");
const restartTimeAttackButtonNode = document.querySelector("#restartTimeAttackButton");

function shuffle(list) {
  const cloned = [...list];
  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]];
  }
  return cloned;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function resolveAudioUrl(audio) {
  if (!audio) {
    return "";
  }
  if (audio.kind === "static") {
    return audio.path;
  }
  return `https://tatoeba.org/audio/download/${audio.id}`;
}

function shouldIgnoreFormatting() {
  return state.settings.ignoreFormatting;
}

function isIgnorableOutput(output) {
  return shouldIgnoreFormatting() && /^[\p{P}\p{S}\s]+$/u.test(output);
}

function getPracticeCollectionSize() {
  return state.settings.practiceMode === "sentence"
    ? state.allSentences.length
    : state.alphabetEntries.length;
}

function getModeInfoLabel() {
  if (state.settings.practiceMode === "sentence") {
    return `例文 / ${isSentenceTimeAttack() ? "タイムアタック" : "通常"}`;
  }
  return `アルファベット / ${state.settings.alphabetMode === "ordered" ? "順番" : "ランダム"}`;
}

function formatElapsed(ms) {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const tenths = Math.floor((totalSeconds % 1) * 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

function isSentenceTimeAttack() {
  return state.settings.practiceMode === "sentence" && state.settings.sentenceMode === "timeattack";
}

function resetTimeAttackRun() {
  state.timeAttack.active = isSentenceTimeAttack();
  state.timeAttack.started = false;
  state.timeAttack.gameOver = false;
  state.timeAttack.gauge = TIME_ATTACK.maxGauge;
  state.timeAttack.elapsedMs = 0;
  state.timeAttack.sentencesCleared = 0;
  state.timeAttack.totalCorrectChars = 0;
  state.timeAttack.lastFrameTs = 0;
}

function runFrame(now) {
  if (
    isSentenceTimeAttack() &&
    state.timeAttack.active &&
    state.timeAttack.started &&
    !state.timeAttack.gameOver
  ) {
    if (state.settingsOpen || document.hidden) {
      state.timeAttack.lastFrameTs = now;
      requestAnimationFrame(runFrame);
      return;
    }
    if (!state.timeAttack.lastFrameTs) {
      state.timeAttack.lastFrameTs = now;
    }
    const deltaMs = now - state.timeAttack.lastFrameTs;
    state.timeAttack.lastFrameTs = now;
    state.timeAttack.elapsedMs += deltaMs;
    const drainRate =
      TIME_ATTACK.baseDrainPerSecond +
      state.timeAttack.sentencesCleared * TIME_ATTACK.drainIncreasePerSentence;
    state.timeAttack.gauge = Math.max(
      0,
      state.timeAttack.gauge - (deltaMs / 1000) * drainRate
    );
    if (state.timeAttack.gauge <= 0) {
      state.timeAttack.gameOver = true;
      gameOverSummaryNode.textContent = `正しい文字数 ${state.timeAttack.totalCorrectChars} / 経過時間 ${formatElapsed(state.timeAttack.elapsedMs)}`;
      render();
    } else {
      renderTimeAttack();
    }
  }
  requestAnimationFrame(runFrame);
}
requestAnimationFrame(runFrame);

function normalizeDisplayText(value) {
  return value
    .normalize("NFC")
    .replace(/[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g, " ")
    .replace(/[«»“”„‟]/g, '"')
    .replace(/[’‘`]/g, "'")
    .replace(/[—–−]/g, "-")
    .replace(/…/g, "...")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSourceText(value, ignoreFormatting) {
  let text = normalizeDisplayText(value);
  if (ignoreFormatting) {
    text = text.replace(/[^\p{L}\p{M}\p{N}]/gu, "");
  }
  return ignoreFormatting ? text : text.replace(/\s+/g, " ").trim();
}

function transformCharForTarget(char) {
  if (shouldIgnoreFormatting() && /\p{Script=Cyrillic}/u.test(char)) {
    return char.toLocaleLowerCase("ru-RU");
  }
  return char;
}

function buildDisplayUnits(displayText, rawSourceText) {
  const units = [];
  let rawIndex = 0;
  let targetIndex = 0;
  for (const char of displayText) {
    const sourceChar = rawSourceText[rawIndex];
    if (sourceChar === char) {
      const chunk = transformCharForTarget(sourceChar);
      units.push({ char, start: targetIndex, end: targetIndex + chunk.length });
      rawIndex += 1;
      targetIndex += chunk.length;
    } else {
      units.push({ char, start: null, end: null });
    }
  }
  return units;
}

function createSentenceSource(sentence) {
  const audioChoices =
    sentence.audios?.length > 0
      ? sentence.audios
      : (sentence.audioIds ?? []).map((id) => ({
          kind: "tatoeba",
          id,
          username: "",
          license: "",
          attributionUrl: ""
        }));

  return {
    kind: "sentence",
    sentence,
    translation: pickRandom(sentence.translations),
    audio: audioChoices.length > 0 ? pickRandom(audioChoices) : null
  };
}

function buildAlphabetSourceQueue() {
  const entries =
    state.settings.alphabetMode === "ordered"
      ? [...state.alphabetEntries]
      : shuffle(state.alphabetEntries);
  state.availableAlphabetSources = entries.map((entry) => ({
    kind: "alphabet",
    entry,
    letter: entry.letter,
    uppercase: Math.random() < 0.35,
    audio: entry.audioPath
      ? {
          kind: "static",
          path: entry.audioPath,
          sourcePageUrl: entry.sourcePageUrl,
          sourceFileName: entry.sourceFileName
        }
      : null
  }));
}

function createAlphabetSource() {
  if (state.availableAlphabetSources.length === 0) {
    buildAlphabetSourceQueue();
  }
  return state.availableAlphabetSources.shift() ?? null;
}

function getAlphabetHint() {
  return "";
}

function hydrateChallenge(source) {
  if (!source) {
    return null;
  }

  let displayText = "";
  let translation = "";
  let audio = null;

  if (source.kind === "sentence") {
    displayText = normalizeDisplayText(source.sentence.originalText);
    translation = source.translation;
    audio = source.audio;
  } else {
    displayText = source.uppercase ? source.letter.toUpperCase() : source.letter;
    translation = getAlphabetHint();
    audio = source.audio;
  }

  const rawSourceText = normalizeSourceText(displayText, shouldIgnoreFormatting());
  const targetText = [...rawSourceText].map(transformCharForTarget).join("");

  return {
    kind: source.kind,
    displayText,
    translation,
    audio,
    rawSourceText,
    targetText,
    displayUnits: buildDisplayUnits(displayText, rawSourceText)
  };
}

function getCurrentExpectedChar() {
  return state.currentChallenge?.targetText[state.typedText.length] ?? "";
}

function getExpectedKeyCodes() {
  if (!state.settings.showGuide) {
    return new Set();
  }
  const expectedChar = getCurrentExpectedChar();
  if (!expectedChar) {
    return new Set();
  }
  const map = RUSSIAN_CHAR_TO_KEY;
  const spec = map.get(expectedChar);
  if (!spec) {
    return new Set();
  }
  const set = new Set([spec.code]);
  if (spec.shift) {
    set.add("ShiftLeft");
    set.add("ShiftRight");
  }
  return set;
}

function mapCodeToOutput(code, shifted) {
  const layout = RUSSIAN_LAYOUT;
  const spec = layout[code];
  if (!spec) {
    return "";
  }
  let output = shifted && spec.shift ? spec.shift : spec.base;
  if (shouldIgnoreFormatting()) {
    if (/\p{Script=Cyrillic}/u.test(output)) {
      output = output.toLocaleLowerCase("ru-RU");
    }
  }
  return output;
}

function renderStats() {
  datasetLabelNode.textContent = state.settings.practiceMode === "sentence" ? "例文数" : "文字数";
  datasetCountNode.textContent = state.loading ? "..." : getPracticeCollectionSize().toLocaleString();
  completedCountNode.textContent = state.completedCount.toLocaleString();
  mistypedCountNode.textContent = state.mistypedKeystrokes.toLocaleString();
}

function renderAudioUnlockNotice() {
  const hasAudio = Boolean(state.currentChallenge?.audio);
  const shouldShow = state.settings.autoReplay && hasAudio && state.needsAudioUnlock;
  hudNoticeNode.hidden = !shouldShow;
  replayButtonNode.classList.toggle("needs-attention", shouldShow);
}

function syncSentenceScrollLayout() {
  if (!sentenceScrollNode) {
    return;
  }

  const shouldCenter =
    hudNoticeNode.hidden &&
    sentenceScrollNode.scrollHeight <= sentenceScrollNode.clientHeight + 1;

  sentenceScrollNode.classList.toggle("is-centered", shouldCenter);
}

function isCompactViewport() {
  return window.matchMedia("(max-width: 760px), (max-height: 760px)").matches;
}

function renderTimeAttack() {
  const enabled = isSentenceTimeAttack();
  timeAttackStripNode.hidden = !enabled;
  gameOverOverlayNode.hidden = !state.timeAttack.gameOver;
  if (!enabled) {
    return;
  }
  gaugeFillNode.style.width = `${Math.max(0, Math.min(100, state.timeAttack.gauge))}%`;
  timerInfoNode.textContent = formatElapsed(state.timeAttack.elapsedMs);
  timeAttackStartButtonNode.hidden = state.timeAttack.started || state.timeAttack.gameOver;
}

function renderChallengeText() {
  if (!state.currentChallenge) {
    sentenceDisplayNode.textContent = "読み込み中...";
    translationNode.hidden = true;
    progressInfoNode.textContent = "0 / 0";
    modeInfoNode.textContent = "";
    sentenceScrollNode.scrollTo({ top: 0 });
    sentenceTrackNode.scrollTo({ left: 0 });
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const unit of state.currentChallenge.displayUnits) {
    const node = document.createElement("span");
    node.className = "sentence-char";
    node.textContent = unit.char === " " ? "\u00A0" : unit.char;
    if (unit.start === null) {
      node.classList.add("ignored");
    } else if (state.typedText.length >= unit.end) {
      node.classList.add("correct");
    } else if (state.typedText.length >= unit.start) {
      node.classList.add(state.flashMistake ? "mistake" : "current");
    } else {
      node.classList.add("pending");
    }
    fragment.appendChild(node);
  }
  sentenceDisplayNode.replaceChildren(fragment);

  translationNode.textContent = state.currentChallenge.translation;
  translationNode.hidden = !state.currentChallenge.translation;
  progressInfoNode.textContent = `${state.typedText.length} / ${state.currentChallenge.targetText.length}`;
  modeInfoNode.textContent = getModeInfoLabel();
  requestAnimationFrame(scrollCurrentTextIntoView);
}

function scrollCurrentTextIntoView() {
  if (!sentenceScrollNode || !sentenceTrackNode || !state.currentChallenge) {
    return;
  }

  syncSentenceScrollLayout();

  const activeNode =
    sentenceDisplayNode.querySelector(".sentence-char.current, .sentence-char.mistake") ??
    sentenceDisplayNode.querySelector(".sentence-char.pending") ??
    sentenceDisplayNode.querySelector(".sentence-char:last-child");

  if (!activeNode) {
    return;
  }

  const trackRect = sentenceTrackNode.getBoundingClientRect();
  const activeRect = activeNode.getBoundingClientRect();
  const maxScrollLeft = Math.max(0, sentenceTrackNode.scrollWidth - sentenceTrackNode.clientWidth);
  const activeCenter =
    sentenceTrackNode.scrollLeft +
    (activeRect.left - trackRect.left) +
    activeRect.width / 2;
  const centeredLeft = Math.max(
    0,
    Math.min(maxScrollLeft, activeCenter - sentenceTrackNode.clientWidth / 2)
  );

  if (isCompactViewport()) {
    const currentCenterLeft = sentenceTrackNode.scrollLeft + sentenceTrackNode.clientWidth / 2;
    const distanceFromCenter = Math.abs(activeCenter - currentCenterLeft);
    const centerTolerance = Math.max(24, sentenceTrackNode.clientWidth * 0.12);
    if (distanceFromCenter > centerTolerance) {
      sentenceTrackNode.scrollTo({
        left: centeredLeft,
        behavior: "auto"
      });
    }
  } else {
    const leftPadding = 24;
    const rightPadding = 40;

    if (activeRect.left < trackRect.left + leftPadding) {
      sentenceTrackNode.scrollTo({
        left: Math.max(
          0,
          sentenceTrackNode.scrollLeft + (activeRect.left - trackRect.left) - leftPadding
        ),
        behavior: "auto"
      });
    } else if (activeRect.right > trackRect.right - rightPadding) {
      sentenceTrackNode.scrollTo({
        left:
          sentenceTrackNode.scrollLeft +
          (activeRect.right - trackRect.right) +
          rightPadding,
        behavior: "auto"
      });
    }
  }

  const scrollerRect = sentenceScrollNode.getBoundingClientRect();
  const topPadding = 20;
  const bottomPadding = 28;

  if (
    activeRect.top >= scrollerRect.top + topPadding &&
    activeRect.bottom <= scrollerRect.bottom - bottomPadding
  ) {
    return;
  }

  const targetTop =
    sentenceScrollNode.scrollTop +
    (activeRect.top - scrollerRect.top) -
    sentenceScrollNode.clientHeight * 0.35;

  sentenceScrollNode.scrollTo({
    top: Math.max(0, targetTop),
    behavior: "auto"
  });
}

function renderKeyboard() {
  const expectedCodes = getExpectedKeyCodes();
  const expectedChar = getCurrentExpectedChar();
  const expectedMap = RUSSIAN_CHAR_TO_KEY;
  const expectedSpec = expectedMap.get(expectedChar);
  const shiftHeld = state.activeCodes.has("ShiftLeft") || state.activeCodes.has("ShiftRight") || state.virtualShift;

  keyboardNode.innerHTML = "";
  for (const row of KEYBOARD_ROWS) {
    const rowNode = document.createElement("div");
    rowNode.className = "keyboard-row";
    rowNode.style.setProperty("--row-indent", `${row.indent}px`);
    rowNode.style.paddingLeft = `calc(var(--row-indent) * var(--keyboard-indent-scale, 1))`;

    for (const key of row.keys) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "key";
      button.dataset.code = key.code;
      if (key.action) {
        button.dataset.action = key.action;
      }
      if (key.disabled) {
        button.dataset.disabled = "true";
      }
      button.style.setProperty("--key-width", key.width);

      const isExpected = expectedCodes.has(key.code);
      const isShiftKey = key.code === "ShiftLeft" || key.code === "ShiftRight";
      const isPressed = state.activeCodes.has(key.code) || (state.virtualShift && isShiftKey);
      const isMatch = key.code === state.lastMatchCode;
      const isMiss = key.code === state.lastMissCode;

      if (key.special) {
        button.classList.add("special");
      }
      if (key.disabled) {
        button.classList.add("disabled");
      }
      if (isExpected) {
        button.classList.add("expected");
      }
      if (isMatch) {
        button.classList.add("pressed-match");
      } else if (isMiss) {
        button.classList.add("pressed-miss");
      }

      const secondary = document.createElement("span");
      secondary.className = "key-secondary";
      secondary.textContent = key.secondary ?? "";
      if (!key.secondary) {
        secondary.classList.add("empty");
      }

      const primary = document.createElement("span");
      primary.className = "key-primary";
      primary.textContent = key.primary;

      button.appendChild(secondary);
      button.appendChild(primary);
      rowNode.appendChild(button);
    }

    keyboardNode.appendChild(rowNode);
  }
}

function setOptionGroupValue(settingKey, value) {
  for (const node of document.querySelectorAll(`[data-setting-key="${settingKey}"]`)) {
    node.classList.toggle("active", node.dataset.settingValue === value);
  }
}

function renderSettings() {
  settingsPanelNode.hidden = !state.settingsOpen;
  settingAutoReplayNode.checked = state.settings.autoReplay;
  settingSoundEnabledNode.checked = state.settings.soundEnabled;
  settingIgnoreFormattingNode.checked = state.settings.ignoreFormatting;
  settingShowGuideNode.checked = state.settings.showGuide;
  setOptionGroupValue("practiceMode", state.settings.practiceMode);
  setOptionGroupValue("sentenceMode", state.settings.sentenceMode);
  setOptionGroupValue("alphabetMode", state.settings.alphabetMode);
  sentenceModeBlockNode.hidden = state.settings.practiceMode !== "sentence";
  alphabetModeBlockNode.hidden = state.settings.practiceMode !== "alphabet";
}

function renderLicenseModal() {
  licenseOverlayNode.hidden = !state.licenseOpen;
}

function createLicenseLink(label, url) {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = label;
  return link;
}

function appendLicenseLine(container, label, value) {
  const row = document.createElement("p");
  row.className = "license-line";
  const strong = document.createElement("strong");
  strong.textContent = `${label}: `;
  row.appendChild(strong);
  row.append(value);
  container.appendChild(row);
}

function renderLicenseInfo() {
  if (!licenseContentNode || !state.currentChallenge) {
    return;
  }

  const fragment = document.createDocumentFragment();
  const licensing = state.datasetMeta?.licensing;

  if (state.currentChallenge.kind === "sentence") {
    const textLineValue = document.createDocumentFragment();
    if (licensing?.text?.sourceUrl) {
      textLineValue.appendChild(
        createLicenseLink(licensing.text.sourceName ?? "Tatoeba", licensing.text.sourceUrl)
      );
    } else {
      textLineValue.append(licensing?.text?.sourceName ?? "Tatoeba");
    }
    textLineValue.append(` / ${licensing?.text?.licenseName ?? "CC BY 2.0 FR"}`);
    appendLicenseLine(fragment, "例文提供", textLineValue);

    const sentenceLinkValue = document.createDocumentFragment();
    const sentencePageUrl =
      state.currentSource?.sentence?.sentencePageUrl ??
      `https://tatoeba.org/en/sentences/show/${state.currentSource?.sentence?.id ?? ""}`;
    sentenceLinkValue.appendChild(
      createLicenseLink(`#${state.currentSource?.sentence?.id ?? ""}`, sentencePageUrl)
    );
    appendLicenseLine(fragment, "現在の文", sentenceLinkValue);

    const currentAudio = state.currentChallenge.audio;
    if (currentAudio?.kind === "tatoeba") {
      const audioValue = `${currentAudio.username || "Tatoeba user"} / ${
        currentAudio.license || "ライセンス情報なし"
      }`;
      appendLicenseLine(fragment, "音声提供", audioValue);

      if (currentAudio.attributionUrl) {
        const audioLinkValue = document.createDocumentFragment();
        audioLinkValue.appendChild(
          createLicenseLink("attribution URL", currentAudio.attributionUrl)
        );
        appendLicenseLine(fragment, "音声データ", audioLinkValue);
      } else if (currentAudio.id) {
        const audioLinkValue = document.createDocumentFragment();
        audioLinkValue.appendChild(
          createLicenseLink(
            `audio #${currentAudio.id}`,
            `https://tatoeba.org/audio/download/${currentAudio.id}`
          )
        );
        appendLicenseLine(fragment, "音声データ", audioLinkValue);
      }
    }
  } else {
    const alphabetValue = document.createDocumentFragment();
    if (state.currentChallenge.audio?.sourcePageUrl) {
      alphabetValue.appendChild(
        createLicenseLink("Wikimedia Commons", state.currentChallenge.audio.sourcePageUrl)
      );
    } else if (licensing?.alphabet?.sourceUrl) {
      alphabetValue.appendChild(
        createLicenseLink(licensing.alphabet.sourceName ?? "Wikimedia Commons", licensing.alphabet.sourceUrl)
      );
    } else {
      alphabetValue.append("Wikimedia Commons");
    }
      appendLicenseLine(fragment, "音声提供", alphabetValue);

    if (state.currentChallenge.audio?.sourceFileName) {
      appendLicenseLine(fragment, "音声データ", state.currentChallenge.audio.sourceFileName);
    }
  }

  if (state.currentChallenge.kind === "sentence" && licensing?.audio?.faqUrl) {
    const faq = document.createElement("p");
    faq.className = "license-note";
    faq.append("詳細: ");
    faq.appendChild(createLicenseLink("Tatoeba FAQ", licensing.audio.faqUrl));
    fragment.appendChild(faq);
  }

  licenseContentNode.replaceChildren(fragment);
}

function toggleLicenseModal(force) {
  state.licenseOpen = force ?? !state.licenseOpen;
  renderLicenseModal();
}

function render() {
  renderStats();
  renderChallengeText();
  renderTimeAttack();
  renderAudioUnlockNotice();
  renderLicenseInfo();
  renderLicenseModal();
  renderKeyboard();
  renderSettings();
}

function focusCaptureSurface() {
  captureSurfaceNode.focus({ preventScroll: true });
}

async function playCurrentAudio() {
  const url = resolveAudioUrl(state.currentChallenge?.audio);
  if (!url) {
    state.needsAudioUnlock = false;
    renderAudioUnlockNotice();
    return true;
  }
  audioPlayer.src = url;
  audioPlayer.currentTime = 0;
  try {
    await audioPlayer.play();
    state.needsAudioUnlock = false;
    renderAudioUnlockNotice();
    return true;
  } catch (error) {
    if (state.settings.autoReplay) {
      state.needsAudioUnlock = true;
      renderAudioUnlockNotice();
    }
    return false;
  }
}

function primeAudio(audioSource) {
  const url = resolveAudioUrl(audioSource);
  if (!url || audioPreloadCache.has(url)) {
    return;
  }
  const preloader = new Audio();
  preloader.preload = "auto";
  preloader.src = url;
  preloader.load();
  audioPreloadCache.set(url, preloader);
}

function primeUpcomingAudio() {
  if (state.currentChallenge?.audio) {
    primeAudio(state.currentChallenge.audio);
  }
  const upcomingSources =
    state.settings.practiceMode === "sentence"
      ? state.availableSentenceSources.slice(0, 2)
      : state.availableAlphabetSources.slice(0, 2);
  for (const source of upcomingSources) {
    primeAudio(source.audio);
  }
}

function resetProgress() {
  state.typedText = "";
  state.activeCodes.clear();
  state.flashMistake = false;
  state.virtualShift = false;
  state.lastMatchCode = "";
  state.lastMissCode = "";
}

function buildSentenceQueue() {
  state.availableSentenceSources = shuffle(state.allSentences.map(createSentenceSource));
}

function startNewRunIfNeeded() {
  if (isSentenceTimeAttack()) {
    resetTimeAttackRun();
  } else {
    state.timeAttack.active = false;
    state.timeAttack.started = false;
    state.timeAttack.gameOver = false;
  }
}

function loadNextChallenge({ preserveRun = false } = {}) {
  if (state.settings.practiceMode === "alphabet") {
    state.currentSource = createAlphabetSource();
  } else {
    if (state.availableSentenceSources.length === 0) {
      buildSentenceQueue();
    }
    state.currentSource = state.availableSentenceSources.shift() ?? null;
  }

  if (!preserveRun) {
    startNewRunIfNeeded();
  }
  state.currentChallenge = hydrateChallenge(state.currentSource);
  resetProgress();
  primeUpcomingAudio();
  render();
  focusCaptureSurface();

  if (state.settings.autoReplay) {
    void playCurrentAudio();
  }
}

function rebuildCurrentChallenge({ preserveRun = false } = {}) {
  if (!state.currentSource) {
    return;
  }
  if (!preserveRun) {
    startNewRunIfNeeded();
  }
  state.currentChallenge = hydrateChallenge(state.currentSource);
  resetProgress();
  primeUpcomingAudio();
  render();
  focusCaptureSurface();
}

let completionTimer = 0;
let flashTimer = 0;
let virtualKeyTimer = 0;

function handleCompletion() {
  window.clearTimeout(completionTimer);
  state.completedCount += 1;
  if (isSentenceTimeAttack()) {
    state.timeAttack.sentencesCleared += 1;
  }
  soundEngine.pulse("complete", state.settings);
  renderStats();
  completionTimer = window.setTimeout(() => {
    loadNextChallenge({ preserveRun: isSentenceTimeAttack() });
  }, 320);
}

function startTimeAttack() {
  if (!isSentenceTimeAttack() || state.timeAttack.gameOver || state.timeAttack.started) {
    return;
  }
  state.timeAttack.started = true;
  state.timeAttack.lastFrameTs = performance.now();
  renderTimeAttack();
}

function flashMistake() {
  window.clearTimeout(flashTimer);
  state.flashMistake = true;
  render();
  flashTimer = window.setTimeout(() => {
    state.flashMistake = false;
    render();
  }, 150);
}

function markVirtualPress(code, output = "") {
  window.clearTimeout(virtualKeyTimer);
  state.activeCodes.set(code, output);
  render();
  virtualKeyTimer = window.setTimeout(() => {
    state.activeCodes.delete(code);
    if (state.lastMatchCode === code) {
      state.lastMatchCode = "";
    }
    if (state.lastMissCode === code) {
      state.lastMissCode = "";
    }
    render();
  }, 110);
}

function acceptCorrectInput(output) {
  const willComplete = state.typedText.length + output.length === state.currentChallenge.targetText.length;
  state.typedText += output;
  state.flashMistake = false;
  if (isSentenceTimeAttack()) {
    state.timeAttack.gauge = Math.min(
      TIME_ATTACK.maxGauge,
      state.timeAttack.gauge + TIME_ATTACK.recoverPerCorrect
    );
    state.timeAttack.totalCorrectChars += output.length;
  }
  if (!willComplete && state.settings.practiceMode === "sentence") {
    soundEngine.pulse("tick", state.settings);
  }
  render();
  if (state.typedText === state.currentChallenge.targetText) {
    handleCompletion();
  }
}

function handleWrongInput() {
  state.mistypedKeystrokes += 1;
  if (isSentenceTimeAttack()) {
    state.timeAttack.gauge = Math.max(0, state.timeAttack.gauge - TIME_ATTACK.penaltyPerMistake);
    if (state.timeAttack.gauge === 0) {
      state.timeAttack.gameOver = true;
      gameOverSummaryNode.textContent = `正しい文字数 ${state.timeAttack.totalCorrectChars} / 経過時間 ${formatElapsed(state.timeAttack.elapsedMs)}`;
    }
  }
  soundEngine.pulse("wrong", state.settings);
  flashMistake();
  renderStats();
}

function processInput(output, code) {
  if (
    !state.currentChallenge ||
    state.timeAttack.gameOver ||
    (isSentenceTimeAttack() && !state.timeAttack.started)
  ) {
    return;
  }

  const expectedChar = getCurrentExpectedChar();
  if (!expectedChar) {
    return;
  }

  if (isIgnorableOutput(output)) {
    state.lastMatchCode = "";
    state.lastMissCode = "";
    markVirtualPress(code, output);
    return;
  }

  if (output === expectedChar) {
    state.lastMatchCode = code;
    state.lastMissCode = "";
    markVirtualPress(code, output);
    acceptCorrectInput(output);
    return;
  }

  state.lastMatchCode = "";
  state.lastMissCode = code;
  markVirtualPress(code, output);
  handleWrongInput();
}

function handleVirtualAction(action, code) {
  if (state.timeAttack.gameOver) {
    return;
  }
  if (isSentenceTimeAttack() && !state.timeAttack.started && action !== "next") {
    startTimeAttack();
  }
  if (action === "shift") {
    state.virtualShift = !state.virtualShift;
    render();
    return;
  }
  if (action === "backspace") {
    state.typedText = state.typedText.slice(0, -1);
    state.virtualShift = false;
    markVirtualPress(code, "");
    return;
  }
  if (action === "next") {
    loadNextChallenge({ preserveRun: isSentenceTimeAttack() });
    return;
  }
  if (action === "space") {
    const output = mapCodeToOutput(code, state.virtualShift);
    processInput(output, code);
    state.virtualShift = false;
    return;
  }
}

function isInteractiveTarget(target) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLButtonElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

function toggleSettings(force) {
  state.settingsOpen = force ?? !state.settingsOpen;
  renderSettings();
}

function applySetting(key, value) {
  const previous = { ...state.settings };
  state.settings = { ...state.settings, [key]: value };
  saveSettings(state.settings);

  const resetRun =
    key === "practiceMode" ||
    key === "sentenceMode" ||
    key === "alphabetMode" ||
    key === "ignoreFormatting";

  if (key === "practiceMode") {
    if (value === "alphabet") {
      state.availableAlphabetSources = [];
    }
    loadNextChallenge();
    return;
  }

  if (
    (key === "sentenceMode" && previous.sentenceMode !== value) ||
    (key === "alphabetMode" && previous.alphabetMode !== value)
  ) {
    if (key === "alphabetMode") {
      state.availableAlphabetSources = [];
    }
    loadNextChallenge();
    return;
  }

  if (resetRun) {
    rebuildCurrentChallenge();
    return;
  }

  render();
}

function handleKeydown(event) {
  if (!state.currentChallenge || state.timeAttack.gameOver) {
    return;
  }
  if (isInteractiveTarget(event.target)) {
    return;
  }
  if (state.settingsOpen) {
    if (event.key === "Escape") {
      toggleSettings(false);
      focusCaptureSurface();
    }
    return;
  }
  if (state.licenseOpen) {
    if (event.key === "Escape") {
      toggleLicenseModal(false);
      focusCaptureSurface();
    }
    return;
  }
  if (event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    if (isSentenceTimeAttack() && !state.timeAttack.started) {
      startTimeAttack();
      return;
    }
    loadNextChallenge({ preserveRun: isSentenceTimeAttack() });
    return;
  }

  if (event.key === "Backspace") {
    event.preventDefault();
    state.typedText = state.typedText.slice(0, -1);
    render();
    return;
  }

  if (event.key === "Shift") {
    state.activeCodes.set(event.code, "Shift");
    render();
    return;
  }

  const output = mapCodeToOutput(event.code, event.shiftKey);
  if (!output) {
    return;
  }
  event.preventDefault();
  state.activeCodes.set(event.code, output);
  processInput(output, event.code);
}

function handleKeyup(event) {
  state.activeCodes.delete(event.code);
  if (state.lastMatchCode === event.code) {
    state.lastMatchCode = "";
  }
  if (state.lastMissCode === event.code) {
    state.lastMissCode = "";
  }
  render();
}

captureSurfaceNode.addEventListener("pointerdown", () => {
  window.setTimeout(() => focusCaptureSurface(), 0);
});

settingsPanelNode.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
});

settingsPanelNode.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("pointerdown", (event) => {
  if (
    state.settingsOpen &&
    !settingsPanelNode.contains(event.target) &&
    event.target !== settingsButtonNode
  ) {
    toggleSettings(false);
  }
});

window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);

replayButtonNode.addEventListener("click", () => {
  soundEngine.ensureContext();
  focusCaptureSurface();
  void playCurrentAudio();
});

nextButtonNode.addEventListener("click", () => {
  soundEngine.ensureContext();
  focusCaptureSurface();
  loadNextChallenge({ preserveRun: isSentenceTimeAttack() });
});

timeAttackStartButtonNode.addEventListener("click", () => {
  soundEngine.ensureContext();
  focusCaptureSurface();
  startTimeAttack();
});

settingsButtonNode.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleSettings();
});

closeSettingsButtonNode.addEventListener("click", () => {
  toggleSettings(false);
  focusCaptureSurface();
});

licenseButtonNode.addEventListener("click", () => {
  toggleLicenseModal(true);
});

closeLicenseButtonNode.addEventListener("click", () => {
  toggleLicenseModal(false);
  focusCaptureSurface();
});

licenseOverlayNode.addEventListener("click", (event) => {
  if (event.target === licenseOverlayNode) {
    toggleLicenseModal(false);
    focusCaptureSurface();
  }
});

licenseDialogNode.addEventListener("click", (event) => {
  event.stopPropagation();
});

restartTimeAttackButtonNode.addEventListener("click", () => {
  resetTimeAttackRun();
  buildSentenceQueue();
  loadNextChallenge({ preserveRun: true });
});

settingAutoReplayNode.addEventListener("change", (event) => {
  applySetting("autoReplay", event.currentTarget.checked);
});

settingSoundEnabledNode.addEventListener("change", (event) => {
  applySetting("soundEnabled", event.currentTarget.checked);
});

settingIgnoreFormattingNode.addEventListener("change", (event) => {
  applySetting("ignoreFormatting", event.currentTarget.checked);
});

settingShowGuideNode.addEventListener("change", (event) => {
  applySetting("showGuide", event.currentTarget.checked);
});

for (const node of document.querySelectorAll(".option-chip")) {
  node.addEventListener("click", () => {
    const key = node.dataset.settingKey;
    const value = node.dataset.settingValue;
    if (!key || !value) {
      return;
    }
    applySetting(key, value);
  });
}

keyboardNode.addEventListener("click", (event) => {
  const keyNode = event.target.closest(".key");
  if (!keyNode || keyNode.dataset.disabled === "true") {
    return;
  }
  soundEngine.ensureContext();
  focusCaptureSurface();

  const { code, action } = keyNode.dataset;
  if (!code) {
    return;
  }
  if (action) {
    handleVirtualAction(action, code);
    return;
  }
  const output = mapCodeToOutput(code, state.virtualShift);
  processInput(output, code);
  state.virtualShift = false;
});

async function loadDataset() {
  try {
    const response = await fetch("/data/sentences.json");
    if (!response.ok) {
      throw new Error(`Failed to load dataset: ${response.status}`);
    }
    const payload = await response.json();
    state.allSentences = payload.sentences;
    state.alphabetEntries = payload.alphabet ?? CYRILLIC_ALPHABET.map((letter) => ({ letter }));
    state.datasetMeta = payload;
    state.loading = false;
    buildSentenceQueue();
    buildAlphabetSourceQueue();
    loadNextChallenge();
  } catch (error) {
    state.loading = false;
    sentenceDisplayNode.textContent = "データを読み込めませんでした";
    translationNode.textContent = error instanceof Error ? error.message : String(error);
    translationNode.hidden = false;
    renderStats();
    renderSettings();
  }
}

render();
loadDataset();
