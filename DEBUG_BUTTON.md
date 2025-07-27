# Debugging Guide for "प्रश्न पूछें" Button

## Quick Troubleshooting Steps:

### 1. **Check Button Status**
Look for the debug info below the button that shows:
- `Selected: ✅/❌` - Whether text is selected
- `Query: ✅/❌` - Whether question is entered  
- `Processing: ⏳/✅` - Whether AI is processing

### 2. **Text Selection Issues**
If text selection doesn't work:
- **Use the manual text input box** (appears when no text is selected)
- Copy text from PDF and paste it in the blue box
- Or try double-clicking text in PDF before selecting

### 3. **Button States**
- **Gray/Disabled**: Missing text selection OR no question entered
- **Green/Enabled**: Ready to send question to AI
- **Processing**: Shows "प्रोसेसिंग..." with spinner

### 4. **Common Issues & Solutions**

**Issue**: Button stays gray even with text and question
**Solution**: 
- Check browser console (F12) for errors
- Try the manual text input method
- Refresh the page and try again

**Issue**: Button becomes green but nothing happens when clicked
**Solution**:
- Check if backend server is running on port 5000
- Look for error messages in browser console
- Verify API key is set in server/.env file

**Issue**: Text selection not working in PDF
**Solution**:
- Try different text areas in the PDF
- Use Ctrl+A to select all text, then copy-paste manually
- Some PDFs have image-based text that can't be selected

### 5. **Testing the Feature**

1. **Upload a PDF** - any text-based PDF
2. **Select some text** - highlight 1-2 sentences
3. **Enter a question** - like "What does this mean?"
4. **Check debug status** - all should show ✅
5. **Click button** - should turn green and be clickable

### 6. **Debug Console Commands**

Open browser console (F12) and look for:
```
=== TEXT SELECTION DEBUG ===
=== DEBUG: AI Query Debug Info ===
```

These will show you exactly what's happening.

### 7. **Backend Testing**

If frontend seems fine, test backend separately:
- Visit: http://localhost:5000 (should show server running)
- Check server terminal for error messages

### 8. **Emergency Fallback**

If text selection completely fails:
1. Copy text manually from PDF
2. Use the blue "Manual text input" box
3. Paste text there
4. Ask your question normally

## Expected Behavior:
1. Upload PDF ✅
2. Select text (shows orange box) ✅  
3. Type question ✅
4. Button turns green ✅
5. Click → Shows "प्रोसेसिंग..." ✅
6. Get AI response ✅
7. Response appears in chat history ✅

If any step fails, use the debug info to identify where the issue occurs!
