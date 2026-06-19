The issue on Android is that `windowSoftInputMode` is set to `adjustResize` by default in Expo.
When `adjustResize` shrinks the screen, `KeyboardAwareScrollView` with `enableOnAndroid={true}` ALSO adds padding and scrolls. This causes a double-reaction, pushing the screen way too far up (as seen in the user's screenshot).
To fix this, we should set `enableOnAndroid={false}` so Android relies purely on native `adjustResize`.
HOWEVER, when using native `adjustResize`, having `justifyContent: 'center'` directly on the `ScrollView`'s `contentContainerStyle` traps the content and prevents scrolling if the content is taller than the shrunk window.
We must move `justifyContent: 'center'` to an inner `<View style={{ flex: 1, justifyContent: 'center' }}>`.
