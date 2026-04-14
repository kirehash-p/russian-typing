import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  createReadStream,
  mkdtempSync,
  rmSync,
  readdirSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from "node:fs";
import path from "node:path";
import os from "node:os";
import readline from "node:readline";

const ROOT_DIR = process.cwd();
const DEFAULT_CONFIG_PATH = path.join(ROOT_DIR, "dataset.config.json");
const JSON_OUTPUT = path.join(ROOT_DIR, "public", "data", "sentences.json");
const TSV_OUTPUT = path.join(ROOT_DIR, "generated", "ru-ja-audio-sentences.tsv");
const ALPHABET_AUDIO_OUTPUT_DIR = path.join(
  ROOT_DIR,
  "public",
  "static",
  "audio",
  "alphabet"
);
const AUTO_TRANSLATION_SOURCE_DIRS = [
  ROOT_DIR,
  path.join(ROOT_DIR, "data-source"),
  path.join(ROOT_DIR, "corpus")
];

const DEFAULT_CONFIG = {
  cacheDir: path.join(".cache", "build-dataset"),
  forceDownload: false,
  sources: {
    translationPairsSource: "",
    audioSource: "",
    tatoebaCustomExportFrom: "rus",
    tatoebaCustomExportTo: "jpn",
    tatoebaDownloadsPage: "https://tatoeba.org/ja/downloads",
    sentencesArchive: "https://downloads.tatoeba.org/exports/sentences.tar.bz2",
    linksArchive: "https://downloads.tatoeba.org/exports/links.tar.bz2",
    audioArchive: "https://downloads.tatoeba.org/exports/sentences_with_audio.tar.bz2",
    alphabetAudioDir: ""
  }
};

const ALPHABET_AUDIO_MANIFEST = [
  { letter: "а", uppercase: "А", wikimediaFileName: "Ru-01-буква-А.ogg", localFileName: "01.ogg" },
  { letter: "б", uppercase: "Б", wikimediaFileName: "Ru-02-буква-Б.ogg", localFileName: "02.ogg" },
  { letter: "в", uppercase: "В", wikimediaFileName: "Ru-03-буква-В.ogg", localFileName: "03.ogg" },
  { letter: "г", uppercase: "Г", wikimediaFileName: "Ru-04-буква-Г.ogg", localFileName: "04.ogg" },
  { letter: "д", uppercase: "Д", wikimediaFileName: "Ru-05-буква-Д.ogg", localFileName: "05.ogg" },
  { letter: "е", uppercase: "Е", wikimediaFileName: "Ru-06-буква-Е.ogg", localFileName: "06.ogg" },
  { letter: "ё", uppercase: "Ё", wikimediaFileName: "Ru-07-буква-Ё.ogg", localFileName: "07.ogg" },
  { letter: "ж", uppercase: "Ж", wikimediaFileName: "Ru-08-буква-Ж.ogg", localFileName: "08.ogg" },
  { letter: "з", uppercase: "З", wikimediaFileName: "Ru-09-буква-З.ogg", localFileName: "09.ogg" },
  { letter: "и", uppercase: "И", wikimediaFileName: "Ru-10-буква-И.ogg", localFileName: "10.ogg" },
  { letter: "й", uppercase: "Й", wikimediaFileName: "Ru-11-буква-Й.ogg", localFileName: "11.ogg" },
  { letter: "к", uppercase: "К", wikimediaFileName: "Ru-12-буква-К.ogg", localFileName: "12.ogg" },
  { letter: "л", uppercase: "Л", wikimediaFileName: "Ru-13-буква-Л.ogg", localFileName: "13.ogg" },
  { letter: "м", uppercase: "М", wikimediaFileName: "Ru-14-буква-М.ogg", localFileName: "14.ogg" },
  { letter: "н", uppercase: "Н", wikimediaFileName: "Ru-15-буква-Н.ogg", localFileName: "15.ogg" },
  { letter: "о", uppercase: "О", wikimediaFileName: "Ru-16-буква-О.ogg", localFileName: "16.ogg" },
  { letter: "п", uppercase: "П", wikimediaFileName: "Ru-17-буква-П.ogg", localFileName: "17.ogg" },
  { letter: "р", uppercase: "Р", wikimediaFileName: "Ru-18-буква-Р.ogg", localFileName: "18.ogg" },
  { letter: "с", uppercase: "С", wikimediaFileName: "Ru-19-буква-С.ogg", localFileName: "19.ogg" },
  { letter: "т", uppercase: "Т", wikimediaFileName: "Ru-20-буква-Т.ogg", localFileName: "20.ogg" },
  { letter: "у", uppercase: "У", wikimediaFileName: "Ru-21-буква-У.ogg", localFileName: "21.ogg" },
  { letter: "ф", uppercase: "Ф", wikimediaFileName: "Ru-22-буква-Ф.ogg", localFileName: "22.ogg" },
  { letter: "х", uppercase: "Х", wikimediaFileName: "Ru-23-буква-Х.ogg", localFileName: "23.ogg" },
  { letter: "ц", uppercase: "Ц", wikimediaFileName: "Ru-24-буква-Ц.ogg", localFileName: "24.ogg" },
  { letter: "ч", uppercase: "Ч", wikimediaFileName: "Ru-25-буква-Ч.ogg", localFileName: "25.ogg" },
  { letter: "ш", uppercase: "Ш", wikimediaFileName: "Ru-26-буква-Ш.ogg", localFileName: "26.ogg" },
  { letter: "щ", uppercase: "Щ", wikimediaFileName: "Ru-27-буква-Щ.ogg", localFileName: "27.ogg" },
  { letter: "ъ", uppercase: "Ъ", wikimediaFileName: "Ru-28-буква-Ъ.ogg", localFileName: "28.ogg" },
  { letter: "ы", uppercase: "Ы", wikimediaFileName: "Ru-29-буква-Ы.ogg", localFileName: "29.ogg" },
  { letter: "ь", uppercase: "Ь", wikimediaFileName: "Ru-30-буква-Ь.ogg", localFileName: "30.ogg" },
  { letter: "э", uppercase: "Э", wikimediaFileName: "Ru-31-буква-Э.ogg", localFileName: "31.ogg" },
  { letter: "ю", uppercase: "Ю", wikimediaFileName: "Ru-32-буква-Ю.ogg", localFileName: "32.ogg" },
  { letter: "я", uppercase: "Я", wikimediaFileName: "Ru-33-буква-Я.ogg", localFileName: "33.ogg" }
];

