# Russian Typing Studio

Tatoeba のロシア語例文と Wikimedia Commons のロシア語アルファベット音声を使う、日本語話者向けの静的タイピングサイトです。

ローカルにコーパスを置いても、Tatoeba/Wikimedia から直接取得しても動きます。公開リポジトリには例文コーパスや生成済み JSON を含めない前提です。

## セットアップ

```bash
npm install
npm run dev
```

本番ビルド:

```bash
npm run build
```

## データ生成

`npm run dev` と `npm run build` は毎回 `scripts/build-dataset.mjs` を実行します。

生成物:

- `public/data/sentences.json`
- `public/static/audio/alphabet/*.ogg`
- `generated/ru-ja-audio-sentences.tsv`

`public/data/sentences.json` と `generated/ru-ja-audio-sentences.tsv` は `.gitignore` 済みです。`public/static/audio/alphabet/*.ogg` は CI での Wikimedia rate limit 回避のため、リポジトリに含めています。

### デフォルト動作

設定ファイルがなくても、まず Tatoeba の「例文の組み合わせ」でダウンロードしたロシア語→日本語 TSV を自動検出します。

探索対象:

- リポジトリ直下
- `data-source/`
- `corpus/`

対象ファイル名の例:

- `例文の組み合わせ ロシア語-日本語 - 2026-04-14.tsv`
- `sentence_pairs_rus_jpn.tsv`
- `translation_pairs.tsv`

見つかった場合は、その TSV を build 時の例文ソースとして優先利用します。見つからない場合は、Tatoeba のカスタムエクスポート API を自動で叩いてロシア語→日本語の TSV を生成します。さらにそれも失敗した場合だけ、weekly export にフォールバックします。

- Tatoeba custom export API
  - `/exports/add`
  - `/exports/get/{id}`
  - `/exports/download/{id}/{filename}`
- Tatoeba weekly export fallback
  - `sentences.tar.bz2`
  - `links.tar.bz2`
  - `sentences_with_audio.tar.bz2`
- Wikimedia Commons
  - `Pronunciation of Russian alphabet` の各文字音声

ダウンロードした元データは `.cache/build-dataset/` に再利用用として保存されます。

### ローカルファイルを使う

`dataset.config.example.json` を `dataset.config.json` にコピーして値を入れるか、CLI 引数を使ってください。

カスタム例:

```json
{
  "sources": {
    "translationPairsSource": "path/to/ru-ja-pairs.tsv",
    "audioSource": "path/to/sentences_with_audio.csv",
    "tatoebaCustomExportFrom": "rus",
    "tatoebaCustomExportTo": "jpn",
    "alphabetAudioDir": "path/to/russian-alphabet-audio"
  }
}
```

`translationPairsSource` を指定した場合は、自動検出や weekly export より優先されます。

`alphabetAudioDir` には、以下のいずれかのファイル名で 33 文字分を置けます。

- `01.ogg` から `33.ogg`
- Wikimedia の元ファイル名 (`Ru-01-буква-А.ogg` など)

CLI 例:

```bash
node scripts/build-dataset.mjs \
  --translation-source "./例文の組み合わせ ロシア語-日本語 - 2026-04-13.tsv" \
  --audio-source "./sentences_with_audio.csv"
```

Tatoeba カスタムエクスポート API の言語を変える場合:

```bash
node scripts/build-dataset.mjs --tatoeba-from rus --tatoeba-to jpn
```

再ダウンロードを強制する場合:

```bash
node scripts/build-dataset.mjs --force-download
```

## 現在の仕様

- 練習モードは `例文入力` と `ロシア語アルファベット` を切り替え可能
- `例文入力` は `通常` と `タイムアタック` を切り替え可能
- `ロシア語アルファベット` は `ランダム` と `順番` を切り替え可能
- 設定で `文字の大小・句読点・スペースを無視` を切り替え可能
- 音声自動再生がブラウザにブロックされた場合は、手動再生ボタンを案内表示
- 例文音声もアルファベット音声も、現在と次の 2 件を先読み
- 入力判定は OS の入力言語に依存せず、物理キー位置をロシア語配列へ対応づけて処理
- 画面上のキーボードはクリックやタップでも入力可能

## Deploy

`main` への push で Cloudflare Pages へ自動デプロイする GitHub Actions を `.github/workflows/deploy-pages.yml` に用意しています。

この workflow で必要な GitHub Secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

`CLOUDFLARE_API_TOKEN` には、少なくとも Pages デプロイ可能な権限を持つ Cloudflare API Token を設定してください。プロジェクト名は workflow 内で `rutyping` に固定しています。
