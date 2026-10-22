# Home page mockup: "The quiet art of wagyu"

A static HTML mockup of the home page as a traditional Japanese luxury kitchen (kappo counter, washi, sumi ink, lacquer, binchotan) rather than a shop. Open it with the `home-mockup` entry in `.claude/launch.json` (serves this folder on http://localhost:4321), or any static server.

Sections, in order: noren curtain intro, hero video of the kitchen, prologue with enso, three craft chapters (origin, grade, cut), the binchotan counter video with key numbers, the collection (逸品), the ritual of cooking, omotenashi gifting with the ryotei video, a saying with sumi-e art, and a closing over a gold byobu. All copy switches between English and Japanese.

The collection shows each A5 product photographed beside its certificate of authenticity: one featured cut (weight, quantity, add to cart) and four more cards (a swipeable carousel on phones). Adding opens a cart panel with quantities, subtotal and the free-delivery threshold. Products and prices mirror the seeded catalogue; the cart is a mockup kept in `localStorage`.

## Assets

All generated with Higgsfield. Images: `gpt_image_2_5`, 2K, converted to WebP. Videos: `kling3_0` pro, 10 s image-to-video with no sound, re-encoded to 1600 px H.264. `hero.mp4` and `omotenashi.mp4` play forward then backward so the loop has no visible jump.

| File | Subject | Higgsfield job |
|---|---|---|
| kitchen.webp | Kappo counter at dusk, A5 striploin on hinoki (hero poster) | f89a9091-1d28-4c5d-9304-0c49d2517633 |
| hero.mp4 | Slow dolly along the counter, binchotan smoke | 05a7b498-3739-499a-ad0d-2c27c33d7028 |
| binchotan.webp | Wagyu skewers over binchotan (counter poster) | 6f8efb52-40ff-44c2-9221-25fdce26ef8d |
| counter.mp4 | Skewers sizzling, smoke and embers | a9696f32-f708-4935-9e93-906b67dc86b3 |
| ryotei.webp | Tatami dining room with shabu-shabu and moss garden | eca0fd2e-e8d1-4e5f-a7cc-63c0db9f20fa |
| omotenashi.mp4 | Steam and lantern light in the dining room | 6864cf56-54b0-4601-a754-476c05bb6524 |
| farm.webp | Kagoshima hills at dawn with grazing cattle | afed7d3e-5507-49de-ab54-eda07150a8f2 |
| knife.webp | Yanagiba and A5 slice on slate, shoji shadows | 0ca73f64-681a-4e39-a343-9a202de48b9a |
| chef.webp | Chef's hands slicing A5 on hinoki | d1b191ac-9311-454a-ac59-559d92d56b0f |
| tataki.webp | A5 tataki on handmade ceramic, top-down | 3f83e98f-9b7d-45a9-9c9f-a3b88ede8d09 |
| jubako.webp | A5 fanned in a lacquer box with indigo furoshiki | b5c450ab-7323-4ea9-ac6d-21befc22387d |
| sumie-bull.webp | Sumi-e ink painting of a wagyu bull | a277c170-e597-4d59-b582-5fd806d12399 |
| enso.webp | Enso circle in sumi ink | fe712d25-d61e-4f4d-881d-afc69c4d7b0f |
| byobu.webp | Gold-leaf byobu screen with pines and clouds | a3354a56-2b37-4d99-9106-5b41a1b57b46 |
| washi.webp | Washi paper texture | 8d8fb01e-f32b-42b6-9848-500995830fe2 |
| p-ribeye.webp | A5 ribeye with certificate (featured product) | fe087c34-9d08-434e-9aea-480a8e31f0cd |
| p-striploin.webp | Two A5 striploins on lacquer with certificate | 21d2af2b-40b8-40df-be9d-0ad3aea735c3 |
| p-tenderloin.webp | A5 filet medallions with certificate | 5572d423-9068-4ba0-876b-546a9341aafe |
| p-shabu.webp | A5 shabu-shabu rose with certificate | b3e34379-e553-4b03-b7f7-a4dfd4fb6ede |
| p-flight.webp | Three A5 striploins in a lacquer box with three certificates | a77c07fe-db70-41f0-89e9-2811a3d7cd42 |

The certificates in the product shots are generated props: the headline text is legible but the small print is not real Japanese. Replace them with photographs of your actual certificates before launch.

Prices on the menu card are the seeded catalogue prices; the dining photos are illustrative, not real stock.