const CHAR_TO_KEY = new Map([
  ["ё", { code: "Backquote", shift: false }],
  ["Ё", { code: "Backquote", shift: true }],
  ["1", { code: "Digit1", shift: false }],
  ["!", { code: "Digit1", shift: true }],
  ["2", { code: "Digit2", shift: false }],
  ['"', { code: "Digit2", shift: true }],
  ["3", { code: "Digit3", shift: false }],
  ["№", { code: "Digit3", shift: true }],
  ["4", { code: "Digit4", shift: false }],
  [";", { code: "Digit4", shift: true }],
  ["5", { code: "Digit5", shift: false }],
  ["%", { code: "Digit5", shift: true }],
  ["6", { code: "Digit6", shift: false }],
  [":", { code: "Digit6", shift: true }],
  ["7", { code: "Digit7", shift: false }],
  ["?", { code: "Digit7", shift: true }],
  ["8", { code: "Digit8", shift: false }],
  ["*", { code: "Digit8", shift: true }],
  ["9", { code: "Digit9", shift: false }],
  ["(", { code: "Digit9", shift: true }],
  ["0", { code: "Digit0", shift: false }],
  [")", { code: "Digit0", shift: true }],
  ["-", { code: "Minus", shift: false }],
  ["_", { code: "Minus", shift: true }],
  ["=", { code: "Equal", shift: false }],
  ["+", { code: "Equal", shift: true }],
  ["й", { code: "KeyQ", shift: false }],
  ["Й", { code: "KeyQ", shift: true }],
  ["ц", { code: "KeyW", shift: false }],
  ["Ц", { code: "KeyW", shift: true }],
  ["у", { code: "KeyE", shift: false }],
  ["У", { code: "KeyE", shift: true }],
  ["к", { code: "KeyR", shift: false }],
  ["К", { code: "KeyR", shift: true }],
  ["е", { code: "KeyT", shift: false }],
  ["Е", { code: "KeyT", shift: true }],
  ["н", { code: "KeyY", shift: false }],
  ["Н", { code: "KeyY", shift: true }],
  ["г", { code: "KeyU", shift: false }],
  ["Г", { code: "KeyU", shift: true }],
  ["ш", { code: "KeyI", shift: false }],
  ["Ш", { code: "KeyI", shift: true }],
  ["щ", { code: "KeyO", shift: false }],
  ["Щ", { code: "KeyO", shift: true }],
  ["з", { code: "KeyP", shift: false }],
  ["З", { code: "KeyP", shift: true }],
  ["х", { code: "BracketLeft", shift: false }],
  ["Х", { code: "BracketLeft", shift: true }],
  ["ъ", { code: "BracketRight", shift: false }],
  ["Ъ", { code: "BracketRight", shift: true }],
  ["ф", { code: "KeyA", shift: false }],
  ["Ф", { code: "KeyA", shift: true }],
  ["ы", { code: "KeyS", shift: false }],
  ["Ы", { code: "KeyS", shift: true }],
  ["в", { code: "KeyD", shift: false }],
  ["В", { code: "KeyD", shift: true }],
  ["а", { code: "KeyF", shift: false }],
  ["А", { code: "KeyF", shift: true }],
  ["п", { code: "KeyG", shift: false }],
  ["П", { code: "KeyG", shift: true }],
  ["р", { code: "KeyH", shift: false }],
  ["Р", { code: "KeyH", shift: true }],
  ["о", { code: "KeyJ", shift: false }],
  ["О", { code: "KeyJ", shift: true }],
  ["л", { code: "KeyK", shift: false }],
  ["Л", { code: "KeyK", shift: true }],
  ["д", { code: "KeyL", shift: false }],
  ["Д", { code: "KeyL", shift: true }],
  ["ж", { code: "Semicolon", shift: false }],
  ["Ж", { code: "Semicolon", shift: true }],
  ["э", { code: "Quote", shift: false }],
  ["Э", { code: "Quote", shift: true }],
  ["я", { code: "KeyZ", shift: false }],
  ["Я", { code: "KeyZ", shift: true }],
  ["ч", { code: "KeyX", shift: false }],
  ["Ч", { code: "KeyX", shift: true }],
  ["с", { code: "KeyC", shift: false }],
  ["С", { code: "KeyC", shift: true }],
  ["м", { code: "KeyV", shift: false }],
  ["М", { code: "KeyV", shift: true }],
  ["и", { code: "KeyB", shift: false }],
  ["И", { code: "KeyB", shift: true }],
  ["т", { code: "KeyN", shift: false }],
  ["Т", { code: "KeyN", shift: true }],
  ["ь", { code: "KeyM", shift: false }],
  ["Ь", { code: "KeyM", shift: true }],
  ["б", { code: "Comma", shift: false }],
  ["Б", { code: "Comma", shift: true }],
  ["ю", { code: "Period", shift: false }],
  ["Ю", { code: "Period", shift: true }],
  [".", { code: "Slash", shift: false }],
  [",", { code: "Slash", shift: true }],
  [" ", { code: "Space", shift: false }]
]);

