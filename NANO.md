# Local Gemini nano

## Enable

Triggering the initial download and the component appearing is odd. This might increase the likelihood of your success.

- chrome://flags/#prompt-api-for-gemini-nano - Enabled.
- chrome://flags/#optimization-guide-on-device-model - BypassPrefRequirement
- check count of components in chrome://components/
- relaunch
- run `await LanguageModel.create()` in browser console to indicate you want to use it
- check count of components in chrome://components/
- if increased, you should see `Optimization Guide On Device Model`
- relaunch if there's no new component
- click "Check for update" if it's not already downloading

It'll download for at least 10 minutes and then proceed to decompress (slowly, using one core)

When the model is downloaded, 
chrome://components/ -> Optimization Guide On Device Model will show a non-zero version