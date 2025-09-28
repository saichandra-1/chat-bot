# AI Chatbot App

A modern, fully functional AI chatbot application built with Next.js 15, TypeScript, and OpenAI integration.

## Features

- 🤖 **AI-Powered Chat**: Integrated with OpenAI GPT models
- 💬 **Modern UI**: Beautiful chat interface with message bubbles
- ⚡ **Real-time**: Instant responses with typing indicators
- 📱 **Responsive**: Works perfectly on desktop and mobile
- 🎨 **Tailwind CSS**: Modern, clean design
- 🔒 **Type Safe**: Full TypeScript support
- ⚠️ **Error Handling**: Comprehensive error management

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **AI Integration**: OpenAI API
- **Icons**: Lucide React
- **Package Manager**: Yarn

## Getting Started

### Prerequisites

1. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

### Installation

1. **Clone and install dependencies**:
   ```bash
   yarn install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   ```

3. **Start the development server**:
   ```bash
   yarn dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Start Chatting**: Type your message in the input field
2. **Send Messages**: Click the send button or press Enter
3. **View Responses**: AI responses appear with typing indicators
4. **Error Handling**: Clear error messages if something goes wrong

## Project Structure

```
app/
├── api/chat/route.ts          # OpenAI API integration
├── components/
│   ├── ChatContainer.tsx      # Main chat interface
│   ├── ChatInput.tsx          # Message input component
│   └── MessageBubble.tsx     # Individual message display
├── types/chat.ts              # TypeScript interfaces
├── globals.css                # Global styles
├── layout.tsx                 # App layout
└── page.tsx                   # Home page
```

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_MODEL`: AI model to use (default: gpt-3.5-turbo)

### Available Models

- `gpt-3.5-turbo` (default, fast and cost-effective)
- `gpt-4` (more capable but slower)
- `gpt-4-turbo` (latest GPT-4 variant)

## Features Explained

### Chat Interface
- **Message Bubbles**: Distinct styling for user and AI messages
- **Timestamps**: Each message shows when it was sent
- **Avatars**: User and bot icons for visual clarity
- **Auto-scroll**: Automatically scrolls to latest messages

### User Experience
- **Typing Indicator**: Shows when AI is responding
- **Loading States**: Disabled input during processing
- **Error Messages**: Clear feedback for any issues
- **Responsive Design**: Works on all screen sizes

### Technical Features
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error management
- **State Management**: React hooks for chat state
- **API Integration**: Secure OpenAI API calls

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add environment variables** in Vercel dashboard
4. **Deploy**

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Make sure your `.env.local` file has the correct API key
   - Restart the development server after adding the key

2. **"Failed to get response from AI"**
   - Check your OpenAI API key is valid
   - Ensure you have credits in your OpenAI account
   - Check the console for detailed error messages

3. **Styling Issues**
   - Make sure Tailwind CSS is properly configured
   - Check that `globals.css` imports Tailwind

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:
1. Check the troubleshooting section
2. Review the console for error messages
3. Open an issue on GitHub

---

Built with ❤️ using Next.js and OpenAI