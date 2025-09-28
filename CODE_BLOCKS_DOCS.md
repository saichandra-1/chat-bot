# Code Block Feature Documentation

## 🎨 **Code Block Display Feature**

Your AI chatbot now includes **professional code block rendering** similar to ChatGPT, with syntax highlighting and copy functionality.

### ✅ **Features Implemented:**

1. **Syntax Highlighting**: Automatic language detection and color coding
2. **Copy to Clipboard**: One-click copy functionality with visual feedback
3. **Line Numbers**: Easy reference for code snippets
4. **Responsive Design**: Works on all screen sizes
5. **Multiple Languages**: Supports 100+ programming languages
6. **Dark Theme**: Professional dark theme for code blocks

### 🔧 **How It Works:**

#### **Automatic Detection**
The chatbot automatically detects code blocks in AI responses using triple backticks:

```
```c
#include <stdio.h>
int main() {
    printf("Hello World!");
    return 0;
}
```
```

#### **Supported Languages**
- **C/C++**: `c`, `cpp`, `c++`
- **JavaScript**: `javascript`, `js`
- **Python**: `python`, `py`
- **Java**: `java`
- **HTML**: `html`
- **CSS**: `css`
- **SQL**: `sql`
- **Bash**: `bash`, `sh`
- **JSON**: `json`
- **And 100+ more!**

### 🎯 **User Experience:**

#### **Code Block Features**
- **Header Bar**: Shows programming language
- **Copy Button**: Click to copy entire code block
- **Visual Feedback**: "Copied!" confirmation
- **Line Numbers**: Easy reference
- **Syntax Colors**: Language-specific highlighting
- **Responsive**: Horizontal scroll for long lines

#### **Example Display**
```
┌─ c ──────────────────────────────── [Copy] ─┐
│ 1  #include <stdio.h>                        │
│ 2  int main() {                              │
│ 3      printf("Hello World!");               │
│ 4      return 0;                             │
│ 5  }                                         │
└─────────────────────────────────────────────┘
```

### 🚀 **Technical Implementation:**

#### **Components Created**
1. **CodeBlock.tsx**: Main code display component
2. **messageParser.ts**: Parses messages for code blocks
3. **Updated MessageBubble.tsx**: Renders mixed content

#### **Dependencies Added**
- `react-syntax-highlighter`: Syntax highlighting
- `@types/react-syntax-highlighter`: TypeScript support

#### **Key Features**
- **Automatic Parsing**: Detects ```language blocks
- **Copy Functionality**: Uses Clipboard API
- **Theme Support**: Dark/light theme ready
- **Responsive**: Mobile-friendly design
- **Performance**: Optimized rendering

### 📱 **Responsive Design:**

#### **Desktop**
- Full-width code blocks
- Line numbers visible
- Copy button always visible

#### **Mobile**
- Horizontal scroll for long lines
- Touch-friendly copy button
- Optimized font sizes

### 🎨 **Styling:**

#### **Dark Theme (Default)**
- Background: Dark gray (`#282c34`)
- Text: Light colors for contrast
- Syntax: Language-specific colors
- Border: Subtle gray borders

#### **Customizable**
- Easy theme switching
- Custom color schemes
- Font size adjustments
- Border radius options

### 🧪 **Testing:**

#### **Test Cases**
1. **Single Code Block**: Basic functionality
2. **Multiple Code Blocks**: Mixed content
3. **Different Languages**: Various syntax highlighting
4. **Long Code**: Horizontal scrolling
5. **Copy Function**: Clipboard integration

#### **Test Commands**
```bash
# Test with C code
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Write a C program"}]}'

# Test with JavaScript
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Write a JavaScript function"}]}'
```

### 🔧 **Customization:**

#### **Adding New Languages**
The syntax highlighter supports 100+ languages automatically. No additional configuration needed.

#### **Theme Customization**
```typescript
// In CodeBlock.tsx
const syntaxTheme = isDarkMode ? oneDark : oneLight;
```

#### **Styling Customization**
```typescript
// Custom styles
customStyle={{
  fontSize: '14px',
  lineHeight: '1.5',
  borderRadius: '0 0 8px 8px',
}}
```

### 🎉 **Benefits:**

- ✅ **Professional Look**: ChatGPT-like code display
- ✅ **Better UX**: Easy copying and reading
- ✅ **Developer Friendly**: Syntax highlighting
- ✅ **Mobile Ready**: Responsive design
- ✅ **Accessible**: Clear visual hierarchy
- ✅ **Fast**: Optimized performance

### 📞 **Support:**

If you encounter issues:
1. Check browser console for errors
2. Verify Clipboard API support
3. Test with different code languages
4. Check responsive design on mobile

---

**Your AI chatbot now has professional code block rendering!** 🚀
