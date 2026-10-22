# 🌿 CropDoc (LeafGuide) — AI Plant Doctor for Farmers

> Snap a photo of a sick leaf. Get the disease, severity and a treatment plan in seconds.

**🔗 Live demo:** https://leafguide.lovable.app/

---

## The problem

Smallholder farmers lose a large share of their harvest to crop diseases, pests and nutrient deficiencies that could have been treated if caught early. Expert help (agronomists, extension officers) is often far away, slow, or unaffordable, and many farmers end up guessing — or spraying the wrong thing.

## Our solution

CropDoc puts a plant doctor in the farmer's pocket. The farmer takes or uploads one photo of an affected leaf or plant, and CropDoc returns:

- **What it is** — the crop and the likely disease, pest or deficiency
- **How bad it is** — a severity rating (healthy / low / moderate / high) and a confidence score
- **What to do** — practical treatment steps, low-cost and organic options first
- **How to prevent it** — steps to avoid it next season

Every diagnosis is saved to a local **History** so farmers can track a field over time, even after closing the app.

## Features

- 📷 Take a photo with the phone camera or upload a JPG/PNG
- 🤖 AI vision diagnosis returned as structured data (crop, condition, severity, confidence, symptoms, treatment, prevention)
- 🗂️ On-device history of past diagnoses (stored in the browser, nothing uploaded to a database)
- 📱 Mobile-first, responsive UI
- 📉 Photos are downscaled in the browser before upload, so it works on slow rural connections
- ⚠️ Built-in safety note: advises confirming severe cases with a local extension officer and following product labels for any chemicals

## How it works

```
 ┌──────────────┐   resized JPEG   ┌────────────────────────┐   image + prompt   ┌──────────────┐
 │  React app   │ ───────────────▶ │ Supabase Edge Function │ ─────────────────▶ │ Claude vision│
 │ (Vite + TS)  │ ◀─────────────── │      /diagnose         │ ◀───────────────── │     model    │
 └──────┬───────┘  Diagnosis JSON  └────────────────────────┘    JSON diagnosis   └──────────────┘
        │
        ▼
   localStorage (history)
```

1. The browser downsizes the photo (max 1024 px) and sends it to the `diagnose` edge function.
2. The function keeps the API key server-side, sends the image to a vision model with an agronomist system prompt, and requires a strict JSON reply.
3. The app renders the result and stores it in the on-device history.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Supabase Edge Function (Deno) |
| AI | Claude vision model via the Anthropic API |
| Storage | Browser `localStorage` (history) |
| Hosting | Lovable (frontend) |

## Project structure

```
cropdoc/
├── index.html
├── package.json
├── vite.config.ts · tsconfig.json · tailwind.config.js · postcss.config.js
├── .env.example                  # copy to .env and fill in
├── public/favicon.svg
├── src/
│   ├── main.tsx · App.tsx · index.css · types.ts
│   ├── components/
│   │   ├── UploadCard.tsx        # photo picker + Diagnose button
│   │   ├── ResultCard.tsx        # diagnosis, severity, treatment, prevention
│   │   └── HistoryList.tsx       # past diagnoses
│   └── lib/
│       ├── image.ts              # in-browser resize/compress
│       ├── diagnose.ts           # calls the edge function
│       └── history.ts            # localStorage helpers
└── supabase/
    ├── config.toml
    └── functions/diagnose/index.ts   # AI diagnosis endpoint
```

## Run it locally

**Prerequisites:** Node.js 18+ and npm. For the AI endpoint: a free [Supabase](https://supabase.com) project, the [Supabase CLI](https://supabase.com/docs/guides/cli), and an [Anthropic API key](https://console.anthropic.com/).

```bash
# 1. Install dependencies
npm install

# 2. Configure the frontend
cp .env.example .env
#    then set VITE_DIAGNOSE_URL and VITE_SUPABASE_ANON_KEY

# 3. Deploy the diagnosis function (once)
supabase login
supabase link --project-ref <your-project-ref>
supabase secrets set ANTHROPIC_API_KEY=<your-key>
supabase functions deploy diagnose

# 4. Start the app
npm run dev        # http://localhost:5173
```

Your `VITE_DIAGNOSE_URL` will be `https://<your-project-ref>.supabase.co/functions/v1/diagnose`.

Other scripts: `npm run build` (type-check + production build), `npm run preview`.

## For judges

You don't need to set anything up — **just open the live demo** and:

1. Click **Take or upload a photo** and choose a clear photo of a plant leaf (healthy or diseased).
2. Click **Diagnose**.
3. Read the diagnosis, severity and treatment plan, then check the **History** section below.

Tip: good results come from a close, well-lit photo of a single leaf showing the affected area.

## Limitations & responsible use

- Diagnoses are AI-generated estimates, not a replacement for a trained agronomist. Confidence is shown so users can judge reliability.
- Photo quality strongly affects accuracy; blurry or dark photos lower confidence.
- History is stored only in the user's own browser and is lost if they clear site data.

## Roadmap

- Local-language and voice output for low-literacy users
- Offline mode with on-device models
- Location- and season-aware advice
- Export / share a diagnosis with an extension officer

## License

MIT — see [LICENSE](LICENSE).
