# SASL Lottie Animations

This directory contains Lottie JSON animation files for South African Sign Language (SASL) phrases.

## How to Add Your Lottie Files

1. **Place your Lottie JSON files in this directory** with these names:
   - `hello.json` - Animation for "Hello"
   - `my-name-is.json` - Animation for "My name is"
   - `yes.json` - Animation for "Yes"
   - `no.json` - Animation for "No"
   - `thank-you.json` - Animation for "Thank you"
   - `please.json` - Animation for "Please"

2. **Update SignScreen.tsx** to import and use the animations:

   Open `/src/screens/SignScreen.tsx` and update the imports section:

   ```typescript
   // Replace the placeholder imports with:
   import helloAnimation from '../assets/animations/hello.json';
   import myNameIsAnimation from '../assets/animations/my-name-is.json';
   import yesAnimation from '../assets/animations/yes.json';
   import noAnimation from '../assets/animations/no.json';
   import thankYouAnimation from '../assets/animations/thank-you.json';
   import pleaseAnimation from '../assets/animations/please.json';
   ```

3. **Update the signPhrases array** in SignScreen.tsx:

   ```typescript
   const signPhrases: SignPhrase[] = [
     {
       id: 'hello',
       text: 'Hello',
       animationData: helloAnimation,
     },
     {
       id: 'my-name-is',
       text: 'My name is',
       animationData: myNameIsAnimation,
     },
     {
       id: 'yes',
       text: 'Yes',
       animationData: yesAnimation,
     },
     {
       id: 'no',
       text: 'No',
       animationData: noAnimation,
     },
     {
       id: 'thank-you',
       text: 'Thank you',
       animationData: thankYouAnimation,
     },
     {
       id: 'please',
       text: 'Please',
       animationData: pleaseAnimation,
     },
   ];
   ```

4. **Rebuild the application**:
   ```bash
   npm run build
   ```

## File Format

Lottie JSON files should be exported from Adobe After Effects using the Bodymovin plugin or created using Lottie Editor. The files should contain valid JSON animation data.

## Future Additions

To add more sign language phrases:

1. Add the new Lottie JSON file to this directory
2. Import it in SignScreen.tsx
3. Add a new entry to the `signPhrases` array with:
   - Unique `id`
   - Display `text`
   - The imported `animationData`