function parseArgs(argv) {
  const args = {
    configPath: DEFAULT_CONFIG_PATH,
    forceDownload: false,
    overrides: {}
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];
    if (token === "--config" && next) {
      args.configPath = path.resolve(ROOT_DIR, next);
      index += 1;
      continue;
    }
    if (token === "--force-download") {
      args.forceDownload = true;
      continue;
    }
    if (token === "--translation-source" && next) {
      args.overrides.translationPairsSource = next;
      index += 1;
      continue;
    }
    if (token === "--audio-source" && next) {
      args.overrides.audioSource = next;
      index += 1;
      continue;
    }
    if (token === "--tatoeba-from" && next) {
      args.overrides.tatoebaCustomExportFrom = next;
      index += 1;
      continue;
    }
    if (token === "--tatoeba-to" && next) {
      args.overrides.tatoebaCustomExportTo = next;
      index += 1;
      continue;
    }
    if (token === "--sentences-archive" && next) {
      args.overrides.sentencesArchive = next;
      index += 1;
      continue;
    }
    if (token === "--links-archive" && next) {
      args.overrides.linksArchive = next;
      index += 1;
      continue;
    }
    if (token === "--audio-archive" && next) {
      args.overrides.audioArchive = next;
      index += 1;
      continue;
    }
    if (token === "--alphabet-audio-dir" && next) {
      args.overrides.alphabetAudioDir = next;
      index += 1;
    }
  }

  return args;
}

