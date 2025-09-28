# OpenAI Free Model Setup Guide

## 🆓 **For OpenAI Free Tier Users**

### **Step 1: Get Your API Key**

1. **Visit**: [OpenAI API Keys](https://platform.openai.com/account/api-keys)
2. **Sign in** to your OpenAI account
3. **Click** "Create new secret key"
4. **Copy** the key (it should start with `sk-`)

### **Step 2: Configure Your Environment**

Create a `.env.local` file in your project root:

```env
# OpenAI Configuration for Free Tier
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
OPENAI_MODEL=gpt-3.5-turbo
```

### **Step 3: Restart Development Server**

```bash
# Stop the current server (Ctrl+C)
# Then restart
yarn dev
```

## 🔧 **Free Tier Limitations**

- **Model**: `gpt-3.5-turbo` (fast and efficient)
- **Usage**: Limited requests per month
- **Cost**: Free tier has usage limits

## ✅ **Correct API Key Format**

Your API key should look like:
```
sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

## ❌ **Common Mistakes**

1. **Wrong format**: `fdjfsjs` ❌
2. **Missing prefix**: Should start with `sk-` ✅
3. **Quotes**: Don't use quotes in `.env` file ❌
4. **Spaces**: No spaces around `=` ❌

## 🚨 **Troubleshooting**

### **Error: "Invalid API key"**
- Check your key starts with `sk-`
- Ensure no quotes in `.env.local`
- Restart the dev server

### **Error: "Quota exceeded"**
- You've hit your free tier limit
- Wait for monthly reset or add billing

### **Error: "API key not configured"**
- Check `.env.local` file exists
- Verify the file name is exactly `.env.local`
- Restart the development server

## 🎯 **Quick Test**

Once configured, test with:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello!"}]}'
```

Should return a proper AI response! 🎉
