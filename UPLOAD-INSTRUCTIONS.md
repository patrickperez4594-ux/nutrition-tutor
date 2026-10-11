# Quick Upload Instructions

This bundle is intended to replace the current minimal source in `patrickperez4594-ux/nutrition-tutor` while preserving the Nutrition Tutor prompt concept.

## Safest route

1. Download and extract the ZIP.
2. On your computer, clone your repository:
   `git clone https://github.com/patrickperez4594-ux/nutrition-tutor.git`
3. Enter it: `cd nutrition-tutor`
4. Create a feature branch: `git checkout -b feat/ai-nutrition-tutor-v1`
5. Copy everything from the extracted bundle into this folder.
6. Run `npm install`.
7. Copy `.env.example` to `.env`, add your OpenAI API key, and **never commit `.env`**.
8. Run `npm run test:ci`.
9. Run `npm run build`.
10. Run `git add . && git status` and confirm `.env` is NOT staged.
11. Commit and push.

If you prefer GitHub's website upload UI, extract the ZIP first and upload the files/folders—not the ZIP itself—because GitHub will store a ZIP as a ZIP rather than unpacking it into source files.