function stripBom(value) {
  return value.replace(/^\uFEFF/, "");
}

function tsvEscape(value) {
  return String(value ?? "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function isUrl(value) {
  return /^https?:\/\//i.test(value);
}

function extractWikimediaFileName(value) {
  if (!value) {
    throw new Error("Empty Wikimedia file reference");
  }

  if (!isUrl(value)) {
    return value;
  }

  const url = new URL(value);
  if (!/commons\.wikimedia\.org$/i.test(url.hostname)) {
    throw new Error(`Unsupported Wikimedia host: ${url.hostname}`);
  }

  const decodedPath = decodeURIComponent(url.pathname);
  const wikiMatch = decodedPath.match(/\/wiki\/File:(.+)$/);
  if (wikiMatch) {
    return wikiMatch[1];
  }

  const redirectMatch = decodedPath.match(/\/wiki\/Special:(?:Redirect\/file|FilePath)\/(.+)$/);
  if (redirectMatch) {
    return redirectMatch[1];
  }

  throw new Error(`Unsupported Wikimedia file URL: ${value}`);
}

function buildWikimediaDownloadUrl(fileReference) {
  const fileName = extractWikimediaFileName(fileReference);
  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}`;
}

function toAbsolutePath(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.resolve(ROOT_DIR, filePath);
}

function readOptionalConfig(configPath) {
  if (!existsSync(configPath)) {
    return {};
  }
  return JSON.parse(readFileSync(configPath, "utf8"));
}

function mergeConfig(baseConfig, fileConfig, cliArgs) {
  return {
    ...baseConfig,
    ...fileConfig,
    forceDownload: baseConfig.forceDownload || fileConfig.forceDownload || cliArgs.forceDownload,
    sources: {
      ...baseConfig.sources,
      ...(fileConfig.sources ?? {}),
      ...Object.fromEntries(
        Object.entries(cliArgs.overrides).map(([key, value]) => [key, value ? value : ""])
      )
    }
  };
}

function normalizeTypingText(value, { ignoreFormatting }) {
  let text = value
    .normalize("NFC")
    .replace(/[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g, " ")
    .replace(/[«»“”„‟]/g, '"')
    .replace(/[’‘`]/g, "'")
    .replace(/[—–−]/g, "-")
    .replace(/…/g, "...");

  if (ignoreFormatting) {
    text = text.replace(/[^\p{L}\p{M}\p{N}]/gu, "");
  } else {
    text = text.replace(/\s+/g, " ").trim();
  }

  return text;
}

function looksLikeTatoebaTranslationPairsFile(fileName) {
  if (path.extname(fileName).toLowerCase() !== ".tsv") {
    return false;
  }
  return /(?:sentence[_ -]?pairs|translation[_ -]?pairs|例文の組み合わせ|ロシア語.*日本語|日本語.*ロシア語|rus.*jpn|jpn.*rus)/i.test(
    fileName
  );
}

function findAutoTranslationPairsSource() {
  const candidates = [];

  for (const directoryPath of AUTO_TRANSLATION_SOURCE_DIRS) {
    if (!existsSync(directoryPath)) {
      continue;
    }

    for (const entry of readdirSync(directoryPath, { withFileTypes: true })) {
      if (!entry.isFile() || !looksLikeTatoebaTranslationPairsFile(entry.name)) {
        continue;
      }

      const absolutePath = path.join(directoryPath, entry.name);
      const relativePath = path.relative(ROOT_DIR, absolutePath);
      if (relativePath.startsWith("generated") || relativePath.startsWith(".cache")) {
        continue;
      }

      candidates.push({
        absolutePath,
        mtimeMs: statSync(absolutePath).mtimeMs
      });
    }
  }

  candidates.sort((left, right) => right.mtimeMs - left.mtimeMs);
  return candidates[0]?.absolutePath ?? "";
}

function isTypeable(text) {
  if (!text) {
    return false;
  }

  for (const char of text) {
    if (!CHAR_TO_KEY.has(char)) {
      return false;
    }
  }

  return true;
}

