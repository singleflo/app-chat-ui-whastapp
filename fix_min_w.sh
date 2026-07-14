#!/bin/bash

# 1. Template.tsx
sed -i '' 's/min-w-\[280px\]/w-[280px] max-w-full/g' src/components/bubbles/content/Template.tsx

# 2. Contacts.tsx
sed -i '' 's/min-w-\[220px\]/w-[220px] max-w-full/g' src/components/bubbles/content/Contacts.tsx

# 3. Media.tsx
sed -i '' 's/min-w-\[240px\]/w-[240px] max-w-full/g' src/components/bubbles/content/Media.tsx
sed -i '' 's/min-w-\[220px\]/w-[220px] max-w-full/g' src/components/bubbles/content/Media.tsx

# 4. Special.tsx and Error.tsx
sed -i '' 's/min-w-\[220px\]/w-[220px] max-w-full/g' src/components/bubbles/content/Special.tsx
sed -i '' 's/min-w-\[240px\]/w-[240px] max-w-full/g' src/components/bubbles/content/Special.tsx
sed -i '' 's/min-w-\[220px\]/w-[220px] max-w-full/g' src/components/bubbles/content/Error.tsx
sed -i '' 's/min-w-\[240px\]/w-[240px] max-w-full/g' src/components/bubbles/content/Error.tsx

# 5. Location.tsx
# First remove min-w-[240px] from the specific line
sed -i '' 's/aspect-\[2\/1\] w-full min-w-\[240px\]/aspect-[2\/1] w-full/g' src/components/bubbles/content/Location.tsx
# Then replace the rest
sed -i '' 's/min-w-\[220px\]/w-[220px] max-w-full/g' src/components/bubbles/content/Location.tsx
sed -i '' 's/min-w-\[240px\]/w-[240px] max-w-full/g' src/components/bubbles/content/Location.tsx

# 6. Audio.tsx
sed -i '' 's/min-w-\[230px\]/w-[230px] max-w-full/g' src/components/bubbles/content/Audio.tsx

# 7. Order.tsx
sed -i '' 's/min-w-\[260px\]/w-[260px] max-w-full/g' src/components/bubbles/content/Order.tsx

# 8. Interactive.tsx
sed -i '' 's/min-w-\[220px\]/w-[220px] max-w-full/g' src/components/bubbles/content/Interactive.tsx
sed -i '' 's/min-w-\[240px\]/w-[240px] max-w-full/g' src/components/bubbles/content/Interactive.tsx
sed -i '' 's/min-w-\[260px\]/w-[260px] max-w-full/g' src/components/bubbles/content/Interactive.tsx

