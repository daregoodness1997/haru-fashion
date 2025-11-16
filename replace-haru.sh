#!/bin/bash

# Script to replace all instances of "haru" with "Shunapee Fashion House"
# This script handles various cases and file types

echo "🔍 Starting replacement of 'haru' with 'Shunapee Fashion House'..."
echo ""

# Directories and files to exclude
EXCLUDE_DIRS="node_modules|.next|.git|dist|build|coverage"
EXCLUDE_FILES="package-lock.json|yarn.lock|*.min.js|*.min.css"

# Function to replace in files
replace_in_files() {
    local search_pattern=$1
    local replacement=$2
    local case_flag=$3
    
    echo "🔄 Replacing '$search_pattern' with '$replacement'..."
    
    # Find all relevant files and replace
    find . -type f \
        -not -path "*/node_modules/*" \
        -not -path "*/.next/*" \
        -not -path "*/.git/*" \
        -not -path "*/dist/*" \
        -not -path "*/build/*" \
        -not -name "package-lock.json" \
        -not -name "yarn.lock" \
        -not -name "*.min.js" \
        -not -name "*.min.css" \
        -not -name "replace-haru.sh" \
        \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" -o -name "*.json" -o -name "*.md" -o -name "*.html" -o -name "*.css" -o -name "*.txt" \) \
        -exec sed -i '' "${case_flag}s/${search_pattern}/${replacement}/g" {} +
    
    # Count replacements
    local count=$(grep -r ${case_flag} "$search_pattern" . \
        --exclude-dir={node_modules,.next,.git,dist,build,coverage} \
        --exclude={package-lock.json,yarn.lock,replace-haru.sh} \
        --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
        --include="*.json" --include="*.md" --include="*.html" --include="*.css" \
        2>/dev/null | wc -l)
    
    echo "   ✓ Processed files (remaining matches: $count)"
}

# Replace different variations
echo "📝 Replacing variations of 'haru'..."
echo ""

# 1. "haru" (lowercase) -> "Shunapee Fashion House"
replace_in_files "haru" "Shunapee Fashion House" ""

# 2. "Haru" (capitalized) -> "Shunapee Fashion House"
replace_in_files "Haru" "Shunapee Fashion House" ""

# 3. "HARU" (uppercase) -> "SHUNAPEE FASHION HOUSE"
replace_in_files "HARU" "SHUNAPEE FASHION HOUSE" ""

# 4. Handle hyphenated versions in URLs/paths
replace_in_files "haru-fashion" "shunapee-fashion-house" ""
replace_in_files "Haru-fashion" "Shunapee-Fashion-House" ""

# 5. Handle underscore versions
replace_in_files "haru_fashion" "shunapee_fashion_house" ""

echo ""
echo "✅ Replacement complete!"
echo ""
echo "📊 Summary of remaining 'haru' instances (case-insensitive):"
echo ""

# Show remaining instances
remaining=$(grep -ri "haru" . \
    --exclude-dir={node_modules,.next,.git,dist,build,coverage} \
    --exclude={package-lock.json,yarn.lock,replace-haru.sh} \
    --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
    --include="*.json" --include="*.md" --include="*.html" --include="*.css" \
    2>/dev/null)

if [ -z "$remaining" ]; then
    echo "   ✓ No remaining instances found!"
else
    echo "$remaining"
    echo ""
    echo "⚠️  Some instances remain. Review them manually to ensure they should be replaced."
fi

echo ""
echo "🎉 Done! Please review the changes before committing."
echo ""
echo "💡 Next steps:"
echo "   1. Review changes: git diff"
echo "   2. Test the application"
echo "   3. Commit changes: git add . && git commit -m 'Replace haru with Shunapee Fashion House'"