async function downloadFile(url, destinationPath, { retries = 5, timeoutMs = 600000 } = {}) {
  mkdirSync(path.dirname(destinationPath), { recursive: true });
  execFileSync(
    "curl",
    [
      "-fsSL",
      "--retry",
      String(retries),
      "--retry-delay",
      "2",
      "--retry-all-errors",
      "--connect-timeout",
      "15",
      "--max-time",
      String(Math.ceil(timeoutMs / 1000)),
      "-A",
      "russian-typing-dataset-builder/1.0",
      "-o",
      destinationPath,
      url
    ],
    {
      stdio: "inherit"
    }
  );
}

async function ensureLocalSource(source, cacheDir, { forceDownload = false, fileName = "" } = {}) {
  if (!source) {
    return "";
  }

  if (!isUrl(source)) {
    const absolutePath = toAbsolutePath(source);
    if (!existsSync(absolutePath)) {
      throw new Error(`Source file not found: ${absolutePath}`);
    }
    return absolutePath;
  }

  const url = new URL(source);
  const resolvedFileName = fileName || path.basename(url.pathname) || "download.dat";
  const destinationPath = path.join(cacheDir, "downloads", resolvedFileName);
  if (!existsSync(destinationPath) || forceDownload) {
    await downloadFile(source, destinationPath);
  }
  return destinationPath;
}

function ensureExtractedCsv(archivePath, extractDir, memberName) {
  const destinationPath = path.join(extractDir, memberName);
  if (existsSync(destinationPath)) {
    return destinationPath;
  }

  mkdirSync(extractDir, { recursive: true });
  try {
    execFileSync("tar", ["-xjf", archivePath, "-C", extractDir, memberName], {
      stdio: "inherit"
    });
  } catch (error) {
    rmSync(destinationPath, { force: true });
    throw error;
  }
  return destinationPath;
}

async function ensureCsvFromSource(source, cacheDir, options) {
  let localPath = await ensureLocalSource(source, cacheDir, options);
  if (!localPath) {
    return "";
  }
  if (localPath.endsWith(".tar.bz2")) {
    try {
      return ensureExtractedCsv(localPath, path.join(cacheDir, "extracted"), options.memberName);
    } catch (error) {
      if (!isUrl(source)) {
        throw error;
      }
      rmSync(localPath, { force: true });
      localPath = await ensureLocalSource(source, cacheDir, { ...options, forceDownload: true });
      return ensureExtractedCsv(localPath, path.join(cacheDir, "extracted"), options.memberName);
    }
  }
  return localPath;
}

function buildSentenceRecord(id, originalText) {
  const typingText = normalizeTypingText(originalText, { ignoreFormatting: true });
  const exactTypingText = normalizeTypingText(originalText, { ignoreFormatting: false });

  if (!isTypeable(typingText) || !isTypeable(exactTypingText)) {
    return null;
  }

  return {
    id,
    originalText,
    typingText,
    exactTypingText,
    translations: new Set(),
    audioIds: new Set()
  };
}

async function loadCustomTranslationPairs(translationPairsPath) {
  const sentenceMap = new Map();
  const rl = readline.createInterface({
    input: createReadStream(translationPairsPath, { encoding: "utf8" }),
    crlfDelay: Infinity
  });

  for await (const rawLine of rl) {
    const line = stripBom(rawLine);
    if (!line) {
      continue;
    }

    const [ruId, originalText, _jaId, jaText] = line.split("\t");
    if (!ruId || !originalText || !jaText) {
      continue;
    }

    let entry = sentenceMap.get(ruId);
    if (!entry) {
      entry = buildSentenceRecord(ruId, originalText);
      if (!entry) {
        continue;
      }
      sentenceMap.set(ruId, entry);
    }

    entry.translations.add(jaText.trim());
  }

  return sentenceMap;
}

async function loadRelevantSentences(sentencesPath) {
  const russianTexts = new Map();
  const japaneseTexts = new Map();
  const rl = readline.createInterface({
    input: createReadStream(sentencesPath, { encoding: "utf8" }),
    crlfDelay: Infinity
  });

  for await (const rawLine of rl) {
    const line = stripBom(rawLine);
    if (!line) {
      continue;
    }

    const [id, lang, text] = line.split("\t");
    if (!id || !lang || !text) {
      continue;
    }

    if (lang === "rus") {
      russianTexts.set(id, text);
    } else if (lang === "jpn") {
      japaneseTexts.set(id, text);
    }
  }

  return { russianTexts, japaneseTexts };
}

async function buildSentenceMapFromWeeklyExports(sentencesPath, linksPath) {
  const { russianTexts, japaneseTexts } = await loadRelevantSentences(sentencesPath);
  const sentenceMap = new Map();
  const invalidRussianIds = new Set();
  const rl = readline.createInterface({
    input: createReadStream(linksPath, { encoding: "utf8" }),
    crlfDelay: Infinity
  });

  for await (const rawLine of rl) {
    const line = stripBom(rawLine);
    if (!line) {
      continue;
    }

    const [leftId, rightId] = line.split("\t");
    if (!leftId || !rightId) {
      continue;
    }

    let ruId = "";
    let jaId = "";
    if (russianTexts.has(leftId) && japaneseTexts.has(rightId)) {
      ruId = leftId;
      jaId = rightId;
    } else if (russianTexts.has(rightId) && japaneseTexts.has(leftId)) {
      ruId = rightId;
      jaId = leftId;
    } else {
      continue;
    }

    if (invalidRussianIds.has(ruId)) {
      continue;
    }

    let entry = sentenceMap.get(ruId);
    if (!entry) {
      entry = buildSentenceRecord(ruId, russianTexts.get(ruId));
      if (!entry) {
        invalidRussianIds.add(ruId);
        continue;
      }
      sentenceMap.set(ruId, entry);
    }

    entry.translations.add(japaneseTexts.get(jaId).trim());
  }

  return sentenceMap;
}

async function attachAudio(sentenceMap, audioPath) {
  if (!audioPath) {
    return;
  }

  const rl = readline.createInterface({
    input: createReadStream(audioPath, { encoding: "utf8" }),
    crlfDelay: Infinity
  });

  for await (const rawLine of rl) {
    const line = stripBom(rawLine);
    if (!line) {
      continue;
    }

    const [sentenceId, audioId] = line.split("\t");
    if (!sentenceId || !audioId) {
      continue;
    }

    const entry = sentenceMap.get(sentenceId);
    if (entry) {
      entry.audioIds.add(audioId);
    }
  }
}

function findAlphabetAudioSource(directoryPath, entry) {
  const absoluteDir = toAbsolutePath(directoryPath);
  const candidates = [
    path.join(absoluteDir, entry.localFileName),
    path.join(absoluteDir, entry.wikimediaFileName)
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(`Alphabet audio file not found for ${entry.letter}: ${absoluteDir}`);
}

async function prepareAlphabetAudio(config) {
  mkdirSync(ALPHABET_AUDIO_OUTPUT_DIR, { recursive: true });

  const alphabetEntries = [];
  for (const entry of ALPHABET_AUDIO_MANIFEST) {
    const destinationPath = path.join(ALPHABET_AUDIO_OUTPUT_DIR, entry.localFileName);

    if (config.sources.alphabetAudioDir) {
      const localSourcePath = findAlphabetAudioSource(config.sources.alphabetAudioDir, entry);
      if (!existsSync(destinationPath) || config.forceDownload) {
        copyFileSync(localSourcePath, destinationPath);
      }
    } else if (!existsSync(destinationPath) || config.forceDownload) {
      const url = buildWikimediaDownloadUrl(entry.wikimediaFileName);
      await downloadFile(url, destinationPath);
    }

    alphabetEntries.push({
      letter: entry.letter,
      uppercase: entry.uppercase,
      audioPath: `/static/audio/alphabet/${entry.localFileName}`,
      sourceFileName: entry.wikimediaFileName,
      sourcePageUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(entry.wikimediaFileName)}`
    });
  }

  return alphabetEntries;
}

function finalizeRecords(sentenceMap) {
  return [...sentenceMap.values()]
    .filter((entry) => entry.audioIds.size > 0 && entry.translations.size > 0)
    .sort((left, right) => Number(left.id) - Number(right.id))
    .map((entry) => ({
      id: entry.id,
      originalText: entry.originalText,
      typingText: entry.typingText,
      exactTypingText: entry.exactTypingText,
      translations: [...entry.translations],
      audioIds: [...entry.audioIds]
    }));
}

function parseCookieFileValue(cookieFilePath, cookieName) {
  const lines = readFileSync(cookieFilePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.startsWith("#")) {
      continue;
    }
    const parts = line.split("\t");
    if (parts.length < 7) {
      continue;
    }
    if (parts[5] === cookieName) {
      return parts[6];
    }
  }
  return "";
}

function runCurlJson(args) {
  const output = execFileSync("curl", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"]
  });
  return output;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function downloadTatoebaCustomExport(config, cacheDir) {
  const from = config.sources.tatoebaCustomExportFrom || "rus";
  const to = config.sources.tatoebaCustomExportTo || "jpn";
  const downloadsPage = config.sources.tatoebaDownloadsPage || "https://tatoeba.org/ja/downloads";
  const exportFileName = `sentence_pairs_${from}_${to}.tsv`;
  const outputPath = path.join(cacheDir, "downloads", exportFileName);

  if (existsSync(outputPath) && !config.forceDownload) {
    return outputPath;
  }

  mkdirSync(path.dirname(outputPath), { recursive: true });
  const tempDir = mkdtempSync(path.join(os.tmpdir(), "tatoeba-export-"));
  const cookieJarPath = path.join(tempDir, "cookies.txt");

  try {
    execFileSync(
      "curl",
      [
        "-fsSL",
        "-A",
        "russian-typing-dataset-builder/1.0",
        "-c",
        cookieJarPath,
        downloadsPage
      ],
      { stdio: "ignore" }
    );

    const csrfToken = parseCookieFileValue(cookieJarPath, "csrfToken");
    if (!csrfToken) {
      throw new Error("Failed to obtain csrfToken from Tatoeba downloads page");
    }

    const payload = JSON.stringify({
      type: "pairs",
      fields: ["id", "text", "trans_id", "trans_text"],
      format: "tsv",
      from,
      to
    });

    const addResponseText = runCurlJson([
      "-fsSL",
      "-A",
      "russian-typing-dataset-builder/1.0",
      "-b",
      cookieJarPath,
      "-c",
      cookieJarPath,
      "-H",
      "content-type: application/json;charset=UTF-8",
      "-H",
      `x-csrf-token: ${csrfToken}`,
      "-H",
      "x-requested-with: XMLHttpRequest",
      "-H",
      "origin: https://tatoeba.org",
      "-H",
      `referer: ${downloadsPage}`,
      "--data-raw",
      payload,
      "https://tatoeba.org/exports/add"
    ]);
    const addResponse = JSON.parse(addResponseText);
    const exportId = addResponse.export?.id;
    if (!exportId) {
      throw new Error(`Unexpected Tatoeba add export response: ${addResponseText}`);
    }

    let exportInfo = addResponse.export;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const getResponseText = runCurlJson([
        "-fsSL",
        "-A",
        "russian-typing-dataset-builder/1.0",
        "-b",
        cookieJarPath,
        "-c",
        cookieJarPath,
        "-H",
        "x-requested-with: XMLHttpRequest",
        "-H",
        `referer: ${downloadsPage}`,
        `https://tatoeba.org/exports/get/${exportId}`
      ]);
      exportInfo = JSON.parse(getResponseText).export;

      if (exportInfo?.status === "online") {
        break;
      }
      if (exportInfo?.status === "failed") {
        throw new Error(`Tatoeba custom export failed for ${from}->${to}`);
      }
      await sleep(2000);
    }

    if (exportInfo?.status !== "online" || !exportInfo.pretty_filename) {
      throw new Error(`Timed out waiting for Tatoeba export ${exportId}`);
    }

    execFileSync(
      "curl",
      [
        "-fsSL",
        "-A",
        "russian-typing-dataset-builder/1.0",
        "-b",
        cookieJarPath,
        "-c",
        cookieJarPath,
        "-o",
        outputPath,
        `https://tatoeba.org/exports/download/${exportId}/${encodeURIComponent(exportInfo.pretty_filename)}`
      ],
      {
        stdio: "inherit"
      }
    );

    return outputPath;
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

async function buildSentenceDataset(config, cacheDir) {
  const translationPairsSource =
    config.sources.translationPairsSource || findAutoTranslationPairsSource();

  if (translationPairsSource) {
    const translationPairsPath = await ensureCsvFromSource(
      translationPairsSource,
      cacheDir,
      {
        forceDownload: config.forceDownload,
        memberName: "translation_pairs.tsv"
      }
    );
    const audioPath = await ensureCsvFromSource(
      config.sources.audioSource || config.sources.audioArchive,
      cacheDir,
      {
        forceDownload: config.forceDownload,
        memberName: "sentences_with_audio.csv"
      }
    );
    const sentenceMap = await loadCustomTranslationPairs(translationPairsPath);
    await attachAudio(sentenceMap, audioPath);
    return {
      sentenceMap,
      sourceMode:
        config.sources.translationPairsSource
          ? "custom-translation-pairs"
          : "auto-detected-custom-translation-pairs"
    };
  }

  try {
    const translationPairsPath = await downloadTatoebaCustomExport(config, cacheDir);
    const audioPath = await ensureCsvFromSource(
      config.sources.audioSource || config.sources.audioArchive,
      cacheDir,
      {
        forceDownload: config.forceDownload,
        memberName: "sentences_with_audio.csv"
      }
    );
    const sentenceMap = await loadCustomTranslationPairs(translationPairsPath);
    await attachAudio(sentenceMap, audioPath);
    return {
      sentenceMap,
      sourceMode: "tatoeba-custom-export-api"
    };
  } catch (error) {
    console.warn(`Falling back to Tatoeba weekly exports: ${error instanceof Error ? error.message : String(error)}`);
  }

  const sentencesPath = await ensureCsvFromSource(config.sources.sentencesArchive, cacheDir, {
    forceDownload: config.forceDownload,
    memberName: "sentences.csv"
  });
  const linksPath = await ensureCsvFromSource(config.sources.linksArchive, cacheDir, {
    forceDownload: config.forceDownload,
    memberName: "links.csv"
  });
  const audioPath = await ensureCsvFromSource(config.sources.audioArchive, cacheDir, {
    forceDownload: config.forceDownload,
    memberName: "sentences_with_audio.csv"
  });

  const sentenceMap = await buildSentenceMapFromWeeklyExports(sentencesPath, linksPath);
  await attachAudio(sentenceMap, audioPath);
  return {
    sentenceMap,
    sourceMode: "tatoeba-weekly-exports"
  };
}

async function main() {
  const cliArgs = parseArgs(process.argv.slice(2));
  const fileConfig = readOptionalConfig(cliArgs.configPath);
  const config = mergeConfig(DEFAULT_CONFIG, fileConfig, cliArgs);
  const cacheDir = toAbsolutePath(config.cacheDir);

  mkdirSync(path.dirname(JSON_OUTPUT), { recursive: true });
  mkdirSync(path.dirname(TSV_OUTPUT), { recursive: true });
  mkdirSync(cacheDir, { recursive: true });

  const [{ sentenceMap, sourceMode }, alphabet] = await Promise.all([
    buildSentenceDataset(config, cacheDir),
    prepareAlphabetAudio(config)
  ]);
  const records = finalizeRecords(sentenceMap);

  writeFileSync(
    JSON_OUTPUT,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceMode,
        totalSentences: records.length,
        totalAlphabetEntries: alphabet.length,
        sentences: records,
        alphabet
      },
      null,
      2
    )
  );

  const tsvRows = [
    ["ru_sentence_id", "original_text", "typing_text", "exact_typing_text", "ja_translations", "audio_ids"].join("\t"),
    ...records.map((record) =>
      [
        record.id,
        tsvEscape(record.originalText),
        tsvEscape(record.typingText),
        tsvEscape(record.exactTypingText),
        tsvEscape(record.translations.join(" | ")),
        tsvEscape(record.audioIds.join("|"))
      ].join("\t")
    )
  ];
  writeFileSync(TSV_OUTPUT, `${tsvRows.join("\n")}\n`);

  console.log(
    JSON.stringify(
      {
        sourceMode,
        totalSentences: records.length,
        totalAlphabetEntries: alphabet.length,
        jsonOutput: path.relative(ROOT_DIR, JSON_OUTPUT),
        tsvOutput: path.relative(ROOT_DIR, TSV_OUTPUT),
        alphabetAudioOutputDir: path.relative(ROOT_DIR, ALPHABET_AUDIO_OUTPUT_DIR)
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
